const mockQuestions = [
  {
    id: 1,
    questionText: "Những thành phần nào sau đây là ngôn ngữ lập trình frontend?",
    category: "Frontend",
    type: "multiple", // nhiều đáp án đúng
    answers: [
      { id: 1, answerText: "HTML", isCorrect: true },
      { id: 2, answerText: "CSS", isCorrect: true },
      { id: 3, answerText: "Java", isCorrect: false },
      { id: 4, answerText: "JavaScript", isCorrect: true }
    ]
  },
  {
    id: 2,
    questionText: "Phát biểu nào sau đây đúng về React?",
    category: "ReactJS",
    type: "single", // chỉ 1 đáp án đúng
    answers: [
      { id: 5, answerText: "React là một framework", isCorrect: false },
      { id: 6, answerText: "React dùng để tạo backend", isCorrect: false },
      { id: 7, answerText: "React là thư viện JavaScript", isCorrect: true },
      { id: 8, answerText: "React được tạo bởi Microsoft", isCorrect: false }
    ]
  },
  {
    id: 3,
    questionText: "Chọn các hệ quản trị cơ sở dữ liệu quan hệ:",
    category: "Database",
    type: "multiple",
    answers: [
      { id: 9, answerText: "PostgreSQL", isCorrect: true },
      { id: 10, answerText: "MongoDB", isCorrect: false },
      { id: 11, answerText: "MySQL", isCorrect: true },
      { id: 12, answerText: "SQLite", isCorrect: true }
    ]
  }
];

export default mockQuestions;
