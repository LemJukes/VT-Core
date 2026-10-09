// Builds the CJS and browser IIFE bundles into dist/. Run with: npm run build
import { build } from 'esbuild';
import { readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const { version, license } = JSON.parse(readFileSync(root + 'package.json', 'utf8'));

rmSync(root + 'dist', { recursive: true, force: true });

const shared = {
  entryPoints: [root + 'src/index.js'],
  bundle: true,
  legalComments: 'none',
  banner: { js: `/*! verbatempus v${version} | ${license} */` },
  logLevel: 'info',
};

// require('verbatempus')
await build({
  ...shared,
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  outfile: root + 'dist/verbatempus.cjs',
});

// <script src="verbatempus.iife.js"> -> global `Verbatempus`
await build({
  ...shared,
  format: 'iife',
  globalName: 'Verbatempus',
  platform: 'browser',
  target: 'es2019',
  outfile: root + 'dist/verbatempus.iife.js',
});
