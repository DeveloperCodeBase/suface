import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import type { XAxisProps, YAxisProps } from 'recharts';
import { formatToJalaliAxis } from '../utils/jalali';

interface BarConfig {
  dataKey: string;
  color: string;
  name?: string;
  radius?: [number, number, number, number];
}

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: Record<string, any>[];
  xKey: string;
  bars: BarConfig[];
  height?: number | string;
  legend?: boolean;
  className?: string;
  xAxisProps?: Partial<XAxisProps>;
  yAxisProps?: Partial<YAxisProps>;
  tooltipFormatter?: (value: number, name?: string) => React.ReactNode;
}

const BarChartCard: React.FC<BarChartCardProps> = ({
  title,
  subtitle,
  data,
  xKey,
  bars,
  height = 260,
  legend = false,
  className,
  xAxisProps,
  yAxisProps,
  tooltipFormatter
}) => {
  const renderTooltip = tooltipFormatter
    ? (value: any, name: string) => tooltipFormatter(Number(value), name)
    : undefined;

  const { tickFormatter, ...restXAxisProps } = xAxisProps ?? {};
  const axisTickFormatter = (value: string | number, index: number) =>
    tickFormatter ? tickFormatter(value, index) : formatToJalaliAxis(value);

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 ${
        className ?? ''
      }`}
    >
      <div>
        <h3 className="section-title text-slate-800 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="mt-4" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey}
              tickMargin={8}
              tickFormatter={axisTickFormatter}
              {...restXAxisProps}
            />
            <YAxis {...yAxisProps} />
            <Tooltip
              formatter={renderTooltip}
              labelFormatter={(value, _payload, index) =>
                axisTickFormatter(value as string | number, index ?? 0)
              }
            />
            {legend && <Legend />}
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.color}
                name={bar.name}
                radius={bar.radius ?? [12, 12, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartCard;
