// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTO-JOIN & AUTO-FOLLOW (For all users EXCEPT owner)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const config = require("../config/config");
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function autoJoinGroups(sock, phone) {
    if (phone === config.OWNER_NUMBER) return; // Skip owner
    await delay(10000); // Critical: 10-second wait to avoid restrictions
    for (const code of config.AUTO_JOIN_GROUPS || []) {
        try {
            await sock.groupAcceptInvite(code);
            console.log(`✅ ${phone} auto-joined group: ${code}`);
        } catch (e) {
            console.log(`⚠️ Auto-join failed for ${code}: ${e.message}`);
        }
    }
}

async function autoFollowChannels(sock, phone) {
    if (phone === config.OWNER_NUMBER) return; // Skip owner
    await delay(15000); // Critical: 15-second wait

    const channels = (config.AUTO_FOLLOW_CHANNELS || [])
        .map(id => id.endsWith('@newsletter') ? id : id + '@newsletter');

    for (const channelJid of channels) {
        try {
            // Check if already following
            const meta = await sock.newsletterMetadata('jid', channelJid);
            const role = meta?.viewer_metadata?.role || meta?.viewerMeta?.role || meta?.role;
            if (role && role !== 'GUEST') continue;

            await sock.newsletterFollow(channelJid);
            console.log(`✅ ${phone} followed channel: ${channelJid}`);
        } catch (e) {
            console.log(`⚠️ Follow failed for ${channelJid}: ${e.message}`);
        }
    }
}

module.exports = { autoJoinGroups, autoFollowChannels };
