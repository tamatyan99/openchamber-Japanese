#!/usr/bin/env bun
/**
 * find-untranslated.ts
 *
 * Scans TSX component files for user-facing English strings that are NOT
 * wrapped in a `t()` translation call. Useful after merging upstream changes
 * to identify new strings that need Japanese translations.
 *
 * Usage:
 *   bun scripts/find-untranslated.ts
 *   bun scripts/find-untranslated.ts --json          # output as JSON
 *   bun scripts/find-untranslated.ts --check         # exit 1 if untranslated strings found
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const UI_SRC = join(import.meta.dir, '..', 'packages', 'ui', 'src');
const JA_JSON_PATH = join(UI_SRC, 'i18n', 'locales', 'ja.json');

// Load existing translations
let jaTranslations: Record<string, string> = {};
try {
  jaTranslations = JSON.parse(readFileSync(JA_JSON_PATH, 'utf-8'));
} catch {
  console.error('Warning: Could not load ja.json');
}

interface UntranslatedString {
  file: string;
  line: number;
  text: string;
  context: string;
}

const results: UntranslatedString[] = [];

// Patterns for user-facing strings
const STRING_PATTERNS = [
  // JSX text content: >Some Text<
  />\s*([A-Z][a-zA-Z\s]{2,}[a-zA-Z.])\s*</g,
  // placeholder="text"
  /placeholder="([^"]+)"/g,
  // aria-label="text"
  /aria-label="([^"]+)"/g,
  // title="text"
  /title="([^"]+)"/g,
  // heading="text"
  /heading="([^"]+)"/g,
];

// Patterns that indicate a string is already translated
const TRANSLATED_PATTERN = /\bt\s*\(/;

function scanFile(filePath: string) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const relPath = relative(join(import.meta.dir, '..'), filePath);

  // Check if file imports useTranslation
  const hasTranslation = content.includes("from 'react-i18next'") || content.includes('from "react-i18next"');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip comments and imports
    if (line.trimStart().startsWith('//') || line.trimStart().startsWith('*') || line.trimStart().startsWith('import ')) {
      continue;
    }

    for (const pattern of STRING_PATTERNS) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(line)) !== null) {
        const text = match[1].trim();

        // Skip short strings, CSS classes, identifiers
        if (text.length < 3) continue;
        if (text.includes('className') || text.includes('var(--')) continue;
        if (/^[a-z]/.test(text) && !text.includes(' ')) continue; // camelCase
        if (/^(true|false|null|undefined)$/.test(text)) continue;

        // Check if this string is already wrapped in t()
        const beforeMatch = line.substring(0, match.index);
        if (TRANSLATED_PATTERN.test(beforeMatch.slice(-20))) continue;

        // Check if string is in translation dict
        if (jaTranslations[text]) continue;

        results.push({
          file: relPath,
          line: lineNum,
          text,
          context: line.trim().substring(0, 100),
        });
      }
    }
  }
}

function walkDir(dir: string) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      // Skip node_modules, dist, etc.
      if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue;
      walkDir(fullPath);
    } else if (entry.endsWith('.tsx')) {
      scanFile(fullPath);
    }
  }
}

// Scan
const componentsDir = join(UI_SRC, 'components');
walkDir(componentsDir);

// Also scan constants and lib/settings
const constantsDir = join(UI_SRC, 'constants');
const settingsDir = join(UI_SRC, 'lib', 'settings');
try { walkDir(constantsDir); } catch { /* may not exist */ }
try { walkDir(settingsDir); } catch { /* may not exist */ }

// Deduplicate by text
const seen = new Set<string>();
const unique = results.filter(r => {
  if (seen.has(r.text)) return false;
  seen.add(r.text);
  return true;
});

// Output
const isJson = process.argv.includes('--json');
const isCheck = process.argv.includes('--check');

if (isJson) {
  console.log(JSON.stringify(unique, null, 2));
} else {
  if (unique.length === 0) {
    console.log('No untranslated strings found.');
  } else {
    console.log(`Found ${unique.length} potentially untranslated strings:\n`);
    for (const item of unique) {
      console.log(`  ${item.file}:${item.line}`);
      console.log(`    "${item.text}"`);
      console.log();
    }
  }
}

if (isCheck && unique.length > 0) {
  process.exit(1);
}
