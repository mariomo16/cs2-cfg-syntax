# CS2 Config Highlighter

Makes .cfg files clear and visually organized with color-coded syntax highlighting for easy editing.

## Features

| Extension Off                                                                                                  | Extension On                                                                                                 |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| ![extensionOff](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOff.png) | ![extensionOn](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOn.png) |

Differences shown in my own cfg file (using CS2 Config Highlighter v0.3.0) with [Catppuccin](https://marketplace.visualstudio.com/items?itemName=Catppuccin.catppuccin-vsc)

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
