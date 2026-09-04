import React, { useState } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I will be conducting your technical interview today. Can you explain the difference between supervised and unsupervised learning?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    // Simulate AI typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: 'That is a great explanation. How would you handle missing values in a dataset using Pandas?' }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[80%] p-5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-sm' 
                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 bg-white border-t border-slate-100">
        <div className="flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your response..." 
            className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-sm font-medium"
          />
          <button 
            onClick={handleSend}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
