import React, { useEffect, useState } from "react";
import axios from "axios";

function AnswerList({ questionId }) {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/answers?questionId=${questionId}`)
      .then((response) => {
        setAnswers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching answers:", error);
      });
  }, [questionId]);

  const handleDelete = (answerId) => {
    if (window.confirm("Bạn có chắc muốn xóa câu trả lời này?")) {
      axios
        .delete(`/api/answers/${answerId}`)
        .then(() => {
          setAnswers(answers.filter((answer) => answer.id !== answerId));
        })
        .catch((error) => {
          console.error("Error deleting answer:", error);
        });
    }
  };

  return (
    <div>
      <h3>Câu trả lời</h3>
      <ul>
        {answers.map((answer) => (
          <li key={answer.id}>
            {answer.content} {answer.isCorrect ? "(Đúng)" : "(Sai)"}
            <button onClick={() => handleDelete(answer.id)} className="text-red-500">Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AnswerList;
