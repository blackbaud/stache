import fs from 'fs-extra';
import path from 'path';

import { runCommand } from './utils/spawn';

const CWD = process.cwd();

function copyFilesToDist() {
  const pathsToCopy = [
    ['collection.json'],
    ['/schematics/migrations/migration-collection.json'],
    ['/schematics/ng-add/schema.json'],
  ];

  pathsToCopy.forEach((pathArr) => {
    const sourcePath = path.join(process.cwd(), 'libs/stache', ...pathArr);
    const distPath = path.join(process.cwd(), 'dist/libs/stache', ...pathArr);

    console.log(`Copying '${sourcePath.replace(process.cwd(), '')}'...`);

    if (fs.existsSync(sourcePath)) {
      fs.copySync(sourcePath, distPath);
      console.log(`Successfully copied ${sourcePath} to ${distPath}`);
    } else {
      throw new Error(`File not found: ${sourcePath}`);
    }
  });
}

async function buildSchematics() {
  console.log('Building @blackbaud/skyux-lib-stache schematics...');

  await runCommand(path.resolve(CWD, 'node_modules/.bin/tsc'), [
    '--project',
    'libs/stache/tsconfig.schematics.json',
  ]);

  copyFilesToDist();

  console.log('Done.');
}

async function postbuild() {
  try {
    await buildSchematics();
  } catch (err) {
    console.error('[postbuild-i18n error]', err);
    process.exit(1);
  }
}

postbuild();
