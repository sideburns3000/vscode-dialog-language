# Dialog Language Support

This extension adds some support for the **Dialog** language, which is used to create interactive fiction (text adventures). Dialog was created by Linus Åkesson and can be found at <https://linusakesson.net/dialog/>.

## Features

* syntax highlighting

* bracket matching & autoclosing

* toggling comments (to comment swathes of code in/out) (`Ctrl+#`)

* automatic indentation after certain keywords -- `(if, then, else, elseif)` -- and de-indentation after `(endif)`

* folding option: folds indented sections, and sections which begin when a line starts with `#` and which end when a line starts with `%%%`

### Compiling from VS Code

In the file explorer panel, right-click on the `.dg` file you want to compile, and select `Compile to z8` (or `aastory`, `z5`, `zblorb`) from the context menu.

**Or:** select `Terminal -> Run Task ...` from the menu bar and choose the compilation target.

**Or:** press `Ctrl+Shift+B` (or from the menu: `Terminal -> Run Build Task...`) and choose which compilation target will be regarded as the default one.

Compiler warnings and errors will be shown in the "Problems" tab, and you can click on them to jump to the corresponding line.

**Note:** for compilation, the extension assumes that the compiler `dialogc` is accessible on your system via your PATH environment variable. If that is not the case (or if you want to try out a new experimental compiler version, for example), then you can provide the full path to the compiler executable in the extension settings.

## Extension Settings

This extension contributes the following settings:

* `dialog.compiler`: Set the compiler executable that shall be used for compiling.
* `dialog.includeWhenCompiling`: List all `.dg` files that shall be included when compiling, separated only by commas, in the intended order (for example: `stddebug.dg,stdlib.dg`). (Except for the `.dg` file that is currently open in the editor, as that will be prepended automatically.) The default is just the Standard Library: `stdlib.dg`.

## Screenshots

**Compilation from context menu (the colour theme is Dark+ (default dark)):**

![Compilation](images/compile_from_context_menu.png)

**Code folding (the colour theme is [Ayu Mirage](https://marketplace.visualstudio.com/items?itemName=teabyii.ayu)):**

![Code folding](images/folding.gif)

**Compiler warning, jump to the line from the "Problems" tab (the colour theme is [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)):**

![Compiler warning](images/jump_to_problem_line.gif)

## NOT implemented

The extension does not implement intelligent autocomplete, tooltips/hover information, interaction with the debugger and other advanced features.

## Release Notes

### 1.1.0 - 2022-03-10

#### Changed

Big thanks go to Nathanaël Marion ([Natrium729](https://marketplace.visualstudio.com/publishers/natrium729)), who contributed these changes:

* Improved syntax highlighting with better, more fine-grained and redefined scopes.
* Improved language configuration by adding a word pattern, such that VS Code's word completion will now work better for Dialog files and take into account leading sigils such as `$` or `#`.

### 1.0.0 - 2019-09-13

Initial release.

## License

Copyright (c) 2019-present Michael Lauenstein. Released under the MIT License (see LICENSE).
