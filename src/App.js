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
  const [talkId, setTalkId] = useState(null);
  const [allowPolling, setAllowPolling] = useState(true);

  useEffect(() => {
    const initialData = window.location.hash.replace(/#/, "");
    const [userIdData, talkIdData] = initialData.split("_");
    // normally we don't want to interact with the global location
    // but this allows us to grab the user id from the iframe
    setUserId(userIdData);
    setTalkId(talkIdData);
  }, []);

  useEffect(() => {
    const pollForTalk = async () => {
      const interval = 300;
      while (allowPolling) {
        await new Promise((res) => setTimeout(res, interval));
        const talkIdData = window.location.hash.replace(/#/, "").split("_")[1];
        console.log(talkIdData);
        setTalkId(talkIdData);
      }
    };
    pollForTalk();

    return () => setAllowPolling(false);
  }, [allowPolling]);

  return (
    <AppContainer>
      <Sticky>
        <QuestionForm user={userId} talkId={talkId} />
      </Sticky>
      <QuestionList user={userId} talkId={talkId} />
    </AppContainer>
  );
};

export default App;
