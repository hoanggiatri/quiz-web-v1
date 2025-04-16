import React from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // 👈 đúng tên export

const ExamQRPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const link = params.get("link");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Mã QR vào phòng thi</h1>
      {link ? (
        <div className="flex flex-col items-center">
          <QRCodeCanvas value={link} size={256} />
          {/* <p className="mt-4 text-blue-600">{link}</p> */}
        </div>
      ) : (
        <p>Không có link bài thi nào được truyền!</p>
      )}
    </div>
  );
};

export default ExamQRPage;
