/**
 * Build script for /connect-kalam/ subpath deployment.
 *
 * 1. Patches manifest.webmanifest scope & start_url to /connect-kalam/
 * 2. Runs ng build --base-href /connect-kalam/
 * 3. Reverts manifest.webmanifest back to /
 *
 * Usage: npm run build:connect-kalam
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SUBPATH = '/connect-kalam/';
const manifestPath = path.join(__dirname, '..', 'src', 'manifest.webmanifest');

// Read and patch manifest
const original = fs.readFileSync(manifestPath, 'utf8');
const patched = original
  .replace('"scope": "/"', `"scope": "${SUBPATH}"`)
  .replace('"start_url": "/"', `"start_url": "${SUBPATH}"`);

fs.writeFileSync(manifestPath, patched, 'utf8');
console.log(`Patched manifest.webmanifest → scope & start_url set to ${SUBPATH}`);

try {
  execSync(`npx ng build --base-href ${SUBPATH}`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log(`\nBuild complete for subpath: ${SUBPATH}`);
} finally {
  // Always revert manifest, even if build fails
  fs.writeFileSync(manifestPath, original, 'utf8');
  console.log('Reverted manifest.webmanifest → scope & start_url set to /');
}
