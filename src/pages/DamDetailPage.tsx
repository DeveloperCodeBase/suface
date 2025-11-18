import React, { useMemo, useState } from 'react';
import { useDashboardData } from '../context/DataContext';
import KpiCard from '../components/KpiCard';
import AlertsList from '../components/AlertsList';
import DataTable from '../components/DataTable';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const statusStyles: Record<string, string> = {
  عادی: 'bg-emerald-100 text-emerald-700',
  هشدار: 'bg-amber-100 text-amber-700',
  بحرانی: 'bg-rose-100 text-rose-700'
};

const DamDetailPage: React.FC = () => {
  const { dams, damSeries, damForecast, alerts } = useDashboardData();
  const pilotDam = dams.find((dam) => dam.id === 'kalpush') ?? dams[0];
  const series = damSeries[pilotDam.id];
  const forecast = damForecast[pilotDam.id];
  const damAlerts = alerts.filter((alert) => alert.damName === pilotDam.name);
  const [tab, setTab] = useState<'level' | 'flow' | 'forecast'>('level');
  const [filter, setFilter] = useState<'7' | '30'>('30');

  const filteredSeries = useMemo(() => {
    const count = filter === '7' ? 7 : 30;
    return series.slice(-count);
  }, [series, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">استان سمنان – حوضه آبریز {pilotDam.basin}</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{pilotDam.name}</h1>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusStyles[pilotDam.status]}`}>
          وضعیت: {pilotDam.status}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="تراز فعلی (متر)" value={pilotDam.currentWaterLevel} />
        <KpiCard label="حجم ذخیره (میلیون مترمکعب)" value={pilotDam.storageVolumeMCM} />
        <KpiCard label="درصد پرشدگی" value={`${pilotDam.fillPercent}%`} />
        <KpiCard label="دبی ورودی (مترمکعب/ثانیه)" value={pilotDam.inflow} />
        <KpiCard label="دبی خروجی (مترمکعب/ثانیه)" value={pilotDam.outflow} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 text-xs">
            {(
              [
                { key: 'level', label: 'روند تراز' },
                { key: 'flow', label: 'روند دبی' },
                { key: 'forecast', label: 'پیش‌بینی' }
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`rounded-full px-4 py-1 font-semibold ${
                  tab === item.key ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 text-xs">
            {(
              [
                { key: '7', label: '۷ روز اخیر' },
                { key: '30', label: '۳۰ روز اخیر' }
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`rounded-full px-3 py-1 font-semibold ${
                  filter === item.key
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            {tab === 'level' && (
              <LineChart data={filteredSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="waterLevel" stroke="#0ea5e9" strokeWidth={3} dot={false} />
              </LineChart>
            )}
            {tab === 'flow' && (
              <LineChart data={filteredSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="inflow" stroke="#22c55e" strokeWidth={3} dot={false} name="ورودی" />
                <Line dataKey="outflow" stroke="#f97316" strokeWidth={3} dot={false} name="خروجی" />
              </LineChart>
            )}
            {tab === 'forecast' && (
              <AreaChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="waterLevel" stroke="#1d4ed8" fill="#bfdbfe" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">بارش و تبخیر</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={series.slice(-30)}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rainfall" fill="#0ea5e9" name="بارش" />
                <Line type="monotone" dataKey="evaporation" stroke="#f43f5e" name="تبخیر" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <AlertsList alerts={damAlerts} title={`هشدارهای ${pilotDam.name}`} limit={4} />
      </div>

      <DataTable
        keyField="date"
        columns={[
          { header: 'تاریخ', accessor: 'date' },
          { header: 'دبی ورودی', accessor: 'inflow' },
          { header: 'دبی خروجی', accessor: 'outflow' },
          { header: 'تراز', accessor: 'waterLevel' },
          { header: 'بارش', accessor: 'rainfall' },
          { header: 'تبخیر', accessor: 'evaporation' }
        ]}
        data={filteredSeries}
      />
    </div>
  );
};

export default DamDetailPage;
