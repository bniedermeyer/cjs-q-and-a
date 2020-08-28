let arc = require("@architect/functions");
let data = require("@begin/data");

exports.handler = arc.http.async(clearQuestions);

async function clearQuestions() {
  const allowClearQuestions = process.env.QA_CLEAR_QUESTIONS || false;
  if (allowClearQuestions) {
    const table = "questions";
    const formatForDelete = ({ key }) => ({
      table,
      key,
    });

    let response = await data.get({ table });
    let dataToRemove = response.map(formatForDelete);

    if (response.cursor) {
      // fetch remaining data from begin
      const cursor = response.cursor;
      const nextPage = await data.get({ table, cursor });
      dataToRemove = dataToRemove.concat(nextPage.map(formatForDelete));
    }

    console.info("Removing all questions", dataToRemove);
    await data.destroy(dataToRemove);
  }

  return { statusCode: 200 };
}
