import React, { useState, useContext, useEffect } from 'react';
import { MockDBProvider, MockDBContext } from './context/MockDBContext';

// Import Pages
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import Journal from './pages/Journal';
import Goals from './pages/Goals';
import Trackers from './pages/Trackers';
import Tasks from './pages/Tasks';
import Resources from './pages/Resources';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Import Icons
import {
  LayoutDashboard, Sparkles, Calendar, Target, Activity,
  CheckSquare, Bookmark, FileText, BarChart3, Settings as SettingsIcon,
  Bell, Search, Menu, ChevronLeft, ChevronRight, LogOut, Plus, HelpCircle
} from 'lucide-react';

function AppContent() {
  // Onboarding & Authentication States
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('sb_onboarded') === 'true';
  });
  const [user, setUser] = useState(() => {
    const local = localStorage.getItem('sb_user');
    return local ? JSON.parse(local) : null;
  });

  // App Navigation States
  const [activePage, setActivePage] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Search & Notification States
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n-1', text: 'AI generated weekly learning insights digest is ready.', time: '12m ago' },
    { id: 'n-2', text: 'Staging AWS ECS pipeline deployed successfully.', time: '1h ago' },
    { id: 'n-3', text: 'MongoDB index optimizations task is due tomorrow.', time: '3h ago' }
  ]);

  // AI query pass state
  const [aiQuery, setAiQuery] = useState('');

  // Quick Ask Modal Drawer State
  const [quickAskOpen, setQuickAskOpen] = useState(false);
  const [quickAskText, setQuickAskText] = useState('');

  const { globalSearch } = useContext(MockDBContext);

  // Sync states to local storage
  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    localStorage.setItem('sb_onboarded', 'true');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('sb_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sb_user');
  };

  const handleUpdateUser = (updated) => {
    const newUser = { ...user, ...updated };
    setUser(newUser);
    localStorage.setItem('sb_user', JSON.stringify(newUser));
  };

  const handleQuickAskSubmit = (e) => {
    e.preventDefault();
    if (!quickAskText.trim()) return;
    setAiQuery(quickAskText);
    setQuickAskText('');
    setQuickAskOpen(false);
    setActivePage('AI Assistant');
  };

  // Perform search
  const searchResults = searchQuery ? globalSearch(searchQuery) : { notes: [], resources: [], tasks: [] };
  const hasSearchResults = searchResults.notes.length > 0 || searchResults.resources.length > 0 || searchResults.tasks.length > 0;

  // Sidebar Menu Config
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'AI Assistant', icon: <Sparkles size={18} /> },
    { name: 'Journal', icon: <Calendar size={18} /> },
    { name: 'Goals', icon: <Target size={18} /> },
    { name: 'Trackers', icon: <Activity size={18} /> },
    { name: 'Tasks', icon: <CheckSquare size={18} /> },
    { name: 'Resources', icon: <Bookmark size={18} /> },
    { name: 'Notes', icon: <FileText size={18} /> },
    { name: 'Analytics', icon: <BarChart3 size={18} /> },
    { name: 'Settings', icon: <SettingsIcon size={18} /> }
  ];

  // Route Rendering logic
  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard setActivePage={setActivePage} setAiQuery={setAiQuery} />;
      case 'AI Assistant':
        return <AIAssistant aiQuery={aiQuery} setAiQuery={setAiQuery} />;
      case 'Journal':
        return <Journal />;
      case 'Goals':
        return <Goals />;
      case 'Trackers':
        return <Trackers />;
      case 'Tasks':
        return <Tasks />;
      case 'Resources':
        return <Resources />;
      case 'Notes':
        return <Notes />;
      case 'Analytics':
        return <Analytics />;
      case 'Settings':
        return <Settings user={user} onUpdateUser={handleUpdateUser} />;
      default:
        return <Dashboard setActivePage={setActivePage} setAiQuery={setAiQuery} />;
    }
  };

  // 1. If not onboarded, show slides
  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // 2. If not authenticated, show login/signup portal
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Background Decorative Shimmers */}
      <div className="bg-glow"></div>
      <div className="bg-glow-left"></div>

      {/* Left Collapsible Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        
        {/* Top Logo */}
        <div>
          <div className="sidebar-logo">
            <div className="logo-icon">Ω</div>
            <span className="logo-text">Synora</span>
          </div>

          {/* Navigation Links list */}
          <ul className="sidebar-menu">
            {menuItems.map(item => (
              <li key={item.name}>
                <div
                  onClick={() => {
                    setActivePage(item.name);
                    // Reset dropdown states
                    setShowSearchDropdown(false);
                    setShowNotifDropdown(false);
                  }}
                  className={`sidebar-item ${activePage === item.name ? 'active' : ''}`}
                >
                  {item.icon}
                  <span className="logo-text">{item.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer profile & collapse buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* User profile item */}
          <div className="sidebar-footer">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">Premium Member</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-icon"
              style={{
                border: 'none',
                background: 'none',
                color: 'var(--text-tertiary)',
                marginLeft: 'auto',
                width: '24px',
                height: '24px',
                display: sidebarCollapsed ? 'none' : 'flex'
              }}
              title="Logout Profile"
            >
              <LogOut size={14} />
            </button>
          </div>

          {/* Sidebar collapse button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600 }}><ChevronLeft size={14} /> Collapse Panel</div>}
          </button>

        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="main-content">
        
        {/* Top Header */}
        <header className="header">
          
          {/* Top Search bar */}
          <div className="header-left">
            <div className="global-search-container">
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Quick search notes, resources, tasks... (Press '/' to focus)"
                className="input-glass"
                style={{ paddingLeft: '38px', height: '38px', fontSize: '0.85rem' }}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
              />

              {/* Autocomplete Droplist */}
              {showSearchDropdown && searchQuery && (
                <div className="search-results-dropdown" onMouseLeave={() => setShowSearchDropdown(false)}>
                  
                  {/* Notes Matches */}
                  {searchResults.notes.length > 0 && (
                    <div>
                      <div className="search-results-section-title">Knowledge Notes</div>
                      {searchResults.notes.map(n => (
                        <div
                          key={n.id}
                          className="search-result-item"
                          onClick={() => {
                            setActivePage('Notes');
                            setSearchQuery('');
                            setShowSearchDropdown(false);
                          }}
                        >
                          <FileText size={12} style={{ color: 'var(--color-primary)' }} />
                          <span>{n.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resource Matches */}
                  {searchResults.resources.length > 0 && (
                    <div>
                      <div className="search-results-section-title">Saved Resources</div>
                      {searchResults.resources.map(r => (
                        <div
                          key={r.id}
                          className="search-result-item"
                          onClick={() => {
                            setActivePage('Resources');
                            setSearchQuery('');
                            setShowSearchDropdown(false);
                          }}
                        >
                          <Bookmark size={12} style={{ color: 'var(--color-cyan)' }} />
                          <span>{r.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tasks Matches */}
                  {searchResults.tasks.length > 0 && (
                    <div>
                      <div className="search-results-section-title">Action Tasks</div>
                      {searchResults.tasks.map(t => (
                        <div
                          key={t.id}
                          className="search-result-item"
                          onClick={() => {
                            setActivePage('Tasks');
                            setSearchQuery('');
                            setShowSearchDropdown(false);
                          }}
                        >
                          <CheckSquare size={12} style={{ color: 'var(--color-emerald)' }} />
                          <span>{t.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {!hasSearchResults && (
                    <div style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                      No index hits found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Top Actions right */}
          <div className="header-right">
            
            {/* Quick Ask floating action button */}
            <button
              onClick={() => setQuickAskOpen(true)}
              className="btn btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.8rem', height: '38px', borderRadius: '10px' }}
            >
              <Plus size={16} /> Quick AI Ask
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowSearchDropdown(false);
                }}
                className="btn-icon"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '7px',
                    height: '7px',
                    background: 'var(--color-rose)',
                    borderRadius: '50%'
                  }}></span>
                )}
              </button>

              {/* Notification Box dropdown */}
              {showNotifDropdown && (
                <div className="notification-dropdown" onMouseLeave={() => setShowNotifDropdown(false)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>System Notifications</span>
                    <span
                      onClick={() => setNotifications([])}
                      style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                    >
                      Clear
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {notifications.length === 0 ? (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', padding: '10px 0', textAlign: 'center' }}>No notifications logged.</p>
                    ) : (
                      notifications.map(not => (
                        <div key={not.id} className="notification-item">
                          <p style={{ color: 'var(--text-primary)', marginBottom: '2px' }}>{not.text}</p>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{not.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar info node */}
            <div className="user-avatar" style={{ width: '38px', height: '38px', borderRadius: '10px', cursor: 'pointer' }} onClick={() => setActivePage('Settings')}>
              {user.name.charAt(0)}
            </div>

          </div>

        </header>

        {/* View Frame Router wrapper */}
        <div className="page-wrapper">
          {renderPage()}
        </div>

      </main>

      {/* Floating Quick Ask overlay drawer */}
      {quickAskOpen && (
        <div className="modal-overlay" onClick={() => setQuickAskOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Quick AI Brain Query</h3>
              </div>
              <button onClick={() => setQuickAskOpen(false)} className="btn-icon" style={{ width: '28px', height: '28px' }}>×</button>
            </div>

            <form onSubmit={handleQuickAskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                className="input-glass"
                placeholder="Ask what you did regarding MongoDB, Redis, or goals..."
                value={quickAskText}
                onChange={(e) => setQuickAskText(e.target.value)}
                required
                autoFocus
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Press <strong>Enter</strong> to trigger query. You will be redirected to the AI Assistant console.
              </span>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                Query Brain Assistant
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <MockDBProvider>
      <AppContent />
    </MockDBProvider>
  );
}
