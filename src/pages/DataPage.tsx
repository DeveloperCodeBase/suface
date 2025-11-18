import React, { useMemo, useState } from 'react';
import { useDashboardData } from '../context/DataContext';

const columnsConfig = [
  { key: 'date', label: 'تاریخ' },
  { key: 'inflow', label: 'دبی ورودی' },
  { key: 'outflow', label: 'دبی خروجی' },
  { key: 'waterLevel', label: 'تراز' },
  { key: 'rainfall', label: 'بارش' },
  { key: 'evaporation', label: 'تبخیر' }
];

type MetricKey = 'inflow' | 'outflow' | 'level';

const DataPage: React.FC = () => {
  const { dams, damSeries } = useDashboardData();
  const [selectedDam, setSelectedDam] = useState(dams[0]?.id ?? '');
  const [days, setDays] = useState(30);
  const [visibleColumns, setVisibleColumns] = useState(columnsConfig.map((col) => col.key));

  const records = useMemo(() => {
    const series = damSeries[selectedDam] ?? [];
    return series.slice(-days);
  }, [damSeries, selectedDam, days]);

  const stats = useMemo<null | Record<MetricKey, { min: number; max: number; avg: string }>>(() => {
    if (!records.length) return null;
    const inflows = records.map((r) => r.inflow);
    const outflows = records.map((r) => r.outflow);
    const levels = records.map((r) => r.waterLevel);
    const avg = (arr: number[]) => (arr.reduce((sum, value) => sum + value, 0) / arr.length).toFixed(1);
    return {
      inflow: { min: Math.min(...inflows), max: Math.max(...inflows), avg: avg(inflows) },
      outflow: { min: Math.min(...outflows), max: Math.max(...outflows), avg: avg(outflows) },
      level: { min: Math.min(...levels), max: Math.max(...levels), avg: avg(levels) }
    };
  }, [records]);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => (prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]));
  };

  const exportCsv = () => {
    const headers = columnsConfig.filter((col) => visibleColumns.includes(col.key)).map((col) => col.label);
    const rows = records.map((record) =>
      columnsConfig
        .filter((col) => visibleColumns.includes(col.key))
        .map((col) => record[col.key as keyof typeof record])
        .join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedDam}-data.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">دسترسی به داده‌های خام و گزارش‌گیری</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">داده‌ها و گزارش‌ها</h1>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs text-slate-500">انتخاب سد</label>
            <select
              value={selectedDam}
              onChange={(e) => setSelectedDam(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              {dams.map((dam) => (
                <option key={dam.id} value={dam.id}>
                  {dam.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">بازه زمانی (روز)</label>
            <input
              type="range"
              min={7}
              max={30}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-4 w-full"
            />
            <p className="mt-1 text-xs text-slate-500">نمایش {days} روز آخر</p>
          </div>
          <div>
            <label className="text-xs text-slate-500">ستون‌های قابل نمایش</label>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {columnsConfig.map((col) => (
                <label key={col.key} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => toggleColumn(col.key)}
                  />
                  {col.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={exportCsv}
            className="rounded-2xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/30"
          >
            خروجی CSV
          </button>
          <button className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-200">
            تولید گزارش PDF (نمایشی)
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                {columnsConfig
                  .filter((col) => visibleColumns.includes(col.key))
                  .map((col) => (
                    <th key={col.key} className="px-4 py-3 text-right">
                      {col.label}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.map((record) => (
                <tr key={record.date} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  {columnsConfig
                    .filter((col) => visibleColumns.includes(col.key))
                    .map((col) => (
                      <td key={col.key} className="px-4 py-3 text-slate-700 dark:text-slate-100">
                        {record[col.key as keyof typeof record] as React.ReactNode}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          {([
            { key: 'inflow', label: 'دبی ورودی' },
            { key: 'outflow', label: 'دبی خروجی' },
            { key: 'level', label: 'تراز' }
          ] as { key: MetricKey; label: string }[]).map((item) => (
            <div key={item.key} className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-xs text-slate-500">{item.label}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div>
                  <p className="text-slate-500">حداقل</p>
                  <p className="font-semibold text-slate-800 dark:text-white">{stats[item.key].min}</p>
                </div>
                <div>
                  <p className="text-slate-500">حداکثر</p>
                  <p className="font-semibold text-slate-800 dark:text-white">{stats[item.key].max}</p>
                </div>
                <div>
                  <p className="text-slate-500">میانگین</p>
                  <p className="font-semibold text-slate-800 dark:text-white">{stats[item.key].avg}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataPage;
