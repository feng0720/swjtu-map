import React from 'react';
import 'leaflet/dist/leaflet.css';
import { useState, useRef, useEffect } from 'react';
import { ThemeProvider, useTheme } from './Theme';
import CampusMap from './components/CampusMap';
import TopNavigation from './components/TopNavigation';
import RightSidebar from './components/RightSidebar';

function Main() {
  const { theme, toggleTheme } = useTheme();
  const [selectBuilding, setSelectBuilding] = useState(null);
  const [language, setLanguage] = useState('zh'); // 'zh' or 'en'
  const [is3D, setIs3D] = useState(false); // 3D mode toggle
  const mapRef = useRef(null); // 地图ref，用于搜索功能
  const [geoData, setGeoData] = useState(null);

  // 当mapRef加载完成后，获取geoData
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef?.current?.getGeoData) {
        const data = mapRef.current.getGeoData();
        if (data) {
          setGeoData(data);
        }
      }
    }, 500); // 延迟获取，确保地图完全加载

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[100vh] w-full flex flex-col bg-gray-50 dark:bg-slate-950">
      {/* 顶部导航栏 */}
      <TopNavigation
        theme={theme}
        onThemeToggle={toggleTheme}
        language={language}
        onLanguageToggle={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
        is3D={is3D}
        on3DToggle={() => setIs3D(!is3D)}
      />

      {/* 主要内容区域 */}
      <div className="flex-1 flex gap-3 p-3 overflow-hidden">
        {/* 左侧地图 */}
        <div className="flex-1 bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
          <CampusMap ref={mapRef} onSelectBuilding={setSelectBuilding} />
        </div>

        {/* 右侧信息栏 */}
        <RightSidebar selectedBuilding={selectBuilding} onSelectBuilding={setSelectBuilding} mapRef={mapRef} geoData={geoData} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
}
