import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  // Load saved data from localStorage
  const [jobTitle, setJobTitle] = useState(() => localStorage.getItem("jobTitle") || "");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("conversationHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Persist jobTitle and messages
  useEffect(() => {
    localStorage.setItem("jobTitle", jobTitle);
    localStorage.setItem("conversationHistory", JSON.stringify(messages));
  }, [jobTitle, messages]);

  // Start interview with local starter message
  const startInterview = () => {
    if (!jobTitle.trim()) {
      alert("Please enter a job title to start the interview.");
      return;
    }

    if (messages.length === 0) {
      setMessages([{ role: "ai", text: "Tell me about yourself." }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message locally
    const updatedMessages = [...messages, { role: "user", text: input }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Only send the **latest user message** to the backend
      const latestUserMessage = updatedMessages
        .filter(msg => msg.role === "user")
        .slice(-1)
        .map(msg => ({ role: "user", content: msg.text }));

      const res = await axios.post(
        API_URL,
        {
          jobTitle,
          conversationHistory: latestUserMessage, // <-- only latest user message
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );

      const aiMessage = res.data.aiResponse || "Hmm, can you clarify that?";

      // Add AI message locally
      setMessages([...updatedMessages, { role: "ai", text: aiMessage }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        { role: "ai", text: "⚠️ Error reaching the AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const restartInterview = () => {
    setMessages([]);
    setJobTitle("");
    setInput("");
    setLoading(false);
    localStorage.removeItem("jobTitle");
    localStorage.removeItem("conversationHistory");
  };

  return (
    <div className="app-container">
      <h1 className="title">AI Interview Bot</h1>

      {!messages.length ? (
        <div className="start-container">
          <input
            type="text"
            placeholder="Enter a job title (e.g. Web Developer)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="job-input"
          />
          <button className="start-btn" onClick={startInterview}>
            Start Interview
          </button>
        </div>
      ) : (
        <>
          <div className="chat-box">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="loading">AI is typing...</div>}
          </div>

          <div className="input-container">
            <input
              type="text"
              placeholder="Type your answer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} disabled={loading}>
              Send
            </button>
          </div>

          <button className="restart-btn" onClick={restartInterview}>
            🔄 Restart Interview
          </button>
        </>
      )}
    </div>
  );
}

export default App;
