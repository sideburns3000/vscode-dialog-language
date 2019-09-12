/**
 * Copyright (c) 2019 Michael Lauenstein
 * License: MIT (see LICENSE file in the root folder)
 * 
 * Based on code samples from Microsoft which were also released under the MIT License:
 * https://github.com/microsoft/vscode-extension-samples/tree/master/task-provider-sample
 */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

interface DialogTaskDefinition extends vscode.TaskDefinition {
	type: "dialog";
	target: string;
}

class DialogTaskProvider implements vscode.TaskProvider {
	private tasks: vscode.Task[] | undefined;

	public async provideTasks(): Promise<vscode.Task[]> {
		return this.getTasks();
	}

	public resolveTask(_task: vscode.Task): vscode.Task | undefined {
		const target: string = _task.definition.target;
		if (target) {
			const definition: DialogTaskDefinition = <any>_task.definition;
			return this.getTask(definition.target, definition);
		}
		return undefined;
	}

	private getTasks(): vscode.Task[] {
		if (this.tasks !== undefined) {
			return this.tasks;
		}
		const targets: string[] = ["z5", "z8", "zblorb", "aa"];
		this.tasks = [];
		targets.forEach(target => {
			this.tasks!.push(this.getTask(target));
		});
		return this.tasks;
	}

	private getTask(target: string, definition?: DialogTaskDefinition): vscode.Task {
		if (definition === undefined) {
			definition = {
				type: "dialog",
				target: target
			};
		}
		let taskName: string = "Compile to " + ((target === "aa") ? "aastory" : target);
		let includeFiles: string = "";
		if (vscode.workspace.getConfiguration("dialog").get<string>("includeWhenCompiling")) {
			includeFiles = vscode.workspace.getConfiguration("dialog").get<string>("includeWhenCompiling")!;
		}
		let basicArguments: string[] = ["-t", target, "${file}"];
		let includeFilesList: string[] = includeFiles.split(",");
		let completeArguments: string[] = basicArguments.concat(includeFilesList);
		return new vscode.Task(definition, vscode.TaskScope.Workspace, taskName, "dialog", new vscode.ProcessExecution("dialogc", completeArguments), "$dialog");
	}
}

let dgTaskProvider: vscode.Disposable | undefined;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	dgTaskProvider = vscode.tasks.registerTaskProvider("dialog", new DialogTaskProvider());

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "dialog-language-support" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (dgTaskProvider) {
		dgTaskProvider.dispose();
	}
}
