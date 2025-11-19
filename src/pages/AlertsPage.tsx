import React, { useEffect, useMemo, useState } from 'react';
import { useDashboardData } from '../context/DataContext';
import BarChartCard from '../components/BarChartCard';
import { AlertSeverity } from '../config/alerts';
import { ALL_DAMS, NATIONAL_DAMS, SEMNAN_DAMS } from '../config/dams';
import DamMap from '../components/DamMap';
import { IRAN_VIEW, SEMNAN_VIEW } from '../config/maps';
import { dayjs } from '../utils/jalali';

const severityTokens: Record<AlertSeverity, { label: string; className: string }> = {
  info: { label: 'اطلاع', className: 'bg-sky-100 text-sky-700' },
  warning: { label: 'هشدار', className: 'bg-amber-100 text-amber-700' },
  critical: { label: 'بحرانی', className: 'bg-rose-100 text-rose-700' }
};

const AlertsPage: React.FC = () => {
  const { alerts: liveAlerts, structuredAlerts } = useDashboardData();
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [regionFilter, setRegionFilter] = useState<'all' | 'iran' | 'semnan'>('all');
  const [damFilter, setDamFilter] = useState<'all' | string>('all');
  const [selectedAlertId, setSelectedAlertId] = useState<string | undefined>(structuredAlerts[0]?.id);

  const filteredStructured = useMemo(() => {
    return structuredAlerts.filter((alert) => {
      const severityOk = severityFilter === 'all' || alert.severity === severityFilter;
      const regionOk = regionFilter === 'all' || alert.regionId === regionFilter;
      const damOk = damFilter === 'all' || alert.damId === damFilter;
      return severityOk && regionOk && damOk;
    });
  }, [structuredAlerts, severityFilter, regionFilter, damFilter]);

  useEffect(() => {
    if (!filteredStructured.length) {
      setSelectedAlertId(undefined);
      return;
    }
    const exists = filteredStructured.some((alert) => alert.id === selectedAlertId);
    if (!exists) {
      setSelectedAlertId(filteredStructured[0]?.id);
    }
  }, [filteredStructured, selectedAlertId]);

  const selectedAlert = filteredStructured.find((alert) => alert.id === selectedAlertId) ?? filteredStructured[0];
  const selectedDam = selectedAlert?.damId ? ALL_DAMS.find((dam) => dam.id === selectedAlert.damId) : undefined;
  const detailView = selectedDam?.provinceFa === 'سمنان' || selectedAlert?.regionId === 'semnan' ? SEMNAN_VIEW : IRAN_VIEW;
  const detailDams = detailView.id === 'semnan' ? SEMNAN_DAMS : NATIONAL_DAMS;

  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    liveAlerts.forEach((alert) => {
      const date = alert.timestamp.split(' ')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort((a, b) => dayjs(a[0]).valueOf() - dayjs(b[0]).valueOf())
      .map(([date, count]) => ({ date, count }));
  }, [liveAlerts]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">مدیریت و پایش هشدارهای عملیاتی</p>
        <h1 className="page-title mt-2 text-slate-900 dark:text-white">مرکز هشدارها</h1>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid gap-4 lg:grid-cols-4">
          <div>
            <label className="text-xs text-slate-500">سطح هشدار</label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as 'all' | AlertSeverity)}
            >
              <option value="all">همه</option>
              <option value="info">اطلاع</option>
              <option value="warning">هشدار</option>
              <option value="critical">بحرانی</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">منطقه</label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value as 'all' | 'iran' | 'semnan')}
            >
              <option value="all">همه</option>
              <option value="iran">ملی</option>
              <option value="semnan">استان سمنان</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">سد مرتبط</label>
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              value={damFilter}
              onChange={(e) => setDamFilter(e.target.value)}
            >
              <option value="all">همه سدها</option>
              {ALL_DAMS.map((dam) => (
                <option key={dam.id} value={dam.id}>
                  {dam.nameFa}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">راهنمای استفاده</label>
            <div className="mt-2 rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-xs leading-6 text-slate-500 dark:border-slate-700 dark:text-slate-300">
              انتخاب هر هشدار جزئیات کامل، توصیه عملیاتی و وضعیت مکانی آن را در پانل کنار نمایش می‌دهد.
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
              <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th className="px-4 py-3 text-right">عنوان</th>
                  <th className="px-4 py-3 text-right">منطقه / سد</th>
                  <th className="px-4 py-3 text-right">سطح</th>
                  <th className="px-4 py-3 text-right">خلاصه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStructured.map((alert) => (
                  <tr
                    key={alert.id}
                    className={`cursor-pointer transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                      alert.id === selectedAlert?.id ? 'bg-brand-50/70 dark:bg-brand-500/10' : ''
                    }`}
                    onClick={() => setSelectedAlertId(alert.id)}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{alert.titleFa}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-200">
                      {alert.damId ? ALL_DAMS.find((dam) => dam.id === alert.damId)?.nameFa ?? '—' : alert.regionId === 'semnan' ? 'استان سمنان' : 'نمای ملی'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityTokens[alert.severity].className}`}>
                        {severityTokens[alert.severity].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-100">{alert.summaryFa}</td>
                  </tr>
                ))}
                {!filteredStructured.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                      هشداری با فیلتر فعلی یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900/70">
          {selectedAlert ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="section-title text-slate-900 dark:text-white">{selectedAlert.titleFa}</h3>
                  <p className="text-xs text-slate-500">{selectedDam ? selectedDam.nameFa : selectedAlert.regionId === 'semnan' ? 'استان سمنان' : 'سطح ملی'}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityTokens[selectedAlert.severity].className}`}>
                  {severityTokens[selectedAlert.severity].label}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3 text-xs leading-6 text-slate-600 dark:bg-slate-800/80 dark:text-slate-200">
                {selectedAlert.summaryFa}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-100">{selectedAlert.descriptionFa}</p>
              <div>
                <p className="text-xs font-semibold text-slate-500">اقدامات پیشنهادی</p>
                <ul className="mt-2 list-decimal space-y-1 pr-5 text-sm text-slate-700 dark:text-slate-100">
                  {selectedAlert.recommendationsFa
                    .split('\n')
                    .filter(Boolean)
                    .map((line, idx) => (
                      <li key={idx}>{line.replace(/^\d+[\)\.\s]*/, '').trim()}</li>
                    ))}
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                <span className={`rounded-full px-3 py-1 ${selectedAlert.isRealData ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                  {selectedAlert.isRealData ? 'داده واقعی / گزارش رسمی' : 'سناریوی نمونه / داده فرضی'}
                </span>
                {selectedDam && selectedDam.capacityMcm && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    ظرفیت مفید ≈ {selectedDam.capacityMcm} میلیون مترمکعب
                  </span>
                )}
              </div>
              <DamMap
                view={detailView}
                dams={detailDams}
                highlightDamId={selectedDam?.id}
                mapHeight="clamp(220px, 40vh, 360px)"
                legendTitle="نمای مکانی هشدار"
              />
            </div>
          ) : (
            <p className="text-sm text-slate-500">هشداری برای نمایش موجود نیست.</p>
          )}
        </div>
      </div>

      <BarChartCard
        title="نمودار تعداد هشدارها"
        data={chartData}
        xKey="date"
        height="clamp(220px, 35vh, 360px)"
        bars={[{ dataKey: 'count', color: '#f97316', name: 'تعداد هشدار' }]}
        yAxisProps={{ allowDecimals: false }}
      />
    </div>
  );
};

export default AlertsPage;
