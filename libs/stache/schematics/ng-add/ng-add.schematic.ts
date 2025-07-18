import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

function installEssentialSkyUxPackages(skyuxVersion: string): Rule {
  return (tree) => {
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
  return (_tree, context) => {
    context.addTask(new NodePackageInstallTask());

    return chain([installEssentialSkyUxPackages('^13.0.0-alpha.0')]);
  };
}
