import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function CampusMap({onSelectBuilding}) {
  const [geoData, setGeoData] = useState(null);
  const geoJsonRef = useRef();

  // 加载 GeoJSON
  useEffect(() => {
    fetch('/src/assets/export.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error(err));
  }, []);

  // 绑定每个图层事件
  const bindLayerEvents = (layer, featureName, parentName = null, description) => {
    const displayName = featureName || parentName || '未命名建筑';
    const displayDescription = description ? description : '';

    // 设置初始样式
    layer.setStyle({
      fillOpacity: 0.15,
      color: '#999',
      weight: 1,
      fillColor: '#d4d4d8',
      fill: true
    });

    layer.on('mouseover', (e) => {
      L.DomEvent.stopPropagation(e);
      layer.setStyle({
        weight: 3,
        color: '#2563eb',
        fillColor: '#2563eb',
        fillOpacity: 0.5,
      });
      layer.bindPopup(`<b>${displayName}</b>${displayDescription ? `<br>${displayDescription}` : ''}`).openPopup(e.latlng);
    });

    layer.on('mouseout', (e) => {
      L.DomEvent.stopPropagation(e);
      layer.setStyle({
        weight: 1,
        color: '#999',
        fillColor: '#d4d4d8',
        fillOpacity: 0.15,
      });
      layer.closePopup();
    });

    // 建筑信息
    const buildingInfo = {
      name:displayName,
      description: displayDescription,
      type: layer.feature?.properties?.building,
      raw: layer.feature?.properties
    };
    layer.on('click',()=>{
      // 把值传递给父组件
      if(typeof onSelectBuilding === 'function'){
        onSelectBuilding(buildingInfo);
      }
    });
  };

  // 处理 MultiPolygon / Relation
  const handleMultiPolygon = (feature, layer, featureName, description) => {
    if (layer.eachLayer) {
      layer.eachLayer(subLayer => {
        bindLayerEvents(subLayer, featureName, featureName, description);
      });
    } else {
      bindLayerEvents(layer, featureName, null, description);
    }
  };

  // 获取建筑名称
  const getFeatureName = (feature) => {
    if (feature.properties['@relations'] && feature.properties['@relations'].length > 0) {
      const rel = feature.properties['@relations'].find(r => r.role === 'outer' || r.role === 'inner');
      return rel?.reltags?.name || '未命名建筑';
    }
    return feature.properties?.name || feature.properties?.['name:zh'] || '未命名建筑';
  };

  // 给每个 Feature 绑定事件
  const onEachFeature = (feature, layer) => {
    const name = getFeatureName(feature);
    const description = feature.properties?.description;
    const isSchool = feature.properties?.amenity === 'university';

    if (isSchool) {
      // 学校整体边界样式
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

    // 普通建筑
    handleMultiPolygon(feature, layer, name, description);
  };

  // 样式函数
  const polygonStyle = (feature) => {
    const isSchool = feature.properties?.amenity === 'university';
    return {
      color: '#999',
      weight: 1,
      fillColor: '#d4d4d8',
      fillOpacity: isSchool ? 0 : 0.15,
      fill: !isSchool,
      bubblingMouseEvents: false
    };
  };

  return (
    // 重要：使用父容器的宽高（不要使用100vw/100vh）
    <div className="w-full h-full rounded-lg">
      <MapContainer
        center={[30.76625, 103.98360]}
        zoom={16}
        scrollWheelZoom={true}
        className='w-full h-full' // 使 MapContainer 填充父容器
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
