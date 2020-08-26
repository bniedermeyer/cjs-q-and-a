let arc = require("@architect/functions");
let data = require("@begin/data");
let getUnixTime = require("date-fns/getUnixTime");

exports.handler = arc.http.async(clearQuestions);

async function clearQuestions() {
  const allowClearQuestions = process.env.QA_CLEAR_QUESTIONS || false;
  if (allowClearQuestions) {
    const table = "questions";
    const ttl = getUnixTime(new Date());
    const updateQuestionTTL = ({ key, question, timesAsked }) => ({
      table,
      key,
      question,
      timesAsked,
      ttl,
    });

    let response = await data.get({ table });
    let dataToRemove = response
      // only update questions that will expire later
      // and don't include the cursor
      .filter((question) => question.key && question.ttl > ttl)
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
