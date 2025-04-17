import React, { useState, useEffect } from "react";
import mockQuestions from "../../../mock/mockQuestions";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "../../../styles/student/exam/QuizPage.css";

// Hàm shuffle mảng (Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Shuffle đáp án cho từng câu hỏi
const shuffleAnswersInQuestions = (questions) => {
  return questions.map((q) => ({
    ...q,
    answers: shuffleArray(q.answers),
  }));
};

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
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
  const [timeQuestion, setTimeQuestion] = useState(0);

  useEffect(() => {
    const prepared = shuffleAnswersInQuestions(mockQuestions);
    setQuestions(prepared);
  }, []);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      setIsFinished(true);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    setTimerKey((prev) => prev + 1);
    setShowAnswer(false);
    setIsOptionDisabled(false);
    setIsSubmitted(false);
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const handleOptionChange = (questionIndex, optionId) => {
    if (isOptionDisabled || isSubmitted) return;

    const currentQuestion = questions[questionIndex];
    if (!currentQuestion) return;

    if (currentQuestion.type === "single") {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionIndex]: [optionId],
      }));
    } else {
      setSelectedAnswers((prev) => {
        const updated = { ...prev };
        if (updated[questionIndex]) {
          if (updated[questionIndex].includes(optionId)) {
            updated[questionIndex] = updated[questionIndex].filter((id) => id !== optionId);
          } else {
            updated[questionIndex].push(optionId);
          }
        } else {
          updated[questionIndex] = [optionId];
        }
        return updated;
      });
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    setTimeQuestion((Date.now() - questionStartTime) / 1000);
  };

  const checkAnswer = (timeQuestion) => {
    const question = questions[currentQuestionIndex];
    const selected = selectedAnswers[currentQuestionIndex] || [];
    const correctAnswers = question.answers.filter((a) => a.isCorrect).map((a) => a.id);

    const isCorrect =
      selected.length === correctAnswers.length &&
      selected.every((id) => correctAnswers.includes(id));

    if (isCorrect) {
      let timeFactor = Math.max(0, (15 - timeQuestion) / 15);
      let questionScore = 1000 * timeFactor;
      setScore((prev) => prev + Math.round(questionScore));
    }
  };

  const handleTimeUp = () => {
    if (isFinished || !questions[currentQuestionIndex]) return;

    if (!isSubmitted) {
      setIsSubmitted(true);
    }
    setShowAnswer(true);
    setIsOptionDisabled(true);
    checkAnswer(timeQuestion);

    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
    }, 2000);
  };

  const handleRetryQuiz = () => {
    const reshuffled = shuffleAnswersInQuestions(mockQuestions);
    setQuestions(reshuffled);
    setCurrentQuestionIndex(0);
    setIsFinished(false);
    setScore(0);
    setSelectedAnswers({});
    setTimerKey(timerKey + 1);
    setLeaderboard([]);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-10 px-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Leaderboard */}
        <div className="w-1/4 bg-white rounded-2xl shadow-lg p-6 h-fit">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">🏆 Leaderboard</h3>
          <ul className="space-y-2 text-gray-700">
            {leaderboard.map((entry, index) => (
              <li key={index}>{`#${index + 1} ${entry.user}: ${entry.score}`}</li>
            ))}
          </ul>
        </div>

        {/* Quiz content */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 relative">
          {/* Timer */}
          <div className="absolute top-4 right-4 w-14 h-14">
            <CountdownCircleTimer
              key={timerKey}
              isPlaying={!isFinished && !!currentQuestion}
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

          {!isFinished && currentQuestion ? (
            <>
              <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                Quiz: {currentQuestion.category}
              </h1>

              <div className="mb-4 text-xl font-semibold">
                Điểm hiện tại: <span className="text-green-600">{score}</span>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {currentQuestion.questionText}
              </h2>
              <div className="space-y-3">
                {currentQuestion.answers.map((answer) => (
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
                      type={currentQuestion.type === "multiple" ? "checkbox" : "radio"}
                      id={`option-${answer.id}`}
                      className="mr-3 accent-blue-600"
                      checked={selectedAnswers[currentQuestionIndex]?.includes(answer.id)}
                      onChange={() => handleOptionChange(currentQuestionIndex, answer.id)}
                      disabled={isOptionDisabled || isSubmitted}
                    />
                    <span className="font-medium">{answer.answerText}</span>
                  </label>
                ))}
              </div>

              {!isSubmitted && (
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
