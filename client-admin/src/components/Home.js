import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement, Filler
);

const STATUS_CONFIG = [
  { key: 'COMPLETED', label: 'Giao thành công', color: '#22c55e' },
  { key: 'SHIPPING',  label: 'Đang giao',       color: '#f97316' },
  { key: 'APPROVED',  label: 'Đang chuẩn bị',   color: '#3b82f6' },
  { key: 'PENDING',   label: 'Chờ xác nhận',    color: '#f59e0b' },
  { key: 'CANCELED',  label: 'Đã hủy',          color: '#ef4444' },
];

const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';

const Home = () => {
  const [stats, setStats]         = useState(null);
  const [chartMode, setChartMode] = useState('daily');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/order/stats')
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const chartData = stats ? (chartMode === 'daily' ? stats.daily : stats.monthly) : [];
  const totalOrders = stats ? Object.values(stats.statusStats).reduce((a, b) => a + b, 0) : 0;

  const lineData = {
    labels: chartData.map(d => chartMode === 'daily' ? d.date.slice(5) : d.date.slice(2)),
    datasets: [{
      label: 'Doanh thu',
      data: chartData.map(d => d.revenue),
      borderColor: '#111',
      backgroundColor: 'rgba(17,17,17,0.06)',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#111',
      pointHoverBackgroundColor: '#22c55e',
      pointHoverRadius: 5,
      tension: 0.4,
      fill: true,
    }]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111',
        titleColor: '#aaa',
        bodyColor: '#4ade80',
        bodyFont: { family: 'DM Mono', weight: '700', size: 13 },
        padding: 12,
        borderWidth: 0,
        callbacks: { label: ctx => fmt(ctx.parsed.y) }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#aaa', font: { family: 'DM Mono', size: 11 } },
        border: { display: false }
      },
      y: {
        grid: { color: '#f0eeea' },
        ticks: {
          color: '#aaa',
          font: { family: 'DM Mono', size: 11 },
          callback: v => v >= 1000000 ? (v/1000000).toFixed(0)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v
        },
        border: { display: false }
      }
    }
  };

  const pieData = stats
    ? STATUS_CONFIG.filter(s => (stats.statusStats[s.key] || 0) > 0)
    : [];

  const doughnutData = {
    labels: pieData.map(s => s.label),
    datasets: [{
      data: pieData.map(s => stats.statusStats[s.key] || 0),
      backgroundColor: pieData.map(s => s.color),
      borderWidth: 0,
      hoverOffset: 6,
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111',
        titleColor: '#aaa',
        bodyColor: '#fff',
        bodyFont: { family: 'DM Mono', size: 12 },
        padding: 10,
        callbacks: { label: ctx => ` ${ctx.parsed} đơn` }
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .dash-root {
          font-family: 'DM Sans', sans-serif;
          background: #f5f4f0;
          min-height: 100vh;
          padding: 32px;
          color: #1a1a1a;
        }

        .dash-title {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.3px;
          margin-bottom: 28px;
          color: #111;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e6e1;
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #999;
        }

        .stat-value {
          font-family: 'DM Mono', monospace;
          font-size: 22px;
          font-weight: 500;
          color: #111;
          letter-spacing: -0.5px;
        }

        .stat-value.green { color: #16a34a; }
        .stat-sub { font-size: 12px; color: #aaa; margin-top: 2px; }

        .charts-row {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 20px;
          align-items: start;
        }

        .chart-panel, .pie-panel {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e6e1;
          overflow: hidden;
        }

        .chart-header, .pie-header {
          padding: 18px 24px;
          border-bottom: 1px solid #e8e6e1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chart-header h2, .pie-header h2 {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          color: #555;
          margin: 0;
        }

        .tab-group {
          display: flex;
          background: #f5f4f0;
          border-radius: 8px;
          padding: 3px;
          gap: 2px;
        }

        .tab-btn {
          padding: 5px 14px;
          border-radius: 6px;
          border: none;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          cursor: pointer;
          background: none;
          color: #999;
          transition: all 0.15s;
        }

        .tab-btn.active {
          background: #fff;
          color: #111;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .chart-body { padding: 20px 20px 16px; height: 300px; }
        .pie-body { padding: 20px 24px; }
        .pie-chart-wrap { height: 200px; }

        .pie-legend {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pie-legend-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }

        .pie-legend-left {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #444;
        }

        .pie-dot {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .pie-count {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #888;
        }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #aaa;
          font-size: 14px;
        }

        @media (max-width: 1100px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .charts-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dash-root">
        <div className="dash-title">Dashboard</div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Tổng doanh thu</div>
            <div className="stat-value green">{loading ? '—' : fmt(stats?.totalRevenue || 0)}</div>
            <div className="stat-sub">Không tính đơn hủy</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Tổng đơn hàng</div>
            <div className="stat-value">{loading ? '—' : totalOrders}</div>
            <div className="stat-sub">Tất cả trạng thái</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Đơn hoàn thành</div>
            <div className="stat-value">{loading ? '—' : (stats?.statusStats?.COMPLETED || 0)}</div>
            <div className="stat-sub" style={{ color: '#16a34a' }}>Giao thành công</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Đơn đã hủy</div>
            <div className="stat-value">{loading ? '—' : (stats?.statusStats?.CANCELED || 0)}</div>
            <div className="stat-sub" style={{ color: '#ef4444' }}>Đã hủy</div>
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-panel">
            <div className="chart-header">
              <h2>Doanh thu</h2>
              <div className="tab-group">
                <button className={`tab-btn ${chartMode === 'daily' ? 'active' : ''}`} onClick={() => setChartMode('daily')}>Theo ngày</button>
                <button className={`tab-btn ${chartMode === 'monthly' ? 'active' : ''}`} onClick={() => setChartMode('monthly')}>Theo tháng</button>
              </div>
            </div>
            <div className="chart-body">
              {loading ? (
                <div className="loading-state">⏳ Đang tải...</div>
              ) : chartData.length === 0 ? (
                <div className="loading-state">Chưa có dữ liệu</div>
              ) : (
                <Line data={lineData} options={lineOptions} />
              )}
            </div>
          </div>

          <div className="pie-panel">
            <div className="pie-header">
              <h2>Trạng thái đơn hàng</h2>
            </div>
            <div className="pie-body">
              {loading ? (
                <div className="loading-state">⏳ Đang tải...</div>
              ) : pieData.length === 0 ? (
                <div className="loading-state">Chưa có dữ liệu</div>
              ) : (
                <>
                  <div className="pie-chart-wrap">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                  <div className="pie-legend">
                    {pieData.map(s => (
                      <div key={s.key} className="pie-legend-row">
                        <div className="pie-legend-left">
                          <div className="pie-dot" style={{ background: s.color }} />
                          {s.label}
                        </div>
                        <span className="pie-count">
                          {stats.statusStats[s.key]} đơn&nbsp;
                          <span style={{ color: '#ccc' }}>
                            ({totalOrders ? Math.round(stats.statusStats[s.key] / totalOrders * 100) : 0}%)
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;