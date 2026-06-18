# Changelog

## [Unreleased]

### Changed
- Renamed manifest file from `cortex.json` to `manifest.json` for consistency with Cortex standard
- Standardized UI section structure to `ui.settings` format
- Normalized parameter naming: `defaultValue` → `default`, `options` → `enum`
- Added `homepage` field with repository URL
- Added `dependencies` field to manifest

### Fixed
- Replaced `console.log` with `ctx.logger.info()` in lifecycle hooks

## [1.0.1] — 2026-06-15

### Added
- Initial release
## [1.0.1] — 2026-06-17

### Added

- Initial project setup

## [1.0.0] — 2026-06-15

### Added

- Initial release of cortex-plugin-obsidian
- `obsidian_read_note` tool — Read notes from an Obsidian vault
- `obsidian_write_note` tool — Write or update notes with optional frontmatter
- `obsidian_search_vault` tool — Search notes by title and content
- `obsidian_list_notes` tool — List notes with glob pattern filtering
- `obsidian_create_wikilink` tool — Create wiki-style [[links]] between notes
- `obsidian_graph` tool — Explore the note graph with configurable depth
