import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

export const UserGrowthChart = ({ data, loading }) => {
  if (loading) return <div className="chart-loading">Loading growth data...</div>;
  if (!data || data.length === 0) return <div className="chart-empty">No growth data available</div>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.1} />
            <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#999', fontSize: 10 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#999', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Area
          type="monotone"
          dataKey="users"
          stroke="#6C5CE7"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorUsers)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const DailyActivityChart = ({ data, loading }) => {
  if (loading) return <div className="chart-loading">Loading activity logs...</div>;
  if (!data || data.length === 0) return <div className="chart-empty">No activity logs recorded</div>;

  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#999', fontSize: 10 }}
        />
        <Tooltip
          cursor={{ fill: '#F8F9FA' }}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        />
        <Bar
          dataKey="logs"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ActivityBreakdownChart = ({ data, loading }) => {
  if (loading) return <div className="chart-loading">Loading breakdown...</div>;
  if (!data || data.length === 0) return <div className="chart-empty">No data</div>;

  // Find max value to calculate percentage width
  const maxVal = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="activity-breakdown-container">
      {data.map((item, idx) => {
        const percentage = Math.min((item.count / maxVal) * 100, 100);
        return (
          <div className="breakdown-row" key={idx}>
            <div className="breakdown-label-group">
              <span className="breakdown-title">LOGS</span>
              <span className="breakdown-category">{item.name}</span>
            </div>
            <div className="breakdown-bar-track">
              <div 
                className="breakdown-bar-fill" 
                style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: item.color 
                }}
              >
                <div className="breakdown-arrow-head" style={{ borderLeftColor: item.color }}>
                  <span className="breakdown-value">{item.count}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

