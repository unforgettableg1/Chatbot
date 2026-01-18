import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';

export default function Chat() {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
  }, [projectId]);

  const loadChats = async () => {
    try {
      const { data } = await api.get(`/chat/${projectId}`);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    setMessages([...messages, { prompt: userMessage, response: '...' }]);

    try {
      const { data } = await api.post('/chat', {
        prompt: userMessage,
        projectId,
      });
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = data;
        return newMessages;
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to get AI response. Please check your Hugging Face API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">
          <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
          <h2>AI Chat</h2>
        </div>
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div className="message user">{msg.prompt}</div>
              <div className="message ai">{msg.response}</div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="chat-input">
          <input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </>
  );
}
