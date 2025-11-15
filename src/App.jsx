import React from 'react';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { ThemeProvider, useTheme } from './Theme';
import CampusMap from './components/CampusMap';
import BuildingInfo from './components/BuildingInfo';
function Main() {
  const { theme,toggleTheme } = useTheme();
  const [selectBuilding,setSelectBuilding] = useState(null);
  return (
    <div className="h-[100vh] w-full relative flex">
      {/* 地图 */}
      <div className='w-[70%] h-full border-4  m-3 rounded-2xl'>
        <CampusMap onSelectBuilding={setSelectBuilding}></CampusMap>
      </div>
      {/* 右侧信息栏 */}
      <div className='w-[30%] bg-white dark:bg-slate-900 border-2 m-2 border-gray-300 dark:border-gray-700 p-4 overflow-y-auto'>
        <BuildingInfo building={selectBuilding}></BuildingInfo>
      </div>
      <button
        className="absolute top-4 z-50 right-4 w-32 h-12 bg-blue-500 dark:bg-red-500 text-white rounded-lg"
        onClick={()=>toggleTheme()}
      >
        {theme}
      </button>
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
