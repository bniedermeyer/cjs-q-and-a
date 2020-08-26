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
    .filter(({ key, question, expiresOn }) => {
      const expireTime = parseISO(expiresOn);
      const notExpired = isAfter(expireTime, timeNow);
      if (!notExpired) {
        console.log(`Question ${key} is expired: ${question} - ${expiresOn}`);
      }
      return notExpired;
    })
    .sort((a, b) => b.timesAsked - a.timesAsked);
  return { body: JSON.stringify(sortedQuestions) };
}
