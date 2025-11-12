const aiService = require("../services/aiService");
const { buildInterviewPrompt } = require("../helpers/promptBuilder");

exports.handleAnswer = async (req, res) => {
  try {
    const { jobTitle, conversationHistory } = req.body;

    if (!jobTitle || !conversationHistory) {
      return res
        .status(400)
        .json({ error: "jobTitle and conversationHistory are required." });
    }

    const prompt = buildInterviewPrompt(jobTitle, conversationHistory);
    const aiResponse = await aiService.getResponse(prompt);

    res.json({ aiResponse });
  } catch (err) {
    console.error("Interview Error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong with the AI interview service." });
  }
};

exports.getStatus = (req, res) => {
  res.json({ status: "Interview bot backend ready" });
};
