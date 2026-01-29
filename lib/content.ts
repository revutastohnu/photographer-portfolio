import fs from 'fs';
import path from 'path';
import { PhotoSet } from './types';

const setsDirectory = path.join(process.cwd(), 'content/sets');

export function getAllPhotoSets(): PhotoSet[] {
  const slugs = fs.readdirSync(setsDirectory);
  
  const sets = slugs
    .map((slug) => {
      const setPath = path.join(setsDirectory, slug, 'set.json');
      if (!fs.existsSync(setPath)) return null;
      
      const fileContents = fs.readFileSync(setPath, 'utf8');
      const set: PhotoSet = JSON.parse(fileContents);
      
      return set;
    })
    .filter((set): set is PhotoSet => set !== null)
    .sort((a, b) => b.year - a.year);
  
  return sets;
}

export function getPhotoSetBySlug(slug: string): PhotoSet | null {
  try {
    const setPath = path.join(setsDirectory, slug, 'set.json');
    const fileContents = fs.readFileSync(setPath, 'utf8');
    const set: PhotoSet = JSON.parse(fileContents);
    return set;
  } catch (error) {
    return null;
  }
}

export function getAllTags(): string[] {
  const sets = getAllPhotoSets();
  const tagsSet = new Set<string>();
  
  sets.forEach(set => {
    set.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
}
