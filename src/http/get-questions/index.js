let arc = require("@architect/functions");
let data = require("@begin/data");
let isAfter = require("date-fns/isAfter");
let parseISO = require("date-fns/parseISO");

exports.handler = arc.http.async(questions);

/**
 * Retrieves the list of active questions from Begin Data and
 * returns a list sorted by times the question has been asked descending
 */
async function questions() {
  const questions = await data.get({ table: "questions" });
  const timeNow = new Date();
  const sortedQuestions = questions
    // do not return expired questions
    .filter(({ expiresOn }) => {
      const expireTime = parseISO(expiresOn);
      return isAfter(expireTime, timeNow);
    })
    .sort((a, b) => b.timesAsked - a.timesAsked);
  return { body: JSON.stringify(sortedQuestions) };
}
