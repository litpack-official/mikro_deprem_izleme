import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import type { Earthquake } from '@/types';
import { getMagnitudeColor, getMagnitudeSize, formatDate, formatCoordinate } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
}

function MapBoundsUpdater({ bounds }: { bounds: LatLngBounds }) {
  const map = useMap();
  
  React.useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);
  
  return null;
}

export function EarthquakeMap({ earthquakes, bounds }: EarthquakeMapProps) {
  const mapBounds = useMemo(() => {
    return new LatLngBounds(
      [bounds.minLat, bounds.minLon],
      [bounds.maxLat, bounds.maxLon]
    );
  }, [bounds]);

  const center = useMemo(() => {
    return [
      (bounds.minLat + bounds.maxLat) / 2,
      (bounds.minLon + bounds.maxLon) / 2,
    ] as [number, number];
  }, [bounds]);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-soft border-2 border-primary-100">
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBoundsUpdater bounds={mapBounds} />
        
        {earthquakes.map((eq) => (
          <CircleMarker
            key={eq.event_id}
            center={[eq.latitude, eq.longitude]}
            radius={getMagnitudeSize(eq.magnitude)}
            pathOptions={{
              fillColor: getMagnitudeColor(eq.magnitude),
              fillOpacity: 0.7,
              color: getMagnitudeColor(eq.magnitude),
              weight: 2,
              opacity: 0.9,
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <div className="font-bold text-lg mb-2 text-primary-700">
                  Büyüklük: {eq.magnitude.toFixed(1)}
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-semibold">Tarih:</span>{' '}
                    {formatDate(eq.timestamp)}
                  </div>
                  <div>
                    <span className="font-semibold">Konum:</span>{' '}
                    {eq.detailed_location || eq.location_text || 'Konum alınıyor...'}
                  </div>
                  <div>
                    <span className="font-semibold">Koordinat:</span>{' '}
                    {formatCoordinate(eq.latitude, 'lat')},{' '}
                    {formatCoordinate(eq.longitude, 'lon')}
                  </div>
                  <div>
                    <span className="font-semibold">Derinlik:</span>{' '}
                    {eq.depth.toFixed(1)} km
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
