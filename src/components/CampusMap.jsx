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
  const currentStartRef = useRef(null); // 追踪当前选定的起点

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

  // 当 language 改变时更新 popup 内容（显示对应语言的建筑名称）
  useEffect(() => {
    if (geoData?.features) {
      // 更新所有图层的popup显示
      buildingLayersRef.current.forEach((layers, chineseName) => {
        // 查找对应的feature获取英文名称
        const feature = geoData.features.find(f => {
          const name = f.properties?.name || f.properties?.['name:zh'] || '未命名建筑';
          return name === chineseName;
        });

        if (feature) {
          const englishName = getEnglishName(feature);
          const displayName = languageRef.current === 'en' && englishName ? englishName : chineseName;

          layers.forEach(layer => {
            layer.setPopupContent(`<b>${displayName}</b>`);
          });
        }
      });
    }
  }, [language, geoData]);

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

    // 绑定 popup （只绑定一次，只显示名称，不显示描述）
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
          // 设置起点 - 清除所有其他高亮，只高亮这个为蓝色
          const allBuildings = Array.from(buildingLayersRef.current.keys());
          allBuildings.forEach(building => {
            const layers = buildingLayersRef.current.get(building);
            if (layers) {
              layers.forEach(l => {
                l.setStyle({
                  weight: 1,
                  color: '#999',
                  fillColor: '#d4d4d8',
                  fillOpacity: 0.15,
                });
              });
            }
          });

          // 立即高亮起点为蓝色
          const startLayers = buildingLayersRef.current.get(buildingInfo.name);
          if (startLayers) {
            startLayers.forEach(l => {
              l.setStyle({
                weight: 4,
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.6,
              });
            });
            console.log(`起点立即高亮: ${buildingInfo.name}`);
          }

          currentStartRef.current = buildingInfo.name;
          setStart(buildingInfo.name);
          clickRef.current = 1;
          console.log(`start:${buildingInfo.name}`);
        } else {
          // 设置终点 - 清除所有高亮，然后重新高亮起点为蓝色，高亮终点为红色
          const allBuildings = Array.from(buildingLayersRef.current.keys());
          allBuildings.forEach(building => {
            const layers = buildingLayersRef.current.get(building);
            if (layers) {
              layers.forEach(l => {
                l.setStyle({
                  weight: 1,
                  color: '#999',
                  fillColor: '#d4d4d8',
                  fillOpacity: 0.15,
                });
              });
            }
          });

          // 重新高亮起点为蓝色
          if (currentStartRef.current) {
            const startLayers = buildingLayersRef.current.get(currentStartRef.current);
            if (startLayers) {
              startLayers.forEach(l => {
                l.setStyle({
                  weight: 4,
                  color: '#3b82f6',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.6,
                });
              });
              console.log(`起点重新高亮: ${currentStartRef.current}`);
            }
          }

          // 立即高亮终点为红色
          const endLayers = buildingLayersRef.current.get(buildingInfo.name);
          if (endLayers) {
            endLayers.forEach(l => {
              l.setStyle({
                weight: 4,
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.6,
              });
            });
            console.log(`终点立即高亮: ${buildingInfo.name}`);
          }

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

  // 获取建筑名称（根据语言选择）
  const getFeatureName = (feature, lang = 'zh') => {
    let name;
    if (feature.properties['@relations'] && feature.properties['@relations'].length > 0) {
      const rel = feature.properties['@relations'].find(r => r.role === 'outer' || r.role === 'inner');
      name = rel?.reltags?.name || '未命名建筑';
    } else {
      name = feature.properties?.name || feature.properties?.['name:zh'] || '未命名建筑';
    }
    return name;
  };

  // 获取建筑的英文名称（仅用于显示）
  const getEnglishName = (feature) => {
    return feature.properties?.['name:en'] || '';
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
          if (layer.bringToFront) {
            layer.bringToFront();
          }
          // 强制重新渲染
          if (layer.redraw) {
            layer.redraw();
          }
        });
        // 通知地图重新渲染
        if (mapContainerRef.current) {
          mapContainerRef.current.invalidateSize(false);
        }
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
          if (layer.bringToFront) {
            layer.bringToFront();
          }
          if (layer.redraw) {
            layer.redraw();
          }
        });
        if (mapContainerRef.current) {
          mapContainerRef.current.invalidateSize(false);
        }
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
          if (layer.redraw) {
            layer.redraw();
          }
        });
        if (mapContainerRef.current) {
          mapContainerRef.current.invalidateSize(false);
        }
      }
    },
    resetRouteHighlights: () => {
      // 重置所有高亮和跟踪状态
      const allBuildings = Array.from(buildingLayersRef.current.keys());
      allBuildings.forEach(building => {
        const layers = buildingLayersRef.current.get(building);
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
      });
      currentStartRef.current = null;
      clickRef.current = 0;
    },
    centerOnBuilding: (buildingName) => {
      const layers = buildingLayersRef.current.get(buildingName);
      if (layers && mapContainerRef.current) {
        const layer = layers[0];
        if (layer.getBounds) {
          const bounds = layer.getBounds();
          mapContainerRef.current.fitBounds(bounds, { padding: [100, 100] });
        }
        return true;
      }
      return false;
    },
    getAllBuildings: () => {
      const buildings = Array.from(buildingLayersRef.current.keys());
      return buildings;
    },
    getGeoData: () => geoData,
    drawRoute: (coordinates, color = '#3b82f6') => {
      const map = mapContainerRef.current;
      if (map) {
        const polyline = L.polyline(coordinates, {
          color: color,
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
