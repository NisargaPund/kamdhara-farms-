import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const index = join(dist, 'index.html');
const notFound = join(dist, '404.html');
const redirectsSrc = join('public', '_redirects');
const redirectsDst = join(dist, '_redirects');

if (!existsSync(index)) {
  console.error('dist/index.html missing — run vite build first');
  process.exit(1);
}

copyFileSync(index, notFound);
copyFileSync(redirectsSrc, redirectsDst);
console.log('Netlify postbuild: wrote dist/404.html and dist/_redirects');
