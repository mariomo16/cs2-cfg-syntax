# Change Log

All notable changes to the "cs2-cfg-syntax" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

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
