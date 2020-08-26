let arc = require("@architect/functions");
let data = require("@begin/data");
let addMinutes = require("date-fns/addMinutes");
let getUnixTime = require("date-fns/getUnixTime");
let formatISO = require("date-fns/formatISO");

exports.handler = arc.http.async(ask);

/**
 * Adds a question to Begin Data or increments the times
 * the question has been asked.
 */
async function ask(req) {
  const { question, key } = req.body;
  try {
    if (question) {
      console.info("adding question", question);
      //only keep each question for 30 minutes. This will help prevent having to clear questions
      const expiresOn = addMinutes(new Date(), 30);

      await data.set({
        table: "questions",
        timesAsked: 1,
        question,
        ttl: getUnixTime(expiresOn),
        expiresOn: formatISO(expiresOn),
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
    console.error(error.message);
    return { statusCode: 500, message: error.message };
  }

  // either question or key are required
  return { statusCode: 400 };
}
