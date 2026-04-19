#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'sections');
const templatesDir = path.join(__dirname, 'templates');
const configDir = path.join(__dirname, 'config');

console.log('===== SECTION SCHEMA VALIDATION =====');
const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid')).sort();
const schemaNameByFile = {};
const presetsByFile = {};
const blocksByFile = {};
for (const f of sectionFiles) {
  const full = path.join(sectionsDir, f);
  const src = fs.readFileSync(full, 'utf8');
  const m = src.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!m) {
    console.log(`[${f}] NO {% schema %} BLOCK FOUND`);
    continue;
  }
  const raw = m[1].trim();
  try {
    const parsed = JSON.parse(raw);
    schemaNameByFile[f] = parsed.name;
    presetsByFile[f] = parsed.presets;
    blocksByFile[f] = parsed.blocks;
    const presetCount = Array.isArray(parsed.presets) ? parsed.presets.length : 0;
    const blockCount = Array.isArray(parsed.blocks) ? parsed.blocks.length : 0;
    const settingsCount = Array.isArray(parsed.settings) ? parsed.settings.length : 0;
    console.log(`[${f}] OK  name="${parsed.name}"  settings=${settingsCount}  blocks=${blockCount}  presets=${presetCount}`);
  } catch (e) {
    console.log(`[${f}] JSON PARSE ERROR: ${e.message}`);
    const lines = raw.split('\n');
    const mm = e.message.match(/position (\d+)/);
    if (mm) {
      let pos = parseInt(mm[1], 10);
      let ln = 0;
      while (ln < lines.length && pos > lines[ln].length) { pos -= lines[ln].length + 1; ln++; }
      console.log(`    around: ${lines[Math.max(0, ln-1)] || ''}`);
      console.log(`            ${lines[ln] || ''}`);
      console.log(`            ${lines[ln+1] || ''}`);
    }
  }
}

console.log('\n===== TEMPLATE JSON VALIDATION =====');
const templateFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json')).sort();
const templateRefs = {};
for (const f of templateFiles) {
  const full = path.join(templatesDir, f);
  const raw = fs.readFileSync(full, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    const sectionTypes = [];
    if (parsed.sections) {
      for (const [key, s] of Object.entries(parsed.sections)) {
        sectionTypes.push({ key, type: s.type, blocks: s.blocks ? Object.values(s.blocks).map(b => b.type) : [] });
      }
    }
    templateRefs[f] = { order: parsed.order || [], sections: sectionTypes };
    console.log(`[${f}] OK  order=${(parsed.order||[]).length}  sections=${sectionTypes.length}`);
    for (const s of sectionTypes) {
      console.log(`    section "${s.key}" → type "${s.type}"`);
    }
  } catch (e) {
    console.log(`[${f}] JSON PARSE ERROR: ${e.message}`);
  }
}

console.log('\n===== TEMPLATE → SECTION FILE RESOLUTION =====');
const sectionBaseNames = new Set(sectionFiles.map(f => f.replace(/\.liquid$/, '')));
const sectionSchemaNames = new Set(Object.values(schemaNameByFile));
for (const [tmpl, info] of Object.entries(templateRefs)) {
  for (const s of info.sections) {
    const existsAsFile = sectionBaseNames.has(s.type);
    const marker = existsAsFile ? 'OK ' : 'MISSING';
    console.log(`[${tmpl}] ${marker}  section key "${s.key}" type="${s.type}"  file=sections/${s.type}.liquid`);
  }
  for (const orderKey of info.order) {
    const known = info.sections.find(s => s.key === orderKey);
    if (!known) {
      console.log(`[${tmpl}] ORDER_ORPHAN  "${orderKey}" in order[] but not in sections{}`);
    }
  }
}

console.log('\n===== SETTINGS SCHEMA VALIDATION =====');
const settingsPath = path.join(configDir, 'settings_schema.json');
try {
  const raw = fs.readFileSync(settingsPath, 'utf8');
  const parsed = JSON.parse(raw);
  console.log(`[config/settings_schema.json] OK  top-level entries=${parsed.length}`);
  if (Array.isArray(parsed)) {
    for (const entry of parsed) {
      const label = entry.name || entry.theme_name || '(theme_info)';
      const settingCount = Array.isArray(entry.settings) ? entry.settings.length : 0;
      console.log(`    group "${label}"  settings=${settingCount}`);
    }
  }
} catch (e) {
  console.log(`[config/settings_schema.json] PARSE ERROR: ${e.message}`);
}
