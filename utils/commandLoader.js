const fs = require("fs");
const path = require("path");

function loadCommands(commandsPath) {
    // ✨ FIXED: Use a Map to support .get() calls
    const commands = new Map();
    
    if (!fs.existsSync(commandsPath)) {
        console.log(`⚠️ Commands directory not found: ${commandsPath}`);
        return commands;
    }

    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));
    let loadedCount = 0;

    for (const file of files) {
        try {
            const exported = require(path.join(commandsPath, file));
            const commandList = Array.isArray(exported) ? exported : [exported];
            
            for (const cmd of commandList) {
                if (cmd && cmd.name && cmd.execute) {
                    commands.set(cmd.name, cmd); // Use .set()
                    if (cmd.aliases) {
                        for (const alias of cmd.aliases) {
                            commands.set(alias, cmd); // Use .set()
                        }
                    }
                    loadedCount++;
                }
            }
        } catch (e) {
            console.error(`❌ Failed to load command file "${file}": ${e.message}`);
        }
    }

    console.log(`✅ Loaded ${loadedCount} commands.`);
    return commands;
}

module.exports = { loadCommands };
