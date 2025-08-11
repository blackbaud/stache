import { normalize } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { VERSION } from '@skyux/packages';

import { createTestLibrary } from '../testing/scaffold';

const COLLECTION_PATH = normalize(`${__dirname}/../../collection.json`);

describe('ng-add.schematic', () => {
  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  const defaultProjectName = 'my-lib';

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestLibrary(runner, {
      projectName: defaultProjectName,
    });
  });

  function runSchematic(
    options: { project?: string } = {},
  ): Promise<UnitTestTree> {
    return runner.runSchematic('ng-add', options, tree);
  }

  it('should install essential SKY UX packages', async () => {
    const updatedTree = await runSchematic();

    const packageJson = JSON.parse(updatedTree.readContent('package.json'));

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
      expect(packageJson.dependencies[packageName]).toEqual(`^${VERSION.full}`);
    }
  });

  it('should add CSP directives in skyuxconfig.json if it exists', async () => {
    tree.create('/skyuxconfig.json', '{}');

    const updatedTree = await runSchematic();
    const skyuxConfig = JSON.parse(updatedTree.readText('/skyuxconfig.json'));

    expect(skyuxConfig).toEqual({
      host: {
        csp: {
          directives: {
            'connect-src': ['www.google-analytics.com'],
          },
        },
      },
    });
  });

  it('should not modify CSP when skyuxconfig.json does not exist', async () => {
    const updatedTree = await runSchematic();

    expect(updatedTree.exists('/skyuxconfig.json')).toBe(false);
  });

  it('should preserve existing CSP configuration and add Google Analytics URL', async () => {
    const existingConfig = {
      host: {
        csp: {
          directives: {
            'connect-src': ['existing-url.com'],
            'script-src': ['self'],
          },
        },
      },
      other: 'property',
    };
    tree.create('/skyuxconfig.json', JSON.stringify(existingConfig));

    const updatedTree = await runSchematic();
    const skyuxConfig = JSON.parse(updatedTree.readText('/skyuxconfig.json'));

    expect(skyuxConfig).toEqual({
      host: {
        csp: {
          directives: {
            'connect-src': ['existing-url.com', 'www.google-analytics.com'],
            'script-src': ['self'],
          },
        },
      },
      other: 'property',
    });
  });

  it('should not duplicate Google Analytics URL if it already exists', async () => {
    const existingConfig = {
      host: {
        csp: {
          directives: {
            'connect-src': ['www.google-analytics.com', 'other-url.com'],
          },
        },
      },
    };
    tree.create('/skyuxconfig.json', JSON.stringify(existingConfig));

    const updatedTree = await runSchematic();
    const skyuxConfig = JSON.parse(updatedTree.readText('/skyuxconfig.json'));

    expect(skyuxConfig.host.csp.directives['connect-src']).toEqual([
      'www.google-analytics.com',
      'other-url.com',
    ]);
  });

  it('should throw an error when skyuxconfig.json contains invalid JSON', async () => {
    tree.create('/skyuxconfig.json', '{ invalid json }');

    await expectAsync(runSchematic()).toBeRejectedWithError(
      'Failed to parse skyuxconfig.json.',
    );
  });
});
