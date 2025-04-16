import React, { useState, useEffect } from "react";
import mockQuestions from "../../../mock/mockQuestions";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "../../../styles/student/exam/QuizPage.css";

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showAnswer, setShowAnswer] = useState(false);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeQuestion, setTimeQuestion] = useState(0); // Thời gian câu hỏi hiện tại

  useEffect(() => {
    if (currentQuestionIndex >= mockQuestions.length) {
      setIsFinished(true);
      calculateScore();
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    setTimerKey((prev) => prev + 1); // reset timer for each new question
    setShowAnswer(false);
    setIsOptionDisabled(false);
    setIsSubmitted(false);
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const calculateScore = () => {
    let totalScore = 0;
    mockQuestions.forEach((question, index) => {
      const timeTaken = (Date.now() - questionStartTime) / 1000;
      let timeFactor = Math.max(0, (30 - timeTaken) / 30);
      let questionScore = 1000 * timeFactor;

      if (
        selectedAnswers[index] &&
        selectedAnswers[index].every((answerId) =>
          question.answers.find((opt) => opt.id === answerId && opt.isCorrect)
        )
      ) {
        totalScore += Math.round(questionScore);
      }
    });
    setScore(totalScore);
    updateLeaderboard(totalScore);
  };

  const updateLeaderboard = (totalScore) => {
    setLeaderboard((prev) => {
      const newLeaderboard = [...prev, { user: "User", score: totalScore }];
      newLeaderboard.sort((a, b) => b.score - a.score);
      return newLeaderboard.slice(0, 5); // Top 5 users
    });
  };

  const handleOptionChange = (questionIndex, optionId) => {
    if (isOptionDisabled || isSubmitted) return; // Disable option change after time up or after submitting

    if (mockQuestions[questionIndex].type === "single" && selectedAnswers[questionIndex]?.length > 0) {
      // Nếu là single choice, chỉ được chọn 1 đáp án, khóa ngay khi chọn
      setSelectedAnswers((prev) => {
        const updatedAnswers = { ...prev };
        updatedAnswers[questionIndex] = [optionId];
        return updatedAnswers;
      });
    } else {
      // Nếu là multiple choice, có thể chọn nhiều đáp án
      setSelectedAnswers((prev) => {
        const updatedAnswers = { ...prev };
        if (updatedAnswers[questionIndex]) {
          if (updatedAnswers[questionIndex].includes(optionId)) {
            updatedAnswers[questionIndex] = updatedAnswers[questionIndex].filter((id) => id !== optionId);
          } else {
            updatedAnswers[questionIndex].push(optionId);
          }
        } else {
          updatedAnswers[questionIndex] = [optionId];
        }
        return updatedAnswers;
      });
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return; // Không cho nộp lại nếu đã nộp câu hỏi
    setIsSubmitted(true);
    setTimeQuestion((Date.now() - questionStartTime) / 1000); // Lưu thời gian trả lời câu hỏi
  };

  const checkAnswer = (timeQuestion) => {
    const question = mockQuestions[currentQuestionIndex];
    const selected = selectedAnswers[currentQuestionIndex] || [];
    const correctAnswers = question.answers.filter((a) => a.isCorrect).map((a) => a.id);

    const isCorrect =
      selected.length === correctAnswers.length &&
      selected.every((id) => correctAnswers.includes(id));

    if (isCorrect) {

      let timeFactor = Math.max(0, (30 - timeQuestion) / 30); // tính tỷ lệ thời gian còn lại (tối đa 1)
      let questionScore = 1000 * timeFactor; // tối đa 1000 điểm
      setScore((prev) => prev + Math.round(questionScore)); // cộng điểm cho câu trả lời đúng
    }
  };

  const handleTimeUp = () => {
    if (!isSubmitted) {
      setIsSubmitted(true);
    }
    setShowAnswer(true); // Hiển thị đáp án khi hết thời gian
    setIsOptionDisabled(true); // Vô hiệu hóa lựa chọn khi hết thời gian
    checkAnswer(timeQuestion); // Kiểm tra đáp án khi hết thời gian
    // Move to the next question after 2 seconds
    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
    }, 2000);
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setIsFinished(false);
    setScore(0);
    setSelectedAnswers({});
    setTimerKey(timerKey + 1);
    setLeaderboard([]);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-10 px-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Leaderboard bên trái */}
        <div className="w-1/4 bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">🏆 Leaderboard</h3>
          <ul className="space-y-2 text-gray-700">
            {leaderboard.map((entry, index) => (
              <li key={index}>{`#${index + 1} ${entry.user}: ${entry.score}`}</li>
            ))}
          </ul>
        </div>

        {/* Nội dung quiz bên phải */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 relative">
          {/* Đồng hồ góc phải */}
          <div className="absolute top-4 right-4 w-14 h-14">
            <CountdownCircleTimer
              key={timerKey}
              isPlaying
              duration={15}
              colors={["#3b82f6", "#facc15", "#ef4444"]}
              colorsTime={[15, 10, 5]}
              onComplete={handleTimeUp}
              size={56}
              strokeWidth={5}
            >
              {({ remainingTime }) => (
                <span className="text-xs font-semibold text-blue-700">
                  {remainingTime}s
                </span>
              )}
            </CountdownCircleTimer>
          </div>

          <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Quiz: {mockQuestions[currentQuestionIndex]?.category}
          </h1>

          {!isFinished ? (
            <>
              {/* Hiển thị điểm */}
              <div className="mb-4 text-xl font-semibold">
                Điểm hiện tại: <span className="text-green-600">{score}</span>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {mockQuestions[currentQuestionIndex]?.questionText}
              </h2>
              <div className="space-y-3">
                {mockQuestions[currentQuestionIndex]?.answers.map((answer) => (
                  <label
                    key={answer.id}
                    htmlFor={`option-${answer.id}`}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition
                      ${showAnswer
                        ? answer.isCorrect
                          ? "bg-green-200"
                          : selectedAnswers[currentQuestionIndex]?.includes(answer.id)
                          ? "bg-red-200"
                          : "bg-gray-100"
                        : "bg-gray-100 hover:bg-blue-100"}`}
                  >
                    <input
                      type={mockQuestions[currentQuestionIndex].type === "multiple" ? "checkbox" : "radio"}
                      id={`option-${answer.id}`}
                      className="mr-3 accent-blue-600"
                      checked={selectedAnswers[currentQuestionIndex]?.includes(answer.id)}
                      onChange={() => handleOptionChange(currentQuestionIndex, answer.id)}
                      disabled={isOptionDisabled || isSubmitted}
                    />
                    <span>
                      <span className="font-medium">{answer.answerText}</span>
                    </span>
                  </label>
                ))}
              </div>

              {/* Nút nộp bài cho single choice */}
              {mockQuestions[currentQuestionIndex]?.type === "single" && !isSubmitted && (
                <button
                  className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md"
                  onClick={handleSubmit}
                >
                  Nộp bài
                </button>
              )}

              {/* Nút nộp bài cho multiple choice */}
              {mockQuestions[currentQuestionIndex]?.type === "multiple" && !isSubmitted && (
                <button
                  className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md"
                  onClick={handleSubmit}
                >
                  Nộp bài
                </button>
              )}
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Kết thúc!</h2>
              <p className="text-xl font-semibold text-green-600">Điểm của bạn: {score}</p>
              <button
                onClick={handleRetryQuiz}
                className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md"
              >
                Làm lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
