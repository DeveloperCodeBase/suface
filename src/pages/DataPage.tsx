import React, { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useDashboardData } from '../context/DataContext';
import { dayjs, formatToJalali } from '../utils/jalali';

const columnsConfig = [
  { key: 'date', label: 'تاریخ' },
  { key: 'inflow', label: 'دبی ورودی' },
  { key: 'outflow', label: 'دبی خروجی' },
  { key: 'waterLevel', label: 'تراز' },
  { key: 'rainfall', label: 'بارش' },
  { key: 'evaporation', label: 'تبخیر' }
];

type MetricKey = 'inflow' | 'outflow' | 'level';

const pickerInputClass =
  'w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900';

const buildDateObject = (iso: string) =>
  iso ? new DateObject({ date: dayjs(iso).toDate(), calendar: persian, locale: persian_fa }) : null;

const DataPage: React.FC = () => {
  const { dams, damSeries } = useDashboardData();
  const [selectedDam, setSelectedDam] = useState(dams[0]?.id ?? '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startPicker, setStartPicker] = useState<DateObject | null>(null);
  const [endPicker, setEndPicker] = useState<DateObject | null>(null);
  const [visibleColumns, setVisibleColumns] = useState(columnsConfig.map((col) => col.key));

  useEffect(() => {
    const series = damSeries[selectedDam] ?? [];
    if (series.length) {
      const firstDate = series[0].date;
      const lastDate = series[series.length - 1].date;
      setStartDate(firstDate);
      setEndDate(lastDate);
      setStartPicker(buildDateObject(firstDate));
      setEndPicker(buildDateObject(lastDate));
    }
  }, [damSeries, selectedDam]);

  const rangeError = useMemo(() => {
    if (!startDate || !endDate) return false;
    return dayjs(startDate).valueOf() > dayjs(endDate).valueOf();
  }, [startDate, endDate]);

  const records = useMemo(() => {
    const series = damSeries[selectedDam] ?? [];
    if (rangeError) {
      return [];
    }
    return series.filter((record) => {
      const recordDate = dayjs(record.date).valueOf();
      const afterStart = startDate ? recordDate >= dayjs(startDate).valueOf() : true;
      const beforeEnd = endDate ? recordDate <= dayjs(endDate).valueOf() : true;
      return afterStart && beforeEnd;
    });
  }, [damSeries, selectedDam, startDate, endDate, rangeError]);

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

  const handlePickerChange = (value: DateObject | null, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartPicker(value);
      setStartDate(value ? dayjs(value.toDate()).format('YYYY-MM-DD') : '');
    } else {
      setEndPicker(value);
      setEndDate(value ? dayjs(value.toDate()).format('YYYY-MM-DD') : '');
    }
  };

  const exportCsv = () => {
    const headers = columnsConfig.filter((col) => visibleColumns.includes(col.key)).map((col) => col.label);
    const rows = records.map((record) =>
      columnsConfig
        .filter((col) => visibleColumns.includes(col.key))
        .map((col) =>
          col.key === 'date'
            ? formatToJalali(record[col.key as keyof typeof record] as string)
            : record[col.key as keyof typeof record]
        )
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
        <h1 className="page-title mt-2 text-slate-900 dark:text-white">داده‌ها و گزارش‌ها</h1>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0">
            <label className="text-xs text-slate-500">انتخاب سد</label>
            <select
              value={selectedDam}
              onChange={(e) => setSelectedDam(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900"
            >
              {dams.map((dam) => (
                <option key={dam.id} value={dam.id}>
                  {dam.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[11px] text-slate-400">داده‌ها هر ۸ ثانیه برای ایجاد حس زنده بودن به‌روزرسانی می‌شوند.</p>
          </div>
          <div className="min-w-0">
            <label className="text-xs text-slate-500">بازه تاریخ (تقویم جلالی)</label>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[11px] text-slate-400">از تاریخ</p>
                <DatePicker
                  value={startPicker}
                  onChange={(value) => handlePickerChange(value as DateObject | null, 'start')}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  calendarPosition="bottom-right"
                  inputClass={pickerInputClass}
                  containerClassName="w-full"
                />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">تا تاریخ</p>
                <DatePicker
                  value={endPicker}
                  onChange={(value) => handlePickerChange(value as DateObject | null, 'end')}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  calendarPosition="bottom-right"
                  inputClass={pickerInputClass}
                  containerClassName="w-full"
                />
              </div>
            </div>
            {rangeError && <p className="mt-2 text-[11px] text-rose-500">بازه انتخابی نامعتبر است.</p>}
          </div>
          <div className="min-w-0">
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
        <div className="w-full overflow-x-auto">
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
                        {col.key === 'date'
                          ? formatToJalali(record[col.key as keyof typeof record] as string)
                          : (record[col.key as keyof typeof record] as React.ReactNode)}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
