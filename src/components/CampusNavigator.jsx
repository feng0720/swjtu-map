import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw'; // 引入 Leaflet.Draw

export default function CampusNavigator() {
  const mapRef = useRef();
  const [paths, setPaths] = useState([]); // 保存所有手绘路径

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;
    const leafletMap = map;

    // 初始化 FeatureGroup 存放绘制的图形
    const drawnItems = new L.FeatureGroup();
    leafletMap.addLayer(drawnItems);

    // 初始化 Draw 控件
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: {
          shapeOptions: {
            color: 'blue',
            weight: 4
          }
        }
      }
    });

    leafletMap.addControl(drawControl);

    // 绘制完成事件
    leafletMap.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      // 将路径坐标加入 paths
      if (layer instanceof L.Polyline) {
        const latlngs = layer.getLatLngs().map(ll => [ll.lat, ll.lng]);
        setPaths(prev => [...prev, latlngs]);
        console.log('新绘制路径坐标:', latlngs);
      }
    });

  }, [mapRef.current]);

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[30.76625, 103.9836]}
        zoom={16}
        scrollWheelZoom
        className="w-full h-full"
        whenCreated={mapInstance => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>

      <div className="absolute top-4 right-4 z-50 bg-white p-2 rounded shadow">
        <h3 className="text-sm font-bold">绘制路径数: {paths.length}</h3>
        <button
          className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => console.log('所有导航数据:', paths)}
        >
          导出导航数据
        </button>
      </div>
    </div>
  );
}
