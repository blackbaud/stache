const fs = require('fs-extra');

function sortObjectByKeys(obj) {
  if (!obj) {
    return;
  }

  return Object.keys(obj)
    .sort()
    .reduce((item, key) => {
      item[key] = obj[key];
      return item;
    }, {});
}

const packageJsonPath = './package.json';
const packageJson = fs.readJsonSync(packageJsonPath);

packageJson.dependencies = sortObjectByKeys(packageJson.dependencies);
packageJson.devDependencies = sortObjectByKeys(packageJson.devDependencies);
packageJson.scripts = sortObjectByKeys(packageJson.scripts);

fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
