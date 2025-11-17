import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function FlowHeatMap({ currentTime }) {
  const [geoData, setGeoData] = useState(null);
  const mapRef = useRef();
  const geoJsonRef = useRef();

  // 加载校园 GeoJSON
  useEffect(() => {
    fetch('/src/assets/export.geojson')
      .then(res => res.json())
      .then(data => {
        // 过滤掉 Point 类型，只保留 Polygon/MultiPolygon
        const filteredFeatures = data.features.filter(f =>
          f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
        );
        setGeoData({ ...data, features: filteredFeatures });
      })
      .catch(err => console.error(err));
  }, []);

  // 样式函数，根据 flow 值和 currentTime 改变填充色
// 线性插值得到渐变颜色
  function interpolateColor(color1, color2, factor) {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);

    const r1 = (c1 >> 16) & 0xff;
    const g1 = (c1 >> 8) & 0xff;
    const b1 = c1 & 0xff;

    const r2 = (c2 >> 16) & 0xff;
    const g2 = (c2 >> 8) & 0xff;
    const b2 = c2 & 0xff;

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `rgb(${r}, ${g}, ${b})`;
  }

  // 根据 flow 生成线性渐变色（0-3000）
  function getFlowColor(flow) {
    const max = 3000;
    const ratio = Math.min(flow / max, 1);

    if (ratio <= 0.33) {
      // 绿色 → 黄色 (#00FF00 → #FFFF00)
      return interpolateColor("#00ff00", "#ffff00", ratio / 0.33);
    } else if (ratio <= 0.66) {
      // 黄色 → 橙色 (#FFFF00 → #FFA500)
      return interpolateColor("#ffff00", "#ffa500", (ratio - 0.33) / 0.33);
    } else {
      // 橙色 → 红色 (#FFA500 → #FF0000)
      return interpolateColor("#ffa500", "#ff0000", (ratio - 0.66) / 0.34);
    }
  }
  const getBuildingColor = (feature) => {
    const isSchool = feature.properties?.amenity === 'university';
    if (isSchool) return '#2563eb'; // 校园边界蓝色
  
    const flowData = feature.properties?.flow || {};
    const flow = flowData[currentTime] || 0;
  
    return getFlowColor(flow); // 使用渐变色
  };


  // 样式
  const polygonStyle = (feature) => {
    const isSchool = feature.properties?.amenity === 'university';
    return {
      color: isSchool ? '#2563eb' : '#999',
      weight: isSchool ? 2 : 1,
      fillColor: getBuildingColor(feature),
      fillOpacity: isSchool ? 0 : 0.6,
      fill: !isSchool,
      bubblingMouseEvents: true, // 保证鼠标事件触发
    };
  };

  // 每个建筑添加事件和 Tooltip
  const onEachFeature = (feature, layer) => {
    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
      const name = feature.properties?.name || feature.properties?.['name:zh'] || '未命名建筑';
      const flowData = feature.properties?.flow || {};
      const flow = flowData[currentTime] ?? 0;

      // 永久显示 Tooltip
      layer.bindTooltip(
        `<b>${name}</b><br/>人数: ${flow}`,
        { permanent: false, direction: 'auto', className: 'building-tooltip' }
      );

      // 鼠标悬停高亮
      layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.8 }));
      layer.on('mouseout', () => layer.setStyle({ fillOpacity: 0.6 }));
    }
  };

  return (
    <div className="w-full h-full rounded-lg">
      <MapContainer
        center={[30.76625, 103.98360]}
        zoom={16}
        scrollWheelZoom={true}
        className='w-full h-full'
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {geoData && (
          <GeoJSON
            ref={geoJsonRef}
            data={geoData}
            style={polygonStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      <style>{`
        .building-tooltip {
          background: rgba(255, 255, 255, 0.85);
          color: #000;
          font-weight: bold;
          border: none;
          box-shadow: 0 0 2px rgba(0,0,0,0.5);
          font-size: 12px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
