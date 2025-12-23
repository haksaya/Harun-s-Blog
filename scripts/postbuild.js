import { copyFileSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Function to copy directory recursively
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('Running post-build tasks...');

  // Copy posts directory
  const postsSource = join(projectRoot, 'posts');
  const postsDestination = join(projectRoot, 'dist', 'posts');
  console.log('Copying posts directory...');
  copyDir(postsSource, postsDestination);

  // Create .nojekyll file for GitHub Pages
  const nojekyllPath = join(projectRoot, 'dist', '.nojekyll');
  console.log('Creating .nojekyll file...');
  writeFileSync(nojekyllPath, '');

  // Copy CNAME file
  const cnameSource = join(projectRoot, 'CNAME');
  const cnameDestination = join(projectRoot, 'dist', 'CNAME');
  console.log('Copying CNAME file...');
  copyFileSync(cnameSource, cnameDestination);

  console.log('Post-build tasks completed successfully!');
} catch (error) {
  console.error('Error during post-build:', error);
  process.exit(1);
}
