const pool = require("../db/postgres");

const metrics = require("../metrics/metricsStore");

const l1Cache = require("../cache/l1Cache");

const {
  redisClient,
} = require("../cache/redisClient");

console.log(redisClient);
const getProductById = async (req, res) => {
  try {
    metrics.total_requests++;

    const { id } = req.params;

    const cacheKey = `product:${id}`;

    // =========================
    // L1 CACHE CHECK
    // =========================

    const l1CachedProduct = l1Cache.get(cacheKey);

    if (l1CachedProduct) {
      metrics.l1_hits++;

      return res.status(200).json({
        success: true,
        source: "l1-cache",
        data: l1CachedProduct,
      });
    }

    metrics.l1_misses++;

    // =========================
    // L2 REDIS CACHE CHECK
    // =========================

    const redisCachedProduct =
      await redisClient.get(cacheKey);

    if (redisCachedProduct) {
      metrics.l2_hits++;

      const parsedProduct =
        JSON.parse(redisCachedProduct);

      // Populate L1
      l1Cache.set(cacheKey, parsedProduct);

      return res.status(200).json({
        success: true,
        source: "l2-redis-cache",
        data: parsedProduct,
      });
    }

    metrics.l2_misses++;

    // =========================
    // DATABASE QUERY
    // =========================

    metrics.db_queries++;

    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = result.rows[0];

    // =========================
    // STORE IN REDIS
    // =========================

    await redisClient.setEx(
      cacheKey,
      parseInt(process.env.L2_CACHE_TTL) || 300,
      JSON.stringify(product)
    );

    // =========================
    // STORE IN L1
    // =========================

    l1Cache.set(cacheKey, product);

    return res.status(200).json({
      success: true,
      source: "database",
      data: product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getProductById,
};