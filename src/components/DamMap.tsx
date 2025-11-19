import React, { useMemo, useState } from 'react';
import { MapViewConfig } from '../config/maps';
import { DamLocation } from '../config/dams';
import clsx from 'clsx';

interface DamMapProps {
  view: MapViewConfig;
  dams: DamLocation[];
  className?: string;
  highlightDamId?: string;
  onDamSelect?: (damId: string) => void;
  legendTitle?: string;
  mapHeight?: number;
}

const statusLabels: Record<string, string> = {
  operational: 'بهره‌برداری',
  under_construction: 'در دست ساخت',
  planned: 'مطالعاتی'
};

const statusColors: Record<string, string> = {
  operational: 'bg-emerald-400',
  under_construction: 'bg-amber-400',
  planned: 'bg-slate-400'
};

const DamMap: React.FC<DamMapProps> = ({
  view,
  dams,
  className,
  highlightDamId,
  onDamSelect,
  legendTitle,
  mapHeight = 320
}) => {
  const [internalDam, setInternalDam] = useState<string | null>(null);
  const damsWithCoords = useMemo(
    () => dams.filter((dam) => typeof dam.lat === 'number' && typeof dam.lng === 'number'),
    [dams]
  );

  const activeDamId = highlightDamId ?? internalDam ?? damsWithCoords[0]?.id;
  const activeDam = damsWithCoords.find((dam) => dam.id === activeDamId);

  const handleSelect = (damId: string) => {
    setInternalDam(damId);
    onDamSelect?.(damId);
  };

  const latSpan = view.bounds.lat[1] - view.bounds.lat[0];
  const lngSpan = view.bounds.lng[1] - view.bounds.lng[0];

  return (
    <div className={clsx('space-y-4', className)}>
      <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div>
            <p className="section-title text-slate-800 dark:text-white">{view.labelFa}</p>
            <p className="text-xs text-slate-500">مرکز: {view.center[0].toFixed(1)}°N / {view.center[1].toFixed(1)}°E</p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span>بزرگ‌نمایی مرجع: ×{view.zoom}</span>
          </div>
        </div>
        <div
          className="relative mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900"
          style={{ height: mapHeight }}
        >
          <div className="pointer-events-none absolute inset-6 rounded-[24px] border border-dashed border-slate-300/70 dark:border-slate-700/70"></div>
          <div className="absolute inset-0 opacity-40" aria-hidden>
            <svg viewBox="0 0 400 400" className="h-full w-full text-slate-300 dark:text-slate-700">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#grid)" />
            </svg>
          </div>
          {damsWithCoords.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center text-sm text-slate-500 dark:text-slate-300">
              داده مکانی برای این نما تکمیل نشده است
            </p>
          )}
          {damsWithCoords.map((dam) => {
            if (dam.lat == null || dam.lng == null) return null;
            const top = ((view.bounds.lat[1] - dam.lat) / latSpan) * 100;
            const left = ((dam.lng - view.bounds.lng[0]) / lngSpan) * 100;
            const isActive = activeDamId === dam.id;
            return (
              <button
                key={dam.id}
                type="button"
                className={clsx(
                  'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white p-1.5 shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
                  isActive ? 'scale-110' : 'scale-95'
                )}
                style={{ top: `${top}%`, left: `${left}%` }}
                onClick={() => handleSelect(dam.id)}
                aria-label={dam.nameFa}
              >
                <span className={clsx('block h-4 w-4 rounded-full', statusColors[dam.status])}></span>
              </button>
            );
          })}
          {activeDam && (
            <div
              className="absolute left-4 top-4 max-w-xs rounded-2xl border border-white/40 bg-white/95 px-4 py-3 text-xs shadow-xl backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/90"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{activeDam.nameFa}</p>
              <p className="text-slate-500 dark:text-slate-300">{activeDam.provinceFa + (activeDam.countyFa ? ` – ${activeDam.countyFa}` : '')}</p>
              {typeof activeDam.capacityMcm === 'number' && (
                <p className="mt-1 text-slate-600 dark:text-slate-200">
                  ظرفیت مفید: {activeDam.capacityMcm?.toLocaleString('fa-IR')} میلیون مترمکعب
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1">
                {activeDam.purposes.map((purpose) => (
                  <span key={purpose} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    {purpose}
                  </span>
                ))}
              </div>
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-200">
                <span className={clsx('h-2 w-2 rounded-full', statusColors[activeDam.status])}></span>
                {statusLabels[activeDam.status]}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <p className="font-semibold text-slate-800 dark:text-white">{legendTitle ?? 'وضعیت سدها'}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
          {Object.entries(statusLabels).map(([status, label]) => (
            <span key={status} className="inline-flex items-center gap-2">
              <span className={clsx('h-2.5 w-2.5 rounded-full', statusColors[status])}></span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DamMap;
