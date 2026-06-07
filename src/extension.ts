import * as vscode from "vscode";
import commands from "../resources/commands.json";

const CVAR_PREFIXES: Record<string, string> = {
	cl_: "Client ConVar",
	sv_: "Server ConVar",
	mp_: "Multiplayer ConVar",
	r_: "Render ConVar",
};

interface CommandInfo {
	name: string;
	description?: string;
	flags?: string[];
}

const PREFIX_ENTRIES = Object.entries(CVAR_PREFIXES);

const COMMANDS_MAP = new Map<string, CommandInfo>(
	(commands.commands as CommandInfo[]).map((cmd) => [cmd.name, cmd]),
);

const COMPLETION_ITEMS: vscode.CompletionItem[] = buildCompletionItems();

export function activate(context: vscode.ExtensionContext) {
	const completionProvider = vscode.languages.registerCompletionItemProvider(
		"cs2-cfg",
		{
			provideCompletionItems(
				_document: vscode.TextDocument,
				_position: vscode.Position,
			): vscode.CompletionList {
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
			if (!range) {
				return null;
			}
			const word = document.getText(range);
			const commandObj = COMMANDS_MAP.get(word);
			if (!commandObj) {
				return null;
			}

			const md = new vscode.MarkdownString();
			md.appendMarkdown(`**${word}**\n\n`);
			if (commandObj.description) {
				md.appendMarkdown(`${commandObj.description}\n\n`);
			}
			if (commandObj.flags && commandObj.flags.length > 0) {
				md.appendMarkdown(`**Flags:** \`${commandObj.flags.join(", ")}\``);
			}

			return new vscode.Hover(md, range);
		},
	});

	context.subscriptions.push(completionProvider, hoverProvider);
}

function buildCompletionItems(): vscode.CompletionItem[] {
	return (commands.commands as CommandInfo[]).map((commandObj) => {
		const command = commandObj.name;
		const match = PREFIX_ENTRIES.find(([prefix]) => command.startsWith(prefix));

		const kind = match
			? vscode.CompletionItemKind.Variable
			: vscode.CompletionItemKind.Function;

		const item = new vscode.CompletionItem(command, kind);
		const typeDetail = match ? match[1] : "ConCommand";
		item.detail = typeDetail;

		if (commandObj.description) {
			const md = new vscode.MarkdownString(commandObj.description);
			if (commandObj.flags && commandObj.flags.length > 0) {
				md.appendMarkdown(`\n\n**Flags:** \`${commandObj.flags.join(", ")}\``);
			}
			item.documentation = md;
		} else if (commandObj.flags && commandObj.flags.length > 0) {
			item.documentation = new vscode.MarkdownString(
				`**Flags:** \`${commandObj.flags.join(", ")}\``,
			);
		}

		return item;
	});
}

export function deactivate() {}
