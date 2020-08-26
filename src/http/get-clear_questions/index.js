let arc = require("@architect/functions");
let data = require("@begin/data");
let formatISO = require("date-fns/formatISO");
let isAfter = require("date-fns/isAfter");
let parseISO = require("date-fns/parseISO");

exports.handler = arc.http.async(clearQuestions);

async function clearQuestions() {
  const allowClearQuestions = process.env.QA_CLEAR_QUESTIONS || false;
  if (allowClearQuestions) {
    const table = "questions";
    const timeNow = new Date();
    const expiresOn = formatISO(timeNow);
    const updateQuestionTTL = (question) => ({
      ...question,
      expiresOn,
    });

    let response = await data.get({ table });
    let dataToRemove = response
      // only update questions that will expire later
      // and don't include the cursor
      .filter((question) => {
        const expireTime = parseISO(question.expiresOn);
        return question.key && isAfter(expireTime, timeNow);
      })
      .map(updateQuestionTTL);

    if (response.cursor) {
      // fetch remaining data from begin
      const cursor = response.cursor;
      const nextPage = await data.get({ table, cursor });
      dataToRemove = dataToRemove.concat(nextPage.map(updateQuestionTTL));
    }

    console.info("Hiding all questions", dataToRemove);
    await data.set(dataToRemove);
  }

  return { statusCode: 200 };
}
