const mockQuestions = [
  {
    id: 1,
    content: "Thủ đô của Việt Nam là gì?",
    type: "singleChoice",
    difficulty: "easy",
    media_url: null,
    created_by: 1,
    created_at: "2024-01-01T12:00:00Z",
    updated_at: null,
    category_id: 1,
    answers: [
      { id: 101, question_id: 1, content: "Hà Nội", is_correct: true },
      { id: 102, question_id: 1, content: "TP. Hồ Chí Minh", is_correct: false },
      { id: 103, question_id: 1, content: "Đà Nẵng", is_correct: false }
    ]
  },
  {
    id: 2,
    content: "Các ngôn ngữ lập trình phổ biến hiện nay là?",
    type: "multipleChoice",
    difficulty: "medium",
    media_url: null,
    created_by: 1,
    created_at: "2024-01-05T10:00:00Z",
    updated_at: null,
    category_id: 2,
    answers: [
      { id: 201, question_id: 2, content: "Python", is_correct: true },
      { id: 202, question_id: 2, content: "HTML", is_correct: false },
      { id: 203, question_id: 2, content: "Java", is_correct: true },
      { id: 204, question_id: 2, content: "C++", is_correct: true }
    ]
  },
  {
    id: 3,
    content: "2 + 2 bằng mấy?",
    type: "singleChoice",
    difficulty: "easy",
    media_url: null,
    created_by: 1,
    created_at: "2024-01-01T12:00:00Z",
    updated_at: null,
    category_id: 3,
    answers: [
      { id: 301, question_id: 3, content: "3", is_correct: false },
      { id: 302, question_id: 3, content: "4", is_correct: true },
      { id: 303, question_id: 3, content: "5", is_correct: false }
    ]
  },
  {
    id: 4,
    content: "Các hệ điều hành mã nguồn mở?",
    type: "multipleChoice",
    difficulty: "medium",
    media_url: null,
    created_by: 1,
    created_at: "2024-01-04T09:30:00Z",
    updated_at: null,
    category_id: 4,
    answers: [
      { id: 401, question_id: 4, content: "Linux", is_correct: true },
      { id: 402, question_id: 4, content: "Windows", is_correct: false },
      { id: 403, question_id: 4, content: "Ubuntu", is_correct: true }
    ]
  },
  {
    id: 5,
    content: "Tác giả của 'Truyện Kiều' là ai?",
    type: "singleChoice",
    difficulty: "medium",
    media_url: null,
    created_by: 1,
    created_at: "2024-01-02T10:00:00Z",
    updated_at: null,
    category_id: 5,
    answers: [
      { id: 501, question_id: 5, content: "Nguyễn Du", is_correct: true },
      { id: 502, question_id: 5, content: "Hồ Xuân Hương", is_correct: false },
      { id: 503, question_id: 5, content: "Nguyễn Trãi", is_correct: false }
    ]
  }
];

export default mockQuestions;
