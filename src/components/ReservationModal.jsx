import React, { useState } from 'react';

export default function ReservationModal({ building, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    timeSlot: '',
    floor: '',
    reservationType: '',
    businessType: ''
  });

  if (!isOpen) return null;

  const isLibrary = building?.type === 'library' || building?.name?.includes('图书馆');
  const isGym = building?.type === 'gym' || building?.name?.includes('体育馆') || building?.name?.includes('运动');
  const isSchool = building?.type === 'school' || building?.name?.includes('学院') || building?.name?.includes('学校');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 保存预约记录到localStorage
    const reservation = {
      id: Date.now(),
      building: building.name,
      studentId: formData.studentId,
      name: formData.name,
      timeSlot: formData.timeSlot,
      date: new Date().toLocaleDateString('zh-CN'),
      ...(isLibrary && { floor: formData.floor, reservationType: formData.reservationType }),
      ...(isSchool && { businessType: formData.businessType })
    };
    
    console.log('保存预约记录:', reservation);
    
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    existingReservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(existingReservations));
    
    console.log('所有预约记录:', existingReservations);
    
    const details = `预约成功！\n建筑：${building.name}\n学号：${formData.studentId}\n姓名：${formData.name}\n时段：${formData.timeSlot}${isLibrary ? `\n楼层：${formData.floor}楼\n类型：${formData.reservationType}` : ''}${isSchool ? `\n事务类型：${formData.businessType}` : ''}`;
    alert(details);
    onClose();
    setFormData({ studentId: '', name: '', timeSlot: '', floor: '', reservationType: '', businessType: '' });
    window.location.reload();
  };

  const libraryTimeSlots = [
    '08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'
  ];

  const gymTimeSlots = [
    '06:00-08:00', '08:00-10:00', '10:00-12:00', '14:00-16:00', 
    '16:00-18:00', '18:00-20:00', '20:00-22:00'
  ];

  const schoolTimeSlots = [
    '09:00-11:00', '14:00-16:00', '16:00-18:00'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {isLibrary ? '图书馆预约' : isGym ? '体育馆预约' : '学院预约'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            预约场所：{building.name}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              学号
            </label>
            <input
              type="text"
              required
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="请输入学号"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              姓名
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="请输入姓名"
            />
          </div>

          {isLibrary && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  楼层
                </label>
                <select
                  required
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">请选择楼层</option>
                  {[2,3,4,5,6].map(floor => (
                    <option key={floor} value={floor}>{floor}楼</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  预约类型
                </label>
                <select
                  required
                  value={formData.reservationType}
                  onChange={(e) => setFormData({...formData, reservationType: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">请选择类型</option>
                  <option value="座位">座位</option>
                  <option value="研讨室">研讨室</option>
                </select>
              </div>
            </>
          )}

          {isSchool && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                预约事务
              </label>
              <select
                required
                value={formData.businessType}
                onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">请选择事务类型</option>
                <option value="成绩证明">成绩证明</option>
                <option value="学籍证明">学籍证明</option>
                <option value="转专业申请">转专业申请</option>
                <option value="学位证书办理">学位证书办理</option>
              </select>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              预约时段
            </label>
            <select
              required
              value={formData.timeSlot}
              onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">请选择时段</option>
              {(isLibrary ? libraryTimeSlots : isGym ? gymTimeSlots : schoolTimeSlots).map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          {isLibrary && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                图书馆预约须知：请保持安静，爱护图书设施
              </p>
            </div>
          )}

          {isGym && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 rounded">
              <p className="text-xs text-green-800 dark:text-green-200">
                体育馆预约须知：请穿运动鞋，注意运动安全
              </p>
            </div>
          )}

          {isSchool && (
            <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900 rounded">
              <p className="text-xs text-purple-800 dark:text-purple-200">
                事务办理预约须知：进入请保持安静，遵守学院规定
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              确认预约
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}