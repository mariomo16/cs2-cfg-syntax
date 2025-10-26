# CS2 Config Syntax for Visual Studio Code

Makes Counter-Strike 2 `.cfg` files clear and visually organized with comprehensive color-coded syntax highlighting. Recognizes all console commands and variables (ConVars) as of October 25, 2025.
Also compatible with Counter-Strike: Global Offensive `.cfg` files.

## Features

| Extension Off                                                                                                  | Extension On                                                                                                 |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| ![extensionOff](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOff.png) | ![extensionOn](https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/codeOn.png) |

Makes CS2 config files easier to read and edit with color coding for:

-   **ConVars**: All current console commands and variables as of October 25, 2025 (e.g., `sensitivity`, `cl_crosshair`, `mp_roundtime`, `exec`, `echo`)
-   **Aliases**: Custom alias definitions with highlighted names
-   **Keybinds**: All keys, mouse buttons, and scancodes
-   **Maps & Weapons**: Map names (`de_dust2`, `cs_italy`) and weapon identifiers
-   **Network**: IPv4 addresses and hostnames with ports
-   **Values**: Numbers, booleans, and strings
-   **Comments**: Line comments starting with `//`

### Known Issues

-   Some regex patterns are intentionally broad (e.g., `r_`) and may match more identifiers than intended.

## Setup

The extension should activate automatically. If it doesn’t, follow these steps:

-   Open a `.cfg` file
-   Click the bottom-right corner to **Select Language Mode**
-   Select: **Configure File Association for '.cfg'...** and search `CS2 Config`

Or open your user settings (`Ctrl+,`) and add the configuration manually:

<img src="https://raw.githubusercontent.com/mariomo16/cs2-cfg-syntax/refs/heads/main/images/settings.png" alt="Alt Text" style="width:50%; height:auto;">

## Release Notes

### 1.0.0

Major release with comprehensive syntax highlighting improvements and new features.

#### ✨ New Features

-   **Alias Detection**: Alias names are now highlighted with distinct colors
    -   `alias "QuickBuy" "buy ak47; buy vest"` - "QuickBuy" gets special highlighting
    -   Works with both quoted and unquoted alias names
-   **Keybind Recognition**: Bound keys now have their own syntax highlighting
    -   Standard keys: `a-z`, `0-9`, `SPACE`, `ENTER`, `TAB`, etc.
    -   Mouse buttons: `MOUSE1-5`, `MOUSE_X`, `MOUSE_Y`, `MWHEELUP`, `MWHEELDOWN`
    -   Numpad keys: `KP_INS`, `KP_HOME`, `KP_ENTER`, etc.
    -   Scancodes: `scancode0` through `scancode255`
-   **Map Name Highlighting**: Map names are now recognized and colored
    -   Arms Race maps: `ar_baggage`, `ar_shoots`, etc.
    -   Hostage maps: `cs_agency`, `cs_italy`, `cs_office`
    -   Defusal maps: `de_dust2`, `de_ancient`, `de_inferno`, etc.
-   **Enhanced Parameter Detection**: Added support for weapon parameters and projectile identifiers
    -   `weapon_knife`, `weapon_ak47`, `weapon_awp`, etc.
    -   `flashbang_projectile`, `smokegrenade_projectile`, etc.

#### 🔧 Improvements

-   Optimized regex patterns using non-capturing groups for better performance
-   Reorganized syntax scopes for more accurate semantic highlighting
-   Expanded command list with additional console commands
-   Improved quote handling in aliases and binds

#### 🐛 Fixes

-   Fixed pattern processing order for better string content detection
-   Consistent punctuation coloring for quotes in special contexts
