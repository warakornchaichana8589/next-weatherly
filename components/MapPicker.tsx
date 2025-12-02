'use client';

import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import 'leaflet/dist/leaflet.css';

export type MapPickerProps = {
  value?: { lat: number; lon: number };
  onChange?: (coords: { lat: number; lon: number}) => void;
  className?: string;
};

const MapPicker = dynamic<MapPickerProps>(
  async () => {
    const { MapContainer, TileLayer, Marker, useMapEvents, useMap } = await import('react-leaflet');
    const L = await import('leaflet');

    const markerIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      shadowSize: [41, 41],
    });

    function ClickHandler({
      onSelect,
    }: {
      onSelect: (coords: { lat: number; lon: number }) => void;
    }) {
      useMapEvents({
        click(event) {
          onSelect({ lat: event.latlng.lat, lon: event.latlng.lng });
        },
      });
      return null;
    }

    function CenterUpdater({ center }: { center: [number, number] }) {
      const map = useMap();
      useEffect(() => {
        map.setView(center);
      }, [center, map]);
      return null;
    }

    const LeafletMap: ComponentType<MapPickerProps> = ({ value, onChange, className }) => {
      const center = useMemo(
        () => [value?.lat ?? 13.7563, value?.lon ?? 100.5018] as [number, number],
        [value],
      );

      return (
        <div className={className}>
          <MapContainer
            center={center}
            zoom={5}
            scrollWheelZoom
            className="h-64 w-full rounded-xl shadow-inner"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {value && (
              <Marker position={[value.lat, value.lon]} icon={markerIcon} opacity={0.9} />
            )}
            <CenterUpdater center={center} />
            <ClickHandler
              onSelect={(coords) => {
                onChange?.(coords);
              }}
            />
          </MapContainer>
        </div>
      );
    };

    return LeafletMap;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Loading map...
      </div>
    ),
  },
);

export default MapPicker;
