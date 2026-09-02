const fs = require('fs');
const path = require('path');
const logger = require('./logger');
function loadCommands(commandsPath) {
  const commands = new Map();
  if (!fs.existsSync(commandsPath)) return commands;
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    try {
      const commandModule = require(path.join(commandsPath, file));
      const commandList = Array.isArray(commandModule) ? commandModule : [commandModule];
      for (const cmd of commandList) {
        if (!cmd || !cmd.name || typeof cmd.execute !== 'function') continue;
        commands.set(cmd.name.toLowerCase(), cmd);
        if (Array.isArray(cmd.aliases)) cmd.aliases.forEach(alias => commands.set(alias.toLowerCase(), cmd));
      }
    } catch (error) { logger.error(`[commandLoader] Failed to load "${file}": ${error.message}`); }
  }
  return commands;
}
module.exports = { loadCommands };
