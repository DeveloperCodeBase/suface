import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet';

declare module 'react-leaflet' {
  interface MapContainerProps {
    center?: LatLngExpression;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    bounds?: LatLngBoundsExpression;
    maxBounds?: LatLngBoundsExpression;
    maxBoundsViscosity?: number;
    scrollWheelZoom?: boolean | 'center';
  }

  interface TileLayerProps {
    attribution?: string;
    maxZoom?: number;
    maxNativeZoom?: number;
  }

  interface CircleMarkerProps {
    radius?: number;
  }
}
