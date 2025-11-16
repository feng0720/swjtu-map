import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export default function BikeRoutePlanner({ isOpen, onClose, mapRef, language = 'zh' }) {
  const [step, setStep] = useState(1); // 1: 时间和目的, 2: 选择起终点
  const [timeOfDay, setTimeOfDay] = useState(null);
  const [purpose, setPurpose] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const routeLineRef = useRef(null);
  const previousHighlightsRef = useRef({ start: null, end: null });

  // 简化的路线 - 只有4条（上学北区、上学鸿哲、放学北区、放学鸿哲）
  const getRoutes = () => {
    if (!timeOfDay || !purpose) return [];

    // 使用实际的教学楼、北区宿舍、鸿哲斋位置（大约坐标）
    const teachingBuildingsArea = [30.76625, 103.98360];
    const northDormArea = [30.77000, 103.98600];
    const hongzheArea = [30.76200, 103.98200];

    // 根据时间和目的生成简单的直线路线
    if (purpose === 'school') {
      // 上学：从宿舍去教学楼
      return [
        {
          id: 1,
          start: '北区宿舍',
          end: '1号教学楼',
          coordinates: [
            northDormArea,
            [(northDormArea[0] + teachingBuildingsArea[0]) / 2, (northDormArea[1] + teachingBuildingsArea[1]) / 2],
            teachingBuildingsArea,
          ]
        },
        {
          id: 2,
          start: '鸿哲斋',
          end: '1号教学楼',
          coordinates: [
            hongzheArea,
            [(hongzheArea[0] + teachingBuildingsArea[0]) / 2, (hongzheArea[1] + teachingBuildingsArea[1]) / 2],
            teachingBuildingsArea,
          ]
        },
      ];
    } else {
      // 放学：从教学楼去宿舍
      return [
        {
          id: 3,
          start: '1号教学楼',
          end: '北区宿舍',
          coordinates: [
            teachingBuildingsArea,
            [(northDormArea[0] + teachingBuildingsArea[0]) / 2, (northDormArea[1] + teachingBuildingsArea[1]) / 2],
            northDormArea,
          ]
        },
        {
          id: 4,
          start: '1号教学楼',
          end: '鸿哲斋',
          coordinates: [
            teachingBuildingsArea,
            [(hongzheArea[0] + teachingBuildingsArea[0]) / 2, (hongzheArea[1] + teachingBuildingsArea[1]) / 2],
            hongzheArea,
          ]
        },
      ];
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

  const handleRouteSelect = (route) => {
    clearRoute();

    // 绘制路线
    if (mapRef?.current?.drawRoute) {
      try {
        routeLineRef.current = mapRef.current.drawRoute(route.coordinates);
      } catch (e) {
        console.warn('绘制路线失败');
      }
    }

    // 高亮起点为蓝色
    if (mapRef?.current?.highlightBuildingWithColor) {
      try {
        mapRef.current.highlightBuildingWithColor(route.start, '#3b82f6');
        previousHighlightsRef.current.start = route.start;
      } catch (e) {
        console.warn('高亮起点失败');
      }
    }

    // 高亮终点为红色
    if (mapRef?.current?.highlightBuildingWithColor) {
      try {
        mapRef.current.highlightBuildingWithColor(route.end, '#ef4444');
        previousHighlightsRef.current.end = route.end;
      } catch (e) {
        console.warn('高亮终点失败');
      }
    }

    // 地图居中
    if (mapRef?.current?.centerOnBuilding) {
      try {
        mapRef.current.centerOnBuilding(route.start);
      } catch (e) {
        console.warn('地图居中失败');
      }
    }

    setSelectedRoute(route.id);

    // 自动关闭窗口以显示路线
    setTimeout(() => {
      handleClose();
    }, 300);
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
        {/* Header */}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 ? (
            <div className="space-y-6">
              {/* 时间选择 */}
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

              {/* 目的选择 */}
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

              {/* 继续按钮 */}
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
                    className="w-full p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 bg-gray-50 dark:bg-slate-800 text-left transition-all"
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-2 px-4 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors"
            >
              {language === 'en' ? 'Back' : '返回'}
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
