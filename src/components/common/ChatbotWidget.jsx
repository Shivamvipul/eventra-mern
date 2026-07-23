import React, { useState } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { aiService } from '../../services/aiService';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: "Hi! I'm the Eventra assistant. Ask me about bookings, tickets, or refunds." }]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);
    try {
      const { data } = await aiService.chat(input);
      setMessages((m) => [...m, { from: 'bot', text: data.data.reply }]);
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-96 w-80 flex-col rounded-xl border border-ink/10 bg-surface-light shadow-xl dark:border-paper/10 dark:bg-surface-dark">
          <div className="flex items-center justify-between rounded-t-xl bg-primary-500 px-4 py-3 text-white">
            <span className="font-semibold">Event Assistant</span>
            <button onClick={() => setOpen(false)}><FiX /></button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.from === 'bot' ? 'bg-ink/5 dark:bg-paper/10' : 'ml-auto bg-primary-500 text-white'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-ink/10 p-3 dark:border-paper/10">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask a question..."
              className="input-field text-sm"
            />
            <button onClick={send} disabled={sending} className="btn-primary !px-3"><FiSend size={14} /></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg">
        <FiMessageCircle size={22} />
      </button>
    </div>
  );
}
