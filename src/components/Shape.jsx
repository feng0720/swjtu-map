import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import FlowHeatMap from "./FlowHeatMap";
import FlowPieChart from "./FlowPieChart";
import { Sun, Moon, Globe } from "lucide-react";

export default function Shape({
  theme,
  onThemeToggle,
  language,
  onLanguageToggle,
  log,
  setLog,
  name,
  ShowShape,
  setShowShape,
}) {
  const [timeIndex, setTimeIndex] = useState(0);

  const formatTime = (index) => {
    const hour = 8 + Math.floor(index);
    const minutes = Math.round((index % 1) * 60);
    return `${hour.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeChange = (e) => {
    const value = parseFloat(e.target.value);
    setTimeIndex(value);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-200 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-200 text-white">

      {/* 顶部标题和按钮（已修复：标题居中，按钮靠右） */}
      <div className="relative px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        
        {/* 标题 - 始终完美居中 */}
        <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl font-bold text-gray-700 dark:text-indigo-100">
          {language==='zh'?"校园人流量监控":"Campus pedestrian flow monitoring"}
        </h1>

        {/* 右侧按钮组 */}
        <div className="ml-auto flex items-center gap-4">

          {/* 光暗模式切换 */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg transition-all hover:scale-125"
            title={
              theme === "light"
                ? language === "en"
                  ? "Switch to dark"
                  : "切换到暗色"
                : language === "en"
                ? "Switch to light"
                : "切换到亮色"
            }
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 hover:text-sky-300" />
            ) : (
              <Sun className="w-5 h-5 hover:text-orange-400" />
            )}
          </button>

          {/* 中英文切换 */}
          <button
            onClick={onLanguageToggle}
            className="p-2 hover:scale-125 rounded-lg flex items-center gap-1 transition-all"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">
              {language === "zh" ? "EN" : "中"}
            </span>
          </button>

          {/* 分隔线 */}
          <div className="w-px h-6 bg-blue-400 opacity-50" />

          {/* 登录用户显示 */}
          {log === 2 && (
            <div className="transition-all hover:scale-125 py-2 px-3 bg-cyan-500 text-white rounded-full font-semibold shadow dark:bg-gray-600 bg-cyan-400 dark:hover:bg-stone-600">
              {name}
            </div>
          )}
        </div>
      </div>

      {/* 主体区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧热力图 */}
        <div className="flex-1 relative rounded-2xl overflow-hidden shadow-lg m-3 border-2 border-gray-300 dark:border-gray-700">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-900">
            <FlowHeatMap currentTime={Math.floor(timeIndex)} />
          </div>
        </div>

        {/* 右侧饼状图 */}
        <div className="w-[40%] p-4 border-4 border-gray-300 dark:border-cyan-700 rounded-2xl shadow-lg flex flex-col h-full overflow-hidden">
          <h2 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-indigo-400 text-center">
            {language==='zh'?"校园主要位置人流量饼状图":"Pie chart of pedestrian traffic in key locations on campus"}
          </h2>

          <div className="flex-1 flex items-center justify-center">
            <div className="h-[400px] w-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-gray-500 rounded-lg">
              <FlowPieChart currentTime={Math.floor(timeIndex)} theme={theme} language={language} />
            </div>
          </div>
        </div>
      </div>

      {/* 底部时间轴 + 返回按钮 */}
      <div className="flex flex-col gap-3 p-4 border-t border-gray-200 dark:border-gray-700">

        <div className="flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-300">
            {formatTime(timeIndex)}
          </span>

          <input
            type="range"
            min={0}
            max={14}
            step={0.1}
            value={timeIndex}
            onChange={handleTimeChange}
            className="flex-1 h-1 rounded-lg accent-blue-500"
          />

          <span className="text-gray-700 dark:text-gray-300">22:00</span>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowShape(false)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-lg text-gray-900 dark:text-white transition-all hover:scale-110"
          >
            <ArrowLeft className="w-4 h-4" />
            {language==='zh'?"返回":"Backup"}
          </button>
        </div>
      </div>
    </div>
  );
}
