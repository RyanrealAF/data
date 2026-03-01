
'use server';

import fs from 'fs/promises';
import path from 'path';
import { Snippet } from '@/lib/types';

const TAGGING_DIR = path.join(process.cwd(), 'src/data/tagging');

/**
 * Ensures the tagging directory exists.
 */
async function ensureDirectory() {
  try {
    await fs.access(TAGGING_DIR);
  } catch {
    await fs.mkdir(TAGGING_DIR, { recursive: true });
  }
}

/**
 * Saves a collection of snippets to a timestamped JSON file in the backend folder.
 */
export async function saveSnippetsToBackend(snippets: Snippet[]) {
  try {
    await ensureDirectory();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `snippets-export-${timestamp}.json`;
    const filePath = path.join(TAGGING_DIR, filename);
    
    const data = {
      exportedAt: new Date().toISOString(),
      count: snippets.length,
      snippets: snippets
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true, filename };
  } catch (error) {
    console.error('Failed to save snippets to backend:', error);
    return { success: false, error: 'Failed to write to file system.' };
  }
}

/**
 * Lists all exported tagging files.
 */
export async function getTaggingFiles() {
  try {
    await ensureDirectory();
    const files = await fs.readdir(TAGGING_DIR);
    return files.filter(f => f.endsWith('.json'));
  } catch (error) {
    console.error('Error reading tagging directory:', error);
    return [];
  }
}
