import React, { useState } from 'react';
import ReservationModal from './ReservationModal';
import ReservationHistory from './ReservationHistory';

export default function BuildingInfo({ building }) {
  const [showReservation, setShowReservation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (!building) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        点击左侧地图中的建筑查看详情…
      </div>
    );
  }

  const isLibrary = building.type === 'library' || building.name?.includes('图书馆');
  const isGym = building.type === 'gym' || building.name?.includes('体育馆') || building.name?.includes('运动');
  const isSchool = building.type === 'school' || building.name?.includes('学院') || building.name?.includes('学校');
  const canReserve = isLibrary || isGym || isSchool;

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
        <p><b>建筑类型：</b> {building.type }</p>
      </div>

      {canReserve && (
        <div className="mt-4">
          <button
            onClick={() => setShowReservation(true)}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            {isLibrary ? '预约图书馆' : isGym ? '预约体育馆' : '预约事务办理'}
          </button>
        </div>
      )}

      <div className="mt-4">
        <details className="cursor-pointer">
          <summary className="text-gray-700 dark:text-gray-300">原始数据</summary>
          <pre className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
            {JSON.stringify(building.raw, null, 2)}
          </pre>
        </details>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={() => setShowHistory(true)}
          className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          预约记录
        </button>
      </div>

      <ReservationModal
        building={building}
        isOpen={showReservation}
        onClose={() => setShowReservation(false)}
      />
      
      <ReservationHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
}
