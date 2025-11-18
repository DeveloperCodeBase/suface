import React from 'react';
import { IconType } from 'react-icons';

interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  trend?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, sublabel, icon, trend }) => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className="text-3xl text-brand-500">{icon}</div>
      </div>
      {sublabel && <p className="mt-2 text-xs text-slate-400">{sublabel}</p>}
      {trend && <span className="mt-2 text-xs font-semibold text-emerald-500">{trend}</span>}
    </div>
  );
};

export default KpiCard;
