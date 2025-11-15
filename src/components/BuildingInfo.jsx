import React from 'react';

export default function BuildingInfo({ building }) {

  if (!building) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        点击左侧地图中的建筑查看详情…
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-400">
        {building.name}
      </h2>

      {building.description && (
        <p className="mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {building.description}
        </p>
      )}
      

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p><b>建筑类型：</b> {building.type || '未知'}</p>
      </div>

      <div className="mt-4">
        <details className="cursor-pointer">
          <summary className="text-gray-700 dark:text-gray-300">原始数据</summary>
          <pre className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
            {JSON.stringify(building.raw, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
