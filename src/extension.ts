/**
 * Copyright (c) 2019 Michael Lauenstein
 * License: MIT (see LICENSE file in the root folder)
 * 
 * Based on code samples from Microsoft which were also released under the MIT License:
 * https://github.com/microsoft/vscode-extension-samples/tree/master/task-provider-sample
 */

// The module 'vscode' contains the VS Code extensibility API
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

// this method is called when the extension is activated
// (compare activationEvents in package.json)
export function activate(context: vscode.ExtensionContext) {

	dgTaskProvider = vscode.tasks.registerTaskProvider("dialog", new DialogTaskProvider());

	// look out for changes to the compilation configuration settings
	vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('dialog.includeWhenCompiling')) {
			// we need to re-register the tasks
			// to take into account the changed compilation settings
			if (dgTaskProvider) {
				dgTaskProvider.dispose();
			}
			dgTaskProvider = vscode.tasks.registerTaskProvider("dialog", new DialogTaskProvider());
			context.subscriptions.push(dgTaskProvider);
        }
    });

	context.subscriptions.push(dgTaskProvider);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let cmdCompileToAastory = vscode.commands.registerCommand('dialog.compileToAastory', async (uri: vscode.Uri) => {
		// This will be executed every time the command is executed
		compile(uri, "aa");
	});

	let cmdCompileToZ5 = vscode.commands.registerCommand('dialog.compileToZ5', async (uri: vscode.Uri) => {
		compile(uri, "z5");
	});

	let cmdCompileToZ8 = vscode.commands.registerCommand('dialog.compileToZ8', async (uri: vscode.Uri) => {
		compile(uri, "z8");
	});

	let cmdCompileToZblorb = vscode.commands.registerCommand('dialog.compileToZblorb', async (uri: vscode.Uri) => {
		compile(uri, "zblorb");
	});

	context.subscriptions.push(cmdCompileToAastory);
	context.subscriptions.push(cmdCompileToZ5);
	context.subscriptions.push(cmdCompileToZ8);
	context.subscriptions.push(cmdCompileToZblorb);
}

/**
 * Compile a Dialog file to a specified target
 * @param {vscode.Uri} uri  the file to be compiled
 * @param {string} intendedTarget the compilation target (aa, z5, z8, zblorb)
 */
async function compile(uri: vscode.Uri, intendedTarget: string) {
	// we open the file in an editor tab, if it's not already open;
	// this way we ensure that VS Code's ${file} variable is set
	// correctly and that our tasks, which reference ${file},
	// will run correctly
	vscode.commands.executeCommand('vscode.open', uri);

	// we fetch our pre-built tasks (see DialogTaskProvider above)
	// and execute the task which has the correct compilation target
	vscode.tasks.executeTask(await vscode.tasks.fetchTasks(new DialogTaskFilter()).then(function (tasks) {
		return tasks.find(function (task) {
			return task.definition.target === intendedTarget;
		})!;
	}));
}

class DialogTaskFilter implements vscode.TaskFilter {
	public type: string = "dialog";
}

// this method is called when the extension is deactivated
export function deactivate() {
	if (dgTaskProvider) {
		dgTaskProvider.dispose();
	}
}
