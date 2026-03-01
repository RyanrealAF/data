'use server';

import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

export async function getSourceFiles() {
  try {
    const files = await fs.readdir(DATA_DIR);
    return files.filter(f => f.endsWith('.txt') || f.endsWith('.md'));
  } catch (error) {
    console.error('Error reading data directory:', error);
    return [];
  }
}

export async function getFileContent(filename: string) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    return null;
  }
}
