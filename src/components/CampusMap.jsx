import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 获取地图实例的子组件
function MapEventsHandler({ mapContainerRef }) {
  const map = useMap();
  useEffect(() => {
    mapContainerRef.current = map;
  }, [map, mapContainerRef]);
  return null;
}

const CampusMap = forwardRef(function CampusMap({ onSelectBuilding, setStart, setEnd, activeTab, language }, ref) {
  const [geoData, setGeoData] = useState(null);
  const geoJsonRef = useRef();
  const mapContainerRef = useRef(null); // 存储地图实例
  const buildingLayersRef = useRef(new Map()); // 存储建筑名称到图层的映射
  const clickRef = useRef(0); // 设置点击选择起点还是终点
  const activeTabRef = useRef(activeTab);
  const languageRef = useRef(language);

  // 加载 GeoJSON
  useEffect(() => {
    fetch('/src/assets/export.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // 当 language 改变时更新 popup 内容
  useEffect(() => {
    buildingLayersRef.current.forEach((layers, buildingName) => {
      layers.forEach(layer => {
        const feature = layer.feature;
        const description = feature?.properties?.description;
        const description_en = feature?.properties?.description_en;
        const displayDescription = languageRef.current === 'zh' ? description || '' : description_en || '';
        layer.setPopupContent(`<b>${buildingName}</b>`);
      });
    });
  }, [language]);

  // 绑定每个图层事件
  const bindLayerEvents = (layer, featureName, parentName = null) => {
    const displayName = featureName || parentName || '未命名建筑';
    const feature = layer.feature;
    const description = feature?.properties?.description;
    const description_en = feature?.properties?.description_en;
    const displayDescription = languageRef.current === 'zh' ? description || '' : description_en || '';

    // 设置初始样式
    layer.setStyle({
      fillOpacity: 0.15,
      color: '#999',
      weight: 1,
      fillColor: '#d4d4d8',
      fill: true
    });

    // 绑定 popup （只绑定一次）
    layer.bindPopup(`<b>${displayName}</b>`);

    // 鼠标事件
    layer.on('mouseover', (e) => {
      L.DomEvent.stopPropagation(e);
      layer.setStyle({
        weight: 3,
        color: '#2563eb',
        fillColor: '#2563eb',
        fillOpacity: 0.5,
      });
      layer.openPopup(e.latlng); // 只打开，不重新绑定
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
      name: displayName,
      description: displayDescription,
      description_en: description_en,
      type: feature?.properties?.building,
      raw: feature?.properties
    };

    // 存储图层引用
    if (!buildingLayersRef.current.has(displayName)) {
      buildingLayersRef.current.set(displayName, []);
    }
    buildingLayersRef.current.get(displayName).push(layer);

    layer.on('click', () => {
      if (typeof onSelectBuilding === 'function') {
        onSelectBuilding(buildingInfo);
      }

      if (activeTabRef.current === 'route') {
        if (clickRef.current === 0) {
          setStart(buildingInfo.name);
          clickRef.current = 1;
          console.log(`start:${buildingInfo.name}`);
        } else {
          setEnd(buildingInfo.name);
          clickRef.current = 0;
          console.log(`end:${buildingInfo.name}`);
        }
      }
    });
  };

  // 处理 MultiPolygon / Relation
  const handleMultiPolygon = (feature, layer, featureName) => {
    if (layer.eachLayer) {
      layer.eachLayer(subLayer => {
        bindLayerEvents(subLayer, featureName, featureName);
      });
    } else {
      bindLayerEvents(layer, featureName, null);
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
    handleMultiPolygon(feature, layer, name);
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

  // 暴露方法
  useImperativeHandle(ref, () => ({
    highlightBuilding: (buildingName) => {
      const layers = buildingLayersRef.current.get(buildingName);
      if (layers) {
        layers.forEach(layer => {
          layer.setStyle({
            weight: 4,
            color: '#2563eb',
            fillColor: '#2563eb',
            fillOpacity: 0.6,
          });
        });
        return true;
      }
      return false;
    },
    highlightBuildingWithColor: (buildingName, color) => {
      const layers = buildingLayersRef.current.get(buildingName);
      if (layers) {
        layers.forEach(layer => {
          layer.setStyle({
            weight: 4,
            color: color,
            fillColor: color,
            fillOpacity: 0.6,
          });
        });
        return true;
      }
      return false;
    },
    clearHighlight: (buildingName) => {
      const layers = buildingLayersRef.current.get(buildingName);
      if (layers) {
        layers.forEach(layer => {
          layer.setStyle({
            weight: 1,
            color: '#999',
            fillColor: '#d4d4d8',
            fillOpacity: 0.15,
          });
        });
      }
    },
    getAllBuildings: () => Array.from(buildingLayersRef.current.keys()),
    getGeoData: () => geoData,
    drawRoute: (coordinates) => {
      const map = mapContainerRef.current;
      if (map) {
        const polyline = L.polyline(coordinates, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
        return polyline;
      }
      return null;
    },
    removeRoute: (routeLine) => {
      if (routeLine && routeLine.remove) {
        routeLine.remove();
      }
    }
  }));

  return (
    <div className="w-full h-full rounded-lg">
      <MapContainer
        center={[30.76625, 103.98360]}
        zoom={16}
        scrollWheelZoom={true}
        className='w-full h-full'
      >
        <MapEventsHandler mapContainerRef={mapContainerRef} />
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
});

CampusMap.displayName = 'CampusMap';
export default CampusMap;
