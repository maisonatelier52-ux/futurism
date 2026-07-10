// lib/store/fileStore.js
//
// Replaces the globalThis in-memory store for header/footer config.
// Writes to JSON files on disk so changes persist across:
//   - Turbopack worker restarts
//   - Hot module reloads
//   - Admin PUT → Public GET crossing worker boundaries
//
// Other stores (articles, authors, categories) are still in-memory since
// those don't need to cross the admin→public boundary yet.

import fs from 'fs';
import path from 'path';

const STORE_DIR = path.join(process.cwd(), 'lib', 'store');

function filePath(name) {
  return path.join(STORE_DIR, `${name}.json`);
}

export function readStore(name, defaultValue = {}) {
  try {
    const raw = fs.readFileSync(filePath(name), 'utf-8');
    const parsed = JSON.parse(raw);
    // Return default if file is empty or just {}
    if (!parsed || Object.keys(parsed).length === 0) return defaultValue;
    return parsed;
  } catch {
    return defaultValue;
  }
}

export function writeStore(name, data) {
  try {
    fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[fileStore] Failed to write ${name}:`, err.message);
    return false;
  }
}
