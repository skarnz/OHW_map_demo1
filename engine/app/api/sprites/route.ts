import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface GeneratedSprite {
  id: string;
  name: string;
  category: string;
  size: string;
  spritePath: string;
  generatedAt: string;
}

export async function GET() {
  try {
    const registryDir = join(process.cwd(), 'public', 'generated');
    
    if (!existsSync(registryDir)) {
      return NextResponse.json({ sprites: [] });
    }
    
    const files = await readdir(registryDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const sprites: GeneratedSprite[] = await Promise.all(
      jsonFiles.map(async (f) => {
        const content = await readFile(join(registryDir, f), 'utf-8');
        return JSON.parse(content);
      })
    );
    
    return NextResponse.json({ sprites });
  } catch (error) {
    console.error('Error reading sprites:', error);
    return NextResponse.json({ sprites: [], error: 'Failed to load sprites' });
  }
}
