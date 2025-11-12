const formatConversation = (conversationHistory) => {
  return conversationHistory
    .map(
      (item) => `${item.role === "assistant" ? "AI" : "User"}: ${item.message}`
    )
    .join("\n");
};

module.exports = formatConversation;
