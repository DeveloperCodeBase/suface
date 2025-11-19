import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export type RainfallPoint = {
  month: string;
  mm: number;
};

interface RainfallChartProps {
  data?: RainfallPoint[];
  title?: string;
  height?: string | number;
}

const defaultData: RainfallPoint[] = [
  { month: 'فروردین', mm: 35 },
  { month: 'اردیبهشت', mm: 28 },
  { month: 'خرداد', mm: 12 },
  { month: 'تیر', mm: 2 },
  { month: 'مرداد', mm: 1 },
  { month: 'شهریور', mm: 3 },
  { month: 'مهر', mm: 10 },
  { month: 'آبان', mm: 22 },
  { month: 'آذر', mm: 30 },
  { month: 'دی', mm: 40 },
  { month: 'بهمن', mm: 38 },
  { month: 'اسفند', mm: 32 }
];

const RainfallChart: React.FC<RainfallChartProps> = ({ data = defaultData, title = 'الگوی بارش سالانه (داده فرضی)', height }) => {
  return (
    <div className="space-y-3" style={{ minHeight: height ?? 'clamp(280px, 45vh, 420px)' }}>
      <h3 className="section-title text-slate-800 dark:text-white">{title}</h3>
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number) => value.toLocaleString('fa-IR')}
              label={{ value: 'میلی‌متر', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString('fa-IR')} میلی‌متر`, 'بارش']}
              labelFormatter={(label: string) => `ماه: ${label}`}
              wrapperClassName="text-xs"
            />
            <Bar dataKey="mm" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RainfallChart;
