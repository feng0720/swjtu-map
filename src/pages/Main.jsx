import React from 'react';
import 'leaflet/dist/leaflet.css';
import { useState, useRef, useEffect } from 'react';
import { ThemeProvider, useTheme } from '../Theme';
import CampusMap from '../components/CampusMap';
import TopNavigation from '../components/TopNavigation';
import RightSidebar from '../components/RightSidebar';
import BikeRoutePlanner from '../components/BikeRoutePlanner';
export default function Main() {
  const { theme, toggleTheme } = useTheme();
  const [selectBuilding, setSelectBuilding] = useState(null);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'zh';
  }); // 'zh' or 'en'
  const mapRef = useRef(null); // 地图ref，用于搜索功能
  const [geoData, setGeoData] = useState(null);
  const [start,setStart] = useState(null);
  const [end,setEnd] = useState(null);
  const [activeTab, setActiveTab] = useState('navigation'); // 'navigation', 'route', 'search'
  const [showBikeRoutes, setShowBikeRoutes] = useState(false);
  const [log,setLog] = useState(() => {
    const savedLoginStatus = localStorage.getItem('loginStatus');
    return savedLoginStatus ? parseInt(savedLoginStatus) : 1;
  });
  const [name, setName] = useState(() => {
    return localStorage.getItem('userName') || "";
  });
  const [showShape,setShowShape] = useState(false);
  
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
    <div className="h-[100vh] w-full flex flex-col bg-gradient-to-r from-white via-sky-300 to-cyan-200 dark:from-slate-950 dark:via-blue-900 dark:to-indigo-900 transition-all duration-200">
      {/* 顶部导航栏 */}
      <TopNavigation
        theme={theme}
        onThemeToggle={toggleTheme}
        language={language}
        onLanguageToggle={() => {
          const next = language === 'zh' ? 'en' : 'zh';
          setLanguage(next);
          localStorage.setItem('language', next);
        }}
        onBikeRouteClick={() => setShowBikeRoutes(true)}
        log={log}
        setLog={setLog}
        name={name}
        showShape={showShape}
        setShowShape={setShowShape}
      />
      {/* 主要内容区域 */}
      <div className="flex-1 flex gap-3 p-3 overflow-hidden">
        {/* 左侧地图 */}
        <div className="flex-1 bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
          <CampusMap ref={mapRef} onSelectBuilding={setSelectBuilding} setStart={setStart} setEnd={setEnd} activeTab={activeTab} language={language}/>
        </div>

        {/* 右侧信息栏 */}
        <RightSidebar selectedBuilding={selectBuilding} onSelectBuilding={setSelectBuilding} mapRef={mapRef} geoData={geoData} activeTab={activeTab} setActiveTab={setActiveTab} start={start} end={end} language={language} name={name} log={log}/>
      </div>

      {/* 自行车路线规划 */}
      <BikeRoutePlanner
        isOpen={showBikeRoutes}
        onClose={() => setShowBikeRoutes(false)}
        mapRef={mapRef}
        geoData={geoData}
        language={language}
      />
    </div>
  );
}


