import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (role !== "ADMIN") {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3003/admin/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [navigate]);

  if (!stats) return <div className="loading-skeleton" />;

  const totalReservations =
    stats.confirmedReservations + stats.cancelledReservations;

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
<div className={`sidebar ${sidebarOpen ? "" : "closed"}`}>        <h2 className="title-gradient">Velora Admin</h2>

        <div className="sidebar-links">
          <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/admin/hotels")}>Hôtels</button>
          <button onClick={() => navigate("/admin/users")}>Utilisateurs</button>
          <button onClick={() => navigate("/admin/metrics")}>Métriques</button>
          <button onClick={() => navigate("/admin/profile")}>Mon Profil</button>
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="dashboard-header">

          {/* MENU BUTTON (mobile) */}
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <h1>Dashboard</h1>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Se déconnecter
          </button>
        </div>

        {/* STATS */}
        <div className="dashboard-grid">
          <Card title="Utilisateurs" value={stats.totalUsers} />
          <Card title="Résérvations" value={stats.totalReservations} />
          <Card title="Hôtels" value={stats.totalHotels} />
          <Card title="Chambres" value={stats.totalRooms} />
        </div>

        {/* PIE CHART */}
        <h2 className="section-title">Résérvations</h2>

        <div className="chart-container">
          {totalReservations === 0 ? (
            <p className="empty-chart">Pas de données de réservation</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Confirmed", value: stats.confirmedReservations },
                    { name: "Cancelled", value: stats.cancelledReservations },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* BAR CHART */}
        <h2 className="section-title">Inventaire</h2>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Hôtels", value: stats.totalHotels },
                { name: "Chambres", value: stats.totalRooms },
              ]}
            >
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

/* COMPONENTS */

function Card({ title, value }: any) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}
