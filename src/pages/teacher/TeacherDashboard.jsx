// src/pages/TeacherDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Bảng Điều Khiển Giáo Viên</h1>
      <div className="space-y-4">
        <button
          onClick={() => navigate('/question')}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          ✏️ Quản lí câu hỏi
        </button>
        <button
          onClick={() => navigate('/create-exam')}
          className="bg-purple-500 text-white px-4 py-2 rounded w-full"
        >
          📝 Tạo Đề Thi
        </button>
        <button
          onClick={() => navigate('/exam-qr')}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          📱 Tạo Mã QR Vào Phòng Thi
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
