import { useEffect, useState } from "react";
import api from "../services/api";
import MetricsCharts from "../components/MetricsCharts";

function Dashboard() {
    const [metrics, setMetrics] = useState({
        l1_hits: 0,
        l1_misses: 0,
        l2_hits: 0,
        l2_misses: 0,
        db_queries: 0,
        total_requests: 0,
        recent_latencies: [],
        average_latency: 0,
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await api.get("/metrics/detailed");
                setMetrics(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMetrics();

        const interval = setInterval(fetchMetrics, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard">
            <h1>Multi-Tier Cache Observatory</h1>

            <div className="cards">
                <div>Total Requests: {metrics.total_requests}</div>
                <div>DB Queries: {metrics.db_queries}</div>
                <div>L1 Hits: {metrics.l1_hits}</div>
                <div>L2 Hits: {metrics.l2_hits}</div>
            </div>

            <MetricsCharts metrics={metrics} />
        </div>
    );
}

export default Dashboard;