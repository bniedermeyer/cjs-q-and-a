let arc = require("@architect/functions");
let data = require("@begin/data");

exports.handler = arc.http.async(deleteQuestion);

/**
 * Deletes the question for the qiven key from the database
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
