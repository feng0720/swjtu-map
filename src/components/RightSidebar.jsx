import React, { useState } from 'react';
import { MapPin, Route, Search } from 'lucide-react';
import BuildingInfo from './BuildingInfo';
import SearchBuildings from './SearchBuildings';
import RouteNavigation from './RouteNavigation';

export default function RightSidebar({ selectedBuilding, onSelectBuilding, mapRef, geoData, activeTab, setActiveTab, start, end, language }) {
  

  return (
    <div className="w-[350px] bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg flex flex-col">
      {/* 标签页切换 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
        <button
          onClick={() => setActiveTab('navigation')}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
            activeTab === 'navigation'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="hidden sm:inline">{language === 'en' ? 'Navigation' : '导航'}</span>
        </button>
        <button
          onClick={() => setActiveTab('route')}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
            activeTab === 'route'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          <Route className="w-5 h-5" />
          <span className="hidden sm:inline">{language === 'en' ? 'Route' : '路线规划'}</span>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
            activeTab === 'search'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="hidden sm:inline">{language === 'en' ? 'Search' : '搜索'}</span>
        </button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'navigation' && (
          <div>
            {selectedBuilding ? (
              <BuildingInfo building={selectedBuilding} language={language} />
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                {language === 'en' ? 'Click a building on the map to view details' : '点击地图中的建筑查看详情'}
              </div>
            )}
          </div>
        )}

        {activeTab === 'route' && geoData && (
          <RouteNavigation
            key={`route-${start || 'none'}-${end || 'none'}`}
            mapRef={mapRef}
            geoData={geoData}
            start={start}
            end={end}
            language={language}
          />
        )}

        {activeTab === 'route' && !geoData && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            {language === 'en' ? 'Loading...' : '加载中...'}
          </div>
        )}

        {activeTab === 'search' && geoData && (
          <SearchBuildings
            key="search-buildings"
            mapRef={mapRef}
            geoData={geoData}
            language={language}
            onBuildingSelect={(buildingInfo) => {
              onSelectBuilding?.(buildingInfo);
              setActiveTab('navigation');
            }}
          />
        )}

        {activeTab === 'search' && !geoData && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            {language === 'en' ? 'Loading...' : '加载中...'}
          </div>
        )}
      </div>
    </div>
  );
}
