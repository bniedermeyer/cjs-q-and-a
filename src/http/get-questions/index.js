let arc = require("@architect/functions");
let data = require("@begin/data");

exports.handler = arc.http.async(questions);

/**
 * Retrieves the list of active questions from Begin Data and
 * returns a list sorted by times the question has been asked descending
 */
async function questions(req) {
  console.log(req.queryStringParameters);
  const { talkId, debug } = req.queryStringParameters;
  console.info("fetching questions for ", talkId);
  const table = "questions";
  try {
    let questions = await data.get({ table });

    if (questions.cursor) {
      // questions remaining data from begin
      const cursor = questions.cursor;
      const nextPage = await data.get({ table, cursor });
      questions = questions.concat(nextPage);
    }
    const sortedQuestions = questions
      .filter((question) => question.talkId === talkId)
      .map((question) => ({
        ...question,
        timesAsked: question.upvotedBy.length,
      }))
      .sort((a, b) => b.timesAsked - a.timesAsked);

    if (debug) {
      const response = { questions, req };
      return { body: JSON.stringify(response) };
    } else {
      return { body: JSON.stringify(sortedQuestions) };
    }
  } catch (error) {
    console.error(error.message);
    console.error(error);
  }
}
