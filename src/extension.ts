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

	context.subscriptions.push(completionProvider, hoverProvider);
}
