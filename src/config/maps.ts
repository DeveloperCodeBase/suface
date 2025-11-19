export interface MapViewConfig {
  id: string;
  labelFa: string;
  center: [number, number];
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  bounds: {
    lat: [number, number];
    lng: [number, number];
  };
}

export const IRAN_VIEW: MapViewConfig = {
  id: 'iran',
  labelFa: 'نقشه ایران',
  center: [32, 53],
  zoom: 5,
  minZoom: 4,
  maxZoom: 8,
  bounds: {
    lat: [24, 40],
    lng: [44, 63]
  }
};

export const SEMNAN_VIEW: MapViewConfig = {
  id: 'semnan',
  labelFa: 'استان سمنان',
  center: [35.6, 54.4],
  zoom: 7,
  minZoom: 6,
  maxZoom: 11,
  bounds: {
    lat: [34.5, 37.5],
    lng: [52, 56.5]
  }
};
