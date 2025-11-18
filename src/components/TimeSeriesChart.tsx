import React, { useId } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface SeriesConfig {
  dataKey: string;
  color: string;
  name?: string;
  type?: 'line' | 'area';
  strokeWidth?: number;
  dot?: boolean;
}

interface TimeSeriesChartProps {
  data: Record<string, any>[];
  lines: SeriesConfig[];
  height?: number;
  xKey?: string;
  legend?: boolean;
  className?: string;
  tooltipFormatter?: (value: number, name?: string) => React.ReactNode;
  yTickFormatter?: (value: number) => React.ReactNode;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  lines,
  height = 300,
  xKey = 'date',
  legend = false,
  className,
  tooltipFormatter,
  yTickFormatter
}) => {
  const hasArea = lines.some((line) => line.type === 'area');
  const gradientPrefix = useId();
  const areaLines = lines.filter((line) => line.type === 'area');

  const renderTooltip = tooltipFormatter
    ? (value: any, name: string) => tooltipFormatter(Number(value), name)
    : undefined;

  const renderYAxisTick = yTickFormatter ? { tickFormatter: yTickFormatter } : {};

  return (
    <div className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {hasArea ? (
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              {areaLines.map((line, idx) => (
                <linearGradient id={`${gradientPrefix}-${idx}`} key={line.dataKey} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={line.color} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={line.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={xKey} tickMargin={8} />
            <YAxis {...renderYAxisTick} />
            <Tooltip formatter={renderTooltip} />
            {legend && <Legend />}
            {lines.map((line, idx) =>
              line.type === 'area' ? (
                <Area
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.color}
                  fill={`url(#${gradientPrefix}-${areaLines.findIndex((item) => item.dataKey === line.dataKey)})`}
                  name={line.name}
                  strokeWidth={line.strokeWidth ?? 3}
                />
              ) : (
                <Line
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.color}
                  name={line.name}
                  strokeWidth={line.strokeWidth ?? 3}
                  dot={line.dot ?? false}
                />
              )
            )}
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={xKey} tickMargin={8} />
            <YAxis {...renderYAxisTick} />
            <Tooltip formatter={renderTooltip} />
            {legend && <Legend />}
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                name={line.name}
                strokeWidth={line.strokeWidth ?? 3}
                dot={line.dot ?? false}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;
