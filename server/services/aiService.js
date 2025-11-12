const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Retry logic for handling model overloads
const MAX_RETRIES = 3;

exports.getResponse = async (prompt) => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return response.text;
    } catch (err) {
      if (err.status === 503 && i < MAX_RETRIES - 1) {
        console.warn("Model overloaded, retrying...", i + 1);
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i))); // Exponential backoff
      } else {
        throw err;
      }
    }
  }
};
