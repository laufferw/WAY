// Bundles the app into one self-contained HTML file (no server needed).
//   npm run build                → dist/holistic-profile.html
//   npm run build -- --sandboxed → also disables network, printing and URL state,
//                                  for hosts that block them (e.g. Claude Artifacts)
import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const sandboxed = process.argv.includes('--sandboxed');
const out = process.argv.find((a) => a.startsWith('--out='))?.slice(6) ?? 'dist/holistic-profile.html';

const { outputFiles } = await build({
  entryPoints: ['js/app.js'], bundle: true, format: 'iife', minify: true, write: false, target: 'es2020',
});
const js = outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const css = await readFile('css/styles.css', 'utf8');
let html = await readFile('index.html', 'utf8');

html = html
  .replace('<link rel="stylesheet" href="css/styles.css">', `<style>\n${css}</style>`)
  .replace('<script type="module" src="js/app.js"></script>',
    `${sandboxed ? '<script>window.__SANDBOXED__ = true;</script>\n' : ''}<script>\n${js}</script>`);

await mkdir(out.split('/').slice(0, -1).join('/') || '.', { recursive: true });
await writeFile(out, html);
console.log(`Wrote ${out} (${(html.length / 1024).toFixed(0)} KB)`);
