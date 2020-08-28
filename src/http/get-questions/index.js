let arc = require("@architect/functions");
let data = require("@begin/data");

exports.handler = arc.http.async(questions);

/**
 * Retrieves the list of active questions from Begin Data and
 * returns a list sorted by times the question has been asked descending
 */
async function questions() {
  const table = "questions";
  let questions = await data.get({ table });

  if (questions.cursor) {
    // questions remaining data from begin
    const cursor = questions.cursor;
    const nextPage = await data.get({ table, cursor });
    questions = questions.concat(nextPage);
  }
  console.log("questions retrieved: ", questions);
  const sortedQuestions = questions
    .map((question) => ({
      ...question,
      timesAsked: question.upvotedBy.length,
    }))
    .sort((a, b) => b.timesAsked - a.timesAsked);
  return { body: JSON.stringify(sortedQuestions) };
}
