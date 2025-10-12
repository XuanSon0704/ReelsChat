// Đây là file React giả lập để minh họa.
// Bạn cần một môi trường build đầy đủ (như Vite hoặc Create React App) để chạy.
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Kết nối tới backend. URL này sẽ được inject qua ConfigMap trong K8s.
const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:3001");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState('User' + Math.round(Math.random() * 1000));

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input) {
      const message = { user, text: input };
      socket.emit('chat message', message);
      setInput('');
    }
  };

  return (
    <div>
      <h1>Hybrid Chat App</h1>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}><strong>{msg.user}:</strong> {msg.text}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;
