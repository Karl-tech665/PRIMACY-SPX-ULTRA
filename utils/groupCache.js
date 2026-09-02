const NodeCache = require('node-cache');
const groupCache = new NodeCache({ stdTTL: 300, useClones: false });
module.exports = { groupCache };
