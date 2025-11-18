import React, { useMemo, useState } from 'react';
import { useDashboardData } from '../context/DataContext';
import KpiCard from '../components/KpiCard';
import AlertsList from '../components/AlertsList';
import DataTable from '../components/DataTable';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FiActivity, FiDroplet, FiLayers, FiTrendingUp, FiZap } from 'react-icons/fi';

const OverviewPage: React.FC = () => {
  const { semnanMonthlyStorage, cumulativeRainfall, provinces, alerts, semnanAggregate, nationalTotals } = useDashboardData();
  const [metric, setMetric] = useState<'storage' | 'inflow' | 'outflow'>('storage');

  const kpiCards = useMemo(
    () => [
      {
        label: 'ذخیره کل کشور (میلیون مترمکعب)',
        value: nationalTotals.totalStorage.toLocaleString(),
        icon: <FiLayers />
      },
      {
        label: 'ذخیره کل استان سمنان',
        value: `${semnanAggregate.totalStorage.toLocaleString()} میلیون مترمکعب`,
        icon: <FiDroplet />
      },
      {
        label: 'میانگین درصد پرشدگی سدهای سمنان',
        value: `${semnanAggregate.avgFill}%`,
        icon: <FiTrendingUp />
      },
      {
        label: 'تعداد هشدارهای فعال',
        value: nationalTotals.totalAlerts,
        icon: <FiActivity />
      },
      {
        label: 'مجموع دبی خروجی امروز (مترمکعب بر ثانیه)',
        value: nationalTotals.totalOutflowToday,
        icon: <FiZap />
      }
    ],
    [nationalTotals, semnanAggregate]
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">نمای کلی وضعیت سدهای استان سمنان و کشور</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">داشبورد کلان مدیریت منابع آب</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpiCards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">روند ذخیره و دبی استان سمنان</h2>
              <p className="text-xs text-slate-500">۱۲ ماه اخیر</p>
            </div>
            <div className="flex gap-2 text-xs">
              {(
                [
                  { key: 'storage', label: 'ذخیره' },
                  { key: 'inflow', label: 'دبی ورودی' },
                  { key: 'outflow', label: 'دبی خروجی' }
                ] as const
              ).map((option) => (
                <button
                  key={option.key}
                  onClick={() => setMetric(option.key)}
                  className={`rounded-full px-3 py-1 font-semibold transition ${
                    metric === option.key
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={semnanMonthlyStorage} margin={{ top: 10, bottom: 0, left: 0, right: 0 }}>
                <defs>
                  <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Area
                  type="monotone"
                  dataKey={metric}
                  stroke="#0ea5e9"
                  fill="url(#colorStorage)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">بارش تجمعی استان</h2>
              <p className="text-xs text-slate-500">۱۲ ماه اخیر</p>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeRainfall}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rainfall" stroke="#0284c7" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable
            keyField="province"
            columns={[
              { header: 'استان', accessor: 'province' },
              { header: 'ذخیره کل (میلیون مترمکعب)', accessor: (row) => row.storage.toLocaleString() },
              { header: 'درصد پرشدگی', accessor: (row) => `${row.fillPercent}%` },
              { header: 'تعداد سدها', accessor: 'dams' },
              { header: 'تعداد هشدارها', accessor: 'alerts' }
            ]}
            data={provinces}
          />
        </div>
        <AlertsList alerts={alerts} />
      </div>
    </div>
  );
};

export default OverviewPage;
