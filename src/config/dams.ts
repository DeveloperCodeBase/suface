export type DamStatus = 'operational' | 'under_construction' | 'planned';

export interface DamLocation {
  id: string;
  nameFa: string;
  nameEn?: string;
  provinceFa: string;
  countyFa?: string;
  status: DamStatus;
  purposes: string[];
  capacityMcm?: number | null;
  lat?: number | null;
  lng?: number | null;
}

export const SEMNAN_DAMS: DamLocation[] = [
  {
    id: 'eyvanaki',
    nameFa: 'سد ایوانکی',
    nameEn: 'Eyvanaki Dam',
    provinceFa: 'سمنان',
    countyFa: 'گرمسار / ایوانکی',
    status: 'operational',
    purposes: ['irrigation', 'local_supply'],
    capacityMcm: null,
    lat: 35.34,
    lng: 52.09
  },
  {
    id: 'beyarjomand',
    nameFa: 'سد بیارجمند',
    nameEn: 'Beyarjomand Dam',
    provinceFa: 'سمنان',
    countyFa: 'شاهرود / بیارجمند',
    status: 'planned',
    purposes: ['irrigation'],
    capacityMcm: null,
    lat: 35.28,
    lng: 55.0
  },
  {
    id: 'tuyeh-darvar',
    nameFa: 'سد تویه‌دروار',
    nameEn: 'Tuyeh Darvar Dam',
    provinceFa: 'سمنان',
    countyFa: 'دامغان',
    status: 'planned',
    purposes: ['irrigation', 'flood_control'],
    capacityMcm: null,
    lat: 36.04,
    lng: 54.46
  },
  {
    id: 'chashm',
    nameFa: 'سد چاشم',
    nameEn: 'Chashm Dam',
    provinceFa: 'سمنان',
    countyFa: 'مهدیشهر',
    status: 'planned',
    purposes: ['irrigation', 'drinking'],
    capacityMcm: null,
    lat: 35.87,
    lng: 54.05
  },
  {
    id: 'damghan',
    nameFa: 'سد دامغان (آستانه)',
    nameEn: 'Damghan (Astaneh) Dam',
    provinceFa: 'سمنان',
    countyFa: 'دامغان',
    status: 'operational',
    purposes: ['drinking', 'irrigation', 'flood_control'],
    capacityMcm: 21,
    lat: 36.17,
    lng: 54.34
  },
  {
    id: 'shahid-safa',
    nameFa: 'سد شهید صفا',
    provinceFa: 'سمنان',
    countyFa: 'شاهرود',
    status: 'planned',
    purposes: ['irrigation'],
    capacityMcm: null,
    lat: 35.68,
    lng: 54.6
  },
  {
    id: 'majan',
    nameFa: 'سد مجن',
    nameEn: 'Majan Dam',
    provinceFa: 'سمنان',
    countyFa: 'شاهرود / مجن',
    status: 'operational',
    purposes: ['irrigation', 'local_supply'],
    capacityMcm: 1.65,
    lat: 36.43,
    lng: 55.02
  },
  {
    id: 'shahid-shahcheraghi',
    nameFa: 'سد شهید شاهچراغی',
    nameEn: 'Shahid Shahcheraghi Dam',
    provinceFa: 'سمنان',
    countyFa: 'دامغان',
    status: 'operational',
    purposes: ['irrigation', 'flood_control', 'recreation'],
    capacityMcm: 40,
    lat: 35.23,
    lng: 54.37
  },
  {
    id: 'kalpush',
    nameFa: 'سد کالپوش',
    nameEn: 'Kalpush Dam',
    provinceFa: 'سمنان',
    countyFa: 'میامی / حسین‌آباد کالپوش',
    status: 'under_construction',
    purposes: ['irrigation', 'flood_control'],
    capacityMcm: 16.5,
    lat: 37.1667,
    lng: 55.75
  },
  {
    id: 'finsak',
    nameFa: 'سد فینسک',
    nameEn: 'Finsak Dam',
    provinceFa: 'سمنان',
    countyFa: 'مهدیشهر',
    status: 'planned',
    purposes: ['drinking'],
    capacityMcm: 11.78,
    lat: 35.98,
    lng: 53.92
  }
];

export const NATIONAL_DAMS: DamLocation[] = [
  {
    id: 'karun-3',
    nameFa: 'سد کارون ۳',
    nameEn: 'Karun-3 Dam',
    provinceFa: 'خوزستان',
    status: 'operational',
    purposes: ['hydropower', 'flood_control'],
    capacityMcm: 2950,
    lat: 31.65,
    lng: 50.12
  },
  {
    id: 'karkheh',
    nameFa: 'سد کرخه',
    nameEn: 'Karkheh Dam',
    provinceFa: 'خوزستان',
    status: 'operational',
    purposes: ['hydropower', 'irrigation', 'flood_control'],
    capacityMcm: 7800,
    lat: 32.75,
    lng: 47.6
  },
  {
    id: 'dez',
    nameFa: 'سد دز',
    nameEn: 'Dez Dam',
    provinceFa: 'خوزستان',
    status: 'operational',
    purposes: ['hydropower', 'irrigation'],
    capacityMcm: 3300,
    lat: 32.58,
    lng: 48.48
  },
  {
    id: 'amir-kabir',
    nameFa: 'سد امیرکبیر (کرج)',
    nameEn: 'Amirkabir (Karaj) Dam',
    provinceFa: 'البرز',
    status: 'operational',
    purposes: ['drinking', 'hydropower'],
    capacityMcm: 202,
    lat: 35.97,
    lng: 51.17
  },
  {
    id: 'lar',
    nameFa: 'سد لار',
    nameEn: 'Lar Dam',
    provinceFa: 'تهران',
    status: 'operational',
    purposes: ['drinking', 'hydropower'],
    capacityMcm: 960,
    lat: 35.91,
    lng: 52.08
  },
  {
    id: 'latian',
    nameFa: 'سد لتیان',
    nameEn: 'Latian Dam',
    provinceFa: 'تهران',
    status: 'operational',
    purposes: ['drinking', 'local_supply'],
    capacityMcm: 95,
    lat: 35.75,
    lng: 51.88
  },
  {
    id: 'zayandeh',
    nameFa: 'سد زاینده‌رود',
    nameEn: 'Zayandeh-Rud Dam',
    provinceFa: 'اصفهان',
    status: 'operational',
    purposes: ['drinking', 'irrigation'],
    capacityMcm: 1475,
    lat: 32.7,
    lng: 51.87
  },
  {
    id: 'sefidrud',
    nameFa: 'سد سفیدرود (منجیل)',
    nameEn: 'Sefidrud (Manjil) Dam',
    provinceFa: 'گیلان',
    status: 'operational',
    purposes: ['irrigation', 'hydropower', 'flood_control'],
    capacityMcm: 1780,
    lat: 36.82,
    lng: 49.52
  }
];

export const ALL_DAMS: DamLocation[] = Array.from(
  new Map(
    [...SEMNAN_DAMS, ...NATIONAL_DAMS].map((dam) => [dam.id, dam])
  ).values()
);
