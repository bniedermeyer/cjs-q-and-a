let arc = require("@architect/functions");
let data = require("@begin/data");

exports.handler = arc.http.async(ask);

/**
 * Adds a question to Begin Data or increments the times
 * the question has been asked.
 */
async function ask(req) {
  const { question, key, user, talkId } = req.body;
  if (user && (question || key)) {
    try {
      if (question) {
        console.info(`user ${user} asked question ${question}`);

        await data.set({
          table: "questions",
          question,
          talkId,
          askedBy: user,
          upvotedBy: [user],
        });
        return { statusCode: 201 };
      }

      if (key) {
        const votedQuestion = await data.get({ table: "questions", key });
        if (votedQuestion.upvotedBy.includes(user)) {
          console.info(`user ${user} already voted for ${key}`);
          return { statusCode: 200 };
        }

        await data.set({
          ...votedQuestion,
          upvotedBy: [...votedQuestion.upvotedBy, user],
        });
        return { statusCode: 200 };
      }
    } catch (error) {
      console.error(error.message);
      return { statusCode: 500, message: error.message };
    }
  }

  // either question or key are required
  return { statusCode: 400 };
}
