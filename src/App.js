import React, { useState } from "react";
import styled from "styled-components";

import QuestionForm from "./components/QuestionForm";
import QuestionList from "./components/QuestionList";

const AppContainer = styled.div`
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 300px;
`;

const Header = styled.h2`
  color: #112378;
  position: sticky;
  top: 0;
`;

const QuestionButton = styled.button`
  height: 30px;
  border: 3px solid #10915b;
  color: #10915b;
  font-weight: bold;
  background-color: transparent;
`;

const App = () => {
  const [askingQuestion, setAskingQuestion] = useState(false);

  const toggleQuestionForm = () => setAskingQuestion(!askingQuestion);
  return (
    <AppContainer>
      <Header>Q&A</Header>
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

      <QuestionList />
    </AppContainer>
  );
};

export default App;
