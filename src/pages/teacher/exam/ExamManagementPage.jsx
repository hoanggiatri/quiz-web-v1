// src/pages/ExamManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExamManagementPage = () => {
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  // Fetch exams when component mounts
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get('http://localhost:8080/exams'); // Your API endpoint for getting exams
        setExams(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách bài thi:', error);
      }
    };
    fetchExams();
  }, []);

  // Handle adding a new exam
  const handleAddExam = async () => {
    try {
      const response = await axios.post('http://localhost:8080/exams', newExam, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Assuming you store the token in localStorage
      });
      setExams([...exams, response.data]);
      setNewExam({ title: '', description: '' }); // Reset form
      alert('✅ Đã tạo bài thi mới.');
    } catch (error) {
      console.error('Lỗi khi tạo bài thi:', error);
      alert('⚠️ Lỗi khi tạo bài thi.');
    }
  };

  // Handle deleting an exam
  const handleDeleteExam = async (examId) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá bài thi này?')) {
      try {
        await axios.delete(`http://localhost:8080/exams/${examId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setExams(exams.filter(exam => exam.id !== examId));
        alert('✅ Đã xoá bài thi.');
      } catch (error) {
        console.error('Lỗi khi xoá bài thi:', error);
        alert('⚠️ Lỗi khi xoá bài thi.');
      }
    }
  };

  // Handle updating an exam (navigate to edit page, assuming you have an edit form)
  const handleEditExam = (exam) => {
    navigate(`/edit-exam/${exam.id}`, { state: { exam } });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Quản Lí Bài Thi</h1>
      
      {/* Form for creating a new exam */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Tạo Bài Thi Mới</h2>
        <input
          type="text"
          className="border px-4 py-2 rounded w-full mb-2"
          placeholder="Tên bài thi"
          value={newExam.title}
          onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
        />
        <textarea
          className="border px-4 py-2 rounded w-full mb-4"
          placeholder="Mô tả bài thi"
          value={newExam.description}
          onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
        />
        <button
          onClick={handleAddExam}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Tạo Bài Thi
        </button>
      </div>

      {/* Table of existing exams */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full table-auto border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">#</th>
              <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Tên Bài Thi</th>
              <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Mô Tả</th>
              <th className="border px-4 py-2 text-center text-sm font-semibold text-gray-700">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500 italic">
                  Không có bài thi nào.
                </td>
              </tr>
            ) : (
              exams.map((exam, index) => (
                <tr key={exam.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{exam.title}</td>
                  <td className="border px-4 py-2">{exam.description}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEditExam(exam)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Sửa"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Xoá"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamManagementPage;
