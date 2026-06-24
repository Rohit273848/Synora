import React, { useState } from 'react';
import { User, Settings as SettingsIcon, Bell, Brain, Shield, Download, RefreshCw, Check } from 'lucide-react';

export default function Settings({ user, onUpdateUser }) {
  // States
  const [username, setUsername] = useState(user?.name || 'Alex Carter');
  const [model, setModel] = useState('gemini-1.5-pro');
  const [temperature, setTemperature] = useState(0.7);
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');
  const [apiKey, setApiKey] = useState('sb_sk_••••••••••••••••••••');
  
  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser({ name: username });
    setStatusMsg('Preferences saved successfully!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleExport = () => {
    const data = {
      notes: JSON.parse(localStorage.getItem('sb_notes') || '[]'),
      resources: JSON.parse(localStorage.getItem('sb_resources') || '[]'),
      tasks: JSON.parse(localStorage.getItem('sb_tasks') || '[]'),
      goals: JSON.parse(localStorage.getItem('sb_goals') || '[]'),
      journals: JSON.parse(localStorage.getItem('sb_journals') || '[]')
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "second_brain_ai_backup.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
      
      {/* Left Column: Profile & AI Engine */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Toast Alert */}
        {statusMsg && (
          <div style={{
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            color: 'var(--color-emerald)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Check size={16} /> {statusMsg}
          </div>
        )}

        {/* Profile Card */}
        <div className="card-glass">
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} style={{ color: 'var(--color-primary)' }} />
            Profile Preferences
          </h4>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Full Name</label>
              <input
                type="text"
                className="input-glass"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Email Address</label>
              <input
                type="email"
                className="input-glass"
                value={user?.email || 'alex.carter@gmail.com'}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.8rem' }}>
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* AI Assistant Preferences */}
        <div className="card-glass">
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brain size={18} style={{ color: 'var(--color-purple)' }} />
            AI Assistant Engine
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Primary AI LLM Model</label>
              <select
                className="select-glass"
                style={{ width: '100%' }}
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                <option value="gpt-4o">GPT-4o (OpenAI API key required)</option>
                <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>LLM Temperature</label>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-purple)' }}>{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-purple)' }}
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', display: 'block', marginTop: '4px' }}>
                Lower values generate more predictable, search-focused answers. Higher values trigger creative summaries.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Personal Developer Access Token</label>
              <input
                type="text"
                className="input-glass"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Settings & Database Utilities */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Notifications Digest */}
        <div className="card-glass">
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} style={{ color: 'var(--color-cyan)' }} />
            Communication & Alerts
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Daily Email Digest</span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Get summaries of completed tasks & journals</span>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={() => setEmailDigest(!emailDigest)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-cyan)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Push Notifications</span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Be notified for goals deadlines and habits check-ins</span>
              </div>
              <input
                type="checkbox"
                checked={pushNotif}
                onChange={() => setPushNotif(!pushNotif)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--color-cyan)' }}
              />
            </div>
          </div>
        </div>

        {/* Database Exporter (Backup) */}
        <div className="card-glass" style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, transparent 100%)',
          border: '1px solid rgba(251, 191, 36, 0.15)'
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} style={{ color: 'var(--color-amber)' }} />
            Data Sovereignty Exporter
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '14px' }}>
            Download a compiled JSON data package containing your notes, task boards, journals, and resources list. Your data remains yours.
          </p>

          <button onClick={handleExport} className="btn btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 16px', fontSize: '0.8rem', border: '1px solid rgba(251, 191, 36, 0.2)', color: 'var(--color-amber)' }}>
            Export JSON Backup
          </button>
        </div>

        {/* Reset Security details */}
        <div className="card-glass">
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} style={{ color: 'var(--color-rose)' }} />
            Security & Access
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Change Password</label>
              <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.75rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <RefreshCw size={12} /> Trigger Password Reset Link
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
