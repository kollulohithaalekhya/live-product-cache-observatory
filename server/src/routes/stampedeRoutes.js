const express = require("express");

const metrics = require("../metrics/metricsStore");

const {
  getProductWithStampedeProtection,
} = require("../services/stampedeService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      productId,
      concurrentRequests,
    } = req.body;

    const beforeQueries = metrics.db_queries;

    const requests = Array.from({
      length: concurrentRequests,
    }).map(() =>
      getProductWithStampedeProtection(productId)
    );

    await Promise.all(requests);

    const afterQueries = metrics.db_queries;

    return res.status(200).json({
      success: true,
      concurrentRequests,
      dbQueriesUsed:
        afterQueries - beforeQueries,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Stampede simulation failed",
    });
  }
});

module.exports = router;