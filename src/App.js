import React, { useState, useEffect } from "react";
import styled from "styled-components";

import QuestionForm from "./components/QuestionForm";
import QuestionList from "./components/QuestionList";
import Sticky from "./components/Sticky";
import windowEvents from "./util/windowEvents";

const AppContainer = styled.div`
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 300px;
`;

const WidgetHeader = styled.h2`
  color: #112378;
`;
const QuestionsHeader = styled.h3`
  color: #112378;
  margin-bottom: 10px;
  padding-bottom: 0;
`;

const QuestionButton = styled.button`
  height: 30px;
  border: 3px solid #10915b;
  color: #10915b;
  font-weight: bold;
  background-color: #fff;
`;

const App = () => {
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    windowEvents.listenForWindowEvents();
  }, []);

  if (!userId) {
    // normally we don't want to interact with the global location
    // but this allows us to grab the user id from the iframe
    // eslint-disable-next-line no-restricted-globals
    setUserId(location.hash);
    console.log("user id set: ", userId);
  }

  const toggleQuestionForm = () => setAskingQuestion(!askingQuestion);
  return (
    <AppContainer>
      <Sticky>
        <WidgetHeader>Q&A</WidgetHeader>
        {askingQuestion ? (
          <QuestionForm />
        ) : (
          <QuestionButton
            onClick={() => toggleQuestionForm()}
            aria-expanded={askingQuestion}
          >
            Ask a Question
          </QuestionButton>
        )}
        <QuestionsHeader>Questions</QuestionsHeader>
      </Sticky>
      <QuestionList />
    </AppContainer>
  );
};

export default App;
