import React from 'react';
import 'leaflet/dist/leaflet.css';
import { ThemeProvider, useTheme } from './Theme';
import Map from './components/Map';
import './App.css'

function Main() {
  const { toggleTheme } = useTheme();

  return (
    <div className="h-screen w-screen relative">
      <Map />
      <button
        className="absolute top-4 left-4 z-50 w-32 h-12 bg-blue-500 dark:bg-red-500 text-white rounded-lg"
        onClick={toggleTheme}
      >
        切换主题
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
