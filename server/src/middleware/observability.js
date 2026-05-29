const metrics = require("../metrics/metricsStore");

const observability = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const latency = Date.now() - start;

    metrics.total_latency += latency;

    metrics.average_latency =
      metrics.total_latency /
      metrics.total_requests;

    metrics.recent_latencies.push(latency);

    if (metrics.recent_latencies.length > 20) {
      metrics.recent_latencies.shift();
    }
  });

  next();
};

module.exports = observability;