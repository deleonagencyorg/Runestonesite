import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export interface GalleryPhoto {
  src: string;
  alt: string;
  number: number;
}

function leadingNumber(name: string) {
  const match = /^(\d+)/.exec(name);
  return match ? Number(match[1]) : 9999;
}

function altFromFile(name: string) {
  return name
    .replace(/^\d+\s*-\s*/, '')
    .replace(/\.(jpe?g|webp)$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function residenceGallery(): GalleryPhoto[] {
  const dir = join(process.cwd(), 'public/media/gallery');
  const files = readdirSync(dir).filter((file) => /\.webp$/i.test(file) && !file.startsWith('._'));
  const ranked = files
    .map((file) => ({ file, number: leadingNumber(file) }))
    .sort((a, b) => a.number - b.number || a.file.localeCompare(b.file));
  const opening = ranked.filter((item) => item.number >= 73 && item.number <= 83);
  const sequence = ranked.filter((item) => item.number < 73 || item.number > 83);

  return [...opening, ...sequence].map((item) => ({
    number: item.number,
    src: `/media/gallery/${encodeURIComponent(item.file)}`,
    alt: altFromFile(item.file),
  }));
}
