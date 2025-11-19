import React from 'react';
import { AlertItem } from '../data/mockData';
import { FiAlertCircle } from 'react-icons/fi';
import { formatToJalaliDateTime } from '../utils/jalali';

interface AlertsListProps {
  alerts: AlertItem[];
  title?: string;
  limit?: number;
}

const levelColors: Record<AlertItem['level'], string> = {
  اطلاع: 'bg-sky-100 text-sky-700',
  هشدار: 'bg-amber-100 text-amber-700',
  بحرانی: 'bg-rose-100 text-rose-700'
};

const AlertsList: React.FC<AlertsListProps> = ({ alerts, title = 'هشدارهای اخیر', limit = 5 }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-100">
        <FiAlertCircle className="text-lg text-rose-500" />
        <span>{title}</span>
      </div>
      <div className="space-y-4">
        {alerts.slice(0, limit).map((alert) => (
          <div key={alert.id} className="rounded-xl border border-slate-100 p-3 text-xs dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${levelColors[alert.level]}`}>
                {alert.level}
              </span>
              <span className="text-slate-400">{formatToJalaliDateTime(alert.timestamp)}</span>
            </div>
            <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">{alert.damName}</p>
            <p className="mt-1 text-slate-500 dark:text-slate-300">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsList;
