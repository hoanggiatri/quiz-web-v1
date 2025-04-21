// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useAuth();  // Lấy auth từ context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!auth) return null;  // Nếu auth là null, không render gì

  const { role, username } = auth;

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">
        QuizApp
      </div>

      <div className="flex gap-4 items-center">
        {role === 'STUDENT' && (
          <>
            <Link to="/student" className="hover:underline">Trang Sinh viên</Link>
          </>
        )}

        {role === 'TEACHER' && (
          <>
            <Link to="/teacher" className="hover:underline">Trang Giáo viên</Link>
            <Link to="/create-question" className="hover:underline">Tạo câu hỏi</Link>
            <Link to="/upload-csv" className="hover:underline">Upload CSV</Link>
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <Link to="/admin" className="hover:underline">Trang Admin</Link>
          </>
        )}

        {role && (
          <>
            <span className="font-medium">👤 {username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
