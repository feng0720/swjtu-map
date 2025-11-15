import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function CampusMap() {
  const [geoData, setGeoData] = useState(null);
  const geoJsonRef = React.useRef();

  // 加载 GeoJSON
  useEffect(() => {
    fetch('/src/assets/export.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error(err));
  }, []);

  // 为单个图层绑定事件
  const bindLayerEvents = (layer, featureName, parentName = null) => {
    // 使用具体的建筑名称，如果没有则用父名称
    const displayName = featureName || parentName || '未命名建筑';

    // 添加透明填充层以支持整个区域交互
    layer.setStyle({
      fillOpacity: 0.15,  // 保持可见但低透明度
      bubblingMouseEvents: false  // 防止冒泡
    });

    // 为了让整个建筑范围都可交互，设置一个"热区"
    const originalFill = layer.options.fill;

    layer.on('mouseover', (e) => {
      L.DomEvent.stopPropagation(e);
      layer.setStyle({
        weight: 3,
        color: '#2563eb',
        fillColor: '#2563eb',
        fillOpacity: 0.5,
        fill: true
      });
      layer.bindPopup(`<b>${displayName}</b>`).openPopup(e.latlng);
    });

    layer.on('mouseout', (e) => {
      L.DomEvent.stopPropagation(e);
      layer.setStyle({
        weight: 1,
        color: '#999',
        fillColor: '#d4d4d8',
        fillOpacity: 0.15,  // 保持填充
        fill: true
      });
      layer.closePopup();
    });

    // 确保填充始终开启
    layer.options.fill = true;
  };

// 修改 handleMultiPolygon 接收 name
const handleMultiPolygon = (feature, layer, featureName) => {
  if (layer.eachLayer) {
    layer.eachLayer(subLayer => {
      bindLayerEvents(subLayer, featureName, featureName);
    });
  } else {
    bindLayerEvents(layer, featureName);
  }
};
  // 在 onEachFeature 里获取显示名称
  const getFeatureName = (feature) => {
    // relation 类型
    if (feature.properties['@relations'] && feature.properties['@relations'].length > 0) {
      // 取第一个 outer/inner 的 name
      const rel = feature.properties['@relations'].find(r => r.role === 'outer' || r.role === 'inner');
      return rel?.reltags?.name || '未命名建筑';
    }
    // 普通 way 类型
    return feature.properties?.name || feature.properties?.['name:zh'] || '未命名建筑';
  };
  // 点击和悬停事件绑定
  const onEachFeature = (feature, layer) => {
    const name = getFeatureName(feature);

    // 判断是不是学校整体
    const isSchool = feature.properties?.amenity === 'university';
    if (isSchool) {
      // 学校整体的样式: 固定蓝色边框，透明填充
      if (layer.setStyle) {
        layer.setStyle({
          color: '#2563eb',
          weight: 2,
          fillOpacity: 0,
          fill: false
        });
      } else if (layer.eachLayer) {
        layer.eachLayer(subLayer => {
          if (subLayer.setStyle) {
            subLayer.setStyle({
              color: '#2563eb',
              weight: 2,
              fillOpacity: 0,
              fill: false
            });
          }
        });
      }
      return;
    }

    // 普通建筑（包括 relation 和 way）
    handleMultiPolygon(feature, layer,name);
  };

  // 样式函数，保证所有建筑都能点击和交互（包括内部区域）
  const polygonStyle = (feature) => {
    // 学校整体不填充
    const isSchool = feature.properties?.amenity === 'university';

    return {
      color: '#999',
      weight: 1,
      fillColor: '#d4d4d8',
      fillOpacity: isSchool ? 0 : 0.15,  // 学校边界不填充，建筑填充
      fill: !isSchool,  // 关键：fill 必须为 true 以启用填充交互
      bubblingMouseEvents: false
    };
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MapContainer
        center={[30.76625, 103.98360]} // 学校中心
        zoom={17}                      // 固定缩放
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
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
            pointToLayer={(feature, latlng) =>
              L.circleMarker(latlng, {
                radius: 4,
                fillColor: '#f00',
                color: '#f00',
                weight: 2,
                opacity: 0.8
              })
            }
          />
        )}
      </MapContainer>
    </div>
  );
}