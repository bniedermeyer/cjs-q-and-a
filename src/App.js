import React, { useState } from "react";
import styled from "styled-components";

import QuestionForm from "./components/QuestionForm";
import QuestionList from "./components/QuestionList";
import Sticky from "./components/Sticky";

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
