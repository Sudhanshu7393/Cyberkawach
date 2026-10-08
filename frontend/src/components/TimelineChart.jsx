import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#151D2A] border border-slate-700/80 p-2.5 rounded-xl shadow-xl text-xs font-mono z-50">
        <p className="text-slate-400 font-semibold mb-1 border-b border-slate-800 pb-1">{data.timestamp || data.time}</p>
        <div className="space-y-1 mt-1">
          <p className="flex justify-between gap-4">
            <span className="text-slate-400">User:</span>
            <span className="text-amber-400 font-bold">{data.user_id || 'N/A'}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-slate-400">Risk Score:</span>
            <span className={`font-bold ${data.risk_score >= 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {data.risk_score} / 100
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function TimelineChart({ timelineData = [], isMini = false }) {
  if (!timelineData || timelineData.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 text-center py-4">
        <Activity className="w-5 h-5 text-slate-600 mb-1 animate-pulse" />
        <span className="text-[11px] font-mono">Awaiting telemetry packets...</span>
      </div>
    );
  }

  const formattedData = timelineData.map((d, index) => ({
    ...d,
    index: index + 1,
    displayTime: d.time || `#${index + 1}`
  }));

  if (isMini) {
    // Clean Sparkline for inside Phone Mockups (No bulky axis labels)
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
            <defs>
              <linearGradient id="miniAmberGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="risk_score"
              stroke="#F59E0B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#miniAmberGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="softAmberGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis
            dataKey="displayTime"
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#64748B"
            fontSize={10}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={60} 
            stroke="#F43F5E" 
            strokeDasharray="4 4" 
            label={{ value: 'Risk > 60', fill: '#F43F5E', fontSize: 9, position: 'insideTopRight' }} 
          />
          <Area
            type="monotone"
            dataKey="risk_score"
            stroke="#F59E0B"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#softAmberGradient)"
            activeDot={{ r: 4, fill: '#F59E0B', stroke: '#151D2A', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
