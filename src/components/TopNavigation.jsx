import React from 'react';
import { Sun, Moon, Globe, Bike } from 'lucide-react';

export default function TopNavigation({ theme, onThemeToggle, onLanguageToggle, language, onBikeRouteClick }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-600 dark:from-sky-950 dark:via-blue-950 dark:to-indigo-950 text-white shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* 左侧：标题和学校名 */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">🗺️</div>
          <div>
            <h1 className="text-lg font-bold">{language === 'en' ? 'Southwest Jiaotong University' : '西南交通大学'}</h1>
            <p className="text-xs opacity-90">Xipu Campus</p>
          </div>
        </div>

        {/* 右侧：功能按钮和登录 */}
        <div className="flex items-center gap-4">
          {/* 光暗转换 */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg transition-colors"
            title={theme === 'light' ? (language === 'en' ? 'Switch to dark' : '切换到暗色') : (language === 'en' ? 'Switch to light' : '切换到亮色')}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 hover:text-sky-300 hover:scale-125 duration-300 transition-all" />
            ) : (
              <Sun className="w-5 h-5 hover:text-orange-500 hover:scale-125 duration-300 transition-all" />
            )}
          </button>

          {/* 中文/EN切换 */}
          <button
            onClick={onLanguageToggle}
            className="p-2 hover:scale-125 rounded-lg flex items-center gap-1 duration-300 transition-all"
            title={language === 'en' ? '切换语言' : 'Switch Language'}
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">{language === 'zh' ? 'EN' : '中'}</span>
          </button>

          {/* 自行车路线规划 */}
          <button
            onClick={onBikeRouteClick}
            className="p-2 rounded-lg flex items-center gap-1 transition-all hover:scale-125 duration-300"
            title={language === 'en' ? 'Peak Hour Bike Routes' : '高峰期自行车路线'}
          >
            <Bike className="w-5 h-5" />
            <span className="text-sm font-medium">🚲</span>
          </button>

          {/* 分隔线 */}
          <div className="w-px h-6 bg-blue-400 opacity-50"></div>

          {/* 登录 */}
          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
            {language === 'zh' ? '登录' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}