// src/pages/teacher/exam/ExamManagementPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; //
import { Pencil, Trash2 } from "lucide-react"; // Import icons

const ExamManagementPage = () => {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { auth } = useAuth(); //
  const token = auth?.token; //

  // Fetch exams when component mounts or token changes
  useEffect(() => {
    const fetchExams = async () => {
      setIsLoading(true);
      setError("");
      setExams([]); // Clear previous exams
      try {
        const response = await axios.get(
          "http://localhost:8080/teacher/get-all-public-quizzes", // API provided by user
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Assuming the data is in response.data or response.data.data
        // Adjust based on your actual API response structure
        const fetchedData = response.data?.data || response.data || [];
        setExams(Array.isArray(fetchedData) ? fetchedData : []); // Ensure exams is always an array
        console.log("Fetched exams:", fetchedData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài thi:", error);
        setError("Không thể tải danh sách bài thi. Vui lòng thử lại.");
        if (error.response?.status === 403) {
          setError("Bạn không có quyền xem danh sách này.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchExams();
    } else {
      setError("Vui lòng đăng nhập để xem danh sách bài thi.");
    }
  }, [token]);

  // Handle deleting an exam
  const handleDeleteExam = async (examId) => {
    // Make sure examId is not null/undefined
    if (typeof examId === "undefined" || examId === null) {
      console.error("Invalid examId for deletion:", examId);
      alert("⚠️ ID bài thi không hợp lệ.");
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xoá bài thi ID: ${examId}?`)) {
      try {
        // TODO: Replace with your actual endpoint to delete exams if different
        // Example: Assuming the endpoint requires the ID in the URL
        const deleteUrl = `http://localhost:8080/teacher/delete-public-quiz/${examId}`; // Adjust endpoint as needed
        console.log(`Attempting to delete exam at: ${deleteUrl}`);

        await axios.delete(deleteUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove the exam from the local state
        setExams((prevExams) =>
          prevExams.filter((exam) => exam.quizId !== examId)
        ); // Assuming the ID field is quizId
        alert(`✅ Đã xoá bài thi ID: ${examId}.`);
      } catch (error) {
        console.error("Lỗi khi xoá bài thi:", error);
        alert(
          `⚠️ Lỗi khi xoá bài thi: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  // Handle updating an exam (navigate to edit page)
  const handleEditExam = (exam) => {
    // TODO: Implement navigation to an edit page if needed
    // Example: navigate(`/edit-exam/${exam.quizId}`, { state: { exam } }); // Assuming ID is quizId
    alert(`Chức năng sửa bài thi (ID: ${exam.quizId}) chưa được triển khai.`); // Assuming ID is quizId
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quản Lí Bài Thi</h1>

      {/* Button to navigate to the Create Exam page */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/create-exam")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
        >
          + Tạo Bài Thi Mới
        </button>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <p className="text-center text-gray-500 italic">
          Đang tải danh sách bài thi...
        </p>
      )}
      {error && (
        <p className="text-center text-red-600 bg-red-100 p-3 rounded">
          {error}
        </p>
      )}

      {/* Table of existing exams */}
      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
          <table className="min-w-full table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                {/* Adjust table headers based on the actual data returned by the API */}
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Tên Bài Thi
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Mô Tả
                </th>
                <th className="border px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Người Tạo
                </th>
                <th className="border px-4 py-2 text-center text-sm font-semibold text-gray-700">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exams.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-gray-500 italic"
                  >
                    Không có bài thi nào.
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  // *** IMPORTANT: Adjust key and data access based on your API response fields ***
                  // Assuming the ID field is 'quizId' and creator is 'createdBy'
                  <tr
                    key={exam.quizId}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="border px-4 py-2 text-sm text-gray-600">
                      {exam.quizId ?? "N/A"}
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-800">
                      {exam.title ?? "N/A"}
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-600">
                      {exam.description ?? "N/A"}
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-600">
                      {exam.createdBy ?? "N/A"}
                    </td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEditExam(exam)}
                        className="text-blue-600 hover:text-blue-800 inline-block"
                        title="Sửa"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.quizId)} // Pass quizId to delete handler
                        className="text-red-600 hover:text-red-800 inline-block"
                        title="Xoá"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamManagementPage; //
