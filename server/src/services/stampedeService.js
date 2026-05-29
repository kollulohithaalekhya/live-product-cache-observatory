const pool = require("../db/postgres");

const metrics = require("../metrics/metricsStore");

const l1Cache = require("../cache/l1Cache");

const {
  redisClient,
} = require("../cache/redisClient");

console.log("REDIS CLIENT:", redisClient);
const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getProductWithStampedeProtection = async (
  productId
) => {
  const cacheKey = `product:${productId}`;

  const lockKey = `lock:${productId}`;

  // =========================
  // L1 CACHE
  // =========================

  const l1Data = l1Cache.get(cacheKey);

  if (l1Data) {
    metrics.l1_hits++;

    return {
      source: "l1-cache",
      data: l1Data,
    };
  }

  metrics.l1_misses++;

  // =========================
  // REDIS CACHE
  // =========================

  const redisData = await redisClient.get(cacheKey);

  if (redisData) {
    metrics.l2_hits++;

    const parsedData = JSON.parse(redisData);

    l1Cache.set(cacheKey, parsedData);

    return {
      source: "l2-redis-cache",
      data: parsedData,
    };
  }

  metrics.l2_misses++;

  // =========================
  // TRY TO ACQUIRE LOCK
  // =========================

  const lockAcquired = await redisClient.set(
    lockKey,
    "locked",
    {
      NX: true,
      EX: 10,
    }
  );

  // =========================
  // LOCK OWNER
  // =========================

  if (lockAcquired) {
    try {
      metrics.db_queries++;

      const result = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [productId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const product = result.rows[0];

      // Store in Redis

      await redisClient.setEx(
        cacheKey,
        parseInt(process.env.L2_CACHE_TTL) || 300,
        JSON.stringify(product)
      );

      // Store in L1

      l1Cache.set(cacheKey, product);

      return {
        source: "database",
        data: product,
      };
    } finally {
      await redisClient.del(lockKey);
    }
  }

  // =========================
  // WAIT FOR CACHE
  // =========================

  for (let i = 0; i < 20; i++) {
    await sleep(100);

    const retryData =
      await redisClient.get(cacheKey);

    if (retryData) {
      metrics.l2_hits++;

      const parsedRetryData =
        JSON.parse(retryData);

      l1Cache.set(cacheKey, parsedRetryData);

      return {
        source: "l2-redis-cache",
        data: parsedRetryData,
      };
    }
  }

  throw new Error(
    "Cache stampede protection timeout"
  );
};

module.exports = {
  getProductWithStampedeProtection,
};