const express = require("express");

const metrics = require("../metrics/metricsStore");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json(metrics);
});

module.exports = router;