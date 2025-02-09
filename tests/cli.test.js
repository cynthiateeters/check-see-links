import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';

describe('check-see-links CLI', () => {
  it('should exit with code 0 and process example.js', (done) => {
    // Resolve the path to the CLI script.
    const cliPath = path.resolve(__dirname, '../check-see-links.js');
    // Set the working directory to the folder containing example.js (src folder).
    const cwd = path.resolve(__dirname, '../src');

    // Spawn the CLI process in silent mode.
    const proc = spawn('node', [cliPath, '--silent'], {
      cwd,
      env: { ...process.env, VITEST_WORKER_ID: '1' } // signal test mode to skip process.exit calls
    });

    let output = '';
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    // eslint-disable-next-line no-unused-vars
    proc.stderr.on('data', (data) => {
      // Optionally, you could log stderr if needed.
      // console.error(data.toString());
    });

    proc.on('close', (code) => {
      // Assert that the output contains a message indicating example.js was processed.
      expect(output).toMatch(/Processing file: example\.js/);
      expect(code).toBe(0);
      done();
    });
  });
});
