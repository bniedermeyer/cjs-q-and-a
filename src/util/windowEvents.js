const listenForWindowEvents = () => {
  window.addEventListener("message", (event) => {
    const origin = event.origin || event.originalEvent.origin;
    if (!origin.match(/(cascadiajs.com$|localhost:3333$)/gi)) {
      return;
    }
    console.log(origin);
    if (
      typeof event.data === "object" &&
      event.data.call === "clearQuestions"
    ) {
      const settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch("/clear-questions", settings).then(() =>
        console.log("clearing questions")
      );
    }
  });
};

export default listenForWindowEvents;
