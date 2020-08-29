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

const SubmitConfirmation = styled.span`
  font-size: 0.75rem;
  padding: 10px;
  color: #112378;
`;

const SubmitError = styled.span`
  font-size: 0.75rem;
  padding: 10px;
  color: #red;
`;

const QuestionForm = ({ user, talkId }) => {
  const [question, setQuestion] = useState("");
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const talkId = window.location.hash.replace(/#/g, "").split("_")[1];

    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, user, talkId }),
    };
    try {
      await fetch("/ask", settings);
      setQuestion("");
      setDisplayConfirmation(true);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  function handleQuestionChange(event) {
    setQuestion(event.target.value);
    setDisplayConfirmation(false);
    setError("");
  }

  return (
    <form id="question-form" onSubmit={handleSubmit}>
      <div>
        <textarea
          name="question"
          id="question"
          cols="30"
          rows="3"
          value={question}
          onChange={handleQuestionChange}
          aria-label="Submit your question here"
        ></textarea>
      </div>
      <SubmitButton type="submit" id="submit-question-btn">
        Ask Question
      </SubmitButton>
      {displayConfirmation && (
        <SubmitConfirmation>Question Asked!</SubmitConfirmation>
      )}
      {error && <SubmitError>{error}</SubmitError>}
    </form>
  );
};

export default QuestionForm;
