/* global fetch */
import React, { useState } from "react";
import styled from "styled-components";

const SubmitButton = styled.button`
  height: 30px;
  border: 3px solid #10915b;
  color: #10915b;
  font-weight: bold;
  background-color: #fff;
`;

const QuestionForm = () => {
  const [question, setQuestion] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    };
    await fetch("/ask", settings);
    setQuestion("");
  }

  function handleQuestionChange(event) {
    setQuestion(event.target.value);
  }

  return (
    <form id="question-form" onSubmit={handleSubmit}>
      <label htmlFor="question">Ask Away!</label>
      <div>
        <textarea
          name="question"
          id="question"
          cols="30"
          rows="3"
          value={question}
          onChange={handleQuestionChange}
        ></textarea>
      </div>
      <SubmitButton type="submit" id="submit-question-btn">
        Ask Question
      </SubmitButton>
    </form>
  );
};

export default QuestionForm;
