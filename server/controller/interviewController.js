const aiService = require('../services/aiService');

exports.handleAnswer = async (req, res) => {
  const { jobTitle, userAnswer } = req.body;

  // Placeholder for AI call
  const aiResponse = await aiService.getResponse(jobTitle, userAnswer);

  res.json({
    userAnswer,
    aiResponse
  });
};

exports.getStatus = (req, res) => {
  res.json({ status: "Interview bot backend ready" });
};
