import React, { useState, useRef, useEffect, useCallback } from 'react';
import { apiClient } from '../../services/apiClient';

const ChatInterface = ({ role = 'technical_interviewer', roleLabel = 'AI Technical Interviewer', sessionId, onSessionCreated }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [localSessionId, setLocalSessionId] = useState(sessionId);
  const scrollRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  // Load role's greeting on mount / role change
  useEffect(() => {
    setMessages([]);
    setLocalSessionId(null);
    initRef.current = false;
    setSessionReady(false);

    const loadGreeting = async () => {
      try {
        const res = await apiClient('/roleplay/chat', {
          method: 'POST',
          body: JSON.stringify({ message: 'Start', role }),
        });
        if (res.session_id) {
          setLocalSessionId(res.session_id);
          if (onSessionCreated) onSessionCreated(res.session_id);
        }
        if (res.reply) {
          setMessages([{ sender: 'ai', text: res.reply }]);
        }
        setSessionReady(true);
      } catch (err) {
        setMessages([{
          sender: 'ai',
          text: "Hello! I'll be your AI interviewer today. Tell me about yourself and the role you're preparing for.",
        }]);
        setSessionReady(true);
      }
      initRef.current = true;
    };
    loadGreeting();
  }, [role]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending || !sessionReady) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setSending(true);
    setError('');

    try {
      const res = await apiClient('/roleplay/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: userText,
          role,
          session_id: localSessionId,
        }),
      });

      if (res.session_id && !localSessionId) {
        setLocalSessionId(res.session_id);
        if (onSessionCreated) onSessionCreated(res.session_id);
      }

      let replyText = res.reply || '—';
      if (res.evaluation) {
        replyText += `\n\n--- Evaluation ---\nScore: ${res.evaluation.score}/100\n${res.evaluation.feedback || ''}`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    } catch (err) {
      setError(err.detail || err.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  }, [input, sending, sessionReady, role, localSessionId, onSessionCreated]);

  const roleIcons = {
    technical_interviewer: '💻',
    hr_interviewer: '🤝',
    career_mentor: '🧭',
    skill_assessor: '📊',
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900 text-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-black text-sm">{roleIcons[role] || '🤖'}</div>
        <div className="flex-1">
          <p className="text-sm font-bold">{roleLabel}</p>
          <p className="text-[10px] font-medium text-slate-300">Live AI Roleplay Session {localSessionId ? '• Active' : '• Starting...'}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
        {!initRef.current && messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-5 rounded-2xl text-sm font-medium leading-relaxed bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-center text-slate-400">Preparing your session...</p>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-100 text-red-600 text-xs font-semibold">{error}</div>
      )}

      {/* Input */}
      <div className="p-5 bg-white border-t border-slate-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={sessionReady ? 'Type your response...' : 'Preparing...'}
            disabled={sending || !sessionReady}
            className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim() || !sessionReady}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
