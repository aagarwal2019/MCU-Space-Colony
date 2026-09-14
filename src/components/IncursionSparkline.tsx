import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

export interface IncursionHistoryPoint {
  cycle: number;
  label: string;
  threat: number;
}

interface IncursionSparklineProps {
  history: IncursionHistoryPoint[];
  currentThreat: number;
  level: string;
  stability: string;
  textColor: string;
  strokeColor: string;
  badgeStyle: string;
  dotStyle: string;
  description: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: IncursionHistoryPoint }>;
}

const SparklineTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950/95 border border-slate-700/90 px-2 py-1 rounded-md shadow-xl text-[10px] font-mono-tech">
        <span className="text-slate-400">{data.label}:</span>{' '}
        <span className="font-bold text-amber-300">{data.threat}%</span>
        <span className="text-slate-500 text-[9px] ml-1">Threat</span>
      </div>
    );
  }
  return null;
};

export const IncursionSparkline: React.FC<IncursionSparklineProps> = ({
  history,
  currentThreat,
  level,
  stability,
  textColor,
  strokeColor,
  badgeStyle,
  description,
}) => {
  // Compute trend delta between the first point (oldest of last 10) and current point
  const { delta, minThreat, maxThreat } = useMemo(() => {
    if (!history || history.length === 0) {
      return { delta: 0, minThreat: Math.round(currentThreat), maxThreat: Math.round(currentThreat) };
    }
    const first = history[0].threat;
    const last = history[history.length - 1].threat;
    const values = history.map((h) => h.threat);
    return {
      delta: last - first,
      minThreat: Math.min(...values),
      maxThreat: Math.max(...values),
    };
  }, [history, currentThreat]);

  return (
    <div className="p-3.5 space-y-2.5 font-sans select-none">
      {/* Header: Title & Threat Level Badge */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/90">
        <div className="flex items-center gap-1.5 text-xs font-bold font-mono-tech text-slate-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>INCURSION THREAT</span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-tech font-bold uppercase border ${badgeStyle}`}>
          {level}
        </span>
      </div>

      {/* Metric Row: Current Value & 10-Cycle Trend Delta */}
      <div className="flex items-center justify-between text-xs font-mono-tech">
        <div>
          <span className="text-[10px] text-slate-400 block leading-tight">CURRENT RISK</span>
          <span className={`text-base font-black ${textColor}`}>
            {Math.round(currentThreat)}%
          </span>
        </div>

        {/* 10-Cycle Trend Indicator */}
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block leading-tight">10-CYCLE TREND</span>
          <div className="flex items-center justify-end gap-1 text-[11px] font-bold">
            {delta > 0 ? (
              <span className="text-rose-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +{delta}%
              </span>
            ) : delta < 0 ? (
              <span className="text-emerald-400 flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                {delta}%
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-0.5">
                <Minus className="w-3 h-3" />
                ±0%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mini Sparkline Chart using Recharts */}
      <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800/80 shadow-inner">
        <div className="flex items-center justify-between text-[9px] font-mono-tech text-slate-400 px-1 mb-1">
          <span className="flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-cyan-400" />
            10-Cycle History
          </span>
          <span className="text-[9px] text-slate-500 font-mono">
            Low: {minThreat}% · High: {maxThreat}%
          </span>
        </div>

        <div className="w-full flex justify-center">
          <AreaChart
            width={260}
            height={58}
            data={history}
            margin={{ top: 4, right: 6, left: 6, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incursionSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <YAxis domain={[0, 100]} hide />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 8, fill: '#64748b', fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <Tooltip content={<SparklineTooltip />} />
            <Area
              type="monotone"
              dataKey="threat"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#incursionSparklineGrad)"
              dot={{ r: 2, fill: strokeColor }}
              activeDot={{ r: 4, stroke: '#ffffff', strokeWidth: 1.5, fill: strokeColor }}
              isAnimationActive={false}
            />
          </AreaChart>
        </div>
      </div>

      {/* Colony Stability & Diagnostic Assessment */}
      <div className="space-y-1 text-[10px] font-mono-tech">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Colony Stability:</span>
          <span className={`font-bold ${textColor}`}>{stability}</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight pt-1 border-t border-slate-800/80">
          {description}
        </p>
      </div>

      <div className="text-[9px] text-emerald-400/90 font-mono-tech italic pt-0.5">
        Click tab to open Doomsday Clock & Loom controls
      </div>
    </div>
  );
};
