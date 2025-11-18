import React from 'react';
import { useDashboardData } from '../context/DataContext';
import KpiCard from '../components/KpiCard';
import DataTable from '../components/DataTable';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const SemnanPage: React.FC = () => {
  const { dams, semnanAggregate, semnanMarkers, monthlyRainSemnan } = useDashboardData();
  const semnanDams = dams.filter((dam) => dam.province === 'سمنان');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">خلاصه وضعیت سدهای استان و بارش‌های اخیر</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">داشبورد استان سمنان</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="تعداد سدهای فعال" value={semnanDams.length} />
        <KpiCard label="ذخیره کل استان (میلیون مترمکعب)" value={semnanAggregate.totalStorage} />
        <KpiCard label="میانگین درصد پرشدگی" value={`${semnanAggregate.avgFill}%`} />
        <KpiCard label="هشدارهای فعال استان" value={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-900/70">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">نقشه استان سمنان – محل سدها</h3>
          <div className="relative mt-6 h-80 rounded-3xl bg-gradient-to-br from-slate-100 via-white to-sky-100 p-4 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
            {semnanMarkers.map((marker) => (
              <div
                key={marker.id}
                className="absolute flex flex-col items-end rounded-xl bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur dark:bg-slate-900/80"
                style={{ top: `${marker.top}%`, right: `${marker.right}%` }}
              >
                <span className="font-semibold text-slate-800 dark:text-white">{marker.name}</span>
                <span className="text-brand-600">{marker.fillPercent}%</span>
              </div>
            ))}
            <div className="absolute inset-6 rounded-3xl border-2 border-dashed border-sky-200 dark:border-slate-700"></div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">مقایسه درصد پرشدگی سدها</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semnanDams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} angle={-10} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="fillPercent" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">جدول سدهای استان سمنان</h3>
        <div className="mt-4">
          <DataTable
            keyField="id"
            columns={[
              { header: 'نام سد', accessor: 'name' },
              { header: 'تراز فعلی', accessor: 'currentWaterLevel' },
              { header: 'حجم ذخیره', accessor: 'storageVolumeMCM' },
              { header: 'درصد پرشدگی', accessor: (row) => `${row.fillPercent}%` },
              { header: 'دبی ورودی', accessor: 'inflow' },
              { header: 'دبی خروجی', accessor: 'outflow' },
              { header: 'وضعیت هشدار', accessor: 'status' }
            ]}
            data={semnanDams}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">بارش ماهانه ۱۲ ماه گذشته</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRainSemnan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rainfall" fill="#38bdf8" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SemnanPage;
