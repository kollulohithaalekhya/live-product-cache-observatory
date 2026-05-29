const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const metricsRoutes = require("./routes/metricsRoutes");
const stampedeRoutes = require("./routes/stampedeRoutes");
const observability =
  require("./middleware/observability");

  const detailedMetricsRoutes =
require("./routes/detailedMetricsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(observability);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
  });
});

app.use("/api/products", productRoutes);

app.use("/api/metrics", metricsRoutes);

app.use("/api/simulate/stampede", stampedeRoutes);

app.use(
  "/api/metrics/detailed",
  detailedMetricsRoutes
);

module.exports = app;