import * as vscode from "vscode";
import commandsJson from "../resources/commands.json";

interface CommandInfo {
  name: string;
  defaultValue?: string | number | boolean;
  flags?: string[];
  description?: string;
}

const commands = commandsJson.commands as CommandInfo[];
const COMMANDS_MAP = new Map<string, vscode.MarkdownString>();
const COMPLETION_ITEMS = buildCompletionItems();
const KNOWN_COMMANDS = new Set(commands.map((cmd) => cmd.name));

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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || line.startsWith("//")) {
      continue;
    }

    const firstTokenMatch = line.match(/^([^\s]+)/);
    if (!firstTokenMatch) {
      continue;
    }

    const firstToken = firstTokenMatch[1];

    if (KNOWN_COMMANDS.has(firstToken)) {
      continue;
    }

    const range = new vscode.Range(i, 0, i, firstToken.length);
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
      const range = document.getWordRangeAtPosition(position, /[\w_]+/);
      if (!range) return null;

      const md = COMMANDS_MAP.get(document.getText(range));
      if (!md) return null;

      return new vscode.Hover(md, range);
    },
  });

  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("cs2-cfg");

  const updateDiagnostics = (document: vscode.TextDocument) => {
    if (document.languageId === "cs2-cfg") {
      diagnosticCollection.set(document.uri, validateDocument(document));
    }
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
