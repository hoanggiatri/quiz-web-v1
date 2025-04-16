import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, KeyRound } from 'lucide-react'; // sử dụng icon đẹp

const VALID_CODES = ['ABC123', 'XYZ789']; // mock data

const StudentDashboard = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoinExam = () => {
    if (VALID_CODES.includes(code.trim().toUpperCase())) {
      navigate(`/quiz/${code}`);
    } else {
      setError('❌ Mã phòng không hợp lệ!');
    }
  };

  const handleMockQRScan = () => {
    const fakeCode = 'ABC123';
    navigate(`/quiz/${fakeCode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md animate-fade-in">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          🎓 Vào phòng thi
        </h1>

        <label className="block text-gray-700 font-medium mb-2" htmlFor="code">
          Nhập mã phòng thi
        </label>
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="text-gray-500" />
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="VD: ABC123"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleJoinExam}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          🔑 Vào bằng mã
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">hoặc</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <button
          onClick={handleMockQRScan}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition duration-200"
        >
          <QrCode size={18} /> Quét mã QR (giả lập)
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
