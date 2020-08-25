let arc = require("@architect/functions");
let data = require("@begin/data");

exports.handler = arc.http.async(ask);

/**
 * Adds a question to Begin Data or increments the times
 * the question has been asked.
 */
async function ask(req) {
  const { question, key } = req.body;
  try {
    if (question) {
      //only keep each question for 30 minutes. This will help prevent having to clear questions
      const ttl = Date.now() / 1000 + 1800;

      await data.set({
        table: "questions",
        timesAsked: 1,
        question,
        ttl,
      });
      return { statusCode: 201 };
    }

    if (key) {
      await data.incr({
        table: "questions",
        prop: "timesAsked",
        key,
      });
      return { statusCode: 200 };
    }
  } catch (error) {
    return { statusCode: 500, message: error.message };
  }

  // either question or key are required
  return { statusCode: 400 };
}
