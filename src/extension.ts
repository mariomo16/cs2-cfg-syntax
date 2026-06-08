import * as vscode from "vscode";
import cvarsJson from "../resources/cvars.json";

interface CommandInfo {
	name: string;
	defaultValue?: string | number | boolean;
	flags?: string[];
	description?: string;
}

const TOKEN_TYPES = ["ConCommand", "ConVar"] as const;
const legend = new vscode.SemanticTokensLegend([...TOKEN_TYPES]);

const CVAR_PREFIXES: Record<string, string> = {
	cl_: "Client ConVar",
	sv_: "Server ConVar",
	mp_: "Multiplayer ConVar",
	r_: "Render ConVar",
} as const;
const PREFIX_ENTRIES = Object.entries(CVAR_PREFIXES);

const commands = cvarsJson.commands as CommandInfo[];
const COMMANDS_MAP = new Map<string, CommandInfo>(
	commands.map((cmd) => [cmd.name, cmd]),
);

const COMPLETION_ITEMS = buildCompletionItems();

function getTokenTypeIndex(cmd: CommandInfo): number {
	return cmd.defaultValue === "cmd" ? 0 : 1;
}

function buildCommandMarkdown(cmd: CommandInfo): vscode.MarkdownString {
	const md = new vscode.MarkdownString();

	md.appendMarkdown(`**${cmd.name}**\n\n`);
	if (cmd.description) md.appendMarkdown(`${cmd.description}\n\n`);
	if (cmd.flags?.length)
		md.appendMarkdown(`**Flags:** \`${cmd.flags.join(", ")}\``);

	return md;
}

function resolveCommandKindAndDetail(name: string): {
	kind: vscode.CompletionItemKind;
	detail: string;
} {
	const match = PREFIX_ENTRIES.find(([prefix]) => name.startsWith(prefix));

	return {
		kind: match
			? vscode.CompletionItemKind.Variable
			: vscode.CompletionItemKind.Function,
		detail: match ? match[1] : "ConCommand",
	};
}

function buildCompletionItems(): vscode.CompletionItem[] {
	return commands.map((cmd) => {
		const { kind, detail } = resolveCommandKindAndDetail(cmd.name);
		const item = new vscode.CompletionItem(cmd.name, kind);
		item.detail = detail;

		if (cmd.description || cmd.flags?.length)
			item.documentation = buildCommandMarkdown(cmd);

		return item;
	});
}

export function activate(context: vscode.ExtensionContext): void {
	const semanticProvider =
		vscode.languages.registerDocumentSemanticTokensProvider(
			"cs2-cfg",
			{
				provideDocumentSemanticTokens(document: vscode.TextDocument) {
					const builder = new vscode.SemanticTokensBuilder(legend);

					for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
						const line = document.lineAt(lineIndex).text;
						const wordRegex = /[\w_]+/g;

						for (
							let match = wordRegex.exec(line);
							match !== null;
							match = wordRegex.exec(line)
						) {
							const word = match[0];
							const cmd = COMMANDS_MAP.get(word);
							if (cmd) {
								builder.push(
									lineIndex,
									match.index,
									word.length,
									getTokenTypeIndex(cmd),
								);
							}
						}
					}

					return builder.build();
				},
			},
			legend,
		);

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

			const cmd = COMMANDS_MAP.get(document.getText(range));
			if (!cmd) return null;

			return new vscode.Hover(buildCommandMarkdown(cmd), range);
		},
	});

	context.subscriptions.push(
		semanticProvider,
		completionProvider,
		hoverProvider,
	);
}

export function deactivate(): void {}
