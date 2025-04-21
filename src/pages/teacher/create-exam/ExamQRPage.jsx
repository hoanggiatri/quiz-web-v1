import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const ExamQRPage = () => {
  const [code, setCode] = useState('');
  const [link, setLink] = useState('');

  const handleGenerate = () => {
    const trimmed = code.trim();
    if (trimmed) {
      // setLink(`http://localhost:3000/quiz/${trimmed}`);
      setLink(`https://youtube.com`)
      setCode('');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Tạo Mã QR vào Phòng Thi</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nhập mã bài thi (VD: ABC123)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 border rounded text-lg"
        />

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-lg"
        >
          Tạo Mã QR
        </button>
      </div>

      {link && (
        <div className="flex flex-col items-center mt-8 space-y-4">
          <QRCodeCanvas value={link} size={512} />
          <p className="text-blue-600 text-center break-words">{link}</p>
        </div>
      )}
    </div>
  );
};

export default ExamQRPage;
