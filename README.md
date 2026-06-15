# cortex-plugin-obsidian

Read/write to local Obsidian vaults, create wiki-links, and explore note graphs.

## Installation

```bash
cortex plugin install marketplace:cortex-plugin-obsidian
cortex plugin install github:CortexPrism/cortex-plugin-obsidian
cortex plugin install ./manifest.json
```

## Tools

### obsidian_read_note

Read a note from the vault.

**Parameters:**
- `path` (string, required) — Path to note relative to vault root
- `vault_path` (string, optional) — Override default vault path

### obsidian_write_note

Write or update a note.

**Parameters:**
- `path` (string, required) — Path to note relative to vault root
- `content` (string, required) — Note content (Markdown)
- `frontmatter` (string, optional) — JSON string of frontmatter key-values

### obsidian_search_vault

Search notes in the vault.

**Parameters:**
- `query` (string, required) — Search query
- `max_results` (number, optional, default 20) — Maximum results
- `search_content` (boolean, optional, default true) — Search note content

### obsidian_list_notes

List notes in a directory.

**Parameters:**
- `directory` (string, optional, default "/") — Directory relative to vault root
- `recursive` (boolean, optional, default false) — List recursively
- `pattern` (string, optional) — Glob pattern

### obsidian_create_wikilink

Create wiki-style links between notes.

**Parameters:**
- `from_note` (string, required) — Source note path
- `to_note` (string, required) — Target note path
- `alias` (string, optional) — Display alias

### obsidian_graph

Get the note graph (linked notes).

**Parameters:**
- `root_note` (string, optional) — Root note to start from
- `max_depth` (number, optional, default 2) — Maximum traversal depth

## Configuration

```json
{
  "plugins": {
    "cortex-plugin-obsidian": {
      "enabled": true,
      "config": {
        "vaultPath": "/home/user/vault",
        "defaultVaultPath": "/home/user/vault",
        "autoCreateLinks": false
      }
    }
  }
}
```

## Capabilities

- `tools` — Provides tool implementations
- `fs:read` — Reads notes from the vault
- `fs:write` — Writes notes to the vault
- `fs:list` — Lists notes in directories

## License

MIT — See LICENSE file
