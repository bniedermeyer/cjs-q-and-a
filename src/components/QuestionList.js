/* global fetch */
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

const ListContainer = styled.ul`
  list-style: none;
  padding-left: 0;
  padding: 3px;
  margin-top: 0;
`;

const QuestionText = styled.p`
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
  margin: 5px;
  color: #112378;
`;

const QuestionList = ({ user }) => {
  const [allowPolling, setAllowPolling] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [err, setErr] = useState(null);

  const fetchQuestions = useCallback(async () => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const talkId = params.get("talk");
    if (talkId) {
      try {
        let data = await (await fetch(`/questions?talkId=${talkId}`)).json();
        setQuestions(data);
      } catch (err) {
        setErr(err.message);
      }
    }
  }, []);

  useEffect(() => {
    const pollForQuestions = async () => {
      const interval = 10000;
      while (allowPolling) {
        await new Promise((res) => setTimeout(res, interval));
        await fetchQuestions();
      }
    };

    pollForQuestions();

    return () => setAllowPolling(false);
  }, [allowPolling, fetchQuestions]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  async function incrementQuestionCount(key) {
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, user }),
    };
    await fetch("/ask", settings);
    await fetchQuestions();
  }

  if (err) {
    return <h2>Error fetching Questions</h2>;
  }

  let content = [];

  if (questions.length === 0) {
    content = <li key="no-questions">No Questions Yet!</li>;
  } else {
    if (Array.isArray(questions)) {
      content = questions.map(({ question, key, timesAsked }) => (
        <Question className="qa-question" key={key}>
          <QuestionText>{question}</QuestionText>

          <IncrementButton
            type="button"
            className="qa-inc-button"
            onClick={() => incrementQuestionCount(key)}
            aria-label="Also ask this question"
          >
            +1
          </IncrementButton>
          <span>{timesAsked}</span>
        </Question>
      ));
    }
  }

  return <ListContainer id="qa-questions">{content}</ListContainer>;
};

export default QuestionList;
