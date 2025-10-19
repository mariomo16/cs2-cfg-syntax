# CS2 Config Highlighter

Makes `.cfg` files clear and visually organized with color-coded syntax highlighting for easy editing.

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

<img src="https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/settings.png" alt="Alt Text" style="width:50%; height:auto;">

### Known Issues

-   Regex patterns have not been thoroughly reviewed; there may be more efficient approaches.
-   Some regex patterns are intentionally broad. For example, `r_\w+` will match any identifier starting with `r_`, which might highlight more than expected.
-   Not all [commands](https://developer.valvesoftware.com/wiki/List_of_Counter-Strike_2_console_commands_and_variables) are included yet.

## Release Notes

### 0.3.2

Patch release with improved string and IPv4 parsing for CS2 config (`.cfg`) syntax highlighting.

-   Updated string parsing to follow Valve’s official syntax.
-   **Significantly** reduced the extension’s size.
-   Fixed leading zeros being allowed in IPv4 addresses.
-   Fixed an issue where a character at the end of a string was incorrectly counted as part of the string.
