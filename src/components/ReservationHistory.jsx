import React from 'react';

export default function ReservationHistory({ isOpen, onClose }) {
  if (!isOpen) return null;

  // 从localStorage获取真实预约记录
  const getReservations = () => {
    const saved = localStorage.getItem('reservations');
    console.log('读取的localStorage数据:', saved);
    const result = saved ? JSON.parse(saved) : [];
    console.log('解析后的预约记录:', result);
    return result;
  };

  const reservations = getReservations();

  // 清空所有预约记录
  const clearAllReservations = () => {
    localStorage.removeItem('reservations');
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            预约记录
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              暂无预约记录
            </div>
          ) : (
            reservations.map(reservation => (
              <div key={reservation.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {reservation.building}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {reservation.date}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">学号:</span> {reservation.studentId}</p>
                  <p><span className="font-medium">姓名:</span> {reservation.name}</p>
                  <p><span className="font-medium">时段:</span> {reservation.timeSlot}</p>
                  
                  {reservation.floor && (
                    <p><span className="font-medium">楼层:</span> {reservation.floor}楼</p>
                  )}
                  {reservation.reservationType && (
                    <p><span className="font-medium">类型:</span> {reservation.reservationType}</p>
                  )}
                  {reservation.businessType && (
                    <p><span className="font-medium">事务:</span> {reservation.businessType}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={clearAllReservations}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            清空记录
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}