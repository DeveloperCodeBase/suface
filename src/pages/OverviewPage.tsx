import React, { useMemo, useState } from 'react';
import { useDashboardData } from '../context/DataContext';
import KpiCard from '../components/KpiCard';
import AlertsList from '../components/AlertsList';
import DataTable from '../components/DataTable';
import TimeSeriesChart from '../components/TimeSeriesChart';
import { FiActivity, FiDroplet, FiLayers, FiTrendingUp, FiZap } from 'react-icons/fi';

const OverviewPage: React.FC = () => {
  const { semnanMonthlyStorage, cumulativeRainfall, provinces, alerts, semnanAggregate, nationalTotals } = useDashboardData();
  const [metric, setMetric] = useState<'storage' | 'inflow' | 'outflow'>('storage');
  const metricLabels: Record<'storage' | 'inflow' | 'outflow', string> = {
    storage: 'ذخیره',
    inflow: 'دبی ورودی',
    outflow: 'دبی خروجی'
  };

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
        <h1 className="page-title mt-2 text-slate-900 dark:text-white">داشبورد کلان مدیریت منابع آب</h1>
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
              <h2 className="section-title text-slate-800 dark:text-white">روند ذخیره و دبی استان سمنان</h2>
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
          <TimeSeriesChart
            className="mt-4 h-72"
            data={semnanMonthlyStorage}
            xKey="month"
            lines={[
              {
                dataKey: metric,
                color: '#0ea5e9',
                type: 'area',
                name: metricLabels[metric]
              }
            ]}
            tooltipFormatter={(value) => value.toLocaleString()}
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-title text-slate-800 dark:text-white">بارش تجمعی استان</h2>
              <p className="text-xs text-slate-500">۱۲ ماه اخیر</p>
            </div>
          </div>
          <TimeSeriesChart
            className="mt-4 h-72"
            data={cumulativeRainfall}
            xKey="month"
            lines={[{ dataKey: 'rainfall', color: '#0284c7', name: 'بارش تجمعی' }]}
          />
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
