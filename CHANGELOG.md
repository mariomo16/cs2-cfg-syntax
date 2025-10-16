# Change Log

All notable changes to the "cs2-cfg-syntax" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

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
