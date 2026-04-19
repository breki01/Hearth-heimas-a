#!/usr/bin/env node
const { themeCheckRun, Severity } = require('@shopify/theme-check-node');
const path = require('path');

const root = path.resolve(__dirname);

const sevLabel = (s) => {
  if (s === Severity.ERROR || s === 0) return 'ERROR';
  if (s === Severity.WARNING || s === 1) return 'WARNING';
  if (s === Severity.INFO || s === 2) return 'INFO';
  return `SEV(${s})`;
};

(async () => {
  try {
    const offenses = await themeCheckRun(root, undefined, () => {});
    if (!offenses.length) {
      console.log('No offenses found.');
      return;
    }
    const grouped = {};
    for (const o of offenses) {
      const uri = o.uri || o.absolutePath || '(unknown)';
      (grouped[uri] = grouped[uri] || []).push(o);
    }
    const files = Object.keys(grouped).sort();
    let errCount = 0, warnCount = 0, infoCount = 0;
    for (const f of files) {
      console.log('\n=== ' + f.replace('file://' + root + '/', '') + ' ===');
      for (const o of grouped[f]) {
        const sev = sevLabel(o.severity);
        if (sev === 'ERROR') errCount++;
        else if (sev === 'WARNING') warnCount++;
        else infoCount++;
        const line = (o.start && (o.start.line ?? o.start.row)) ?? '?';
        const col = (o.start && (o.start.character ?? o.start.col)) ?? '?';
        console.log(`  [${sev}] ${o.check}: ${o.message}  (line ${line}, col ${col})`);
      }
    }
    console.log(`\nTotals: ${errCount} errors, ${warnCount} warnings, ${infoCount} info`);
  } catch (e) {
    console.error('theme-check failed:', e.stack || e);
    process.exit(1);
  }
})();
