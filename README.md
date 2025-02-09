# @cynthiateeters/check-see-links

A Node.js command-line tool that scans all tracked JavaScript files for MDN `@see` links and verifies that they are not broken. This package uses Git to filter out files listed in `.gitignore` and checks each link using HTTP requests via the global `fetch` API.

## Features

- **File Discovery:**
  Uses `git ls-files '*.js'` to list only tracked JavaScript files, automatically skipping files ignored by Git.

- **Link Extraction:**
  Searches for `@see` comments in your source files and extracts URLs (assuming they are enclosed in quotes).

- **Link Validation:**
  Checks each extracted URL by performing an HTTP request (with a 10-second timeout) and reports any broken links (i.e. those not returning HTTP status 200).

- **Command-Line Flags:**
  - `-v` or `--verbose`: Print detailed progress messages, including each URL being checked.
  - `-s` or `--silent`: Suppress all console output except errors.

- **Clean Exit:**
  Exits with status code `0` if no broken links are found, or `1` if one or more broken links are detected.

## Requirements

- **Node.js:** Version 18 or later is required for built-in `fetch` and `AbortController` support.
- **Git:** Must be installed, as the tool uses Git to list tracked JavaScript files.

## Installation

You can install this package as a dev dependency in your project:

```bash
npm install --save-dev @cynthiateeters/check-see-links