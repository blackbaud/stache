import path from 'path';

import { runCommand } from './utils/spawn';

async function posttest() {
  console.log('Testing library schematics...');

  try {
    await runCommand(
      'nyc',
      [
        'ts-node',
        '--project',
        'tsconfig.schematics.json',
        '../../node_modules/jasmine/bin/jasmine.js',
        '--config=jasmine.json',
      ],
      {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '../libs/stache'), // Must run in context of lib folder to pick up tsconfig.json.
      },
    );
    console.log('Done.');
  } catch (err) {
    console.log('[posttest-stache error]', err);
    process.exit(1);
  }
}

posttest();
