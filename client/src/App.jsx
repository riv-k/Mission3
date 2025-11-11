import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [jobTitle, setJobTitle] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const startInterview = () => {
    if (!jobTitle.trim()) {
      alert("Please enter a job title to start the interview.");
      return;
    }
    setMessages([{ role: "ai", text: "Tell me about yourself." }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const updated = [...messages, { role: "user", text: input }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("jobTitle", jobTitle);
      formData.append("conversation", JSON.stringify(updated));

      const res = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": API_KEY,
        },
      });

      const aiMessage = res.data.reply || "Hmm, can you clarify that?";
      setMessages([...updated, { role: "ai", text: aiMessage }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updated,
        { role: "ai", text: "⚠️ Error reaching the AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const restartInterview = () => {
    setMessages([]);
    setJobTitle("");
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
