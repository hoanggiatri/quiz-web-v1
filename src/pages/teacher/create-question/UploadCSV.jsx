import React, { useState } from "react";
import { CSVLink } from "react-csv";  // Dùng react-csv

const UploadCSV = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (fileData) => {
    setData(fileData);
    console.log(fileData);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nhập câu hỏi từ file CSV</h1>
      <CSVLink
        onFileLoaded={handleFileUpload}
        inputStyle={{ color: 'black', fontSize: '16px' }}
      />
      <div>
        <h2 className="mt-4 text-xl">Câu hỏi từ file CSV:</h2>
        <ul className="mt-2">
          {data.map((item, index) => (
            <li key={index}>
              {item.question}: {item.answers.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadCSV;
