const NodeCache = require("node-cache");

const l1Cache = new NodeCache({
  stdTTL: parseInt(process.env.L1_CACHE_TTL) || 60,
  checkperiod: 120,
});

module.exports = l1Cache;