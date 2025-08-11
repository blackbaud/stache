import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

function installEssentialSkyUxPackages(skyuxVersion: string): Rule {
  return async (tree) => {
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
      const skyuxConfig = JSON.parse(tree.readText(skyuxConfigPath));

      skyuxConfig.host ??= {};
      skyuxConfig.host.csp ??= {};
      skyuxConfig.host.csp.directives ??= {};
      skyuxConfig.host.csp.directives['connect-src'] ??= [];

      const gaUrl = 'www.google-analytics.com';

      if (!skyuxConfig.host.csp.directives['connect-src'].includes(gaUrl)) {
        skyuxConfig.host.csp.directives['connect-src'].push(gaUrl);
      }

      tree.overwrite(skyuxConfigPath, JSON.stringify(skyuxConfig));
    } catch (err) {
      throw new Error('Failed to parse skyuxconfig.json.', { cause: err });
    }
  };
}

export default function ngAdd(): Rule {
  return async (_tree, context) => {
    context.addTask(new NodePackageInstallTask());

    return chain([installEssentialSkyUxPackages('^12.0.0'), tryConfigureCsp()]);
  };
}
