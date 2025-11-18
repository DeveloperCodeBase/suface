import React, { useMemo, useState } from 'react';
import { useDashboardData } from '../context/DataContext';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const levelColors: Record<string, string> = {
  اطلاع: 'bg-sky-100 text-sky-700',
  هشدار: 'bg-amber-100 text-amber-700',
  بحرانی: 'bg-rose-100 text-rose-700'
};

const AlertsPage: React.FC = () => {
  const { alerts, dams } = useDashboardData();
  const [levelFilter, setLevelFilter] = useState<string>('همه');
  const [damFilter, setDamFilter] = useState<string>('همه');

  const filteredAlerts = alerts.filter((alert) => {
    const levelMatch = levelFilter === 'همه' || alert.level === levelFilter;
    const damMatch = damFilter === 'همه' || alert.damName === damFilter;
    return levelMatch && damMatch;
  });

  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredAlerts.forEach((alert) => {
      const date = alert.timestamp.split(' ')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }, [filteredAlerts]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">مدیریت و پایش هشدارهای عملیاتی</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">مرکز هشدارها</h1>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs text-slate-500">سطح هشدار</label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {['همه', 'اطلاع', 'هشدار', 'بحرانی'].map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">سد</label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              value={damFilter}
              onChange={(e) => setDamFilter(e.target.value)}
            >
              <option>همه</option>
              {dams.map((dam) => (
                <option key={dam.id}>{dam.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">بازه تاریخ (نمایشی)</label>
            <input
              type="date"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th className="px-4 py-3 text-right">زمان</th>
                <th className="px-4 py-3 text-right">سد</th>
                <th className="px-4 py-3 text-right">سطح</th>
                <th className="px-4 py-3 text-right">پیام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-200">{alert.timestamp}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{alert.damName}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${levelColors[alert.level]}`}>{alert.level}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-100">{alert.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">نمودار تعداد هشدارها</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
