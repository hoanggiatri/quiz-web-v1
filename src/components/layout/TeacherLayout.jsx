import React from 'react';
import Navbar from './Navbar';

const TeacherLayout = ({ children }) => {
  return (
    <div className="teacher-layout">
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default TeacherLayout;
