import dayjs from 'dayjs';

export type DamStatus = 'عادی' | 'هشدار' | 'بحرانی';

export interface Dam {
  id: string;
  name: string;
  province: string;
  basin: string;
  currentWaterLevel: number;
  storageVolumeMCM: number;
  capacityMCM: number;
  fillPercent: number;
  inflow: number;
  outflow: number;
  status: DamStatus;
}

export interface DamDailyRecord {
  date: string;
  inflow: number;
  outflow: number;
  waterLevel: number;
  rainfall: number;
  evaporation: number;
}

export interface DamForecastRecord {
  date: string;
  waterLevel: number;
  inflow: number;
  outflow: number;
}

export interface ProvinceSummary {
  province: string;
  storage: number;
  fillPercent: number;
  dams: number;
  alerts: number;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  damName: string;
  level: 'اطلاع' | 'هشدار' | 'بحرانی';
  message: string;
}

const damSeeds: Dam[] = [
  {
    id: 'kalpush',
    name: 'سد کالپوش',
    province: 'سمنان',
    basin: 'حوضه شمالی',
    currentWaterLevel: 1624,
    storageVolumeMCM: 320,
    capacityMCM: 420,
    fillPercent: 76,
    inflow: 145,
    outflow: 120,
    status: 'عادی'
  },
  {
    id: 'damghan',
    name: 'سد دامغان',
    province: 'سمنان',
    basin: 'حوضه مرکزی',
    currentWaterLevel: 1478,
    storageVolumeMCM: 190,
    capacityMCM: 270,
    fillPercent: 68,
    inflow: 96,
    outflow: 102,
    status: 'هشدار'
  },
  {
    id: 'lar',
    name: 'سد لار',
    province: 'تهران',
    basin: 'مازندران',
    currentWaterLevel: 2450,
    storageVolumeMCM: 720,
    capacityMCM: 960,
    fillPercent: 74,
    inflow: 210,
    outflow: 190,
    status: 'عادی'
  },
  {
    id: 'dezal',
    name: 'سد دز',
    province: 'خوزستان',
    basin: 'کارون',
    currentWaterLevel: 350,
    storageVolumeMCM: 2600,
    capacityMCM: 3400,
    fillPercent: 78,
    inflow: 420,
    outflow: 410,
    status: 'عادی'
  },
  {
    id: 'zayandeh',
    name: 'سد زاینده‌رود',
    province: 'اصفهان',
    basin: 'زاینده‌رود',
    currentWaterLevel: 2040,
    storageVolumeMCM: 640,
    capacityMCM: 1500,
    fillPercent: 43,
    inflow: 95,
    outflow: 120,
    status: 'هشدار'
  },
  {
    id: 'sepidrud',
    name: 'سد سفیدرود',
    province: 'گیلان',
    basin: 'سفیدرود',
    currentWaterLevel: 144,
    storageVolumeMCM: 830,
    capacityMCM: 1200,
    fillPercent: 69,
    inflow: 260,
    outflow: 230,
    status: 'عادی'
  }
];

const buildSeries = (baseLevel: number, baseInflow: number, baseOutflow: number): DamDailyRecord[] => {
  const days = 30;
  return Array.from({ length: days }).map((_, idx) => {
    const date = dayjs().subtract(days - idx, 'day');
    const drift = Math.sin(idx / 5) * 5;
    return {
      date: date.format('YYYY-MM-DD'),
      inflow: Number((baseInflow + drift + (Math.random() - 0.5) * 10).toFixed(1)),
      outflow: Number((baseOutflow + Math.cos(idx / 6) * 4 + (Math.random() - 0.5) * 8).toFixed(1)),
      waterLevel: Number((baseLevel + drift * 1.2 + (Math.random() - 0.5) * 6).toFixed(1)),
      rainfall: Number((Math.random() * 14).toFixed(1)),
      evaporation: Number((Math.random() * 8).toFixed(1))
    };
  });
};

const buildForecast = (baseLevel: number, baseInflow: number, baseOutflow: number): DamForecastRecord[] => {
  return Array.from({ length: 7 }).map((_, idx) => {
    const date = dayjs().add(idx + 1, 'day');
    return {
      date: date.format('YYYY-MM-DD'),
      waterLevel: Number((baseLevel + idx * (Math.random() * 2 - 1)).toFixed(1)),
      inflow: Number((baseInflow + (Math.random() - 0.5) * 15).toFixed(1)),
      outflow: Number((baseOutflow + (Math.random() - 0.5) * 15).toFixed(1))
    };
  });
};

export const dams: Dam[] = damSeeds;

export const damSeries: Record<string, DamDailyRecord[]> = dams.reduce((acc, dam) => {
  acc[dam.id] = buildSeries(dam.currentWaterLevel, dam.inflow, dam.outflow);
  return acc;
}, {} as Record<string, DamDailyRecord[]>);

export const damForecast: Record<string, DamForecastRecord[]> = dams.reduce((acc, dam) => {
  acc[dam.id] = buildForecast(dam.currentWaterLevel, dam.inflow, dam.outflow);
  return acc;
}, {} as Record<string, DamForecastRecord[]>);

export const semnanMonthlyStorage = Array.from({ length: 12 }).map((_, idx) => {
  const month = dayjs().subtract(11 - idx, 'month');
  const storage = 500 + Math.sin(idx / 2) * 60 + Math.random() * 20;
  const inflow = 180 + Math.cos(idx / 2) * 30;
  const outflow = 150 + Math.sin(idx / 3) * 20;
  return {
    month: month.format('YYYY-MM'),
    storage: Number(storage.toFixed(0)),
    inflow: Number(inflow.toFixed(0)),
    outflow: Number(outflow.toFixed(0))
  };
});

export const cumulativeRainfall = Array.from({ length: 12 }).map((_, idx) => {
  const month = dayjs().subtract(11 - idx, 'month');
  return {
    month: month.format('YYYY-MM'),
    rainfall: Number((200 + idx * 8 + Math.random() * 15).toFixed(0))
  };
});

export const provinces: ProvinceSummary[] = [
  { province: 'سمنان', storage: 510, fillPercent: 71, dams: 5, alerts: 3 },
  { province: 'تهران', storage: 820, fillPercent: 68, dams: 6, alerts: 2 },
  { province: 'خوزستان', storage: 4100, fillPercent: 82, dams: 12, alerts: 4 },
  { province: 'گیلان', storage: 980, fillPercent: 65, dams: 4, alerts: 1 },
  { province: 'اصفهان', storage: 640, fillPercent: 45, dams: 3, alerts: 2 },
  { province: 'فارس', storage: 760, fillPercent: 58, dams: 4, alerts: 1 },
  { province: 'کرمانشاه', storage: 430, fillPercent: 61, dams: 3, alerts: 0 }
];

export const nationalTrend = Array.from({ length: 5 }).map((_, idx) => {
  const year = dayjs().subtract(4 - idx, 'year').format('YYYY');
  return {
    year,
    storage: 18000 + idx * 450 - Math.random() * 300
  };
});

export const monthlyRainSemnan = Array.from({ length: 12 }).map((_, idx) => {
  const month = dayjs().subtract(11 - idx, 'month');
  return {
    month: month.format('MMM'),
    rainfall: Number((25 + Math.random() * 20).toFixed(1))
  };
});

export const alerts: AlertItem[] = [
  {
    id: 'a1',
    timestamp: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm'),
    damName: 'سد کالپوش',
    level: 'هشدار',
    message: 'افزایش دبی ورودی سد کالپوش بالاتر از حد معمول'
  },
  {
    id: 'a2',
    timestamp: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm'),
    damName: 'سد دامغان',
    level: 'بحرانی',
    message: 'کاهش تراز مخزن سد دامغان به زیر آستانه برنامه‌ریزی'
  },
  {
    id: 'a3',
    timestamp: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    damName: 'سد زاینده‌رود',
    level: 'هشدار',
    message: 'افزایش برداشت پایین‌دست سد زاینده‌رود'
  },
  {
    id: 'a4',
    timestamp: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm'),
    damName: 'سد لار',
    level: 'اطلاع',
    message: 'ورود موج بارشی به حوضه سد لار طی ۴۸ ساعت آینده'
  },
  {
    id: 'a5',
    timestamp: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm'),
    damName: 'سد دز',
    level: 'اطلاع',
    message: 'برنامه تعمیرات توربین سد دز'
  }
];

export const calculateSemnanAggregate = (damList: Dam[]) => {
  const semnanDams = damList.filter((dam) => dam.province === 'سمنان');
  const totalStorage = semnanDams.reduce((sum, dam) => sum + dam.storageVolumeMCM, 0);
  const avgFill = semnanDams.reduce((sum, dam) => sum + dam.fillPercent, 0) / semnanDams.length;
  const inflowSum = semnanDams.reduce((sum, dam) => sum + dam.inflow, 0);
  const outflowSum = semnanDams.reduce((sum, dam) => sum + dam.outflow, 0);
  return {
    totalStorage: Number(totalStorage.toFixed(1)),
    avgFill: Number(avgFill.toFixed(1)),
    inflowSum: Number(inflowSum.toFixed(1)),
    outflowSum: Number(outflowSum.toFixed(1))
  };
};

export const nationalKpis = () => {
  const totalStorage = dams.reduce((sum, dam) => sum + dam.storageVolumeMCM, 0);
  const avgFill = dams.reduce((sum, dam) => sum + dam.fillPercent, 0) / dams.length;
  const totalAlerts = alerts.length;
  const totalOutflowToday = dams.reduce((sum, dam) => sum + dam.outflow, 0);
  return {
    totalStorage: Number(totalStorage.toFixed(0)),
    avgFill: Number(avgFill.toFixed(1)),
    totalAlerts,
    totalOutflowToday: Number(totalOutflowToday.toFixed(0))
  };
};

