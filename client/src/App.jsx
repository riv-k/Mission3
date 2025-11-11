import { useState } from "react";

function App() {
  const [messages, setMessages] = useState([{ role: "ai", text: "Tell me about yourself." }]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="app-container">
      <h1>AI Job Interview Practice</h1>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>{msg.text}</div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your answer..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
