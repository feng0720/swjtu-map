import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

export default function BikeRoutePlanner({ isOpen, onClose, mapRef, geoData, language = 'zh' }) {
  const [step, setStep] = useState(1);
  const [timeOfDay, setTimeOfDay] = useState(null);
  const [purpose, setPurpose] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const routeLineRef = useRef(null);
  const previousHighlightsRef = useRef({ start: null, end: null });

  const getRoutes = () => {
    if (!timeOfDay || !purpose) return [];

    if (purpose === 'school') {
      return [
        { id: 1, start: '北区宿舍(在装修)', end: '1号教学楼' },
        { id: 2, start: '北区宿舍(在装修)', end: '2号教学楼' },
        { id: 3, start: '北区宿舍(在装修)', end: '3号教学楼（含事务办理中心）' },
        { id: 4, start: '鸿哲斋4号楼', end: '1号教学楼' },
        { id: 5, start: '鸿哲斋4号楼', end: '2号教学楼' },
        { id: 6, start: '鸿哲斋4号楼', end: '3号教学楼（含事务办理中心）' },
      ];
    } else {
      return [
        { id: 7, start: '1号教学楼', end: '北区宿舍(在装修)' },
        { id: 8, start: '2号教学楼', end: '北区宿舍(在装修)' },
        { id: 9, start: '3号教学楼（含事务办理中心）', end: '北区宿舍(在装修)' },
        { id: 10, start: '1号教学楼', end: '鸿哲斋4号楼' },
        { id: 11, start: '2号教学楼', end: '鸿哲斋4号楼' },
        { id: 12, start: '3号教学楼（含事务办理中心）', end: '鸿哲斋4号楼' },
      ];
    }
  };

  // 从GeoJSON获取建筑的中心坐标
  const getBuildingCoordinates = (buildingName) => {
    if (!geoData?.features) {
      console.warn('GeoJSON数据不可用');
      return null;
    }

    // 调试：打印所有可用的建筑名称
    if (!window._buildingsLogged) {
      const allNames = geoData.features.map(f => f.properties?.name || f.properties?.['name:zh'] || '未命名').slice(0, 20);
      console.log('GeoJSON中可用的建筑名称:', allNames);
      window._buildingsLogged = true;
    }

    const feature = geoData.features.find(f => {
      const name = f.properties?.name || f.properties?.['name:zh'] || '未命名建筑';
      return name === buildingName;
    });

    if (!feature || !feature.geometry) {
      console.warn(`未找到建筑: ${buildingName}`);
      return null;
    }

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

  // 生成真实路线
  const getPseudoRoute = async (route) => {
    const startCoords = getBuildingCoordinates(route.start);
    const endCoords = getBuildingCoordinates(route.end);

    if (!startCoords || !endCoords) {
      console.warn(`无法获取路线坐标: ${route.start} -> ${route.end}`);
      return null;
    }

    try {
      // 使用OSRM获取自行车路由
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/bike/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error('OSRM request failed');
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const routeCoordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        return routeCoordinates;
      }

      return null;
    } catch (e) {
      console.warn('OSRM路由失败，使用直线连接:', e);
      // 如果OSRM失败，使用起点和终点的直线
      return [startCoords, endCoords];
    }
  };

  const clearRoute = () => {
    if (routeLineRef.current && mapRef?.current?.removeRoute) {
      try {
        mapRef.current.removeRoute(routeLineRef.current);
        routeLineRef.current = null;
      } catch (e) {
        console.warn('清除路线失败');
      }
    }

    if (previousHighlightsRef.current.start && mapRef?.current?.clearHighlight) {
      try {
        mapRef.current.clearHighlight(previousHighlightsRef.current.start);
      } catch (e) {}
    }

    if (previousHighlightsRef.current.end && mapRef?.current?.clearHighlight) {
      try {
        mapRef.current.clearHighlight(previousHighlightsRef.current.end);
      } catch (e) {}
    }

    previousHighlightsRef.current = { start: null, end: null };
  };

  const handleRouteSelect = async (route) => {
    setLoading(true);
    clearRoute();

    try {
      const coordinates = await getPseudoRoute(route);

      if (coordinates) {
        if (mapRef?.current?.drawRoute) {
          try {
            routeLineRef.current = mapRef.current.drawRoute(coordinates, '#ef4444');
          } catch (e) {
            console.warn('绘制路线失败');
          }
        }
      }

      if (mapRef?.current?.highlightBuildingWithColor) {
        try {
          mapRef.current.highlightBuildingWithColor(route.start, '#3b82f6');
          previousHighlightsRef.current.start = route.start;
        } catch (e) {
          console.warn('高亮起点失败');
        }
      }

      if (mapRef?.current?.highlightBuildingWithColor) {
        try {
          mapRef.current.highlightBuildingWithColor(route.end, '#ef4444');
          previousHighlightsRef.current.end = route.end;
        } catch (e) {
          console.warn('高亮终点失败');
        }
      }

      if (mapRef?.current?.centerOnBuilding) {
        try {
          mapRef.current.centerOnBuilding(route.start);
        } catch (e) {
          console.warn('地图居中失败');
        }
      }

      setSelectedRoute(route.id);

      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (e) {
      console.warn('处理路线失败:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setTimeOfDay(null);
    setPurpose(null);
    setSelectedRoute(null);
    onClose();
  };

  if (!isOpen) return null;

  const routes = getRoutes();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-auto"
      style={{ zIndex: 9999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden flex flex-col pointer-events-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {language === 'en' ? 'Peak Hour Bike Routes' : '高峰期自行车路线'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {language === 'en' ? 'Time of Day' : '时间段'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTimeOfDay('morning')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all ${
                      timeOfDay === 'morning'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {language === 'en' ? 'Morning' : '上午'}
                  </button>
                  <button
                    onClick={() => setTimeOfDay('afternoon')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all ${
                      timeOfDay === 'afternoon'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {language === 'en' ? 'Afternoon' : '下午'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {language === 'en' ? 'Purpose' : '目的'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPurpose('school')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all ${
                      purpose === 'school'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {language === 'en' ? 'Go to School' : '上学'}
                  </button>
                  <button
                    onClick={() => setPurpose('leave')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all ${
                      purpose === 'leave'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {language === 'en' ? 'Leave School' : '放学'}
                  </button>
                </div>
              </div>

              {timeOfDay && purpose && (
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  {language === 'en' ? 'Next' : '下一步'}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {routes.length > 0 ? (
                routes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => handleRouteSelect(route)}
                    disabled={loading}
                    className="w-full p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 bg-gray-50 dark:bg-slate-800 text-left transition-all disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{route.start}</span>
                      <span className="text-gray-600 dark:text-gray-400">→</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">{route.end}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  {language === 'en' ? 'No routes available' : '没有可用路线'}
                </div>
              )}
              {loading && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  {language === 'en' ? 'Loading route...' : '加载路线中...'}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-2 px-4 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors"
            >
              {language === 'en' ? 'Back' : '返回'}
            </button>
          )}
          {routeLineRef.current && (
            <button
              onClick={() => {
                clearRoute();
                setSelectedRoute(null);
              }}
              className="flex-1 py-2 px-4 rounded-lg bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white font-medium transition-colors"
            >
              {language === 'en' ? 'Clear Route' : '清除路线'}
            </button>
          )}
          <button
            onClick={handleClose}
            className="flex-1 py-2 px-4 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors"
          >
            {language === 'en' ? 'Close' : '关闭'}
          </button>
        </div>
      </div>
    </div>
  );
}
