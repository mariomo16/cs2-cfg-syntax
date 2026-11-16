import * as vscode from "vscode";
import commandsJson from "../resources/commands.json";

interface CommandInfo {
  name: string;
  defaultValue?: string | number | boolean;
  flags?: string[];
  description?: string;
}

interface AliasInfo {
  name: string;
  action: string;
  line: number;
}

const commands = commandsJson.commands as CommandInfo[];
const COMMANDS_MAP = new Map<string, vscode.MarkdownString>();
const COMPLETION_ITEMS = buildCompletionItems();
const KNOWN_COMMANDS = new Set(commands.map((cmd) => cmd.name));
const ALIAS_DEFINITION_PATTERN =
  /^\s*alias\s+(?:"([a-zA-Z0-9_+-]+)"|([a-zA-Z0-9_+-]+))\s+(?:"([^"]*)"|(\S+))/i;

function collectAliases(lines: readonly string[]): Map<string, AliasInfo> {
  const aliases = new Map<string, AliasInfo>();

  for (let i = 0; i < lines.length; i++) {
    const match = ALIAS_DEFINITION_PATTERN.exec(lines[i]);

    if (!match) {
      continue;
    }

    const aliasName = match[1] ?? match[2];
    const action = match[3] ?? match[4] ?? "";

    aliases.set(aliasName.toLowerCase(), {
      name: aliasName,
      action,
      line: i,
    });
  }

  return aliases;
}

function buildCommandMarkdown(cmd: CommandInfo): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  md.appendMarkdown(`**${cmd.name}**\n\n`);

  const description =
    cmd.description ||
    `Type 'help ${cmd.name}' in the in-game console to get more info.`;
  md.appendMarkdown(`${description}\n\n`);

  if (cmd.flags?.length) {
    md.appendMarkdown(`**Flags:** \`${cmd.flags.join(", ")}\``);
  }

  return md;
}

function buildAliasMarkdown(alias: AliasInfo): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  md.appendMarkdown(`**${alias.name}**\n\n`);
  md.appendMarkdown(`Defined at line ${alias.line + 1}\n\n`);
  md.appendCodeblock(alias.action, "cfg");

  return md;
}

function buildCompletionItems(): vscode.CompletionItem[] {
  return commands.map((cmd) => {
    const isConCommand = cmd.defaultValue === "cmd";
    const item = new vscode.CompletionItem(
      cmd.name,
      isConCommand
        ? vscode.CompletionItemKind.Function
        : vscode.CompletionItemKind.Variable,
    );
    item.detail = isConCommand ? "Command" : "Console Variable";

    const md = buildCommandMarkdown(cmd);
    COMMANDS_MAP.set(cmd.name, md);
    item.documentation = md;

    return item;
  });
}

function validateDocument(document: vscode.TextDocument): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const text = document.getText();
  const lines = text.split("\n");
  const aliases = collectAliases(lines);

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line || line.startsWith("//")) {
      continue;
    }

    const firstTokenMatch = line.match(/^([^\s]+)/);
    if (!firstTokenMatch) {
      continue;
    }

    const firstToken = firstTokenMatch[1];

    if (
      KNOWN_COMMANDS.has(firstToken) ||
      aliases.has(firstToken.toLowerCase())
    ) {
      continue;
    }

    const tokenStart = rawLine.indexOf(firstToken);
    const range = new vscode.Range(
      i,
      tokenStart,
      i,
      tokenStart + firstToken.length,
    );
    const diagnostic = new vscode.Diagnostic(
      range,
      `Unrecognized command or cvar: ${firstToken}`,
      vscode.DiagnosticSeverity.Error,
    );
    diagnostic.source = "cs2-cfg";
    diagnostics.push(diagnostic);
  }

  return diagnostics;
}

export function activate(context: vscode.ExtensionContext): void {
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    "cs2-cfg",
    {
      provideCompletionItems(): vscode.CompletionList {
        return new vscode.CompletionList(COMPLETION_ITEMS, false);
      },
    },
  );

  const hoverProvider = vscode.languages.registerHoverProvider("cs2-cfg", {
    provideHover(
      document: vscode.TextDocument,
      position: vscode.Position,
    ): vscode.Hover | null {
      const range = document.getWordRangeAtPosition(position, /[+-]?[\w-]+/);
      if (!range) return null;

      const word = document.getText(range);
      const alias = collectAliases(document.getText().split("\n")).get(
        word.toLowerCase(),
      );

      if (alias) {
        return new vscode.Hover(buildAliasMarkdown(alias), range);
      }

      const md = COMMANDS_MAP.get(word);
      if (!md) return null;

      return new vscode.Hover(md, range);
    },
  });

  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("cs2-cfg");

  const updateDiagnostics = (document: vscode.TextDocument) => {
    if (document.languageId !== "cs2-cfg") {
      return;
    }

    diagnosticCollection.set(document.uri, validateDocument(document));
  };

  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(
    (event) => updateDiagnostics(event.document),
  );

  const onDidOpenTextDocument =
    vscode.workspace.onDidOpenTextDocument(updateDiagnostics);

  const onDidSaveTextDocument =
    vscode.workspace.onDidSaveTextDocument(updateDiagnostics);

  vscode.workspace.textDocuments.forEach(updateDiagnostics);

  context.subscriptions.push(
    completionProvider,
    hoverProvider,
    diagnosticCollection,
    onDidChangeTextDocument,
    onDidOpenTextDocument,
    onDidSaveTextDocument,
  );
}
