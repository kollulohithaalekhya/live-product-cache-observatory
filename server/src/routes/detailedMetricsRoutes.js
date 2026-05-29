const express = require("express");

const metrics = require("../metrics/metricsStore");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    ...metrics,

    l1_hit_ratio:
      metrics.l1_hits /
      Math.max(
        metrics.l1_hits + metrics.l1_misses,
        1
      ),

    l2_hit_ratio:
      metrics.l2_hits /
      Math.max(
        metrics.l2_hits + metrics.l2_misses,
        1
      ),
  });
});

module.exports = router;