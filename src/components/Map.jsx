// src/components/Map.jsx
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import geojsonData from '../assets/export.geojson';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  // 点击每个 feature 弹出学校名字
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  };

  // 计算地图 bounds
  const bounds = geojsonData.features.flatMap(f => {
    if (f.geometry.type === 'Polygon') return f.geometry.coordinates[0].map(c => [c[1], c[0]]);
    if (f.geometry.type === 'MultiPolygon') return f.geometry.coordinates.flat(2).map(c => [c[1], c[0]]);
    return [];
  });

  // 确保 bounds 非空，否则使用默认位置
  const mapBounds = bounds.length ? L.latLngBounds(bounds) : L.latLngBounds([[30.766, 103.983], [30.767, 103.984]]);

  return (
    <MapContainer
      bounds={mapBounds}
      style={{ height: '100vh', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <GeoJSON
        data={geojsonData}
        onEachFeature={onEachFeature}
        style={{
          color: 'blue',
          weight: 2,
          fillOpacity: 0.3
        }}
      />
    </MapContainer>
  );
}
