import React, { useContext, useState, useEffect } from 'react';
import { MockDBContext } from '../context/MockDBContext';
import { Plus, Search, FileText, Sparkles, BookOpen, Link, Tag, Eye, Edit3, Trash2 } from 'lucide-react';

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useContext(MockDBContext);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState('preview'); // 'edit' | 'preview'
  
  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [noteSummary, setNoteSummary] = useState('');

  // Set default note on load
  useEffect(() => {
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes]);

  // Sync fields when active note changes
  const activeNote = notes.find(n => n.id === activeNoteId);
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setTagsInput(activeNote.tags.join(', '));
      setNoteSummary(activeNote.summary || '');
    } else if (notes.length > 0) {
      // Fallback if deleted
      setActiveNoteId(notes[0].id);
    }
  }, [activeNoteId, activeNote]);

  const handleCreateNote = () => {
    const newNote = addNote({
      title: 'Untitled Note',
      content: '# Untitled Note\n\nStart writing...',
      tags: ['Idea'],
      summary: 'New note details.'
    });
    setActiveNoteId(newNote.id);
    setEditMode('edit');
  };

  const handleSave = () => {
    if (!activeNoteId) return;
    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    updateNote(activeNoteId, {
      title,
      content,
      tags: parsedTags,
      summary: noteSummary || content.substring(0, 100).replace(/[#*`[\]]/g, '') + '...'
    });
  };

  const handleGenerateSummary = () => {
    if (!content.trim()) return;
    setAiGenerating(true);
    setTimeout(() => {
      // Simple summary generation mockup
      const rawText = content.replace(/[#*`[\]]/g, '');
      const summaryResult = rawText.length > 100 
        ? rawText.substring(0, 120) + '...' 
        : 'Brief digest captured for ' + title;
      setNoteSummary(summaryResult);
      setAiGenerating(false);
      updateNote(activeNoteId, { summary: summaryResult });
    }, 1000);
  };

  // Find other notes that link to the active note (Backlinks)
  const getBacklinks = () => {
    if (!activeNote) return [];
    return notes.filter(n => 
      n.id !== activeNote.id && 
      n.content.toLowerCase().includes(`[[${activeNote.title.toLowerCase()}]]`)
    );
  };

  // Render text replacing Obsidian links [[Note Title]] with clickable HTML links
  const renderMarkdownContent = (mdText) => {
    if (!mdText) return '';
    
    // Split by [[...]] syntax
    const parts = mdText.split(/(\[\[.*?\]\])/g);
    
    return parts.map((part, idx) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const linkTitle = part.slice(2, -2);
        const linkedNote = notes.find(n => n.title.toLowerCase() === linkTitle.toLowerCase());
        
        if (linkedNote) {
          return (
            <span
              key={idx}
              onClick={() => setActiveNoteId(linkedNote.id)}
              style={{
                color: 'var(--color-primary)',
                fontWeight: 600,
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
              title={`Jump to: ${linkedNote.title}`}
            >
              {linkTitle}
            </span>
          );
        } else {
          return <span key={idx} style={{ color: 'var(--text-tertiary)' }}>{linkTitle} (broken link)</span>;
        }
      }
      
      // Basic paragraph/header mockup parser in standard HTML
      if (part.startsWith('# ')) return <h1 key={idx} style={{ fontSize: '1.6rem', margin: '14px 0 8px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>{part.slice(2)}</h1>;
      if (part.startsWith('## ')) return <h2 key={idx} style={{ fontSize: '1.25rem', margin: '12px 0 6px 0' }}>{part.slice(3)}</h2>;
      if (part.startsWith('### ')) return <h3 key={idx} style={{ fontSize: '1.05rem', margin: '10px 0 4px 0' }}>{part.slice(4)}</h3>;
      if (part.startsWith('- ')) return <li key={idx} style={{ marginLeft: '16px', margin: '4px 0', fontSize: '0.875rem' }}>{part.slice(2)}</li>;
      
      return <span key={idx} style={{ display: 'inline', whiteSpace: 'pre-wrap', fontSize: '0.875rem', lineHeight: '1.6' }}>{part}</span>;
    });
  };

  // Filter left menu list
  const filteredNotesList = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const backlinks = getBacklinks();

  return (
    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', height: 'calc(100vh - 120px)' }}>
      
      {/* Left Sidebar: Notes Explorer */}
      <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '14px' }}>
        
        {/* Actions head */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Explorer</h4>
          <button onClick={handleCreateNote} className="btn-icon" style={{ width: '26px', height: '26px', borderRadius: '4px' }} title="New Note">
            <Plus size={14} />
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={12} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="input-glass"
            placeholder="Search note tags..."
            style={{ paddingLeft: '28px', height: '30px', fontSize: '0.75rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List of Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto', paddingRight: '2px' }}>
          {filteredNotesList.map(note => (
            <div
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                background: activeNoteId === note.id ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              className="hover-bright"
            >
              <FileText size={14} style={{ color: activeNoteId === note.id ? 'var(--color-primary)' : 'var(--text-secondary)', flexShrink: 0 }} />
              <span style={{
                fontSize: '0.8rem',
                fontWeight: activeNoteId === note.id ? 600 : 500,
                color: activeNoteId === note.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1
              }}>
                {note.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Workspace Panel */}
      {activeNote ? (
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', padding: '24px', overflow: 'hidden' }}>
          
          {/* Editor Header: Title, Tags, Toolbar */}
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {/* Title input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  outline: 'none',
                  width: '70%'
                }}
              />

              {/* Edit/Preview Toggle button */}
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setEditMode('edit')}
                  style={{
                    background: editMode === 'edit' ? 'rgba(255,255,255,0.08)' : 'none',
                    border: 'none',
                    color: editMode === 'edit' ? 'white' : 'var(--text-secondary)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit3 size={12} /> Edit
                </button>
                <button
                  onClick={() => setEditMode('preview')}
                  style={{
                    background: editMode === 'preview' ? 'rgba(255,255,255,0.08)' : 'none',
                    border: 'none',
                    color: editMode === 'preview' ? 'white' : 'var(--text-secondary)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Eye size={12} /> Preview
                </button>
              </div>
            </div>

            {/* Tags + AI Summary buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
                <Tag size={12} style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)..."
                  style={{ background: 'none', border: 'none', borderBottom: '1px solid transparent', color: 'var(--text-secondary)', fontSize: '0.8rem', outline: 'none', width: '100%', padding: '2px 0' }}
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onBlur={handleSave}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={handleGenerateSummary}
                  disabled={aiGenerating}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sparkles size={12} style={{ color: 'var(--color-purple)' }} />
                  {aiGenerating ? 'AI Summary...' : 'AI Summarize'}
                </button>

                <button
                  onClick={() => {
                    deleteNote(activeNote.id);
                    setActiveNoteId(null);
                  }}
                  className="btn-icon"
                  style={{ width: '26px', height: '26px', border: 'none', background: 'none', color: 'var(--text-tertiary)' }}
                  title="Delete Note"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Edit Area or Preview Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
            
            {editMode === 'edit' ? (
              <textarea
                className="input-glass"
                style={{
                  flex: 1,
                  resize: 'none',
                  padding: '14px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  background: 'rgba(0,0,0,0.1)'
                }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleSave}
              />
            ) : (
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {renderMarkdownContent(content)}
              </div>
            )}

            {/* AI Summary display node */}
            {noteSummary && (
              <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={10} /> AI Summary Node
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{noteSummary}</span>
              </div>
            )}

            {/* Backlinks panel (Obsidian style) */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', flexShrink: 0 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link size={12} />
                Backlinks ({backlinks.length})
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {backlinks.length === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>No backlinks reference this note.</span>
                ) : (
                  backlinks.map(b => (
                    <div
                      key={b.id}
                      onClick={() => setActiveNoteId(b.id)}
                      className="citation-card"
                      style={{ padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
                    >
                      <FileText size={10} style={{ color: 'var(--color-primary)' }} />
                      <span>{b.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-tertiary)' }}>Create a note or select an explorer note.</p>
        </div>
      )}

    </div>
  );
}
