import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import { MapViewConfig } from '../config/maps';
import { DamLocation } from '../config/dams';

interface DamMapProps {
  view: MapViewConfig;
  dams: DamLocation[];
  className?: string;
  highlightDamId?: string;
  onDamSelect?: (damId: string) => void;
  legendTitle?: string;
  mapHeight?: number;
}

const statusLabels: Record<DamLocation['status'], string> = {
  operational: 'بهره‌برداری',
  under_construction: 'در دست ساخت',
  planned: 'مطالعاتی'
};

const statusColors: Record<DamLocation['status'], { stroke: string; fill: string }> = {
  operational: { stroke: '#0f766e', fill: '#34d399' },
  under_construction: { stroke: '#d97706', fill: '#facc15' },
  planned: { stroke: '#475569', fill: '#cbd5f5' }
};

const MapViewSync: React.FC<{ view: MapViewConfig }> = ({ view }) => {
  const map = useMap();
  React.useEffect(() => {
    const minZoom = view.minZoom ?? 4;
    const maxZoom = view.maxZoom ?? 18;
    map.setView(view.center, view.zoom, { animate: true });
    map.setMinZoom(minZoom);
    map.setMaxZoom(maxZoom);
  }, [map, view]);
  return null;
};

const ActiveDamFocus: React.FC<{ dam?: DamLocation; fallbackZoom: number }> = ({ dam, fallbackZoom }) => {
  const map = useMap();
  React.useEffect(() => {
    if (dam?.lat != null && dam?.lng != null) {
      map.flyTo([dam.lat, dam.lng], Math.max(fallbackZoom, 8), { duration: 0.6 });
    }
  }, [dam, fallbackZoom, map]);
  return null;
};

const DamMap: React.FC<DamMapProps> = ({
  view,
  dams,
  className,
  highlightDamId,
  onDamSelect,
  legendTitle,
  mapHeight = 360
}) => {
  const [internalDam, setInternalDam] = useState<string | null>(null);
  const damsWithCoords = useMemo(() => dams.filter((dam) => typeof dam.lat === 'number' && typeof dam.lng === 'number'), [dams]);
  const damsMissingCoords = useMemo(() => dams.filter((dam) => dam.lat == null || dam.lng == null), [dams]);
  const activeDamId = highlightDamId ?? internalDam ?? damsWithCoords[0]?.id;
  const activeDam = damsWithCoords.find((dam) => dam.id === activeDamId);
  const minZoom = view.minZoom ?? 4;
  const maxZoom = view.maxZoom ?? 18;
  const bounds = useMemo<LatLngBoundsExpression>(
    () => [
      [view.bounds.lat[0], view.bounds.lng[0]],
      [view.bounds.lat[1], view.bounds.lng[1]]
    ],
    [view]
  );

  const handleSelect = (damId: string) => {
    setInternalDam(damId);
    onDamSelect?.(damId);
  };

  return (
    <div className={clsx('space-y-4 w-full', className)}>
      <div className="rounded-[32px] border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div>
            <p className="section-title text-slate-800 dark:text-white">{view.labelFa}</p>
            <p className="text-xs text-slate-500">
              مرکز: {view.center[0].toFixed(1)}°N / {view.center[1].toFixed(1)}°E
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-300">بزرگ‌نمایی مرجع ×{view.zoom}</p>
        </div>
        <div className="relative mt-4 overflow-hidden rounded-[28px]" style={{ height: mapHeight }}>
          <MapContainer
            key={view.id}
            center={view.center}
            zoom={view.zoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            zoomControl={false}
            scrollWheelZoom
            bounds={bounds}
            maxBounds={bounds}
            maxBoundsViscosity={0.6}
            className="h-full w-full"
          >
            <MapViewSync view={view} />
            <ActiveDamFocus dam={activeDam} fallbackZoom={view.zoom} />
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
              maxNativeZoom={19}
            />
            <ZoomControl position="topleft" />
            {damsWithCoords.map((dam) => {
              if (dam.lat == null || dam.lng == null) return null;
              const isActive = activeDamId === dam.id;
              const palette = statusColors[dam.status];
              return (
                <CircleMarker
                  key={dam.id}
                  center={[dam.lat, dam.lng]}
                  pathOptions={{
                    color: palette.stroke,
                    fillColor: palette.fill,
                    weight: isActive ? 4 : 2,
                    fillOpacity: 0.85
                  }}
                  radius={isActive ? 12 : 9}
                  eventHandlers={{
                    click: () => handleSelect(dam.id)
                  }}
                >
                  <Popup>
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold">{dam.nameFa}</p>
                      <p className="text-slate-500">
                        {dam.provinceFa}
                        {dam.countyFa ? ` – ${dam.countyFa}` : ''}
                      </p>
                      {typeof dam.capacityMcm === 'number' && (
                        <p>ظرفیت مفید: {dam.capacityMcm.toLocaleString('fa-IR')} میلیون مترمکعب</p>
                      )}
                      <p className="text-xs">وضعیت: {statusLabels[dam.status]}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
          {!damsWithCoords.length && (
            <p className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-slate-500 dark:bg-slate-900/70 dark:text-slate-300">
              داده مکانی برای این نما موجود نیست.
            </p>
          )}
        </div>
        {activeDam && (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-sm shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <p className="font-semibold text-slate-900 dark:text-white">{activeDam.nameFa}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              {activeDam.provinceFa}
              {activeDam.countyFa ? ` – ${activeDam.countyFa}` : ''}
            </p>
            {activeDam.purposes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-slate-600 dark:text-slate-200">
                {activeDam.purposes.map((purpose) => (
                  <span key={purpose} className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                    {purpose}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <p className="font-semibold text-slate-800 dark:text-white">{legendTitle ?? 'وضعیت سدها'}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
          {Object.entries(statusLabels).map(([status, label]) => (
            <span key={status} className="inline-flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: statusColors[status as DamLocation['status']].fill }}
              ></span>
              {label}
            </span>
          ))}
        </div>
        {damsMissingCoords.length > 0 && (
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            مختصات دقیق {damsMissingCoords.length} سد هنوز تکمیل نشده است: {damsMissingCoords.map((dam) => dam.nameFa).join('، ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default DamMap;
