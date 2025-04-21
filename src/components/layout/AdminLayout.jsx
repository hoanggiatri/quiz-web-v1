import React from 'react';
import Navbar from './Navbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default AdminLayout;
