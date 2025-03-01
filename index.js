#!/usr/bin/env node
/**
 * check-see-links.js
 *
 * This script finds all @see links in tracked JavaScript files (using Git)
 * and tests that they are not broken by performing HTTP requests.
 * Use the -v or --verbose flag to see progress messages.
 * Use the -s or --silent flag to run without any console.log output.
 *
 * Usage: npx check-see-links [--verbose] [--silent]
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Parse command-line flags.
let verbose = false;
let silent = false;
process.argv.slice(2).forEach(arg => {
  if (arg === '-v' || arg === '--verbose') {
    verbose = true;
  }
  if (arg === '-s' || arg === '--silent') {
    silent = true;
  }
});

// If silent flag is set, override console.log to a no-op.
if (silent) {
  console.log = () => { };
}

let broken = 0;

async function checkLinks() {
  try {
    // Get list of tracked .js files using Git (ignores files in .gitignore)
    const output = execSync("git ls-files '*.js'", { encoding: 'utf8' });
    const files = output.split('\n').filter(f => f.trim() !== '');

    // Process each file that contains at least one @see link.
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      if (!content.includes('@see')) {
        continue; // Skip files without @see links.
      }
      console.log(`Processing file: ${file}`);
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.includes('@see')) {
          // Extract URLs: This regex matches URLs starting with http(s) and continues until whitespace.
          const regex = /https?:\/\/\S+/g;
          let match;
          while ((match = regex.exec(line)) !== null) {
            const url = match[0];
            if (verbose) {
              console.log(`  Checking URL: ${url}`);
            }
            try {
              // Set up a timeout (10 seconds) using AbortController.
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 10000);
              const response = await fetch(url, { signal: controller.signal });
              clearTimeout(timeoutId);
              if (response.status !== 200) {
                console.log(`  Broken link in ${file}: ${url} (HTTP code: ${response.status})`);
                broken++;
              }
            } catch (e) {
              console.log(`  Broken link in ${file}: ${url} (Error: ${e.message})`);
              broken++;
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error while processing files:", err.message);
    process.exit(1);
  }
}

checkLinks()
  .then(() => {
    if (broken === 0) {
      console.log("No broken @see links found.");
    } else {
      console.log(`Found ${broken} broken @see link(s).`);
    }
    process.exit(broken === 0 ? 0 : 1);
  })
  .catch((err) => {
    console.error("Error while processing files:", err.message);
    process.exit(1);
  });
