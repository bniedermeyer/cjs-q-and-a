/* global fetch */
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

const ListContainer = styled.ul`
  list-style: none;
  padding-left: 0;
  padding: 3px;
`;
const QuestionText = styled.span`
  color: #112378;
  font-weight: bold;
  word-wrap: break-word;
  margin: 3px;
`;

const IncrementButton = styled.button`
  margin-right: 5px;
  border: 3px solid #10915b;
  font-weight: bold;
  background-color: transparent;
  &:active {
    background-color: green;
  }
`;

const Question = styled.li`
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  margin: 5px;
`;

const Header = styled.h3`
  color: #112378;
`;

const QuestionList = () => {
  const [allowPolling, setAllowPolling] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [err, setErr] = useState(null);

  const pollForQuestions = useCallback(async () => {
    const interval = 10000;
    while (allowPolling) {
      await new Promise((res) => setTimeout(res, interval));
      await fetchQuestions();
    }
  }, [allowPolling]);

  useEffect(() => {
    fetchQuestions();
    pollForQuestions();

    return () => setAllowPolling(false);
  }, [pollForQuestions]);

  async function fetchQuestions() {
    try {
      let data = await (await fetch("/questions")).json();
      setQuestions(data);
    } catch (err) {
      setErr(err.message);
    }
  }

  async function incrementQuestionCount(key) {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    };
    await fetch("/ask", settings);
    await fetchQuestions();
  }

  if (err) {
    return <h2>Error fetching Questions</h2>;
  }

  let content;

  if (questions.length === 0) {
    content = <li key="no-questions">No Questions Yet!</li>;
  } else {
    content = questions.map(({ question, key, timesAsked }) => (
      <Question className="qa-question" key={key}>
        <IncrementButton
          type="button"
          className="qa-inc-button"
          onClick={() => incrementQuestionCount(key)}
        >
          +1
        </IncrementButton>
        <span>
          <QuestionText>{question}</QuestionText>
          (Times asked: {timesAsked})
        </span>
      </Question>
    ));
  }

  return (
    <div>
      <Header>Questions</Header>
      <ListContainer id="qa-questions">{content}</ListContainer>
    </div>
  );
};

export default QuestionList;
