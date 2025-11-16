import React from 'react';
import { Sun, Moon, Globe, Box } from 'lucide-react';

export default function TopNavigation({ theme, onThemeToggle, onLanguageToggle, language, on3DToggle, is3D }) {
  return (
    <div className="bg-blue-600 dark:bg-blue-900 text-white shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* 左侧：标题和学校名 */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">🗺️</div>
          <div>
            <h1 className="text-lg font-bold">西南交通大学</h1>
            <p className="text-xs opacity-90">Xipu Campus</p>
          </div>
        </div>

        {/* 右侧：功能按钮和登录 */}
        <div className="flex items-center gap-4">
          {/* 光暗转换 */}
          <button
            onClick={onThemeToggle}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
            title={theme === 'light' ? '切换到暗色' : '切换到亮色'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* 中文/EN切换 */}
          <button
            onClick={onLanguageToggle}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1"
            title="切换语言"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">{language === 'zh' ? 'EN' : '中'}</span>
          </button>

          {/* 3D/2D切换 */}
          <button
            onClick={on3DToggle}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1"
            title={is3D ? '切换到2D' : '切换到3D'}
          >
            <Box className="w-5 h-5" />
            <span className="text-sm font-medium">{is3D ? '3D' : '2D'}</span>
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