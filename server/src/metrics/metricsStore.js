const metrics = {
  l1_hits: 0,
  l1_misses: 0,
  l2_hits: 0,
  l2_misses: 0,
  db_queries: 0,
  total_requests: 0,

  total_latency: 0,
  average_latency: 0,
  recent_latencies: [],
};

module.exports = metrics;