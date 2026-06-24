import React, { useContext, useState, useEffect, useRef } from 'react';
import { MockDBContext } from '../context/MockDBContext';
import { Sparkles, Send, Brain, Bookmark, FileText, CheckCircle2, BookOpen, Calendar, HelpCircle } from 'lucide-react';

export default function AIAssistant({ aiQuery, setAiQuery }) {
  const { askAI, notes, resources, tasks, goals, journals } = useContext(MockDBContext);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState([
    { id: 't-1', title: 'MongoDB Aggregations Overview' },
    { id: 't-2', title: 'Redis Cache Consistency' },
    { id: 't-3', title: 'June Learning Roadmap' }
  ]);
  const [activeThreadId, setActiveThreadId] = useState(null);

  // Selected item modal for citation review
  const [selectedCitation, setSelectedCitation] = useState(null);

  const messagesEndRef = useRef(null);

  const promptSuggestions = [
    "What did I do about MongoDB?",
    "Show everything I learned about Redis.",
    "What goals did I complete this month?",
    "Summarize my backend learning journey."
  ];

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle external query from Dashboard/Header
  useEffect(() => {
    if (aiQuery) {
      handleSend(aiQuery);
      setAiQuery(''); // Reset external query trigger
    }
  }, [aiQuery]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    // Append User Message
    const userMsg = { sender: 'user', text: query, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    // Call Mock AI response after short delay
    setTimeout(() => {
      const responseData = askAI(query);
      const aiMsg = {
        sender: 'ai',
        text: responseData.text,
        citations: responseData.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);

      // Create new thread header if query is unique
      const threadTitle = query.length > 28 ? query.substring(0, 25) + '...' : query;
      setThreads(prev => {
        if (prev.some(t => t.title.toLowerCase() === threadTitle.toLowerCase())) return prev;
        return [{ id: `t-${Date.now()}`, title: threadTitle }, ...prev];
      });
    }, 1200);
  };

  const loadThread = (threadTitle) => {
    setLoading(true);
    setMessages([]);
    setTimeout(() => {
      const responseData = askAI(threadTitle);
      setMessages([
        { sender: 'user', text: threadTitle, timestamp: '10:00 AM' },
        { sender: 'ai', text: responseData.text, citations: responseData.citations, timestamp: '10:01 AM' }
      ]);
      setLoading(false);
    }, 500);
  };

  const handleCitationClick = (type, item) => {
    setSelectedCitation({ type, data: item });
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '20px' }}>
      
      {/* Thread History Sidebar */}
      <div className="card-glass" style={{ width: '220px', display: 'flex', flexDirection: 'column', padding: '16px', gap: '14px', flexShrink: 0 }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Chat History
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
          {threads.map(thread => (
            <button
              key={thread.id}
              onClick={() => {
                setActiveThreadId(thread.id);
                loadThread(thread.title);
              }}
              style={{
                textLeft: 'left',
                padding: '8px 12px',
                borderRadius: '8px',
                background: activeThreadId === thread.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                border: 'none',
                color: activeThreadId === thread.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                textAlign: 'left',
                cursor: 'pointer',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
              className="hover-bright"
            >
              {thread.title}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setMessages([]);
            setActiveThreadId(null);
          }}
          className="btn btn-secondary"
          style={{ width: '100%', padding: '8px', fontSize: '0.8rem' }}
        >
          New Chat Thread
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="card-glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
        
        {/* Chat Message Window */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.length === 0 ? (
            /* Splash Welcome state */
            <div style={{ margin: 'auto', maxWidth: '500px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px 0' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '20px', borderRadius: '50%', margin: '0 auto', color: 'var(--color-primary)' }}>
                <Brain size={40} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Ask your Synora AI</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Ask anything about your notes, saved links, daily journal updates, learning checklists, or milestones. The assistant queries only your stored information.
              </p>

              {/* Suggestions Grid */}
              <div className="chat-suggestions">
                {promptSuggestions.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="chat-suggestion-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Sparkles size={14} style={{ color: 'var(--color-purple)' }} />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Suggested Query</span>
                    </div>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active message listing */
            messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                {/* Avatar Icon */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: msg.sender === 'user' ? 'rgba(255,255,255,0.06)' : 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'white',
                  flexShrink: 0
                }}>
                  {msg.sender === 'user' ? 'U' : 'AI'}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* Msg Box */}
                  <div
                    className={msg.sender === 'ai' ? 'ai-answer-card' : ''}
                    style={{
                      background: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.04)' : undefined,
                      border: msg.sender === 'user' ? '1px solid var(--border-color)' : undefined,
                      borderRadius: msg.sender === 'user' ? '16px 4px 16px 16px' : undefined,
                      padding: msg.sender === 'user' ? '12px 16px' : '0px', // AI uses card styles inside div
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {/* Render AI styling cleanly */}
                    {msg.text}
                  </div>

                  {/* Message Timestamp */}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    {msg.timestamp}
                  </span>

                  {/* Render citations if available */}
                  {msg.sender === 'ai' && msg.citations && (
                    <div style={{ marginTop: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <Brain size={12} style={{ color: 'var(--color-primary)' }} />
                        Citations from Synora database:
                      </span>
                      <div className="citation-container">
                        {/* Note Citations */}
                        {msg.citations.notes?.map(n => (
                          <div key={n.id} onClick={() => handleCitationClick('Note', n)} className="citation-card" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={14} style={{ color: 'var(--color-primary)' }} />
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{n.title}</span>
                          </div>
                        ))}
                        {/* Resource Citations */}
                        {msg.citations.resources?.map(r => (
                          <div key={r.id} onClick={() => handleCitationClick('Resource', r)} className="citation-card" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bookmark size={14} style={{ color: 'var(--color-cyan)' }} />
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{r.title}</span>
                          </div>
                        ))}
                        {/* Task Citations */}
                        {msg.citations.tasks?.map(t => (
                          <div key={t.id} onClick={() => handleCitationClick('Task', t)} className="citation-card" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle2 size={14} style={{ color: 'var(--color-emerald)' }} />
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{t.title}</span>
                          </div>
                        ))}
                        {/* Goal Citations */}
                        {msg.citations.goals?.map(g => (
                          <div key={g.id} onClick={() => handleCitationClick('Goal', g)} className="citation-card" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Brain size={14} style={{ color: 'var(--color-purple)' }} />
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{g.title} ({g.progress}%)</span>
                          </div>
                        ))}
                        {/* Journal Citations */}
                        {msg.citations.journals?.map(j => (
                          <div key={j.id} onClick={() => handleCitationClick('Journal', j)} className="citation-card" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={14} style={{ color: 'var(--color-amber)' }} />
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Journal: {j.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Typing Loading Indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: '14px', alignSelf: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>AI</div>
              <div className="card-glass" style={{ padding: '12px 20px', borderRadius: '16px', display: 'inline-flex', alignItems: 'center' }}>
                <span className="typing-dots">
                  <span></span><span></span><span></span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Text Form */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{
            marginTop: '20px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            className="input-glass"
            placeholder="Ask anything about MongoDB optimization, caching, habits, notes..."
            style={{ paddingRight: '50px', paddingLeft: '16px', height: '48px', borderRadius: '12px' }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            style={{
              position: 'absolute',
              right: '8px',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'var(--primary-gradient)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: inputValue.trim() ? 1 : 0.4,
              transition: 'opacity var(--transition-fast)'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Citation Review Modal */}
      {selectedCitation && (
        <div className="modal-overlay" onClick={() => setSelectedCitation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={18} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Synora {selectedCitation.type} Source
                </span>
              </div>
              <button onClick={() => setSelectedCitation(null)} className="btn-icon" style={{ width: '28px', height: '28px', borderRadius: '6px' }}>×</button>
            </div>

            {/* Note details */}
            {selectedCitation.type === 'Note' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedCitation.data.title}</h3>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedCitation.data.tags.map((t, i) => (
                    <span key={i} className="badge badge-medium">{t}</span>
                  ))}
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  padding: '16px',
                  borderRadius: '8px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  fontFamily: 'var(--font-body)',
                  whiteSpace: 'pre-wrap',
                  color: 'var(--text-primary)'
                }}>
                  {selectedCitation.data.content}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Last modified: {selectedCitation.data.lastModified}</span>
              </div>
            )}

            {/* Resource Details */}
            {selectedCitation.type === 'Resource' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, flex: 1 }}>{selectedCitation.data.title}</h3>
                  <span style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--color-cyan)', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    {selectedCitation.data.type}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedCitation.data.tags.map((t, i) => (
                    <span key={i} className="badge badge-medium">{t}</span>
                  ))}
                </div>
                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '14px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>AI Scraper Summary:</div>
                  <p style={{ color: 'var(--text-primary)' }}>{selectedCitation.data.summary}</p>
                </div>
                <a href={selectedCitation.data.url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                  Open Link URL
                </a>
              </div>
            )}

            {/* Task Details */}
            {selectedCitation.type === 'Task' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedCitation.data.title}</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className={`badge badge-${selectedCitation.data.priority.toLowerCase()}`}>{selectedCitation.data.priority}</span>
                  <span style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>
                    Status: {selectedCitation.data.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {selectedCitation.data.description}
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Due date: {selectedCitation.data.dueDate}</div>
              </div>
            )}

            {/* Goal Details */}
            {selectedCitation.type === 'Goal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedCitation.data.title}</h3>
                  <span className="text-gradient" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedCitation.data.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${selectedCitation.data.progress}%`, height: '100%', background: 'var(--primary-gradient)' }}></div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Milestone Progress:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedCitation.data.milestones.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                        <input type="checkbox" checked={m.completed} readOnly style={{ accentColor: 'var(--color-primary)' }} />
                        <span style={{ color: m.completed ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: m.completed ? 'line-through' : 'none' }}>
                          {m.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Journal Details */}
            {selectedCitation.type === 'Journal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Journal Entry: {selectedCitation.data.date}</h3>
                  <span className="badge badge-medium" style={{ textTransform: 'capitalize' }}>Mood: {selectedCitation.data.mood}</span>
                </div>
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: 'var(--text-primary)',
                  background: 'rgba(0,0,0,0.15)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  "{selectedCitation.data.text}"
                </p>
                <div style={{ background: 'rgba(99,102,241,0.06)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-primary)', marginBottom: '4px' }}>AI Journal Summary:</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedCitation.data.aiSummary}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
