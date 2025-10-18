# CS2 Config Highlighter

This extension adds color-coded clarity to `.cfg` files, making it easy to edit and optimize your game settings, ensuring your configs are both accurate and visually intuitive.

## Features

> Differences shown in my own cfg file (using CS2 Config Highlighter v0.3.0) with [Catppuccin for VSCode](https://marketplace.visualstudio.com/items?itemName=Catppuccin.catppuccin-vsc) > ![extensionOff](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOff.png) ![extensionOn](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOn.png)

-   **Vivid Syntax Highlighting:** Instantly differentiate CS2-specific commands (e.g., `sensitivity`, `bind`) with distinct colors for seamless config editing.
-   **Value Clarity:** Clearly distinguish strings, numeric/boolean values, and IP addresses (used in `connect` commands).
-   **Source 2 Engine Support:** Tailored for CS2’s `.cfg` format, ensuring accurate highlighting for autoexec and custom config files.
-   **Error Reduction:** Visual cues highlight commands and values, helping prevent syntax mistakes that could stop your cfg from running correctly.

## Setup

The extension should activate automatically. If it doesn’t, follow these steps:

-   Open a `.cfg` file
-   Click the bottom-right corner to **Select Language Mode**
-   Select: **Configure File Association for '.cfg'...** and search `CS2 Config`

Or open your user settings (`Ctrl+,`) and add the configuration manually:
![](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/settings.png)

### Known Issues

-   Regex patterns have not been thoroughly reviewed; there may be more efficient approaches.
-   Some regex patterns are intentionally broad. For example, `r_\w+` will match any identifier starting with `r_`, which might highlight more than expected.
-   Not all [commands](https://developer.valvesoftware.com/wiki/List_of_Counter-Strike_2_console_commands_and_variables) are included yet.

## Release Notes

### 0.3.1

Patch release with internal refactoring and improvements for CS2 config (`.cfg`) syntax highlighting.

-   Moved IPv4 addresses and hostnames to a dedicated `#network` repository for clearer separation from general numeric values.
-   Created `#separators` repository for `;` and `|` punctuation, previously only defined inside strings, now included in strings for consistent highlighting.
-   Removed `invalid` scopes for malformed IPv4 addresses, hostnames, or ports; such values now appear as normal strings.
-   Updated numeric regex to accept values like `.8` as valid numbers, matching CS2 behavior.
-   Renamed comment scope from `comment.line.cs2-cfg` → `comment.line.double-slash.cs2-cfg`.
-   Refactored repository structure for improved maintainability and cleaner grammar.
-   Fixed accidental numeric highlighting of malformed network values.
