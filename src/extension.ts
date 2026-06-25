import * as vscode from "vscode";
import commandsJson from "../resources/commands.json";

interface CommandInfo {
	name: string;
	defaultValue?: string | number | boolean;
	flags?: string[];
	description?: string;
}

const commands = commandsJson.commands as CommandInfo[];
const COMMANDS_MAP = new Map<string, CommandInfo>(
	commands.map((cmd) => [cmd.name, cmd]),
);

const COMPLETION_ITEMS = buildCompletionItems();

function buildCommandMarkdown(cmd: CommandInfo): vscode.MarkdownString {
	const md = new vscode.MarkdownString();

	md.appendMarkdown(`**${cmd.name}**\n\n`);
	if (cmd.description) md.appendMarkdown(`${cmd.description}\n\n`);
	if (cmd.flags?.length)
		md.appendMarkdown(`**Flags:** \`${cmd.flags.join(", ")}\``);

	return md;
}

function buildCompletionItems(): vscode.CompletionItem[] {
	return commands.map((cmd) => {
		const isConCommand = cmd.defaultValue === "cmd" ? 1 : 0;

		const item = new vscode.CompletionItem(
			cmd.name,
			isConCommand
				? vscode.CompletionItemKind.Function
				: vscode.CompletionItemKind.Variable,
		);
		item.detail = isConCommand ? "Command" : "Console Variable";

		if (!cmd.description)
			cmd.description = `Type 'help ${cmd.name}' in the in-game console to get more info.`;

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
