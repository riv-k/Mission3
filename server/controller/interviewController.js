const aiService = require("../services/aiService");
const { buildInterviewPrompt } = require("../helpers/promptBuilder");

exports.handleAnswer = async (req, res) => {
  const { jobTitle, conversationHistory } = req.body;

  const prompt = buildInterviewPrompt(jobTitle, conversationHistory);

  // Placeholder for AI call
  const aiResponse = await aiService.getResponse(prompt);

  res.json({
    aiResponse,
  });
};

exports.getStatus = (req, res) => {
  res.json({ status: "Interview bot backend ready" });
};
