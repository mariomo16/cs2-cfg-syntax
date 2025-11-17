# CS2 Config Syntax for Visual Studio Code

Makes Counter-Strike 2 `.cfg` files clear and visually organized with comprehensive color-coded syntax highlighting. Recognizes all console commands and variables (ConVars) as of October 25, 2025.<br />
<small> **_Also compatible with Counter-Strike: Global Offensive `.cfg` files._** </small>

## Features

> Screenshots taken with [Catppuccin for VSCode](https://marketplace.visualstudio.com/items?itemName=Catppuccin.catppuccin-vsc) v3.18.1 & [CS2 Config Syntax](https://marketplace.visualstudio.com/items?itemName=mario-morales-ortega.cs2-cfg-syntax) v0.3.0

| Extension Off                                                                                                  | Extension On                                                                                                 |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| ![extensionOff](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOff.png) | ![extensionOn](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOn.png) |

Makes CS2 config files easier to read and edit with color coding for:

- **ConVars**: All current console commands and variables as of October 25, 2025 (e.g., `sensitivity`, `cl_crosshair`, `mp_roundtime`, `exec`, `echo`)
- **Aliases**: Custom alias definitions with highlighted names
- **Keybinds**: All keys, mouse buttons, and scancodes
- **Maps & Weapons**: Map names (`de_dust2`, `cs_italy`) and weapon identifiers
- **Network**: IPv4 addresses and hostnames with ports
- **Values**: Numbers, booleans, and strings
- **Comments**: Line comments starting with `//`

### Known Issues

- Some regex patterns are intentionally broad (e.g., `r_`) and may match more identifiers than intended.

## Setup

The extension should activate automatically. If it doesn’t, follow these steps:

- Open a `.cfg` file
- Click the bottom-right corner to **Select Language Mode**
- Select: **Configure File Association for '.cfg'...** and search `CS2 Config`

Or open your user settings (`Ctrl+,`) and add the configuration manually:

<img src="https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/settings.png" alt="Alt Text" style="width:50%; height:auto;">
