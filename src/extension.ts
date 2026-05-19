import * as vscode from "vscode";
import commands from "../resources/commands.json";

const CVAR_PREFIXES: Record<string, string> = {
	cl_: "Client ConVar",
	sv_: "Server ConVar",
	mp_: "Multiplayer ConVar",
	r_: "Render ConVar",
};

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

	context.subscriptions.push(completionProvider);
}

function buildCompletionItems(): vscode.CompletionItem[] {
	const prefixEntries = Object.entries(CVAR_PREFIXES);

	return (commands.commands as string[]).map((command) => {
		const match = prefixEntries.find(([prefix]) => command.startsWith(prefix));

		const kind = match
			? vscode.CompletionItemKind.Variable
			: vscode.CompletionItemKind.Function;

		const item = new vscode.CompletionItem(command, kind);
		item.detail = match ? match[1] : "CS2 ConCommand";

		return item;
	});
}

export function deactivate() {}
