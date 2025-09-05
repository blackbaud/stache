import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { JSONFile } from '../utility/json-file';

const GOOGLE_ANALYTICS_URL = 'www.google-analytics.com';

function installEssentialSkyUxPackages(skyuxVersion: string): Rule {
  return (tree) => {
    const packageNames = [
      '@skyux/config',
      '@skyux/core',
      '@skyux/forms',
      '@skyux/help-inline',
      '@skyux/i18n',
      '@skyux/icon',
      '@skyux/indicators',
      '@skyux/inline-form',
      '@skyux/lists',
      '@skyux/layout',
      '@skyux/lookup',
      '@skyux/modals',
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

function tryConfigureCsp(): Rule {
  return (tree) => {
    const skyuxConfigPath = '/skyuxconfig.json';

    if (!tree.exists(skyuxConfigPath)) {
      return;
    }

    try {
      const skyuxConfig = new JSONFile(tree, skyuxConfigPath);
      const connectSrcJsonPath = ['host', 'csp', 'directives', 'connect-src'];
      const connectSrc: string[] =
        (skyuxConfig.get(connectSrcJsonPath) as string[] | undefined) ?? [];

      if (!connectSrc.includes(GOOGLE_ANALYTICS_URL)) {
        connectSrc.push(GOOGLE_ANALYTICS_URL);
      }

      skyuxConfig.modify(connectSrcJsonPath, connectSrc);
    } catch (err) {
      throw new Error('Failed to parse skyuxconfig.json.', { cause: err });
    }
  };
}

export default function ngAdd(): Rule {
  return (_tree, context) => {
    context.addTask(new NodePackageInstallTask());

    return chain([
      installEssentialSkyUxPackages('^13.0.0-alpha.9'),
      tryConfigureCsp(),
    ]);
  };
}
