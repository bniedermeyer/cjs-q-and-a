let arc = require("@architect/functions");
let data = require("@begin/data");

exports.handler = arc.http.async(deleteQuestion);

/**
 * Retrieves the list of active questions from Begin Data and
 * returns a list sorted by times the question has been asked descending
 */
async function deleteQuestion(req) {
  const queryString = req.queryStringParameters;

  if (!queryString || !queryString.key) {
    return { statusCode: 400 };
  }
  console.info("deleting question ", queryString.key);
  const table = "questions";
  await data.destroy({ table, key: queryString.key });

  return { statusCode: 200 };
}
