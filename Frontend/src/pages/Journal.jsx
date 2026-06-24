import React, { useContext, useState } from 'react';
import { MockDBContext } from '../context/MockDBContext';
import { Calendar, AlignLeft, Sparkles, Plus, BookOpen, Smile, Frown, Coffee, Target, Compass } from 'lucide-react';

export default function Journal() {
  const { journals, addJournal } = useContext(MockDBContext);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'timeline'
  const [typeFilter, setTypeFilter] = useState('Daily'); // 'Daily' | 'Monthly' | 'Yearly'
  
  // Editor States
  const [text, setText] = useState('');
  const [mood, setMood] = useState('focused');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [editorSummary, setEditorSummary] = useState('');
  const [editorSuccess, setEditorSuccess] = useState(false);

  const moods = [
    { name: 'focused', icon: <Target size={16} />, label: 'Focused', color: '#818cf8', bg: 'rgba(99,102,241,0.1)' },
    { name: 'happy', icon: <Smile size={16} />, label: 'Happy', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    { name: 'calm', icon: <Compass size={16} />, label: 'Calm', color: '#22d3ee', bg: 'rgba(6,182,212,0.1)' },
    { name: 'tired', icon: <Coffee size={16} />, label: 'Tired', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    { name: 'anxious', icon: <Frown size={16} />, label: 'Anxious', color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' }
  ];

  const handleGenerateSummary = () => {
    if (!text.trim()) return;
    setAiGenerating(true);
    setTimeout(() => {
      // Simulate basic AI summary mapping
      const keyWords = [];
      if (text.toLowerCase().includes('mongodb')) keyWords.push('Optimized MongoDB pipeline stages.');
      if (text.toLowerCase().includes('redis')) keyWords.push('Worked on caching invalidation mechanics.');
      if (text.toLowerCase().includes('docker')) keyWords.push('Docker configuration adjustments.');
      if (text.toLowerCase().includes('tired')) keyWords.push('Rested due to exhaustion.');
      
      const summaryText = keyWords.length > 0 
        ? keyWords.join(' ')
        : `Reflected on personal progress. Energy level logged as ${mood}. Focus maintained on key tasks.`;

      setEditorSummary(summaryText);
      setAiGenerating(false);
    }, 1000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    addJournal({
      date: customDate,
      mood,
      text,
      aiSummary: editorSummary || 'Reflections captured in personal journal.',
      type: typeFilter
    });

    setEditorSuccess(true);
    setText('');
    setEditorSummary('');
    setTimeout(() => setEditorSuccess(false), 3000);
  };

  // Filter journals
  const filteredJournals = journals.filter(j => j.type === typeFilter);

  // Quick helper to fetch mood object
  const getMoodObj = (moodName) => moods.find(m => m.name === moodName) || moods[0];

  return (
    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
      
      {/* Left Column: Calendar / Timeline View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Toggle Head */}
        <div className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
          {/* Daily/Monthly/Yearly filter */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Daily', 'Monthly', 'Yearly'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`btn ${typeFilter === type ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Calendar/Timeline layout selector */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                background: viewMode === 'calendar' ? 'rgba(255,255,255,0.08)' : 'none',
                border: 'none',
                color: viewMode === 'calendar' ? 'white' : 'var(--text-secondary)',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem'
              }}
            >
              <Calendar size={14} /> Grid Map
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              style={{
                background: viewMode === 'timeline' ? 'rgba(255,255,255,0.08)' : 'none',
                border: 'none',
                color: viewMode === 'timeline' ? 'white' : 'var(--text-secondary)',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem'
              }}
            >
              <AlignLeft size={14} /> Timeline
            </button>
          </div>
        </div>

        {/* View content container */}
        <div className="card-glass" style={{ flex: 1, minHeight: '400px' }}>
          
          {viewMode === 'calendar' ? (
            /* Calendar View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{typeFilter} Reflection Calendar</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>June 2026</span>
              </div>

              {/* Grid 7 Columns for Days */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <div key={idx} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>{day}</div>
                ))}
                
                {/* 1st to 30th elements */}
                {Array.from({ length: 30 }).map((_, index) => {
                  const dayNum = index + 1;
                  const dateString = `2026-06-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                  
                  // Match with database journals
                  const matchedJ = journals.find(j => j.date === dateString && j.type === typeFilter);
                  const moodObj = matchedJ ? getMoodObj(matchedJ.mood) : null;

                  return (
                    <div
                      key={index}
                      title={matchedJ ? `${matchedJ.date}: ${matchedJ.aiSummary}` : `${dateString}: No Entry`}
                      style={{
                        paddingBottom: '100%',
                        borderRadius: '8px',
                        background: moodObj ? moodObj.color : 'rgba(255,255,255,0.02)',
                        opacity: moodObj ? 0.75 : 1,
                        border: '1px solid var(--border-color)',
                        position: 'relative',
                        cursor: matchedJ ? 'pointer' : 'default',
                        transition: 'transform 0.2s ease'
                      }}
                      className={matchedJ ? 'hover-bright' : ''}
                    >
                      <span style={{
                        position: 'absolute',
                        top: '4px',
                        left: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: moodObj ? '#ffffff' : 'var(--text-secondary)'
                      }}>
                        {dayNum}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Timeline View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>Journal Logs ({filteredJournals.length})</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredJournals.length === 0 ? (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textAlign: 'center', padding: '40px 0' }}>No journal entries logged under this category.</p>
                ) : (
                  filteredJournals.map(j => {
                    const moodObj = getMoodObj(j.mood);
                    return (
                      <div
                        key={j.id}
                        style={{
                          borderLeft: `2px solid ${moodObj.color}`,
                          paddingLeft: '14px',
                          background: 'rgba(255, 255, 255, 0.01)',
                          border: '1px solid var(--border-color)',
                          borderLeftWidth: '3px',
                          borderLeftColor: moodObj.color,
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{j.date}</span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.7rem',
                              background: moodObj.bg,
                              color: moodObj.color,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 600
                            }}
                          >
                            {moodObj.icon} {moodObj.label}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '8px' }}>
                          "{j.text}"
                        </p>
                        {j.aiSummary && (
                          <div style={{ background: 'rgba(99,102,241,0.04)', padding: '6px 10px', borderRadius: '4px', border: '1px solid rgba(99,102,241,0.08)', fontSize: '0.75rem', color: 'var(--color-primary)' }}>
                            <strong style={{ fontWeight: 600 }}>AI Brief:</strong> {j.aiSummary}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Right Column: Writing Workspace */}
      <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>New Reflection Workspace</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>Capture daily updates and reflections into your Second Brain.</p>
        </div>

        {editorSuccess && (
          <div style={{
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            color: 'var(--color-emerald)',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem'
          }}>
            Reflection saved to knowledge database successfully!
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          
          {/* Date Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Log Date</label>
            <input
              type="date"
              className="input-glass"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
            />
          </div>

          {/* Mood Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Today's Vibe</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {moods.map(m => (
                <button
                  type="button"
                  key={m.name}
                  onClick={() => setMood(m.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: mood === m.name ? m.color : 'rgba(255,255,255,0.03)',
                    color: mood === m.name ? 'white' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: mood === m.name ? m.color : 'var(--border-color)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Input */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Text Entry</label>
            <textarea
              className="input-glass"
              placeholder="What did you learn? What did you achieve? Write your mind..."
              style={{
                flex: 1,
                minHeight: '180px',
                resize: 'none',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                lineHeight: '1.6'
              }}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* AI summaries section inside workspace */}
          {text.trim() && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>AI Journal Digest</span>
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={aiGenerating}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sparkles size={12} style={{ color: 'var(--color-purple)' }} />
                  {aiGenerating ? 'Analyzing...' : 'Generate summary'}
                </button>
              </div>

              {editorSummary && (
                <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99,102,241,0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                  {editorSummary}
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!text.trim()}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Save Journal Node
          </button>

        </form>
      </div>

    </div>
  );
}
