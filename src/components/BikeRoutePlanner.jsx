import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

// 预定义的6条路线
const PREDEFINED_ROUTES = [
  {
    id: 1,
    start: '1号教学楼',
    end: '北区宿舍',
    coordinates: [
      [30.76625, 103.98360],
      [30.76650, 103.98400],
      [30.76700, 103.98450],
      [30.76750, 103.98500],
      [30.76800, 103.98550],
      [30.76850, 103.98600],
      [30.76900, 103.98650],
    ]
  },
  {
    id: 2,
    start: '2号教学楼',
    end: '鸿哲斋4号楼',
    coordinates: [
      [30.76625, 103.98360],
      [30.76580, 103.98380],
      [30.76530, 103.98400],
      [30.76480, 103.98420],
      [30.76430, 103.98440],
      [30.76380, 103.98460],
    ]
  },
  {
    id: 3,
    start: '3号教学楼',
    end: '北区宿舍',
    coordinates: [
      [30.76625, 103.98360],
      [30.76610, 103.98340],
      [30.76595, 103.98320],
      [30.76580, 103.98300],
      [30.76565, 103.98280],
      [30.76750, 103.98500],
      [30.76850, 103.98600],
    ]
  },
  {
    id: 4,
    start: '北区宿舍',
    end: '1号教学楼',
    coordinates: [
      [30.76850, 103.98600],
      [30.76800, 103.98550],
      [30.76750, 103.98500],
      [30.76700, 103.98450],
      [30.76650, 103.98400],
      [30.76625, 103.98360],
    ]
  },
  {
    id: 5,
    start: '鸿哲斋4号楼',
    end: '2号教学楼',
    coordinates: [
      [30.76380, 103.98460],
      [30.76430, 103.98440],
      [30.76480, 103.98420],
      [30.76530, 103.98400],
      [30.76580, 103.98380],
      [30.76625, 103.98360],
    ]
  },
  {
    id: 6,
    start: '北区宿舍',
    end: '鸿哲斋4号楼',
    coordinates: [
      [30.76850, 103.98600],
      [30.76820, 103.98570],
      [30.76790, 103.98540],
      [30.76760, 103.98510],
      [30.76730, 103.98480],
      [30.76700, 103.98450],
      [30.76650, 103.98420],
      [30.76600, 103.98390],
      [30.76550, 103.98360],
      [30.76380, 103.98460],
    ]
  },
];

export default function BikeRoutePlanner({ isOpen, onClose, mapRef, language = 'zh' }) {
  const [step, setStep] = useState(1); // 1: 时间和目的, 2: 选择路线
  const [timeOfDay, setTimeOfDay] = useState(null);
  const [purpose, setPurpose] = useState(null);
  const routeLineRef = useRef(null);
  const previousHighlightsRef = useRef({ start: null, end: null });

  const handleClose = () => {
    setStep(1);
    setTimeOfDay(null);
    setPurpose(null);
    clearRoute();
    onClose();
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden flex flex-col">
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
              {PREDEFINED_ROUTES.map((route) => (
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
              ))}
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
