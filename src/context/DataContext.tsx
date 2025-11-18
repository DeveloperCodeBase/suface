import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  alerts as baseAlerts,
  AlertItem,
  calculateSemnanAggregate,
  cumulativeRainfall,
  damForecast,
  damSeries,
  dams as baseDams,
  Dam,
  monthlyRainSemnan,
  nationalTrend,
  provinces,
  ProvinceSummary,
  semnanDamMarkers,
  semnanMonthlyStorage
} from '../data/mockData';

interface DataContextValue {
  dams: Dam[];
  alerts: AlertItem[];
  provinces: ProvinceSummary[];
  damSeries: typeof damSeries;
  damForecast: typeof damForecast;
  semnanMonthlyStorage: typeof semnanMonthlyStorage;
  cumulativeRainfall: typeof cumulativeRainfall;
  monthlyRainSemnan: typeof monthlyRainSemnan;
  nationalTrend: typeof nationalTrend;
  semnanMarkers: typeof semnanDamMarkers;
  semnanAggregate: ReturnType<typeof calculateSemnanAggregate>;
  nationalTotals: {
    totalStorage: number;
    avgFill: number;
    totalAlerts: number;
    totalOutflowToday: number;
  };
}

const DashboardDataContext = createContext<DataContextValue | undefined>(undefined);

const computeNationalTotals = (damList: Dam[], alertList: AlertItem[]) => {
  const totalStorage = damList.reduce((sum, dam) => sum + dam.storageVolumeMCM, 0);
  const avgFill = damList.reduce((sum, dam) => sum + dam.fillPercent, 0) / damList.length;
  const totalOutflowToday = damList.reduce((sum, dam) => sum + dam.outflow, 0);
  return {
    totalStorage: Number(totalStorage.toFixed(0)),
    avgFill: Number(avgFill.toFixed(1)),
    totalAlerts: alertList.length,
    totalOutflowToday: Number(totalOutflowToday.toFixed(0))
  };
};

export const DataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [damState, setDamState] = useState<Dam[]>(baseDams);
  const [alertState, setAlertState] = useState<AlertItem[]>(baseAlerts);
  const damRef = useRef(damState);

  useEffect(() => {
    damRef.current = damState;
  }, [damState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDamState((prev) => {
        const updated = prev.map((dam) => {
          const nextFill = Math.min(100, Math.max(25, dam.fillPercent + (Math.random() - 0.5) * 2.5));
          const nextStorage = (nextFill / 100) * dam.capacityMCM;
          return {
            ...dam,
            fillPercent: Number(nextFill.toFixed(1)),
            storageVolumeMCM: Number(nextStorage.toFixed(1)),
            inflow: Number((dam.inflow + (Math.random() - 0.5) * 8).toFixed(1)),
            outflow: Number((dam.outflow + (Math.random() - 0.5) * 8).toFixed(1)),
            currentWaterLevel: Number((dam.currentWaterLevel + (Math.random() - 0.5) * 2).toFixed(1))
          };
        });
        damRef.current = updated;
        return updated;
      });

      setAlertState((prev) => {
        if (Math.random() > 0.7) {
          const dam = damRef.current[Math.floor(Math.random() * damRef.current.length)];
          const levelPool: AlertItem['level'][] = ['اطلاع', 'هشدار', 'بحرانی'];
          const newAlert: AlertItem = {
            id: `alert-${Date.now()}`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            damName: dam.name,
            level: levelPool[Math.floor(Math.random() * levelPool.length)],
            message: `${dam.name} - به‌روزرسانی خودکار شاخص‌های پایش`
          };
          return [newAlert, ...prev].slice(0, 25);
        }
        return prev;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const semnanAggregate = useMemo(() => {
    const base = calculateSemnanAggregate(damState);
    if (!Number.isFinite(base.avgFill)) {
      return { totalStorage: 0, avgFill: 0, inflowSum: 0, outflowSum: 0 };
    }
    return base;
  }, [damState]);

  const provinceRows = useMemo(() => {
    return provinces.map((row) =>
      row.province === 'سمنان'
        ? {
            ...row,
            storage: Number(semnanAggregate.totalStorage.toFixed(0)),
            fillPercent: Number(semnanAggregate.avgFill.toFixed(1)),
            alerts: alertState.filter((alert) => alert.damName.includes('سد کالپوش') || alert.damName.includes('سد دامغان')).length
          }
        : row
    );
  }, [semnanAggregate, alertState]);

  const nationalTotals = useMemo(() => computeNationalTotals(damState, alertState), [damState, alertState]);

  const value: DataContextValue = {
    dams: damState,
    alerts: alertState,
    provinces: provinceRows,
    damSeries,
    damForecast,
    semnanMonthlyStorage,
    cumulativeRainfall,
    monthlyRainSemnan,
    nationalTrend,
    semnanMarkers: semnanDamMarkers,
    semnanAggregate,
    nationalTotals
  };

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
};

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error('useDashboardData must be used within DataProvider');
  }
  return context;
};
