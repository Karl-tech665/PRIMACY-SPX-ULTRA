const config = require('../config/config');
function normalizeNumber(num) { if (!num) return ''; return String(num).split('@')[0].split(':')[0].replace(/\D/g, ''); }
function isDev(msg) { const sender = msg.key.participantPn || msg.key.participantAlt || msg.key.participant || msg.key.remoteJid; return normalizeNumber(sender) === config.ownerNumber; }
module.exports = { isDev };
