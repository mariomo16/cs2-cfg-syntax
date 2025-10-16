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

### 0.3.0

Third release with enhanced network value highlighting for CS2 config (`.cfg`) syntax.

-   Added highlighting for `.` and `:` separators in valid **IPv4 addresses** with ports 27000–27099.
-   Added highlighting for `.` and `:` separators in valid **domain names** with ports 27000–27099.
-   Added invalid highlighting for **IPv4 addresses** with incorrect format or out-of-range ports.
-   Added invalid highlighting for **domain names** with incorrect format or out-of-range ports.
-   Updated regex patterns for valid IPs and domain names to properly capture separators without affecting invalid values.
