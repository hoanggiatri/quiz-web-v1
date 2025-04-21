// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Sidebar */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1 bg-gray-200 p-4 rounded-md">
            <ul>
              <li>
                <Link to="/admin/users" className="block py-2">Quản lý người dùng</Link>
              </li>
              <li>
                <Link to="/admin/questions" className="block py-2">Quản lý câu hỏi</Link>
              </li>
              <li>
                <Link to="/admin/reports" className="block py-2">Thống kê</Link>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="col-span-4 p-4 bg-white rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Chào mừng bạn đến với Admin Dashboard!</h2>
            <p>Chọn một mục từ sidebar để bắt đầu quản lý hệ thống.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
