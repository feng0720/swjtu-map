import React, { useState } from 'react';
import ReservationModal from './ReservationModal';
import ReservationHistory from './ReservationHistory';
import { MapPin, Clock, Phone } from 'lucide-react';

export default function BuildingInfo({ building,language }) {
  const [showReservation, setShowReservation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (!building) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-4">
        点击建筑查看详情…
      </div>
    );
  }

  const isLibrary = building.type === 'library' || building.name?.includes('图书馆');
  const isGym = building.type === 'gym' || building.name?.includes('体育馆') || building.name?.includes('运动');
  const isSchool = building.type === 'school' || building.name?.includes('学院') || building.name?.includes('学校');
  const canReserve = isLibrary || isGym || isSchool;

  return (
    <div className="space-y-4">
      {/* 建筑标题 */}
      <div>
        <h2 className="text-2xl font-bold mb-1 text-blue-600 dark:text-blue-400">
          {building.name}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{building.type || '建筑'}</span>
        </div>
      </div>

      {/* 建筑描述 */}
      {building.description && (
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {language==='zh'?building.description:building.description_en}
        </p>
      )}

      {/* 预约按钮 */}
      {canReserve && (
        <button
          onClick={() => setShowReservation(true)}
          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold text-lg"
        >
          {isLibrary ? '预约图书馆' : isGym ? '预约体育馆' : '预约事务办理'}
        </button>
      )}

      {/* 预约记录按钮 */}
      <button
        onClick={() => setShowHistory(true)}
        className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors font-medium text-sm"
      >
        📋 预约记录
      </button>

      {/* 模态框 */}
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
