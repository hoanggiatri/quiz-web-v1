// src/components/teacher/question/SelectableQuestionTable.jsx
import React from "react";

const SelectableQuestionTable = ({
  questions,
  selectedIds = [],
  onSelectionChange,
}) => {
  const handleCheckboxChange = (event, question) => {
    const { checked } = event.target;
    console.log("[Table] handleCheckboxChange received question:", question);
    console.log("[Table] Checkbox Changed:", {
      questionId: question?.questionId,
      isChecked: checked,
    }); // Use questionId

    // Ensure question is valid and has questionId before calling parent handler
    if (question && typeof question.questionId !== "undefined") {
      // Use questionId
      onSelectionChange(question, checked);
    } else {
      console.error(
        "[Table] Error: question or question.questionId is undefined in handleCheckboxChange"
      );
    }
  };

  // Log the received selectedIds prop
  console.log("[Table] Received selectedIds:", selectedIds);
  // Log the entire questions array received as prop
  console.log("[Table] Received questions prop:", questions);

  return (
    <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
      <table className="min-w-full table-auto bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
              Chọn
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              #
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Nội dung
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Loại
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Mức độ
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {questions.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="px-4 py-6 text-center text-gray-500 italic"
              >
                Không có câu hỏi nào trong chủ đề này.
              </td>
            </tr>
          ) : (
            questions.map((question, index) => {
              // Log the question object for each iteration of the map
              console.log(
                `[Table] Mapping question at index ${index}:`,
                question
              );
              return (
                // Use questionId for the key as well, it's likely the primary identifier
                <tr
                  key={question?.questionId || index}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      // Ensure question.questionId exists before checking includes
                      checked={
                        typeof question?.questionId !== "undefined" &&
                        selectedIds.includes(question.questionId)
                      } // Use questionId
                      onChange={(e) => handleCheckboxChange(e, question)}
                      // Disable checkbox if question.questionId is missing
                      disabled={typeof question?.questionId === "undefined"} // Use questionId
                    />
                  </td>
                  {/* Use optional chaining for safety when accessing properties */}
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {index + 1}
                  </td>
                  {/* Accessing other properties like content, type seems correct based on logs */}
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {question?.content ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 capitalize">
                    {question?.type ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {question?.difficultyLevel ?? "N/A"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SelectableQuestionTable;
