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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/student/get-all-question-category",
          { headers: { Authorization: `Bearer ${token}` } }
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

  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedCategoryId) {
        try {
          const res = await axios.get(
            `http://localhost:8080/teacher/get-all-question-by-category/${selectedCategoryId}?questionCategoryId=${selectedCategoryId}`,
            { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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

      const res = await axios.get(
        `http://localhost:8080/teacher/get-all-question-by-category/${selectedCategoryId}?questionCategoryId=${selectedCategoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(res.data.data);
    } catch (err) {
      console.error("❌ Lỗi khi import CSV:", err);
      setImportStatus("❌ Lỗi khi tải file. Kiểm tra lại định dạng CSV.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        🎓 Quản lý câu hỏi
      </h2>

      {/* Chủ đề */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <label className="font-medium text-gray-700 whitespace-nowrap">
            Chọn chủ đề:
          </label>
          <select
            value={selectedCategoryId || ""}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full lg:w-64"
          >
            <option value="">-- Chọn chủ đề --</option>
            {categories.map((cat) => (
              <option
                key={cat.questionCategoryId}
                value={cat.questionCategoryId}
              >
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tên chủ đề mới"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full lg:w-80"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            ➕ Thêm chủ đề
          </button>
        </div>
      </div>

      {/* Thao tác nếu đã chọn chủ đề */}
      {selectedCategoryId ? (
        <>
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                className="border border-gray-300 px-3 py-2 rounded-lg w-full sm:w-auto"
              />
              <button
                onClick={handleImportCSV}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold transition"
              >
                📥 Nhập từ CSV
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold transition"
            >
              ➕ Thêm câu hỏi
            </button>
          </div>

          {importStatus && (
            <p className="mb-4 text-sm italic text-gray-700">{importStatus}</p>
          )}

          <QuestionTable
            questions={questions}
            onDeleteSuccess={(deletedId) => {
              setQuestions((prev) => prev.filter((q) => q.id !== deletedId));
            }}
          />
        </>
      ) : (
        <p className="text-gray-500 italic text-center">
          Vui lòng chọn chủ đề để xem hoặc thêm câu hỏi.
        </p>
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
