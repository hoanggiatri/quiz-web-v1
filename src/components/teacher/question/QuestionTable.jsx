import React from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
function QuestionTable({ questions, onEdit, onDeleteSuccess, onAddAnswer }) {
  const { auth } = useAuth();
  const token = auth?.token;

  const handleDelete = async (questionId) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá câu hỏi này?");
    if (!confirm) return;

    try {

      const response = await axios.delete(
        `http://localhost:8080/teacher/delete-question/${questionId}?questionId=${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("✅ Đã xoá câu hỏi.");
        onDeleteSuccess?.(questionId);
      } else {
        alert("⚠️ Không thể xoá. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi xoá câu hỏi:", error);
      if (error.response?.status === 403) {
        alert("Bạn không có quyền thực hiện thao tác này.");
      } else {
        alert("Lỗi kết nối đến server.");
      }
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full table-auto border border-gray-300 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">#</th>
            <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Nội dung</th>
            <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Loại</th>
            <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">Mức độ</th>
            <th className="border px-4 py-2 text-center text-sm font-semibold text-gray-700">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {questions.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-gray-500 italic">
                Không có câu hỏi nào trong chủ đề này.
              </td>
            </tr>
          ) : (
            questions.map((question, index) => (
              <tr key={question.id || index} className="hover:bg-gray-50 transition duration-150">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{question.content}</td>
                <td className="border px-4 py-2 capitalize">{question.type}</td>
                <td className="border px-4 py-2">{question.difficultyLevel}</td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => onEdit?.(question)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Sửa"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Xoá"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => onAddAnswer?.(question.id)}
                    className="text-green-600 hover:text-green-800"
                    title="Thêm câu trả lời"
                  >
                    <PlusCircle size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default QuestionTable;
