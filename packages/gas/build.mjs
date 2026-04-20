import { build, context } from 'esbuild';
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const watch = process.argv.includes('--watch');
const outdir = 'dist';

const options = {
  entryPoints: ['src/Main.ts'],
  outfile: path.join(outdir, 'Code.js'),
  bundle: true,
  format: 'iife',
  globalName: '__OC_GAS__',
  target: 'es2019',
  platform: 'neutral',
  logLevel: 'info',
  // Re-export named exports into GAS global scope so triggers are discoverable
  footer: {
    js: 'for (var k in __OC_GAS__) { this[k] = __OC_GAS__[k]; }',
  },
};

await mkdir(outdir, { recursive: true });
await copyFile('appsscript.json', path.join(outdir, 'appsscript.json'));

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await build(options);
}
