import React, { useState, useEffect } from "react";
import axios from "axios";

function AnswerForm({ questionId, answerId, onClose }) {
  const [answer, setAnswer] = useState({ content: "", isCorrect: false });

  useEffect(() => {
    if (answerId) {
      // Lấy câu trả lời hiện tại nếu có answerId
      axios
        .get(`/api/answers/${answerId}`)
        .then((response) => {
          setAnswer(response.data);
        })
        .catch((error) => {
          console.error("Error fetching answer:", error);
        });
    }
  }, [answerId]);

  const handleSubmit = () => {
    const url = answerId ? `/api/answers/${answerId}` : "/api/answers";
    const method = answerId ? "put" : "post";

    axios[method](url, { ...answer, question_id: questionId })
      .then(() => {
        alert(answerId ? "Câu trả lời đã được cập nhật." : "Câu trả lời đã được lưu.");
        onClose();
      })
      .catch((error) => {
        console.error("Error saving answer:", error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-1/2">
        <h2>{answerId ? "Chỉnh sửa câu trả lời" : "Thêm câu trả lời"}</h2>
        <input
          type="text"
          value={answer.content}
          onChange={(e) => setAnswer({ ...answer, content: e.target.value })}
          placeholder="Nội dung câu trả lời"
        />
        <label>
          <input
            type="checkbox"
            checked={answer.isCorrect}
            onChange={(e) => setAnswer({ ...answer, isCorrect: e.target.checked })}
          />
          Đúng
        </label>
        <button onClick={handleSubmit}>{answerId ? "Cập nhật" : "Lưu"}</button>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

export default AnswerForm;
