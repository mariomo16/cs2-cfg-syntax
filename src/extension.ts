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

interface DocumentCacheEntry {
  version: number;
  lines: string[];
  aliases: Map<string, AliasInfo>;
}

const commands = commandsJson.commands as CommandInfo[];
const COMMANDS_MAP = new Map<string, vscode.MarkdownString>();
const KNOWN_COMMANDS = new Set(commands.map((cmd) => cmd.name.toLowerCase()));
const COMPLETION_ITEMS = buildCompletionItems();
const ALIAS_DEFINITION_PATTERN =
  /^\s*alias\s+(?:"([a-zA-Z0-9_+-]+)"|([a-zA-Z0-9_+-]+))\s+(?:"([^"]*)"|(\S+))/i;
const aliasCache = new Map<string, DocumentCacheEntry>();

function collectAliases(lines: readonly string[]): Map<string, AliasInfo> {
  const aliases = new Map<string, AliasInfo>();

  for (const [i, line] of lines.entries()) {
    const match = ALIAS_DEFINITION_PATTERN.exec(line);

    if (!match) {
      continue;
    }

    const aliasName = match[1] ?? match[2];

    if (!aliasName) {
      continue;
    }

    const action = match[3] ?? match[4] ?? "";

    aliases.set(aliasName.toLowerCase(), {
      name: aliasName,
      action,
      line: i,
    });
  }

  return aliases;
}

function getDocumentCache(document: vscode.TextDocument): DocumentCacheEntry {
  const key = document.uri.toString();
  const cached = aliasCache.get(key);

  if (cached?.version === document.version) {
    return cached;
  }

  const lines = document.getText().split("\n");
  const entry: DocumentCacheEntry = {
    version: document.version,
    lines,
    aliases: collectAliases(lines),
  };
  aliasCache.set(key, entry);

  return entry;
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
  md.appendCodeblock(alias.action, "cs2-cfg");

  return md;
}

function buildCompletionItems(): vscode.CompletionItem[] {
  const items = commands.map((cmd) => {
    const isConCommand = cmd.defaultValue === "cmd";
    const item = new vscode.CompletionItem(
      cmd.name,
      isConCommand
        ? vscode.CompletionItemKind.Function
        : vscode.CompletionItemKind.Variable,
    );
    item.detail = isConCommand ? "Command" : "Console Variable";

    const md = buildCommandMarkdown(cmd);
    COMMANDS_MAP.set(cmd.name.toLowerCase(), md);
    item.documentation = md;

    return item;
  });

  return items;
}

function validateDocument(document: vscode.TextDocument): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const { lines, aliases } = getDocumentCache(document);

  for (const [i, rawLine] of lines.entries()) {
    const line = rawLine.trim();

    if (!line || line.startsWith("//")) {
      continue;
    }

    const firstTokenMatch = line.match(/^([^\s]+)/);
    if (!firstTokenMatch) {
      continue;
    }

    const firstToken = firstTokenMatch[1];

    if (!firstToken) {
      continue;
    }

    const normalizedToken = firstToken.toLowerCase();

    if (KNOWN_COMMANDS.has(normalizedToken) || aliases.has(normalizedToken)) {
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
    diagnostic.code = "unknown-command";
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
      const normalizedWord = word.toLowerCase();
      const alias = getDocumentCache(document).aliases.get(normalizedWord);

      if (alias) {
        return new vscode.Hover(buildAliasMarkdown(alias), range);
      }

      const md = COMMANDS_MAP.get(normalizedWord);
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

  const onDidCloseTextDocument = vscode.workspace.onDidCloseTextDocument(
    (document) => aliasCache.delete(document.uri.toString()),
  );

  vscode.workspace.textDocuments.forEach(updateDiagnostics);

  context.subscriptions.push(
    completionProvider,
    hoverProvider,
    diagnosticCollection,
    onDidChangeTextDocument,
    onDidOpenTextDocument,
    onDidSaveTextDocument,
    onDidCloseTextDocument,
  );
}
