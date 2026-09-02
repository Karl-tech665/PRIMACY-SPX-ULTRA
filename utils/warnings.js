const fs = require('fs');
const path = require('path');
const FILE_PATH = path.join(__dirname, '../data/warnings.json');
function ensureFileExists() { if (!fs.existsSync(path.dirname(FILE_PATH))) fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true }); if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, JSON.stringify({}), 'utf-8'); }
function readAll() { ensureFileExists(); return JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8')); }
function writeAll(data) { ensureFileExists(); fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8'); }
function key(groupJid, userJid) { return `${groupJid}::${userJid}`; }
function addWarning(groupJid, userJid) { const data = readAll(); const k = key(groupJid, userJid); data[k] = (data[k] || 0) + 1; writeAll(data); return data[k]; }
function getWarnings(groupJid, userJid) { return readAll()[key(groupJid, userJid)] || 0; }
function resetWarnings(groupJid, userJid) { const data = readAll(); delete data[key(groupJid, userJid)]; writeAll(data); }
module.exports = { addWarning, getWarnings, resetWarnings };
