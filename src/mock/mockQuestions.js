const mockQuestions = [
  {
    id: 1,
    questionText: "Những thành phần nào sau đây là ngôn ngữ lập trình frontend?",
    category: "Frontend",
    type: "multiple", // nhiều đáp án đúng
    answers: [
      { id: 1, label: "A", answerText: "HTML", isCorrect: true },
      { id: 2, label: "B", answerText: "CSS", isCorrect: true },
      { id: 3, label: "C", answerText: "Java", isCorrect: false },
      { id: 4, label: "D", answerText: "JavaScript", isCorrect: true }
    ]
  },
  {
    id: 2,
    questionText: "Phát biểu nào sau đây đúng về React?",
    category: "ReactJS",
    type: "single", // chỉ 1 đáp án đúng
    answers: [
      { id: 5, label: "A", answerText: "React là một framework", isCorrect: false },
      { id: 6, label: "B", answerText: "React dùng để tạo backend", isCorrect: false },
      { id: 7, label: "C", answerText: "React là thư viện JavaScript", isCorrect: true },
      { id: 8, label: "D", answerText: "React được tạo bởi Microsoft", isCorrect: false }
    ]
  },
  {
    id: 3,
    questionText: "Chọn các hệ quản trị cơ sở dữ liệu quan hệ:",
    category: "Database",
    type: "multiple",
    answers: [
      { id: 9, label: "A", answerText: "PostgreSQL", isCorrect: true },
      { id: 10, label: "B", answerText: "MongoDB", isCorrect: false },
      { id: 11, label: "C", answerText: "MySQL", isCorrect: true },
      { id: 12, label: "D", answerText: "SQLite", isCorrect: true }
    ]
  }
];

export default mockQuestions;
