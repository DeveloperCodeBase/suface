import React, { useMemo, useState } from 'react';
import { useDashboardData } from '../context/DataContext';
import KpiCard from '../components/KpiCard';
import AlertsList from '../components/AlertsList';
import DataTable from '../components/DataTable';
import TimeSeriesChart from '../components/TimeSeriesChart';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatToJalali, formatToJalaliAxis } from '../utils/jalali';

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">استان سمنان – حوضه آبریز {pilotDam.basin}</p>
          <h1 className="page-title mt-2 text-slate-900 dark:text-white">{pilotDam.name}</h1>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusStyles[pilotDam.status]}`}>
          وضعیت: {pilotDam.status}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
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
        <div className="mt-4">
          {tab === 'level' && (
            <TimeSeriesChart
              className="w-full"
              height="clamp(260px, 45vh, 420px)"
              data={filteredSeries}
              xKey="date"
              lines={[{ dataKey: 'waterLevel', color: '#0ea5e9', name: 'تراز' }]}
            />
          )}
          {tab === 'flow' && (
            <TimeSeriesChart
              className="w-full"
              height="clamp(260px, 45vh, 420px)"
              data={filteredSeries}
              xKey="date"
              legend
              lines={[
                { dataKey: 'inflow', color: '#22c55e', name: 'ورودی' },
                { dataKey: 'outflow', color: '#f97316', name: 'خروجی' }
              ]}
            />
          )}
          {tab === 'forecast' && (
            <TimeSeriesChart
              className="w-full"
              height="clamp(260px, 45vh, 420px)"
              data={forecast}
              xKey="date"
              lines={[{ dataKey: 'waterLevel', color: '#1d4ed8', type: 'area', name: 'پیش‌بینی تراز' }]}
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 lg:col-span-2">
          <h3 className="section-title text-slate-800 dark:text-white">بارش و تبخیر</h3>
          <div className="mt-4" style={{ minHeight: 'clamp(240px, 40vh, 360px)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={series.slice(-30)}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => formatToJalaliAxis(String(value))} />
                <YAxis />
                <Tooltip labelFormatter={(value) => formatToJalali(value as string)} />
                <Legend />
                <Bar dataKey="rainfall" fill="#0ea5e9" name="بارش" />
                <Line type="monotone" dataKey="evaporation" stroke="#f43f5e" name="تبخیر" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="min-w-0">
          <AlertsList alerts={damAlerts} title={`هشدارهای ${pilotDam.name}`} limit={4} />
        </div>
      </div>

      <DataTable
        keyField="date"
        columns={[
          { header: 'تاریخ', accessor: (row) => formatToJalali(row.date) },
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
