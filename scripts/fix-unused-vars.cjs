#!/usr/bin/env node
/**
 * Auto-fix unused variables by prefixing with underscore
 * Usage: node scripts/fix-unused-vars.cjs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = path.dirname(__dirname);
let totalFixed = 0;
let pass = 0;

console.log('🔧 Finding and fixing unused variables...\n');

while (true) {
  pass++;
  console.log(`Pass ${pass}...`);

  // Run ESLint via bun and capture output
  const eslintOutput = execSync('bun run lint 2>&1 || true', {
    encoding: 'utf8',
    cwd: projectDir
  });

  // Parse the output to find unused variables
  const fixes = [];
  let currentFile = null;

  const lines = eslintOutput.split('\n');
  for (const line of lines) {
    // Check if line is a file path (starts with / and contains .jsx/.js/.tsx/.ts)
    const fileMatch = line.match(/^([/\w.~_-]+?\.(?:jsx?|tsx?))$/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      continue;
    }

    // Match:    16:9   warning  'varName' is assigned...  unused-imports/no-unused-vars
    if (currentFile) {
      const match = line.match(/^\s+(\d+):\d+\s+warning\s+'(.+?)'\s+is\s+(?:assigned|defined)\s+but\s+never\s+used.*unused-imports\/no-unused-vars/);
      if (match) {
        const [, lineNumber, varName] = match;
        // Skip if already prefixed with _
        if (!varName.startsWith('_')) {
          fixes.push({ filePath: currentFile, lineNumber: parseInt(lineNumber), varName });
        }
      }
    }
  }

  if (fixes.length === 0) {
    console.log('✅ No more unused variables found!');
    break;
  }

  console.log(`  Found ${fixes.length} unused variables. Fixing...\n`);

  // Group fixes by file
  const fixesByFile = {};
  for (const fix of fixes) {
    if (!fixesByFile[fix.filePath]) {
      fixesByFile[fix.filePath] = [];
    }
    fixesByFile[fix.filePath].push(fix);
  }

  // Apply fixes to each file
  for (const [filePath, fileFixes] of Object.entries(fixesByFile)) {
    const fullPath = path.resolve(projectDir, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const contentLines = content.split('\n');

    // Sort by line number in descending order to avoid line number shifts
    fileFixes.sort((a, b) => b.lineNumber - a.lineNumber);

    let modified = false;
    for (const fix of fileFixes) {
      const lineIndex = fix.lineNumber - 1;
      if (lineIndex >= 0 && lineIndex < contentLines.length) {
        const line = contentLines[lineIndex];

        // Check if already prefixed with _
        if (line.includes(`_${fix.varName}`)) {
          continue;
        }

        // Replace the variable name with _variableName
        // Use word boundaries to avoid partial matches
        const regex = new RegExp(`\\b${escapeRegExp(fix.varName)}\\b`, 'g');
        const newLine = line.replace(regex, `_${fix.varName}`);

        if (newLine !== line) {
          contentLines[lineIndex] = newLine;
          modified = true;
          console.log(`    ${filePath}:${fix.lineNumber}  ${fix.varName} → _${fix.varName}`);
        }
      }
    }

    if (modified) {
      fs.writeFileSync(fullPath, contentLines.join('\n'), 'utf8');
      totalFixed += fileFixes.length;
    }
  }

  // Safety: don't loop more than 20 times
  if (pass >= 20) {
    console.log('⚠️  Reached maximum passes (20). Some fixes may remain.');
    break;
  }
}

console.log(`\n✅ Fixed ${totalFixed} unused variables in ${pass} pass(es)!`);
console.log('\nRun "bun run lint" to verify.');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
