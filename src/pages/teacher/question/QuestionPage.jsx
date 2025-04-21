// pages/teacher/question/QuestionPage.jsx
import React, { useEffect, useState } from "react";
import QuestionTable from "../../../components/teacher/question/QuestionTable";
import QuestionFormModal from "../../../components/teacher/question/QuestionFormModal";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const QuestionPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { auth } = useAuth();
  const token = auth?.token;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/student/get-all-question-category",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(res.data.data);
      } catch (err) {
        console.error("Không thể tải danh mục câu hỏi:", err);
      }
    };

    fetchCategories();
  }, [token]);

  useEffect(() => {
    // Lấy câu hỏi nếu đã chọn category
    if (selectedCategoryId) {
      axios
        .get(
          `http://localhost:8080/teacher/get-all-question-by-category/${selectedCategoryId}?questionCategoryId=${selectedCategoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => setQuestions(res.data.data))
        .catch((err) => console.error("Lỗi khi lấy câu hỏi:", err));
    }
  }, [token, selectedCategoryId]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    axios
      .post("http://localhost:8080/teacher/create-question-category", {
        name: newCategoryName,
      })
      .then((res) => {
        setCategories((prev) => [...prev, res.data]);
        setNewCategoryName("");
      })
      .catch((err) => console.error("Lỗi khi thêm category:", err));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý câu hỏi</h2>

      <div className="mb-4">
        <label className="mr-2">Chọn chủ đề:</label>
        <select
          value={selectedCategoryId || ""}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">-- Chọn chủ đề --</option>
          {categories.map((cat) => (
            <option key={cat.questionCategoryId} value={cat.questionCategoryId}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Tên chủ đề mới"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="border p-1 rounded"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Thêm chủ đề
          </button>
        </div>
      </div>

      {selectedCategoryId ? (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="mb-2 bg-green-600 text-white px-3 py-1 rounded"
          >
            Thêm câu hỏi
          </button>
          <QuestionTable questions={questions} />
        </>
      ) : (
        <p className="text-gray-500">Vui lòng chọn chủ đề để xem câu hỏi.</p>
      )}

      <QuestionFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        categoryId={selectedCategoryId}
        onQuestionAdded={(newQuestion) =>
          setQuestions((prev) => [...prev, newQuestion])
        }
      />
    </div>
  );
};

export default QuestionPage;
