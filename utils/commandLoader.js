const fs = require("fs");
const path = require("path");

function loadCommands(commandsPath) {
    const commands = {};
    if (!fs.existsSync(commandsPath)) {
        console.log(`⚠️ Commands directory not found: ${commandsPath}`);
        return commands;
    }
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));
    for (const file of files) {
        try {
            const exported = require(path.join(commandsPath, file));
            const commandList = Array.isArray(exported) ? exported : [exported];
            for (const cmd of commandList) {
                if (cmd && cmd.name && cmd.execute) {
                    commands[cmd.name] = cmd;
                    if (cmd.aliases) {
                        for (const alias of cmd.aliases) {
                            commands[alias] = cmd;
                        }
                    }
                }
            }
            console.log(`✅ Loaded command file: ${file}`);
        } catch (e) {
            console.error(`❌ Failed to load command file "${file}": ${e.message}`);
        }
    }
    console.log(`📦 Total commands loaded: ${Object.keys(commands).length}`);
    return commands;
}

module.exports = { loadCommands };
