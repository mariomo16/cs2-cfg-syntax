# CS2 Config Highlighter

This extension adds color-coded clarity to `.cfg` files, making it easy to edit and optimize your game settings, ensuring your configs are both accurate and visually intuitive.

## Features

> Differences shown in my own cfg file (using CS2 Config Highlighter v0.1.0) with [Andromeda](https://marketplace.visualstudio.com/items?itemName=EliverLara.andromeda)
> ![extensionOff](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOff.png) ![extensionOn](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOn.png)

-   **Vivid Syntax Highlighting:** Instantly differentiate CS2-specific commands (e.g., `sensitivity`, `bind`) with distinct colors for seamless config editing.
-   **Value Clarity:** Clearly distinguish strings, numeric/boolean values, and IP addresses (used in `connect` commands).
-   **Source 2 Engine Support:** Tailored for CS2’s `.cfg` format, ensuring accurate highlighting for autoexec and custom config files.
-   **Error Reduction:** Visual cues highlight commands and values, helping prevent syntax mistakes that could stop your cfg from running correctly.

## Setup

The extension should activate automatically. If it doesn’t, follow these steps:

-   Open a `.cfg` file
-   Click the bottom-right corner to change the **File Association** _(or press `Ctrl+K, Ctrl+M`)_
-   Select: **Configure CS2 Config language based settings…**

Or open your user settings (`Ctrl+,`) and add the configuration manually:
![](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/settings.png)

### Known Issues

-   Not all [commands](https://developer.valvesoftware.com/wiki/List_of_Counter-Strike_2_console_commands_and_variables) are included yet.
-   The regex patterns have not been thoroughly reviewed; there may be more efficient approaches.

## Release Notes

### 0.2.0

Second release with improvements and optimizations for CS2 config (`.cfg`) syntax highlighting.

-   Improved comment highlighting with cleaner scope naming (`comment.line`).
-   Commands and binds now use more precise scope (`keyword.other`) for better semantic coloring.
-   Strings now correctly handle end-of-line comments and include command/value highlighting inside quotes.
-   Added syntax highlighting for command delimiters (`;` and `|`) inside strings.
-   IP addresses and domain names now have distinct highlighting (`variable.other`) to separate them from numeric values.
-   Numeric and boolean values now have improved detection and consistent highlighting.
-   Overall grammar is cleaner, more maintainable, and more consistent with VSCode/TextMate conventions.
