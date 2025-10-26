# Changelog

All notable changes to the "CS2 Config Syntax" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-26

### Added

-   **Alias name highlighting**: Alias names now have specific syntax highlighting (`entity.name.type`)
    -   Support for quoted aliases: `alias "name" "command"`
    -   Support for unquoted aliases: `alias name command`
-   **Keybind highlighting**: Bound keys now have specific colorization
    -   Support for standard keys (a-z, 0-9, SPACE, ENTER, etc.)
    -   Support for special keys (MOUSE1-5, MOUSE_X, MOUSE_Y, MWHEELUP/DOWN)
    -   Support for numpad keys (KP\_\*)
    -   Support for scancodes (scancode0-255)
-   **Map name highlighting**:
    -   Arms Race maps (ar\_\*)
    -   Hostage maps (cs\_\*)
    -   Defusal maps (de\_\*)
    -   Lobby mapveto
-   **New command parameters detected**:
    -   `weapon_*` (all weapon variants)
    -   `*_projectile` (grenade projectiles)

### Changed

-   **Scope reorganization**: Several scopes changed for better semantics
    -   `pitch`, `yaw`, `messagemode` changed from `support.type` to `keyword.control`
    -   Weapons and maps changed from `support.type` to `entity.name.class`
    -   Specific commands now use `support.function` instead of `keyword.control`
-   **Improved command patterns**: Using non-capturing groups `(?:...)` for better performance
-   **Expanded command list**: Added missing commands like `binddefaults`, `bindss`, `kill`

### Fixed

-   **Improved pattern order**: Strings are now processed correctly with all sub-patterns included
-   **Improved quote detection**: Quotes in aliases and binds are now consistently colored as `punctuation.definition.string`

## [0.3.4] - 2025-10-25

### Fixed

-   Fixed an issue where some words were incorrectly highlighted due to an overly general regex pattern matching `sk`.

## [0.3.3] - 2025-10-24

### Changed

-   Adjusted several **scopes** to better differentiate syntax elements.
-   Updated the **main command regex**:
    -   Removed obsolete or non-existent commands.
    -   Added missing commands.
    -   Split generic regexes (like `cl_*`, `sv_*`, etc.) from specific command patterns for improved accuracy.
-   Standardized **repository block names** to a consistent format (`#comment`, `#command`, `#string`, `#network`, `#literal`, `#separator`).
-   Simplified several **regex patterns** to improve readability and performance.
-   Added **syntax highlighting** for new parameters:  
    `starttimeout`, `relative`, `subclass_change`, and `weapon_knife`.
-   Added **reserved words** used only in binds:  
    `pitch`, `yaw`, `messagemode`, and `messagemode2`.

### Improved

-   Overall scope consistency and keyword classification.
-   More accurate highlighting for common CS2 configuration commands and parameters.

## [0.3.2] - 2025-10-19

### Changed

-   Changed how strings are read to follow Valve’s official syntax.
-   **Significantly** reduced the extension’s size.

### Fixed

-   Fixed a bug that allowed leading zeros in IPv4 addresses.
-   Fixed a bug where a character followed by the end of a string was also counted as part of the string.

## [0.3.1] - 2025-10-18

### Changed

-   Moved IPv4 addresses and hostnames from `#values` to a dedicated `#network` repository for clearer separation.
-   Created `#separators` repository for `;` and `|` punctuation, previously only defined inside strings.
-   Included `#network` and `#separators` inside string patterns for consistent highlighting.
-   Removed `invalid` scopes for malformed IPv4 addresses, hostnames, or ports; such values now appear as normal strings.
-   Updated numeric regex to accept values like `.8` as valid numbers, reflecting CS2 behavior.
-   Renamed comment scope from `comment.line.cs2-cfg` → `comment.line.double-slash.cs2-cfg`.
-   Refactored repository structure for better maintainability.

### Fixed

-   Prevented accidental numeric highlighting of malformed network values.

## [0.3.0] - 2025-10-17

### Added

-   Highlighting of `.` and `:` separators in **valid IPv4 addresses** with ports 27000–27099.
-   Highlighting of `.` and `:` separators in **valid domain names** with ports 27000–27099.
-   Invalid highlighting for **IPv4** with incorrect format or ports outside 27000–27099.
-   Invalid highlighting for **domain names** with incorrect or out-of-range ports.

### Changed

-   Updated regex patterns for valid IPs and domain names to capture separators `. `and `:`.

## [0.2.0] - 2025-10-16

### Added

-   Added proper handling of `;` and `|` as `punctuation.separator` inside strings.
-   Included `#commands` and `#values` inside string patterns to avoid repeating long regexes.
-   Lookahead for string endings updated to `"(?=\s|$|//)"` to correctly ignore end-of-line comments.

### Changed

-   Scope for comments updated from `comment.line.double-slash` → `comment.line` for cleaner semantic naming.
-   Scope for commands updated from `keyword` → `keyword.other` to better reflect command semantics.
-   Scope for IPs and domain names updated from `variable.name` → `variable.other` to differentiate network values from numeric values.
-   String patterns now safer with lookahead to avoid including comments as part of the string.
-   Numeric pattern uses lookbehind/lookahead for more precise number detection: `(?<=[\s\"|.+-])[+-]?\d+(\.\d+)?(?=\b|\"|$)`.

### Fixed

-   Prevented accidental inclusion of comments in string values.
-   Clarified separation between numeric values and IP/domain values for syntax highlighting.

## [0.1.0] 2025-10-05

-   Initial release of CS2 Config Highlighter.
-   Basic syntax highlighting for:
    -   Comments (`//`)
    -   Commands and binds
    -   Strings (`"..."`)
    -   Numbers
    -   Boolean values (`true`/`false`)
    -   IPs and domain names
