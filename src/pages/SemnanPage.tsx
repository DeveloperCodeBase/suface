import React, { useState } from 'react';
import { useDashboardData } from '../context/DataContext';
import KpiCard from '../components/KpiCard';
import DataTable from '../components/DataTable';
import BarChartCard from '../components/BarChartCard';
import DamMap from '../components/DamMap';
import RainfallChart from '../components/RainfallChart';
import { SEMNAN_DAMS } from '../config/dams';
import { SEMNAN_VIEW } from '../config/maps';
import { formatToJalaliMonth } from '../utils/jalali';

const SemnanPage: React.FC = () => {
  const { dams, semnanAggregate, monthlyRainSemnan } = useDashboardData();
  const semnanDams = dams.filter((dam) => dam.province === 'سمنان');
  const [activeMapDam, setActiveMapDam] = useState<string | undefined>(SEMNAN_DAMS[0]?.id);
  const rainfallSeries = monthlyRainSemnan.map((item) => ({
    month: formatToJalaliMonth(item.month),
    mm: item.rainfall
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">خلاصه وضعیت سدهای استان و بارش‌های اخیر</p>
        <h1 className="page-title mt-2 text-slate-900 dark:text-white">داشبورد استان سمنان</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="تعداد سدهای فعال" value={semnanDams.length} />
        <KpiCard label="ذخیره کل استان (میلیون مترمکعب)" value={semnanAggregate.totalStorage} />
        <KpiCard label="میانگین درصد پرشدگی" value={`${semnanAggregate.avgFill}%`} />
        <KpiCard label="هشدارهای فعال استان" value={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <DamMap
          className="min-w-0"
          view={SEMNAN_VIEW}
          dams={SEMNAN_DAMS}
          highlightDamId={activeMapDam}
          onDamSelect={setActiveMapDam}
          legendTitle="کاربری و وضعیت سدهای استان"
          mapHeight="clamp(320px, 55vh, 620px)"
        />
        <div className="space-y-6 min-w-0">
          <BarChartCard
            title="مقایسه درصد پرشدگی سدها"
            data={semnanDams}
            xKey="name"
            height="clamp(220px, 35vh, 360px)"
            xAxisProps={{ interval: 0, angle: -10, textAnchor: 'end', height: 80 }}
            bars={[{ dataKey: 'fillPercent', color: '#0ea5e9', name: 'درصد پرشدگی' }]}
          />
          <BarChartCard
            title="حجم ذخیره سدهای استان"
            data={semnanDams}
            xKey="name"
            height="clamp(220px, 35vh, 360px)"
            xAxisProps={{ interval: 0, angle: -10, textAnchor: 'end', height: 70 }}
            tooltipFormatter={(value) => `${value} میلیون مترمکعب`}
            bars={[{ dataKey: 'storageVolumeMCM', color: '#14b8a6', name: 'حجم ذخیره' }]}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="section-title text-slate-800 dark:text-white">جدول سدهای استان سمنان</h3>
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
        <RainfallChart data={rainfallSeries} title="بارش ماهانه ۱۲ ماه گذشته (سناریوی نمونه)" />
      </div>
    </div>
  );
};

export default SemnanPage;
