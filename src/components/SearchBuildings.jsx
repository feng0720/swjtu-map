import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBuildings({ mapRef, onBuildingSelect, geoData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [allBuildings, setAllBuildings] = useState([]);
  const previousHighlightRef = useRef(null);

  // 获取所有建筑列表
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef?.current?.getAllBuildings) {
        const buildings = mapRef.current.getAllBuildings();
        if (buildings && buildings.length > 0) {
          setAllBuildings(buildings);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [mapRef]);

  // 从GeoJSON中获取建筑的完整信息
  const getBuildingInfo = (buildingName) => {
    if (!geoData?.features) return null;
    const feature = geoData.features.find(f => {
      const name = f.properties?.name || f.properties?.['name:zh'] || '未命名建筑';
      return name === buildingName;
    });
    if (feature) {
      return {
        name: buildingName,
        description: feature.properties?.description || '',
        type: feature.properties?.building || 'building',
        raw: feature.properties
      };
    }
    return null;
  };

  // 搜索建筑
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setSelectedBuilding(null);
      return;
    }

    // 模糊搜索
    const results = allBuildings.filter(building =>
      building.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setSelectedBuilding(null);
  };

  // 选择建筑 - 这时才高亮
  const handleSelectBuilding = (buildingName) => {
    setSelectedBuilding(buildingName);

    // 清除之前的高亮
    if (previousHighlightRef.current && previousHighlightRef.current !== buildingName && mapRef?.current?.clearHighlight) {
      try {
        mapRef.current.clearHighlight(previousHighlightRef.current);
      } catch (e) {
        console.warn('清除高亮失败');
      }
    }

    // 高亮选中的建筑
    if (mapRef?.current?.highlightBuilding) {
      try {
        mapRef.current.highlightBuilding(buildingName);
        previousHighlightRef.current = buildingName;
      } catch (e) {
        console.warn('高亮失败');
      }
    }

    // 获取完整的建筑信息
    const buildingInfo = getBuildingInfo(buildingName);
    if (buildingInfo) {
      onBuildingSelect?.(buildingInfo);
    }
  };

  // 清除搜索
  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedBuilding(null);

    if (previousHighlightRef.current && mapRef?.current?.clearHighlight) {
      try {
        mapRef.current.clearHighlight(previousHighlightRef.current);
      } catch (e) {
        console.warn('清除高亮失败');
      }
      previousHighlightRef.current = null;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索建筑..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 搜索结果 */}
      <div className="flex-1 overflow-y-auto">
        {searchResults.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              找到 {searchResults.length} 个结果
            </p>
            {searchResults.map((building, index) => (
              <div
                key={index}
                onClick={() => handleSelectBuilding(building)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedBuilding === building
                    ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                    : 'bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {building}
                </h3>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>未找到匹配的建筑</p>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>输入建筑名称进行搜索</p>
          </div>
        )}
      </div>
    </div>
  );
}
