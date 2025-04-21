import React from "react";

function QuestionTable({ questions, onEdit, onDelete, onAddAnswer }) {
  return (
    <table className="table-auto w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2">#</th>
          <th className="border p-2">Nội dung</th>
          <th className="border p-2">Loại</th>
          <th className="border p-2">Mức độ</th>
          <th className="border p-2">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question, index) => (
          <tr key={question.id || index}> {/* Dùng index nếu không có id */}
            <td className="border p-2">{index + 1}</td>
            <td className="border p-2">{question.content}</td>
            <td className="border p-2">{question.type}</td>
            <td className="border p-2">{question.difficultyLevel}</td>
            <td className="border p-2">
              <button onClick={() => onEdit(question)}>Sửa</button>
              <button onClick={() => onDelete(question.id)}>Xoá</button>
              <button onClick={() => onAddAnswer(question.id)}>Thêm câu trả lời</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default QuestionTable;
