import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import '../../styles/dashboard_metrics.css';

type Metric = {
  metric: {
    job?: string;
  };
  value: [number, string];
};

const SERVICES = [
  'auth-service',
  'user-service',
  'admin-service',
  'customer-service',
];

export default function Dashboard_Metrics() {
  const [data, setData] = useState<any>(null);

  // ✅ AJOUT ALERTS
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('http://localhost:3010/dashboard/metrics');
      setData(res.data);

      // ✅ FETCH ALERTS
      const alertsRes = await axios.get('http://localhost:3010/dashboard/alerts');
      setAlerts(alertsRes.data);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const format = (arr: Metric[] = [], convert?: (value: number) => number) => {
    const map = new Map<string, number>();

    arr.forEach((item) => {
      const rawValue = Number(item.value[1]);
      map.set(item.metric.job || 'unknown', convert ? convert(rawValue) : rawValue);
    });

    return SERVICES.map((service) => ({
      service,
      value: map.get(service) ?? 0,
    }));
  };

  if (!data) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  const status = format(data.status);
  const cpu = format(data.cpu, (v) => Number((v * 100).toFixed(3)));
  const memory = format(data.memory, (v) => Number((v / 1024 / 1024).toFixed(2)));

  // AJOUT LAG (ms)
  const lag = format(data.lag, (v) => Number((v * 1000).toFixed(3)));

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Real-Time <span>Monitoring Dashboard</span>
          </h1>
          <p className="dashboard-subtitle">
            Visualise the health and performance of your microservices through Prometheus metrics,
            refreshed automatically every 5 seconds.
          </p>
        </div>

        <div className="dashboard-grid">
          {status.map((s) => {
            const isUp = s.value === 1;

            return (
              <div className="status-card" key={s.service}>
                <div className="status-card-header">
                  <span className="status-service-name">{s.service}</span>
                  <span className={`status-dot ${isUp ? 'up' : 'down'}`}></span>
                </div>

                <div className={`status-label ${isUp ? 'up' : 'down'}`}>
                  {isUp ? 'UP' : 'DOWN'}
                </div>

                <div className="status-meta">
                  {isUp
                    ? 'Service is reachable and responding correctly.'
                    : 'Service is unavailable or not responding.'}
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ SECTION ALERTS AJOUTÉE */}
        <div className="alerts-section" style={{ marginTop: "30px" }}>
          <h2 className="chart-title">Alerts</h2>

          {alerts.length === 0 && (
            <div style={{ color: "lightgreen" }}>
              No active alerts ✅
            </div>
          )}

          {alerts.map((alert, i) => {
            const severity = alert.labels?.severity || "unknown";

            return (
              <div
                key={i}
                style={{
                  border: "2px solid red",
                  borderRadius: "10px",
                  padding: "10px",
                  marginBottom: "10px",
                  background: "rgba(255,0,0,0.1)",
                }}
              >
                <strong>{alert.labels?.alertname}</strong>
                <p>Status: {alert.state}</p>
                <p>Severity: {severity}</p>
                <p>{alert.annotations?.description}</p>
              </div>
            );
          })}
        </div>

        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h2 className="chart-title">CPU Usage</h2>
                <div className="chart-desc">Current CPU activity by service (%)</div>
              </div>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cpu}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.18)" />
                  <XAxis dataKey="service" stroke="rgba(255,255,255,0.72)" />
                  <YAxis stroke="rgba(255,255,255,0.72)" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(20,20,30,0.95)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '14px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="dashboard-legend">
              <span className="legend-pill">Live refresh: 5s</span>
              <span className="legend-pill">Metric: rate(process_cpu_seconds_total[1m])</span>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h2 className="chart-title">Memory Usage</h2>
                <div className="chart-desc">Resident memory used by each service (MB)</div>
              </div>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.18)" />
                  <XAxis dataKey="service" stroke="rgba(255,255,255,0.72)" />
                  <YAxis stroke="rgba(255,255,255,0.72)" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(20,20,30,0.95)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '14px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#7c72ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="dashboard-legend">
              <span className="legend-pill">Unit: MB</span>
              <span className="legend-pill">Metric: process_resident_memory_bytes</span>
            </div>
          </div>

          {/* AJOUT LAG */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h2 className="chart-title">Event Loop Lag</h2>
                <div className="chart-desc">Node.js delay (ms)</div>
              </div>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lag}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.18)" />
                  <XAxis dataKey="service" stroke="rgba(255,255,255,0.72)" />
                  <YAxis stroke="rgba(255,255,255,0.72)" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(20,20,30,0.95)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: '14px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="dashboard-legend">
              <span className="legend-pill">Unit: ms</span>
              <span className="legend-pill">Metric: nodejs_eventloop_lag_seconds</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}