// src/pages/teacher/exam/CreateExamPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { Trash2 } from "lucide-react"; // Import icon

const CreateExamPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Store full question objects to display more info if needed
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  // Effect to receive selected questions from SelectQuestionPage
  useEffect(() => {
    if (location.state?.updatedSelectedQuestions) {
      // Ensure received objects are valid and have a non-null/undefined questionId
      const validReceivedQuestions =
        location.state.updatedSelectedQuestions.filter(
          (q) =>
            q && typeof q.questionId !== "undefined" && q.questionId !== null
        );

      // Filter out duplicates based on questionId
      const uniqueQuestions = validReceivedQuestions.filter(
        (q, index, self) =>
          index === self.findIndex((t) => t.questionId === q.questionId)
      );

      if (
        uniqueQuestions.length !==
        location.state.updatedSelectedQuestions.length
      ) {
        console.warn(
          "Warning: Received some invalid or duplicate question objects from selection page."
        );
      }

      setSelectedQuestions(uniqueQuestions);
      // Clear location state after processing to prevent re-processing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]); // Depend on location.state

  const handleNavigateToSelectQuestions = () => {
    // Pass current selected questions (which should be valid objects)
    navigate("/select-question-for-exam", {
      state: { currentSelectedQuestions: selectedQuestions },
    });
  };

  const handleRemoveQuestion = (questionIdToRemove) => {
    setSelectedQuestions((prev) =>
      prev.filter((q) => q.questionId !== questionIdToRemove)
    );
  };

  const handleSaveExam = async () => {
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề bài thi.");
      return;
    }
    // Check selectedQuestions directly, as filtering happens next
    if (selectedQuestions.length === 0) {
      // Check if maybe the selection resulted in only invalid questions
      const originalSelection = location.state?.updatedSelectedQuestions || [];
      if (originalSelection.length > 0) {
        setError(
          "Lỗi: Không có câu hỏi hợp lệ nào được chọn. Vui lòng kiểm tra lại."
        );
      } else {
        setError("Vui lòng thêm ít nhất một câu hỏi vào bài thi.");
      }
      return;
    }
    setError("");
    setIsLoading(true);

    // --- Map and rigorously filter IDs ---
    const validQuestionIds = selectedQuestions
      .map((q) => q.questionId) // Get the questionId
      .filter((id) => id !== null && typeof id !== "undefined"); // Keep only non-null/undefined IDs

    // --- Final check on filtered IDs ---
    if (validQuestionIds.length === 0) {
      console.error("Error: No valid question IDs to send after filtering.");
      setError(
        "Lỗi: Không có ID câu hỏi hợp lệ nào để lưu. Vui lòng chọn lại câu hỏi."
      );
      setIsLoading(false);
      return;
    }

    if (validQuestionIds.length !== selectedQuestions.length) {
      console.warn(
        "Warning: Some selected questions had null or undefined IDs and were filtered out before sending."
      );
      // Depending on requirements, you might want to alert the user here
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      createdBy: auth?.username, // Get username from auth context
      questionIds: validQuestionIds, // Send the strictly filtered array
    };

    console.log("--- Attempting to Save Exam ---");
    console.log("Auth Object:", auth);
    console.log("Payload being sent:", JSON.stringify(payload, null, 2));
    // --- End Log ---

    try {
      // Ensure auth token exists
      if (!auth?.token) {
        throw new Error("Missing authentication token.");
      }

      const response = await axios.post(
        "http://localhost:8080/teacher/create-public-quizzes",
        payload,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Use auth.token directly
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
      alert("✅ Tạo bài thi thành công!");
      // Navigate back to the exam management page or dashboard
      navigate("/manage-exam");
    } catch (err) {
      console.error("❌ Lỗi khi tạo bài thi:", err);
      console.error("Backend Error Response:", err.response?.data);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Đã xảy ra lỗi khi tạo bài thi. Vui lòng thử lại.";
      setError(errorMsg);
      if (err.response?.status === 403) {
        setError("Bạn không có quyền thực hiện thao tác này.");
      } else if (err.response?.status === 400) {
        // Provide more specific feedback if possible based on err.response.data
        setError(`Lỗi dữ liệu gửi đi không hợp lệ: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tạo Bài Thi Mới</h1>

      {error && (
        <p className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</p>
      )}

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tiêu đề bài thi <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập tiêu đề..."
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mô tả (không bắt buộc)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mô tả..."
        />
      </div>

      <div className="mb-6 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Câu hỏi đã chọn ({selectedQuestions.length})
          </h2>
          <button
            onClick={handleNavigateToSelectQuestions}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition duration-150 ease-in-out"
          >
            + Thêm/Sửa câu hỏi
          </button>
        </div>

        {selectedQuestions.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nội dung
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Loại
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedQuestions.map((q, index) =>
                  // Ensure q and q.questionId exist before rendering row
                  q &&
                  typeof q.questionId !== "undefined" &&
                  q.questionId !== null ? (
                    <tr key={q.questionId} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {q.content ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {q.type ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleRemoveQuestion(q.questionId)}
                          className="text-red-600 hover:text-red-800"
                          title="Xóa khỏi bài thi"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ) : null // Don't render row if question object or ID is invalid
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-4">
            Chưa có câu hỏi nào được chọn.
          </p>
        )}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSaveExam}
          disabled={isLoading || selectedQuestions.length === 0}
          className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition duration-150 ease-in-out ${
            isLoading || selectedQuestions.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isLoading ? "Đang lưu..." : "Lưu Bài Thi"}
        </button>
        <button
          onClick={() => navigate("/manage-exam")} // Or Teacher Dashboard
          className="ml-3 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-semibold transition duration-150 ease-in-out"
          disabled={isLoading}
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default CreateExamPage;
