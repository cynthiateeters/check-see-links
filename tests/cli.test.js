import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';

describe('check-see-links CLI', () => {
  it('should exit with code 0 when no broken links are found', (done) => {
    // Resolve the path to the CLI script.
    const cliPath = path.resolve(__dirname, '../check-see-links.js');

    // Spawn a child process to run the CLI in silent mode.
    const proc = spawn('node', [cliPath, '--silent'], { stdio: 'pipe' });

    // Capture any output (if needed for debugging)
    // eslint-disable-next-line no-unused-vars
    let output = '';
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    // eslint-disable-next-line no-unused-vars
    proc.stderr.on('data', (data) => {
      // You can log errors if needed:
      // console.error(data.toString());
    });

    // When the process exits, check its exit code.
    proc.on('close', (code) => {
      expect(code).toBe(0);
      done();
    });
  });
});
