import * as vscode from "vscode";
import commandsJson from "../resources/commands.json";

interface CommandInfo {
	name: string;
	defaultValue?: string | number | boolean;
	flags?: string[];
	description?: string;
}

const CVAR_PREFIXES: Record<string, string> = {
	cl_: "Client ConVar",
	sv_: "Server ConVar",
	mp_: "Multiplayer ConVar",
	r_: "Render ConVar",
};

const PREFIX_ENTRIES = Object.entries(CVAR_PREFIXES);
const commands = commandsJson.commands as CommandInfo[];

const COMMANDS_MAP = new Map<string, CommandInfo>(
	commands.map((cmd) => [cmd.name, cmd]),
);

const COMPLETION_ITEMS: vscode.CompletionItem[] = buildCompletionItems();

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

	context.subscriptions.push(completionProvider, hoverProvider);
}

export function deactivate(): void {}
