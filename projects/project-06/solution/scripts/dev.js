const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

function requireDependency(name) {
  try {
    require.resolve(name, { paths: [root] });
  } catch {
    console.error(`[dev] Missing dependency: ${name}`);
    console.error('[dev] Run `npm install` from projects/project-06/solution, then retry `npm run dev`.');
    process.exit(1);
  }
}

requireDependency('typescript');
requireDependency('vite');
requireDependency('electron');

console.log('[dev] Building main + preload...');
try {
  execSync('npx tsc -p tsconfig.node.json', { cwd: root, stdio: 'inherit' });
  execSync('node scripts/build-preload.js', { cwd: root, stdio: 'inherit' });
} catch {
  console.error('[dev] Main/preload build failed');
  process.exit(1);
}

console.log('[dev] Building renderer...');
try {
  execSync('npx vite build', { cwd: root, stdio: 'inherit' });
} catch {
  console.error('[dev] Vite build failed');
  process.exit(1);
}

console.log('[dev] Starting Electron...');
try {
  execSync('npx electron .', { cwd: root, stdio: 'inherit' });
} catch {
  // Electron exits with code 0 on normal close
}
