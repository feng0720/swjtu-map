import React, { useState, useMemo } from 'react';
import { Search, MapPin } from 'lucide-react';

// 常用建筑列表（从GeoJSON中提取的示例）
const BUILDING_CATEGORIES = {
  '图书馆': ['文学楼', '图书馆', '信息中心'],
  '教学楼': ['教室1', '教室2', '教室3'],
  '体育设施': ['体育馆', '运动场', '游泳池'],
  '生活设施': ['学生食堂', '宿舍', '活动中心'],
  '行政': ['学院办公室', '财务处', '教务处']
};

export default function BuildingList({ buildings = [], onSelectBuilding }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 获取所有建筑列表（从GeoJSON特性提取）
  const allBuildings = useMemo(() => {
    return buildings.length > 0 ? buildings : [
      { name: '文学楼', type: 'building' },
      { name: '图书馆', type: 'library' },
      { name: '体育馆', type: 'gym' },
      { name: '学生食堂', type: 'dining' },
    ];
  }, [buildings]);

  // 搜索和筛选逻辑
  const filteredBuildings = useMemo(() => {
    return allBuildings.filter(building => {
      const matchesSearch = building.name?.toLowerCase().includes(searchQuery.toLowerCase());
      if (selectedCategory) {
        const categoryBuildings = BUILDING_CATEGORIES[selectedCategory] || [];
        return matchesSearch && categoryBuildings.some(b => building.name?.includes(b));
      }
      return matchesSearch;
    });
  }, [allBuildings, searchQuery, selectedCategory]);

  return (
    <div className="h-full flex flex-col">
      {/* 搜索框 */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索建筑..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedCategory === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
          }`}
        >
          全部
        </button>
        {Object.keys(BUILDING_CATEGORIES).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 建筑列表 */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredBuildings.length > 0 ? (
          filteredBuildings.map((building, index) => (
            <div
              key={index}
              onClick={() => onSelectBuilding && onSelectBuilding(building)}
              className="p-3 bg-gray-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {building.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {building.type || '建筑'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>未找到匹配的建筑</p>
          </div>
        )}
      </div>
    </div>
  );
}
