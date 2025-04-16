import React, { useState } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    answerA: '',
    answerB: '',
    answerC: '',
    answerD: '',
    correctAnswer: '',
  });

  const navigate = useNavigate();

  const handleShowQRCode = () => {
    const examLink = "https://www.youtube.com/"; // sẽ thay bằng link động sau
    navigate(`/exam-qr?link=${encodeURIComponent(examLink)}`);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({
      questionText: '',
      answerA: '',
      answerB: '',
      answerC: '',
      answerD: '',
      correctAnswer: '',
    });
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const importedQuestions = results.data.map((row) => ({
          questionText: row.questionText || '',
          answerA: row.answerA || '',
          answerB: row.answerB || '',
          answerC: row.answerC || '',
          answerD: row.answerD || '',
          correctAnswer: row.correctAnswer || '',
        }));
        setQuestions([...questions, ...importedQuestions]);
      }
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Trang Quản Lý Câu Hỏi</h1>

      {/* Nút Tạo QR Code */}
      <div className="mb-6">
        <button
          onClick={handleShowQRCode}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded text-lg"
        >
          📱 Tạo mã QR vào phòng thi
        </button>
      </div>

      {/* Tải CSV */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Nhập từ file CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="mb-4"
        />
      </div>

      {/* Tạo câu hỏi mới */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Tạo Câu Hỏi Mới</h2>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="Câu hỏi"
          value={newQuestion.questionText}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, questionText: e.target.value })
          }
        />
        <div className="grid grid-cols-2 gap-4 mb-4">
          {['A', 'B', 'C', 'D'].map((opt) => (
            <input
              key={opt}
              type="text"
              className="border p-2 w-full"
              placeholder={`Đáp án ${opt}`}
              value={newQuestion[`answer${opt}`]}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, [`answer${opt}`]: e.target.value })
              }
            />
          ))}
        </div>
        <select
          className="border p-2 mb-4 w-full"
          value={newQuestion.correctAnswer}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })
          }
        >
          <option value="">Chọn đáp án đúng</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <button
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm Câu Hỏi
        </button>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Danh Sách Câu Hỏi</h2>
        <ul>
          {questions.map((q, index) => (
            <li key={index} className="mb-4">
              <p><strong>{q.questionText}</strong></p>
              <ul>
                <li>A: {q.answerA}</li>
                <li>B: {q.answerB}</li>
                <li>C: {q.answerC}</li>
                <li>D: {q.answerD}</li>
                <li>Đáp án đúng: {q.correctAnswer}</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherDashboard;
