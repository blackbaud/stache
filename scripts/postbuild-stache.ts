import fs from 'fs-extra';
import path from 'path';

function copyFilesToDist() {
  const pathsToCopy = [
    ['collection.json'],
    ['/src/schematics/migrations/migration-collection.json'],
    ['/src/schematics/ng-add/schema.json'],
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

function postBuildPackages() {
  console.log('Running @blackbaud/skyux-lib-stache postbuild step...');
  try {
    copyFilesToDist();
  } catch (err) {
    console.error('[postbuild-stache error]', err);
    process.exit(1);
  }
}

postBuildPackages();
