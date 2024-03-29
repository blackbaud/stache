import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

/**
 * Creates a new Angular CLI application.
 */
export async function createTestApp(
  runner: SchematicTestRunner,
  appOptions: {
    projectName: string;
  },
): Promise<UnitTestTree> {
  return runner.runExternalSchematic('@schematics/angular', 'ng-new', {
    directory: '/',
    name: appOptions.projectName,
    routing: true,
    strict: true,
    style: 'scss',
    version: '17',
  });
}

/**
 * Create a test workspace with a library as the default project.
 */
export async function createTestLibrary(
  runner: SchematicTestRunner,
  libOptions: {
    projectName: string;
  },
): Promise<UnitTestTree> {
  const workspaceTree = await runner.runExternalSchematic(
    '@schematics/angular',
    'ng-new',
    {
      directory: '/',
      name: `${libOptions.projectName}-workspace`,
      createApplication: false,
      strict: true,
      version: '16',
    },
  );

  await runner.runExternalSchematic(
    '@schematics/angular',
    'library',
    {
      name: libOptions.projectName,
    },
    workspaceTree,
  );

  // Create a "showcase" application for library projects.
  await runner.runExternalSchematic(
    '@schematics/angular',
    'application',
    {
      name: `${libOptions.projectName}-showcase`,
    },
    workspaceTree,
  );

  return workspaceTree;
}
