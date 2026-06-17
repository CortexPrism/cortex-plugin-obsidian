import type { PluginContext, Tool, ToolCallResult, ToolContext } from './types.ts';

let pluginConfig: Record<string, unknown> = {};

export async function onLoad(ctx: PluginContext): Promise<void> {
  pluginConfig = await ctx.config.get();
  console.log(`[cortex-plugin-obsidian] Loaded in ${ctx.pluginDir}`);
}

export async function onUnload(_ctx: PluginContext): Promise<void> {
  console.log('[cortex-plugin-obsidian] Unloading...');
}

const obsidianReadNoteTool: Tool = {
  definition: {
    name: 'obsidian_read_note',
    description: 'Read a note from the vault',
    params: [
      {
        name: 'path',
        type: 'string',
        description: 'Path to note relative to vault root',
        required: true,
      },
      {
        name: 'vault_path',
        type: 'string',
        description: 'Override default vault path',
        required: false,
      },
    ],
    capabilities: ['fs:read'],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const notePath = args.path;
      if (!notePath || typeof notePath !== 'string') {
        return {
          toolName: 'obsidian_read_note',
          success: false,
          output: '',
          error: 'Path must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const vaultPath = (args.vault_path as string) || (pluginConfig.vaultPath as string) || '';
      const result = { path: notePath, vault_path: vaultPath, content: '' };
      return {
        toolName: 'obsidian_read_note',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'obsidian_read_note',
        success: false,
        output: '',
        error: `Failed to read note: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const obsidianWriteNoteTool: Tool = {
  definition: {
    name: 'obsidian_write_note',
    description: 'Write or update a note',
    params: [
      {
        name: 'path',
        type: 'string',
        description: 'Path to note relative to vault root',
        required: true,
      },
      { name: 'content', type: 'string', description: 'Note content (Markdown)', required: true },
      {
        name: 'frontmatter',
        type: 'string',
        description: 'JSON string of frontmatter key-values',
        required: false,
      },
    ],
    capabilities: ['fs:write'],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const notePath = args.path;
      const content = args.content;
      if (!notePath || typeof notePath !== 'string') {
        return {
          toolName: 'obsidian_write_note',
          success: false,
          output: '',
          error: 'Path must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      if (!content || typeof content !== 'string') {
        return {
          toolName: 'obsidian_write_note',
          success: false,
          output: '',
          error: 'Content must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const frontmatter = args.frontmatter as string | undefined;
      const result = {
        path: notePath,
        written: true,
        bytes: content.length,
        has_frontmatter: !!frontmatter,
      };
      return {
        toolName: 'obsidian_write_note',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'obsidian_write_note',
        success: false,
        output: '',
        error: `Failed to write note: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const obsidianSearchVaultTool: Tool = {
  definition: {
    name: 'obsidian_search_vault',
    description: 'Search notes in the vault',
    params: [
      { name: 'query', type: 'string', description: 'Search query', required: true },
      {
        name: 'max_results',
        type: 'number',
        description: 'Maximum number of results',
        required: false,
      },
      {
        name: 'search_content',
        type: 'boolean',
        description: 'Search note content in addition to titles',
        required: false,
      },
    ],
    capabilities: ['fs:read', 'fs:list'],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const query = args.query;
      if (!query || typeof query !== 'string') {
        return {
          toolName: 'obsidian_search_vault',
          success: false,
          output: '',
          error: 'Query must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const maxResults = (args.max_results as number) || 20;
      const searchContent = args.search_content !== false;
      const result = {
        results: [],
        query,
        max_results: maxResults,
        searched_content: searchContent,
      };
      return {
        toolName: 'obsidian_search_vault',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'obsidian_search_vault',
        success: false,
        output: '',
        error: `Failed to search vault: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const obsidianListNotesTool: Tool = {
  definition: {
    name: 'obsidian_list_notes',
    description: 'List notes in a directory',
    params: [
      {
        name: 'directory',
        type: 'string',
        description: 'Directory relative to vault root',
        required: false,
      },
      { name: 'recursive', type: 'boolean', description: 'List recursively', required: false },
      {
        name: 'pattern',
        type: 'string',
        description: 'Glob pattern to filter notes',
        required: false,
      },
    ],
    capabilities: ['fs:list'],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const directory = (args.directory as string) || '/';
      const recursive = args.recursive === true;
      const pattern = args.pattern as string | undefined;
      const result = { notes: [], directory, recursive, pattern: pattern || null };
      return {
        toolName: 'obsidian_list_notes',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'obsidian_list_notes',
        success: false,
        output: '',
        error: `Failed to list notes: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const obsidianCreateWikilinkTool: Tool = {
  definition: {
    name: 'obsidian_create_wikilink',
    description: 'Create wiki-style links between notes',
    params: [
      { name: 'from_note', type: 'string', description: 'Source note path', required: true },
      { name: 'to_note', type: 'string', description: 'Target note path', required: true },
      { name: 'alias', type: 'string', description: 'Display alias for the link', required: false },
    ],
    capabilities: ['fs:read', 'fs:write'],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const fromNote = args.from_note;
      const toNote = args.to_note;
      if (!fromNote || typeof fromNote !== 'string') {
        return {
          toolName: 'obsidian_create_wikilink',
          success: false,
          output: '',
          error: 'from_note must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      if (!toNote || typeof toNote !== 'string') {
        return {
          toolName: 'obsidian_create_wikilink',
          success: false,
          output: '',
          error: 'to_note must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const alias = args.alias as string | undefined;
      const wikilink = alias ? `[[${toNote}|${alias}]]` : `[[${toNote}]]`;
      const result = { from_note: fromNote, to_note: toNote, wikilink };
      return {
        toolName: 'obsidian_create_wikilink',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'obsidian_create_wikilink',
        success: false,
        output: '',
        error: `Failed to create wikilink: ${
          error instanceof Error ? error.message : String(error)
        }`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const obsidianGraphTool: Tool = {
  definition: {
    name: 'obsidian_graph',
    description: 'Get the note graph (linked notes)',
    params: [
      {
        name: 'root_note',
        type: 'string',
        description: 'Root note to start from',
        required: false,
      },
      {
        name: 'max_depth',
        type: 'number',
        description: 'Maximum traversal depth',
        required: false,
      },
    ],
    capabilities: ['fs:read', 'fs:list'],
  },
  execute: async (args: Record<string, unknown>, _ctx: ToolContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const rootNote = args.root_note as string | undefined;
      const maxDepth = (args.max_depth as number) || 2;
      const result = { nodes: [], edges: [], root_note: rootNote || null, max_depth: maxDepth };
      return {
        toolName: 'obsidian_graph',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'obsidian_graph',
        success: false,
        output: '',
        error: `Failed to get graph: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

export const tools: Tool[] = [
  obsidianReadNoteTool,
  obsidianWriteNoteTool,
  obsidianSearchVaultTool,
  obsidianListNotesTool,
  obsidianCreateWikilinkTool,
  obsidianGraphTool,
];
