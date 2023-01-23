import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestLibrary } from '../testing/scaffold';

const COLLECTION_PATH = path.resolve(__dirname, '../../../collection.json');

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
    options: { project?: string } = {}
  ): Promise<UnitTestTree> {
    return runner.runSchematicAsync('ng-add', options, tree).toPromise();
  }

  it('should install essential SKY UX packages', async () => {
    const updatedTree = await runSchematic();

    const packageJson = JSON.parse(updatedTree.readContent('package.json'));

    const packageNames = [
      '@skyux/config',
      '@skyux/core',
      '@skyux/i18n',
      '@skyux/layout',
      '@skyux/lookup',
    ];

    for (const packageName of packageNames) {
      expect(packageJson.dependencies[packageName]).toEqual(
        '^0.0.0-PLACEHOLDER'
      );
    }
  });
});
