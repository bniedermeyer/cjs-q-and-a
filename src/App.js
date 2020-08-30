import React, { useState, useEffect } from "react";
import styled from "styled-components";

import QuestionForm from "./components/QuestionForm";
import QuestionList from "./components/QuestionList";
import Sticky from "./components/Sticky";
// import listenForWindowEvents from "./util/windowEvents";

const AppContainer = styled.div`
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 300px;
`;

const App = () => {
  const [userId, setUserId] = useState(null);
  const search = window.location.search;
  const params = new URLSearchParams(search);

  useEffect(() => {
    // normally we don't want to interact with the global location
    // but this allows us to grab the user id from the iframe
    setUserId(params.get("user"));
  }, []);

  const talkId = params.get("talk");
  if (!talkId) {
    return (
      <AppContainer>
        <h2 style={{ color: "#112378", textAlign: "center" }}>
          Q&A will open once the talks begin
        </h2>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Sticky>
        <QuestionForm user={userId} />
      </Sticky>
      <QuestionList user={userId} />
    </AppContainer>
  );
};

export default App;
