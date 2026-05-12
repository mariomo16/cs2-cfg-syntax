# CS2 Config Syntax for Visual Studio Code

Color-coded syntax highlighting for Counter-Strike 2 `.cfg` files. Recognizes all console commands and ConVars as of October 25, 2025.

> Also compatible with Counter-Strike: Global Offensive `.cfg` files.

[![Version](https://vsmarketplacebadges.dev/version/mario-morales-ortega.cs2-cfg-syntax.svg)](https://marketplace.visualstudio.com/items?itemName=mario-morales-ortega.cs2-cfg-syntax)
[![Installs](https://vsmarketplacebadges.dev/installs/mario-morales-ortega.cs2-cfg-syntax.svg)](https://marketplace.visualstudio.com/items?itemName=mario-morales-ortega.cs2-cfg-syntax)
[![Rating](https://vsmarketplacebadges.dev/rating/mario-morales-ortega.cs2-cfg-syntax.svg)](https://marketplace.visualstudio.com/items?itemName=mario-morales-ortega.cs2-cfg-syntax)

## Preview

> Screenshots taken with Dark 2026 (built-in theme)

| Without Extension | With Extension |
| --- | --- |
| ![CS2 config file without syntax highlighting](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOff.png) | ![CS2 config file with syntax highlighting enabled](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOn.png) |

## Features

Highlights the following elements in CS2 config files:

- **ConVars**: All current console commands and variables (e.g., `sensitivity`, `mp_roundtime`, `exec`)
- **Aliases**: Custom alias definitions with highlighted names
- **Keybinds**: All keys, mouse buttons, and scancodes
- **Maps & Weapons**: Map names (`de_cache`, `cs_italy`) and weapon identifiers
- **Network**: IPv4 addresses and hostnames with ports
- **Values**: Numbers, booleans, and strings
- **Comments**: Line comments starting with `//`

## Installation

Search **CS2 Config Syntax** in the VS Code Extensions panel (`Ctrl+Shift+X`) or install directly from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=mario-morales-ortega.cs2-cfg-syntax).

## Setup

The extension activates automatically when you open a `.cfg` file. If it doesn't:

1. Open a `.cfg` file
2. Click the language indicator in the bottom-right corner
3. Select **Configure File Association for '.cfg'...**
4. Search and select **CS2 Config**

Alternatively, add this to your user settings (`Ctrl+,`):

![VS Code settings.json showing the file association configuration for .cfg files](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/settings.png)

## Known Issues

- Some regex patterns are intentionally broad (e.g., `r_`) and may match more identifiers than intended.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.
