import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function MetricsCharts({ metrics = {} }) {
  const latencies = metrics.recent_latencies || [];

  const l1Data = {
    labels: ["Hits", "Misses"],
    datasets: [
      {
        data: [
          metrics.l1_hits || 0,
          metrics.l1_misses || 0,
        ],
      },
    ],
  };

  const l2Data = {
    labels: ["Hits", "Misses"],
    datasets: [
      {
        data: [
          metrics.l2_hits || 0,
          metrics.l2_misses || 0,
        ],
      },
    ],
  };

  const latencyData = {
    labels: latencies.map((_, i) => i + 1),
    datasets: [
      {
        label: "Latency (ms)",
        data: latencies,
      },
    ],
  };

  return (
    <>
      <div data-testid="l1-hit-ratio-chart">
        <h3>L1 Cache Ratio</h3>
        <Doughnut data={l1Data} />
      </div>

      <div data-testid="l2-hit-ratio-chart">
        <h3>L2 Cache Ratio</h3>
        <Doughnut data={l2Data} />
      </div>

      <div data-testid="latency-chart">
        <h3>Latency Trend</h3>
        <Line data={latencyData} />
      </div>

      <div data-testid="request-waterfall-display">
        <h3>Request Waterfall</h3>

        <p>
          Total Requests:{" "}
          <strong>{metrics.total_requests || 0}</strong>
        </p>

        <p>
          Database Queries:{" "}
          <strong>{metrics.db_queries || 0}</strong>
        </p>

        <p>
          L1 Hits:{" "}
          <strong>{metrics.l1_hits || 0}</strong>
        </p>

        <p>
          L1 Misses:{" "}
          <strong>{metrics.l1_misses || 0}</strong>
        </p>

        <p>
          L2 Hits:{" "}
          <strong>{metrics.l2_hits || 0}</strong>
        </p>

        <p>
          L2 Misses:{" "}
          <strong>{metrics.l2_misses || 0}</strong>
        </p>

        <p>
          Average Latency:{" "}
          <strong>{metrics.average_latency || 0} ms</strong>
        </p>
      </div>
    </>
  );
}

export default MetricsCharts;