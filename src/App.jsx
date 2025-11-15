import React from 'react';
import 'leaflet/dist/leaflet.css';
import { ThemeProvider, useTheme } from './Theme';
import CampusMap from './components/CampusMap';

function Main() {
  const { theme,toggleTheme } = useTheme();

  return (
    <div className="h-[100vh] w-full relative bg-blue-500 flex">
      <CampusMap></CampusMap>
      <button
        className="absolute top-4 z-50 left-4 w-32 h-12 bg-blue-500 dark:bg-red-500 text-white rounded-lg"
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
