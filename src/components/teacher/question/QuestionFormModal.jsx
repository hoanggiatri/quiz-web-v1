import React, { useState, useEffect } from "react";
import "../../../styles/components/QuestionFormModal.css"

export default function QuestionFormModal({
  isOpen,
  onClose,
  question,
  onSaved,
}) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [answers, setAnswers] = useState([{ content: "", is_correct: false }]);

  useEffect(() => {
    if (question) {
      setContent(question.content);
      setType(question.type);
      setDifficulty(question.difficulty);
      setAnswers(question.answers || [{ content: "", is_correct: false }]);
    } else {
      // Reset form khi thêm mới
      setContent("");
      setType("");
      setDifficulty("");
      setAnswers([{ content: "", is_correct: false }]);
    }
  }, [question, isOpen]);

  const handleAddAnswer = () => {
    setAnswers([...answers, { content: "", is_correct: false }]);
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = answers.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    setAnswers(updatedAnswers);
  };

  const handleSave = () => {
    const updatedQuestion = {
      ...question,
      content,
      type,
      difficulty,
      answers,
    };
    onSaved(updatedQuestion);
    onClose(); // đóng sau khi lưu
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" />
      <div className="modal-container">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">
              {question ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}
            </h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Câu hỏi</label>
              <textarea
                className="w-full border rounded p-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập câu hỏi"
              />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Loại câu hỏi</label>
                <select
                  className="w-full border rounded p-2"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">-- Chọn loại câu hỏi --</option>
                  <option value="singleChoice">Single Choice</option>
                  <option value="multipleChoice">Multiple Choice</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Mức độ</label>
                <select
                  className="w-full border rounded p-2"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="">-- Chọn mức độ --</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Câu trả lời</h3>
              {answers.map((answer, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <input
                    className="flex-1 border rounded p-2"
                    type="text"
                    value={answer.content}
                    onChange={(e) =>
                      handleAnswerChange(index, "content", e.target.value)
                    }
                    placeholder={`Câu trả lời ${index + 1}`}
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={answer.is_correct}
                      onChange={(e) =>
                        handleAnswerChange(
                          index,
                          "is_correct",
                          e.target.checked
                        )
                      }
                    />
                    <span className="text-sm">Đúng</span>
                  </label>
                </div>
              ))}
              <button
                onClick={handleAddAnswer}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                + Thêm câu trả lời
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                {question ? "Cập nhật" : "Lưu"}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
