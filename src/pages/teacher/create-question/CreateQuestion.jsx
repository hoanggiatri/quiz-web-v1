import React, { useState } from "react";

const CreateQuestion = () => {
  const [question, setQuestion] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleSubmit = () => {
    const newQuestion = {
      question,
      answers: [answer1, answer2, answer3, answer4],
      correctAnswer,
    };

    // Save question to state or API
    console.log("New Question: ", newQuestion);
    alert("Question added successfully!");
  };

  return (
    <div>
      <h3>Create Question</h3>
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <input
        type="text"
        placeholder="Answer 1"
        value={answer1}
        onChange={(e) => setAnswer1(e.target.value)}
      />
      <input
        type="text"
        placeholder="Answer 2"
        value={answer2}
        onChange={(e) => setAnswer2(e.target.value)}
      />
      <input
        type="text"
        placeholder="Answer 3"
        value={answer3}
        onChange={(e) => setAnswer3(e.target.value)}
      />
      <input
        type="text"
        placeholder="Answer 4"
        value={answer4}
        onChange={(e) => setAnswer4(e.target.value)}
      />
      <input
        type="text"
        placeholder="Correct Answer"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CreateQuestion;
