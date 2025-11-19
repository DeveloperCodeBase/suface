import React, { useEffect, useMemo, useState } from 'react';
import { useDashboardData } from '../context/DataContext';
import KpiCard from '../components/KpiCard';
import TimeSeriesChart from '../components/TimeSeriesChart';
import DamMap from '../components/DamMap';
import { IRAN_VIEW, SEMNAN_VIEW } from '../config/maps';
import { NATIONAL_DAMS, SEMNAN_DAMS } from '../config/dams';

const NationalPage: React.FC = () => {
  const { dams, provinces, nationalTrend, nationalTotals } = useDashboardData();
  const [sortKey, setSortKey] = useState<keyof (typeof provinces)[number]>('storage');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [mapViewId, setMapViewId] = useState<'iran' | 'semnan'>('iran');
  const [activeDamId, setActiveDamId] = useState<string | undefined>(NATIONAL_DAMS[0]?.id);

  useEffect(() => {
    setActiveDamId(mapViewId === 'iran' ? NATIONAL_DAMS[0]?.id : SEMNAN_DAMS[0]?.id);
  }, [mapViewId]);

  const currentView = mapViewId === 'iran' ? IRAN_VIEW : SEMNAN_VIEW;
  const currentMapDams = mapViewId === 'iran' ? NATIONAL_DAMS : SEMNAN_DAMS;

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
        <h1 className="page-title mt-2 text-slate-900 dark:text-white">نمای ملی منابع آب و سدها</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="ذخیره کل کشور" value={`${nationalTotals.totalStorage.toLocaleString()} میلیون مترمکعب`} />
        <KpiCard label="میانگین درصد پرشدگی" value={`${nationalTotals.avgFill}%`} />
        <KpiCard label="تعداد کل سدها" value={dams.length} />
        <KpiCard label="هشدارهای فعال" value={nationalTotals.totalAlerts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="section-title text-slate-800 dark:text-white">نقشه تعاملی سدها</h3>
            <div className="flex gap-2 text-xs">
              {[
                { id: 'iran' as const, label: 'ایران' },
                { id: 'semnan' as const, label: 'استان سمنان' }
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMapViewId(option.id)}
                  className={`rounded-full px-3 py-1 font-semibold transition ${
                    mapViewId === option.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <DamMap
            className="mt-4"
            view={currentView}
            dams={currentMapDams}
            highlightDamId={activeDamId}
            onDamSelect={setActiveDamId}
            legendTitle={mapViewId === 'iran' ? 'سدهای شاخص کشور' : 'سدهای استان سمنان'}
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="section-title text-slate-800 dark:text-white">روند ذخیره کل کشور (۵ سال)</h3>
          <TimeSeriesChart
            className="mt-4 w-full"
            height="clamp(260px, 45vh, 420px)"
            data={nationalTrend}
            xKey="year"
            lines={[{ dataKey: 'storage', color: '#0284c7', type: 'area', name: 'ذخیره کل' }]}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <h3 className="section-title text-slate-800 dark:text-white">جدول استان‌ها</h3>
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
