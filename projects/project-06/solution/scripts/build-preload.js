// build-preload.js -- Bundle the preload script into a single file.
//
// Electron runs preload scripts in a sandbox (the default since Electron 20),
// where require() only resolves 'electron' and a few built-ins. A plain tsc
// build leaves `require("../shared/types")` in dist/preload/preload.js; that
// require throws, contextBridge never runs, and window.knowledgeBase is
// undefined in the renderer. Bundling inlines shared/types and keeps
// 'electron' as the only external.
//
// Usage: node scripts/build-preload.js   (run after `tsc -p tsconfig.node.json`)
const path = require('path');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: [path.join(root, 'src', 'preload', 'preload.ts')],
  outfile: path.join(root, 'dist', 'preload', 'preload.js'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  external: ['electron'],
  logLevel: 'warning',
};

module.exports = { options };

if (require.main === module) {
  esbuild.buildSync(options);
  console.log(`[build-preload] Bundled ${path.relative(root, options.outfile)}`);
}
