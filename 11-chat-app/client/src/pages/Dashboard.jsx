// client/src/pages/Dashboard.jsx
// Global real-time chat room displaying message history, live messages, and online user count

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import API from '../api/axios';
import { useAuth } from '../context/useAuth';

const SOCKET_URL = 'http://localhost:5000';

const Dashboard = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load message history via REST API
  useEffect(() => {
    let ignore = false;

    API.get('/messages')
      .then((res) => {
        if (!ignore) {
          setMessages(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load message history:', err);
          setError(err.response?.data?.message || 'Failed to load message history.');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem('token');

    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      if (token) {
        socket.emit('authenticate', token);
      }
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    // Receive updated online user count
    socket.on('onlineCount', (count) => {
      setOnlineCount(count);
    });

    // Receive real-time message
    socket.on('receiveMessage', (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) {
          return prev;
        }
        return [...prev, newMsg];
      });
    });

    socket.on('chatError', (err) => {
      console.error('Chat error:', err);
      alert(err.message || 'Error sending message');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Send message handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const token = localStorage.getItem('token');

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', {
        text: trimmed,
        token,
      });
      setInputText('');
    } else {
      // Fallback to HTTP POST if socket is temporarily disconnected
      API.post('/messages', { text: trimmed })
        .then((res) => {
          setMessages((prev) => {
            if (prev.some((m) => m._id === res.data._id)) return prev;
            return [...prev, res.data];
          });
          setInputText('');
        })
        .catch((err) => {
          alert(err.response?.data?.message || 'Failed to send message.');
        });
    }
  };

  // Helper to format timestamps
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-dashboard">
      {/* Chat Room Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>Global Chat Room</h2>
          <p className="chat-subtitle">Real-time chat with everyone online</p>
        </div>
        <div className="online-indicator">
          <span className={`status-dot ${socketConnected ? 'connected' : 'disconnected'}`}></span>
          <span className="online-text">
            <strong>{onlineCount}</strong> {onlineCount === 1 ? 'user' : 'users'} online
          </span>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Chat Messages Container */}
      <div className="chat-messages-container">
        {loading ? (
          <div className="chat-state-message">Loading message history...</div>
        ) : messages.length === 0 ? (
          <div className="chat-state-message">
            No messages yet. Send the first message to start chatting!
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => {
              const senderId =
                typeof msg.sender === 'object' && msg.sender !== null
                  ? msg.sender._id
                  : msg.sender;
              const isMe = user && senderId && user._id === senderId;
              const senderName =
                typeof msg.sender === 'object' && msg.sender !== null
                  ? msg.sender.name
                  : 'Unknown';

              return (
                <div
                  key={msg._id || `${msg.createdAt}-${Math.random()}`}
                  className={`message-row ${isMe ? 'my-row' : 'other-row'}`}
                >
                  <div className={`message-bubble ${isMe ? 'my-bubble' : 'other-bubble'}`}>
                    <div className="message-meta">
                      <span className="sender-name">{isMe ? 'You' : senderName}</span>
                      <span className="message-time">{formatTime(msg.createdAt)}</span>
                    </div>
                    <div className="message-text">{msg.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          className="btn btn-primary chat-send-btn"
          disabled={!inputText.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
