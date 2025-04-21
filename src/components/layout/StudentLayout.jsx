import React from 'react';
import Navbar from './Navbar';

const StudentLayout = ({ children }) => {
  return (
    <div className="student-layout">
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default StudentLayout;
