#!/usr/bin/env node
import path from 'node:path';
import url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const appDirPath = path.join(__dirname, '..');
process.chdir(appDirPath);
await import(path.join(appDirPath, 'dist', 'src', 'main.js'));
