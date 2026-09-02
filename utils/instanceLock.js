const fs = require('fs');
const path = require('path');
const lockFile = path.join(__dirname, '../auth_info_baileys/.instance.lock');
function isOurProcess(pid) { try { process.kill(pid, 0); } catch { return false; } try { const cmdline = fs.readFileSync(`/proc/${pid}/cmdline`, 'utf8').replace(/\0/g, ' ').trim(); return /\bnode\b/i.test(cmdline) && cmdline.includes('index.js'); } catch { return false; } }
function acquireLock() { fs.mkdirSync(path.dirname(lockFile), { recursive: true }); if (fs.existsSync(lockFile)) { const oldPid = Number(fs.readFileSync(lockFile, 'utf8').trim()); if (oldPid === process.pid) { fs.unlinkSync(lockFile); } else if (isOurProcess(oldPid)) { console.error(`[instanceLock] ❌ Another instance running (PID ${oldPid}). Exiting.`); process.exit(1); } else { fs.unlinkSync(lockFile); } } fs.writeFileSync(lockFile, process.pid.toString()); }
module.exports = { acquireLock };
