import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Tell me about yourself." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "ai", text: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "ai", text: "⚠️ Oops! Couldn't reach the AI server." },
      ]);
    }
  };

  return (
    <div className="app-container">
      <h1>AI Job Interview Practice</h1>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your answer..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
