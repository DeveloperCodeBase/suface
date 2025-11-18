import React, { useMemo, useState } from 'react';
import { useDashboardData } from '../context/DataContext';
import KpiCard from '../components/KpiCard';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const NationalPage: React.FC = () => {
  const { dams, provinces, nationalTrend, nationalTotals } = useDashboardData();
  const [sortKey, setSortKey] = useState<keyof (typeof provinces)[number]>('storage');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');

  const sortedProvinces = useMemo(() => {
    return [...provinces].sort((a, b) => {
      const dir = direction === 'asc' ? 1 : -1;
      if (a[sortKey] < b[sortKey]) return -1 * dir;
      if (a[sortKey] > b[sortKey]) return 1 * dir;
      return 0;
    });
  }, [provinces, sortKey, direction]);

  const handleSort = (key: keyof (typeof provinces)[number]) => {
    if (sortKey === key) {
      setDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">خلاصه وضعیت استان‌ها و سدهای مهم کشور</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">نمای ملی منابع آب و سدها</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="ذخیره کل کشور" value={`${nationalTotals.totalStorage.toLocaleString()} میلیون مترمکعب`} />
        <KpiCard label="میانگین درصد پرشدگی" value={`${nationalTotals.avgFill}%`} />
        <KpiCard label="تعداد کل سدها" value={dams.length} />
        <KpiCard label="هشدارهای فعال" value={nationalTotals.totalAlerts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">نقشه کشور – سدهای مهم</h3>
          <div className="relative mt-6 h-96 rounded-3xl bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
            {dams.map((dam, idx) => (
              <div
                key={dam.id}
                className="absolute flex w-40 flex-col rounded-2xl bg-white/90 px-3 py-2 text-xs shadow-lg backdrop-blur dark:bg-slate-900/80"
                style={{ top: `${15 + (idx % 3) * 25}%`, left: `${10 + (idx * 12) % 70}%` }}
              >
                <span className="font-semibold text-slate-800 dark:text-white">{dam.name}</span>
                <span className="text-slate-500">{dam.province}</span>
                <span className="text-brand-600">{dam.fillPercent}% پرشدگی</span>
              </div>
            ))}
            <div className="absolute inset-8 rounded-[40px] border-2 border-dashed border-slate-300 dark:border-slate-700"></div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">روند ذخیره کل کشور (۵ سال)</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={nationalTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="storage" stroke="#0284c7" fill="#bae6fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">جدول استان‌ها</h3>
          <p className="text-xs text-slate-500">قابل مرتب‌سازی بر اساس هر ستون</p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                {[
                  { key: 'province', label: 'استان' },
                  { key: 'storage', label: 'ذخیره کل' },
                  { key: 'fillPercent', label: 'میانگین درصد پرشدگی' },
                  { key: 'dams', label: 'تعداد سدها' },
                  { key: 'alerts', label: 'هشدارها' }
                ].map((column) => (
                  <th
                    key={column.key}
                    className="cursor-pointer px-4 py-3 text-right font-medium"
                    onClick={() => handleSort(column.key as keyof (typeof provinces)[number])}
                  >
                    {column.label}{' '}
                    {sortKey === column.key && (direction === 'asc' ? '▲' : '▼')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedProvinces.map((province) => (
                <tr key={province.province} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{province.province}</td>
                  <td className="px-4 py-3">{province.storage.toLocaleString()}</td>
                  <td className="px-4 py-3">{province.fillPercent}%</td>
                  <td className="px-4 py-3">{province.dams}</td>
                  <td className="px-4 py-3">{province.alerts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NationalPage;
