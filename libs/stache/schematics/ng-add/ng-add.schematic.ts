import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import fs from 'fs-extra';
import path from 'path';

function installEssentialSkyUxPackages(skyuxVersion: string): Rule {
  return async (tree) => {
    const packageNames = [
      '@skyux/config',
      '@skyux/core',
      '@skyux/i18n',
      '@skyux/layout',
      '@skyux/lookup',
    ];

    for (const packageName of packageNames) {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: packageName,
        version: skyuxVersion,
        overwrite: true,
      });
    }
  };
}

export default function ngAdd(): Rule {
  return async (_tree, context) => {
    // Get the preferred version of SKY UX found in the "peerDependencies" section of
    // @blackbaud/skyux-lib-stache package.json.
    const packageJson = fs.readJsonSync(
      path.resolve(__dirname, '../../package.json')
    );

    const skyuxVersion = packageJson.peerDependencies['@skyux/core'];

    context.addTask(new NodePackageInstallTask());

    return chain([installEssentialSkyUxPackages(skyuxVersion)]);
  };
}
