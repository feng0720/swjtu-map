import React, { useState, useRef, useEffect } from 'react';
import { X, MapPin, ArrowRight } from 'lucide-react';

export default function RouteNavigation({ mapRef, geoData, start, end, language = 'zh' }) {
  const [startBuilding, setStartBuilding] = useState(null);
  const [endBuilding, setEndBuilding] = useState(null);
  const [startQuery, setStartQuery] = useState('');
  const [endQuery, setEndQuery] = useState('');
  const [startResults, setStartResults] = useState([]);
  const [endResults, setEndResults] = useState([]);
  const [allBuildings, setAllBuildings] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const routeLineRef = useRef(null);
  const previousHighlightsRef = useRef({ start: null, end: null });
  const buildingNameMapRef = useRef(new Map()); // 存储建筑中英文名称的映射

  // 初始化建筑名称映射（中英文）
  useEffect(() => {
    if (geoData?.features) {
      const nameMap = new Map();
      geoData.features.forEach(feature => {
        const nameZh = feature.properties?.name || feature.properties?.['name:zh'];
        const nameEn = feature.properties?.['name:en'];
        if (nameZh) {
          nameMap.set(nameZh, nameEn || nameZh);
        }
      });
      buildingNameMapRef.current = nameMap;
    }
  }, [geoData]);

  // 获取所有建筑列表
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef?.current?.getAllBuildings) {
        const buildings = mapRef.current.getAllBuildings();
        if (buildings && buildings.length > 0) {
          setAllBuildings(buildings);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [mapRef]);

  // 同步从地图点击传入的 start/end
  useEffect(() => {
    if (start) {
      setStartBuilding(start);
      setStartQuery(start);
      setStartResults([]);
      console.log(`起点已同步: ${start}`);
    }
  }, [start]);

  useEffect(() => {
    if (end) {
      setEndBuilding(end);
      setEndQuery(end);
      setEndResults([]);
      console.log(`终点已同步: ${end}`);
    }
  }, [end]);

  // 获取建筑坐标（中文名称）
  const getBuildingCoordinates = (buildingName) => {
    if (!geoData?.features) return null;
    const feature = geoData.features.find(f => {
      const name = f.properties?.name || f.properties?.['name:zh'] || '未命名建筑';
      return name === buildingName;
    });

    if (!feature || !feature.geometry) return null;

    let coordinates = [];
    if (feature.geometry.type === 'Polygon') {
      coordinates = feature.geometry.coordinates[0];
    } else if (feature.geometry.type === 'MultiPolygon') {
      coordinates = feature.geometry.coordinates[0][0];
    } else if (feature.geometry.type === 'Point') {
      return [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
    }

    if (coordinates.length === 0) return null;

    let minLat = coordinates[0][1];
    let maxLat = coordinates[0][1];
    let minLng = coordinates[0][0];
    let maxLng = coordinates[0][0];

    coordinates.forEach(coord => {
      minLat = Math.min(minLat, coord[1]);
      maxLat = Math.max(maxLat, coord[1]);
      minLng = Math.min(minLng, coord[0]);
      maxLng = Math.max(maxLng, coord[0]);
    });

    return [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
  };

  // 搜索起点
  const handleStartSearch = (query) => {
    setStartQuery(query);
    if (!query.trim()) {
      setStartResults([]);
      return;
    }

    const results = allBuildings.filter(building =>
      building.toLowerCase().includes(query.toLowerCase())
    );
    setStartResults(results);
  };

  // 搜索终点
  const handleEndSearch = (query) => {
    setEndQuery(query);
    if (!query.trim()) {
      setEndResults([]);
      return;
    }

    const results = allBuildings.filter(building =>
      building.toLowerCase().includes(query.toLowerCase())
    );
    setEndResults(results);
  };

  // 选择起点
  const handleSelectStart = (building) => {
    setStartBuilding(building);
    setStartQuery(building);
    setStartResults([]);

    // 清除之前的起点高亮
    if (previousHighlightsRef.current.start && mapRef?.current?.clearHighlight) {
      try {
        mapRef.current.clearHighlight(previousHighlightsRef.current.start);
      } catch (e) {
        console.warn('清除起点高亮失败');
      }
    }

    // 高亮新的起点
    if (mapRef?.current?.highlightBuildingWithColor) {
      try {
        mapRef.current.highlightBuildingWithColor(building, '#3b82f6');
        previousHighlightsRef.current.start = building;
      } catch (e) {
        console.warn('高亮起点失败');
      }
    }
  };

  // 选择终点
  const handleSelectEnd = (building) => {
    setEndBuilding(building);
    setEndQuery(building);
    setEndResults([]);

    // 清除之前的终点高亮
    if (previousHighlightsRef.current.end && mapRef?.current?.clearHighlight) {
      try {
        mapRef.current.clearHighlight(previousHighlightsRef.current.end);
      } catch (e) {
        console.warn('清除终点高亮失败');
      }
    }

    // 高亮新的终点
    if (mapRef?.current?.highlightBuildingWithColor) {
      try {
        mapRef.current.highlightBuildingWithColor(building, '#ef4444');
        previousHighlightsRef.current.end = building;
      } catch (e) {
        console.warn('高亮终点失败');
      }
    }
  };

  // 清除路线
  const handleClearRoute = () => {
    // 清除所有状态
    setStartBuilding(null);
    setEndBuilding(null);
    setStartQuery('');
    setEndQuery('');
    setStartResults([]);
    setEndResults([]);
    setRouteDistance(null);
    setRouteDuration(null);

    // 清除地图上的路线
    if (routeLineRef.current && mapRef?.current?.removeRoute) {
      try {
        mapRef.current.removeRoute(routeLineRef.current);
        routeLineRef.current = null;
      } catch (e) {
        console.warn('清除路线失败');
      }
    }

    // 重置地图上的所有高亮和交互状态
    if (mapRef?.current?.resetRouteHighlights) {
      try {
        mapRef.current.resetRouteHighlights();
        console.log('路线高亮已重置');
      } catch (e) {
        console.warn('重置高亮失败:', e.message);
      }
    }

    previousHighlightsRef.current = { start: null, end: null };
  };

  // 生成路线
  const handleGenerateRoute = async () => {
    if (!startBuilding || !endBuilding) {
      alert('请选择起点和终点');
      return;
    }

    // 先清除旧路线
    if (routeLineRef.current && mapRef?.current?.removeRoute) {
      try {
        mapRef.current.removeRoute(routeLineRef.current);
        routeLineRef.current = null;
      } catch (e) {
        console.warn('清除旧路线失败');
      }
    }

    const startCoords = getBuildingCoordinates(startBuilding);
    const endCoords = getBuildingCoordinates(endBuilding);

    if (!startCoords || !endCoords) {
      alert('无法获取建筑坐标');
      return;
    }

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/bike/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error('路线获取失败');
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distance = (route.distance / 1000).toFixed(2);
        const duration = Math.round(route.duration / 60);

        setRouteDistance(distance);
        setRouteDuration(duration);

        if (mapRef?.current?.drawRoute) {
          try {
            const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            routeLineRef.current = mapRef.current.drawRoute(routeCoordinates);
          } catch (e) {
            console.warn('绘制路线失败:', e);
          }
        }
      } else {
        alert('无法找到路线');
      }
    } catch (error) {
      console.error('生成路线错误:', error);
      alert('生成路线失败: ' + error.message);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* 起点搜索 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {language === 'en' ? 'Start' : '起点'}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-blue-400" />
          <input
            type="text"
            placeholder={language === 'en' ? 'Select start or click on map...' : '选择起点或在地图点击...'}
            value={startQuery}
            onChange={(e) => handleStartSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
          />
          {startQuery && (
            <button
              onClick={() => {
                setStartQuery('');
                setStartResults([]);
              }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {startResults.length > 0 && (
          <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-lg overflow-y-auto max-h-40 bg-white dark:bg-slate-800">
            {startResults.map((building, index) => (
              <div
                key={index}
                onClick={() => handleSelectStart(building)}
                className={`p-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 border-b border-gray-200 dark:border-gray-700 ${
                  startBuilding === building ? 'bg-blue-100 dark:bg-blue-900' : ''
                }`}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">{language === 'en' ? (buildingNameMapRef.current.get(building) || building) : building}</p>
              </div>
            ))}
          </div>
        )}

        {startBuilding && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">✓ {language === 'en' ? 'Selected' : '已选择'}: {language === 'en' ? (buildingNameMapRef.current.get(startBuilding) || startBuilding) : startBuilding}</p>
        )}
      </div>

      {/* 终点搜索 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {language === 'en' ? 'End' : '终点'}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-red-400" />
          <input
            type="text"
            placeholder={language === 'en' ? 'Select end or click on map...' : '选择终点或在地图点击...'}
            value={endQuery}
            onChange={(e) => handleEndSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-800 dark:text-white"
          />
          {endQuery && (
            <button
              onClick={() => {
                setEndQuery('');
                setEndResults([]);
              }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {endResults.length > 0 && (
          <div className="mt-2 border border-gray-300 dark:border-gray-600 rounded-lg overflow-y-auto max-h-40 bg-white dark:bg-slate-800">
            {endResults.map((building, index) => (
              <div
                key={index}
                onClick={() => handleSelectEnd(building)}
                className={`p-2 cursor-pointer hover:bg-red-50 dark:hover:bg-slate-700 border-b border-gray-200 dark:border-gray-700 ${
                  endBuilding === building ? 'bg-red-100 dark:bg-red-900' : ''
                }`}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">{language === 'en' ? (buildingNameMapRef.current.get(building) || building) : building}</p>
              </div>
            ))}
          </div>
        )}

        {endBuilding && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">✓ {language === 'en' ? 'Selected' : '已选择'}: {language === 'en' ? (buildingNameMapRef.current.get(endBuilding) || endBuilding) : endBuilding}</p>
        )}
      </div>

      {/* 路线信息 */}
      {routeDistance && routeDuration && (
        <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
          <p className="text-sm text-green-800 dark:text-green-200">
            {language === 'en' ? (
              <>
                <strong>Distance:</strong> {routeDistance} km | <strong>Time:</strong> {routeDuration} min
              </>
            ) : (
              <>
                <strong>距离:</strong> {routeDistance} km | <strong>时间:</strong> {routeDuration} 分钟
              </>
            )}
          </p>
        </div>
      )}

      {/* 按钮 */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleGenerateRoute}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          {language === 'en' ? 'Generate Route' : '生成路线'}
        </button>
        <button
          onClick={handleClearRoute}
          className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {language === 'en' ? 'Clear' : '清除'}
        </button>
      </div>
    </div>
  );
}
