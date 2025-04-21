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
  const [csvFile, setCsvFile] = useState(null);
  const [importStatus, setImportStatus] = useState("");

  const { auth } = useAuth();
  const token = auth?.token;
  const username = auth?.username;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/student/get-all-question-category",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(res.data.data);
      } catch (err) {
        console.error("Không thể tải danh mục câu hỏi:", err);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedCategoryId) {
        try {
          const res = await axios.get(
            `http://localhost:8080/teacher/get-all-question-by-category/${selectedCategoryId}?questionCategoryId=${selectedCategoryId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setQuestions(res.data.data);
        } catch (err) {
          console.error("Lỗi khi lấy câu hỏi:", err);
        }
      }
    };

    fetchQuestions();
  }, [token, selectedCategoryId]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:8080/teacher/create-question-category",
        { name: newCategoryName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories((prev) => [...prev, res.data]);
      setNewCategoryName("");
    } catch (err) {
      console.error("Lỗi khi thêm category:", err);
    }
  };

  const handleImportCSV = async () => {
    if (!csvFile || !selectedCategoryId || !username) {
      setImportStatus("⚠️ Vui lòng chọn file CSV, chủ đề và đăng nhập.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      await axios.post(
        `http://localhost:8080/teacher/import-question?questionCategoryId=${selectedCategoryId}&username=${username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImportStatus("✅ Nhập câu hỏi thành công!");

      // Reload questions
      const res = await axios.get(
        `http://localhost:8080/teacher/get-all-question-by-category/${selectedCategoryId}?questionCategoryId=${selectedCategoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions(res.data.data);
    } catch (err) {
      console.error("❌ Lỗi khi import CSV:", err);
      setImportStatus("❌ Lỗi khi tải file. Kiểm tra lại định dạng CSV.");
    }
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
          <div className="mb-3 flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Thêm câu hỏi
            </button>

            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                className="border p-1 rounded"
              />
              <button
                onClick={handleImportCSV}
                className="bg-purple-600 text-white px-3 py-1 rounded"
              >
                Nhập từ CSV
              </button>
            </div>
          </div>

          {importStatus && (
            <p className="mb-3 text-sm italic text-gray-700">{importStatus}</p>
          )}

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
