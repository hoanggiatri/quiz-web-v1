import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import SelectableQuestionTable from '../question/SelectableQuestionTable';

const SelectQuestionPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [questions, setQuestions] = useState([]); // Questions currently displayed
  const [isLoading, setIsLoading] = useState(false);
  const [currentViewSelectedIds, setCurrentViewSelectedIds] = useState(new Set());
  const [previouslySelectedIds, setPreviouslySelectedIds] = useState(new Set());
  const [currentViewQuestionMap, setCurrentViewQuestionMap] = useState(new Map());


  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const token = auth?.token;

  // Get questions already selected from the CreateExamPage (passed as objects)
  const previouslySelectedQuestions = location.state?.currentSelectedQuestions || [];

  // --- Fetch Categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          'http://localhost:8080/student/get-all-question-category',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Không thể tải danh mục câu hỏi:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchCategories();
  }, [token]);

  // --- Fetch Questions and Initialize ---
  useEffect(() => {
    // Update previouslySelectedIds whenever the location state changes
    setPreviouslySelectedIds(new Set(previouslySelectedQuestions.map(q => q.questionId)));

    const fetchQuestions = async () => {
      if (selectedCategoryId && token) {
        setIsLoading(true);
        setQuestions([]);
        // Use the updated previouslySelectedIds from state
        const currentPrevIds = new Set(previouslySelectedQuestions.map(q => q.questionId));

        try {
          const res = await axios.get(
            `http://localhost:8080/teacher/get-all-question-by-category/${selectedCategoryId}?questionCategoryId=${selectedCategoryId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const fetchedQuestions = res.data.data || [];
          setQuestions(fetchedQuestions);
          const currentMap = new Map(fetchedQuestions.map(q => [q.questionId, q]));
          setCurrentViewQuestionMap(currentMap); // Store map for later use

          // Initialize selections for the current view based on fetched questions and the most recent previous IDs
          const initialSelectedIdsForView = new Set();
          fetchedQuestions.forEach(q => {
            if (currentPrevIds.has(q.questionId)) {
              initialSelectedIdsForView.add(q.questionId);
            }
          });
          console.log('[Page] Initializing currentViewSelectedIds for category:', selectedCategoryId, initialSelectedIdsForView);
          setCurrentViewSelectedIds(initialSelectedIdsForView);

        } catch (err) {
          console.error("Lỗi khi lấy câu hỏi:", err);
          setCurrentViewSelectedIds(new Set()); // Clear on error
        } finally {
          setIsLoading(false);
        }
      } else {
        setQuestions([]);
        setCurrentViewQuestionMap(new Map());
        // If no category, reset selections to empty or only those truly from other categories (if needed)
        setCurrentViewSelectedIds(new Set());
      }
    };

    fetchQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedCategoryId, location.state?.currentSelectedQuestions]); // Re-run if previous questions change


  // Handle checkbox changes - TRY Explicitly creating a new Set object
  const handleSelectionChange = useCallback((question, isSelected) => {
    console.log('[Page] handleSelectionChange called:', { questionId: question.questionId, isSelected });
    setCurrentViewSelectedIds(prevIds => {
      console.log('[Page] Previous selectedIds:', prevIds);
      // Create a new Set from the previous state to ensure immutability
      const newIds = new Set(prevIds);
      if (isSelected) {
        newIds.add(question.questionId); // Add the ID if checked
      } else {
        newIds.delete(question.questionId); // Remove the ID if unchecked
      }
      console.log('[Page] New selectedIds:', newIds);
      // Return the new Set
      return newIds;
    });
  }, []); // Empty dependency array is usually fine here

  // --- Confirmation Logic ---
  const handleConfirmSelection = () => {
    console.log('--- handleConfirmSelection START ---');
    console.log('[Confirm] previouslySelectedQuestions:', previouslySelectedQuestions);
    console.log('[Confirm] currentViewSelectedIds (Set):', currentViewSelectedIds);
    console.log('[Confirm] currentViewQuestionMap:', currentViewQuestionMap);

    // Start with the previously selected questions objects
    let finalSelectedQuestions = [...previouslySelectedQuestions];
    const latestPreviouslySelectedIds = new Set(previouslySelectedQuestions.map(q=>q.questionId)); // Ensure we use the latest prop


    // 1. Remove questions that were previously selected BUT are displayed now AND are UNCHECKED in currentViewSelectedIds
     finalSelectedQuestions = finalSelectedQuestions.filter(q => {
         const isDisplayed = currentViewQuestionMap.has(q.questionId);
         const stillSelected = currentViewSelectedIds.has(q.questionId);

         // If it's displayed and not selected anymore, filter it out
         if (isDisplayed && !stillSelected) {
             console.log(`[Confirm] Removing previously selected question (uncheck): ${q.questionId}`);
             return false;
         }
         // Otherwise, keep it (either not displayed, or displayed and still selected)
         return true;
     });
     console.log('[Confirm] After removing unchecks:', finalSelectedQuestions);


    // 2. Add questions that are newly selected in the current view
    currentViewSelectedIds.forEach(id => {
      // If this ID wasn't previously selected...
      if (!latestPreviouslySelectedIds.has(id)) {
        const questionToAdd = currentViewQuestionMap.get(id); // Get full question object from map
        // ...and we have its data from the current view, add it (if not already added somehow)
        if (questionToAdd && !finalSelectedQuestions.some(q => q.questionId === id)) {
          console.log(`[Confirm] Adding newly selected question: ${id}`);
           // Ensure you add all necessary fields required by CreateExamPage table
           finalSelectedQuestions.push({
               questionId: questionToAdd.questionId, // Use correct ID field
               content: questionToAdd.content,
               type: questionToAdd.type
               // Add other fields like difficultyLevel if needed by the other page
           });
        }
      }
    });
    console.log('[Confirm] After adding new checks:', finalSelectedQuestions);
    console.log('--- handleConfirmSelection END ---');


    // Navigate back with the updated list of question objects
    navigate('/create-exam', { state: { updatedSelectedQuestions: finalSelectedQuestions } });
  };


  return (
    <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Chọn Câu Hỏi Cho Bài Thi</h1>
        <p className="mb-6 text-sm text-gray-600">Chọn chủ đề, sau đó tích vào các câu hỏi bạn muốn thêm hoặc bỏ khỏi bài thi.</p>

        {/* Category Selection */}
        <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label htmlFor="category-select" className="font-medium text-gray-700 whitespace-nowrap">
            Chọn chủ đề:
          </label>
          <select
            id="category-select"
            value={selectedCategoryId || ""}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full lg:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="">-- Chọn chủ đề --</option>
            {categories.map((cat) => (
              <option key={cat.questionCategoryId} value={cat.questionCategoryId}>
                {cat.name}
              </option>
            ))}
          </select>
          {isLoading && <span className="text-sm text-gray-500 italic">Đang tải...</span>}
        </div>

        {/* Question Table */}
        {selectedCategoryId && !isLoading && (
            <div className="mb-6">
              {console.log('[Page] Rendering Table with selectedIds:', Array.from(currentViewSelectedIds))}
              <SelectableQuestionTable
                questions={questions}
                // Pass the Set converted to an Array for the prop
                selectedIds={Array.from(currentViewSelectedIds)}
                onSelectionChange={handleSelectionChange}
              />
            </div>
        )}
        {isLoading && selectedCategoryId && (
            <p className="text-center text-gray-500 italic">Đang tải câu hỏi...</p>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
            <button
                onClick={() => navigate('/create-exam')} // Go back without changes
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md font-semibold transition"
            >
                Hủy bỏ
            </button>
            <button
                onClick={handleConfirmSelection}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition"
            >
              Xác nhận và Quay lại
            </button>
        </div>
    </div>
  );
};

export default SelectQuestionPage;