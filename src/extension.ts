import * as vscode from "vscode";
import commands from "../resources/commands.json";

const CVAR_PREFIXES: Record<string, string> = {
	cl_: "Client CVar",
	sv_: "Server CVar",
	mp_: "Multiplayer CVar",
	r_: "Render CVar",
};

const COMPLETION_ITEMS: vscode.CompletionItem[] = buildCompletionItems();

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage(
		"¡Extensión CS2-CFG activada correctamente!",
	);

	const completionProvider = vscode.languages.registerCompletionItemProvider(
		"cs2-cfg",
		{
			provideCompletionItems(
				_document: vscode.TextDocument,
				_position: vscode.Position,
			): vscode.CompletionList {
				vscode.window.showInformationMessage("¡Autocompletado ejecutado!");
				return new vscode.CompletionList(COMPLETION_ITEMS, false);
			},
		},
	);

	context.subscriptions.push(completionProvider);
}

function buildCompletionItems(): vscode.CompletionItem[] {
	return (commands.commands as string[]).map((command) => {
		const item = new vscode.CompletionItem(
			command,
			vscode.CompletionItemKind.Function,
		);

		const prefix = Object.keys(CVAR_PREFIXES).find((p) =>
			command.startsWith(p),
		);
		item.detail = prefix ? CVAR_PREFIXES[prefix] : "CS2 Command";

		return item;
	});
}

export function deactivate() {}
