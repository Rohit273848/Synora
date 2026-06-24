import React, { useContext, useState } from 'react';
import { MockDBContext } from '../context/MockDBContext';
import { Plus, Search, Bookmark, Eye, Trash2, Globe, Video, FileText, Share2, Sparkles } from 'lucide-react';

export default function Resources() {
  const { resources, addResource, deleteResource } = useContext(MockDBContext);
  const [filterType, setFilterType] = useState('All'); // 'All' | 'YouTube' | 'Website' | 'Research Paper' | 'Blog Article'
  const [searchQuery, setSearchQuery] = useState('');
  
  // URL Input / Scraper States
  const [urlInput, setUrlInput] = useState('');
  const [scrapeState, setScrapeState] = useState('idle'); // 'idle' | 'scraping' | 'summarizing' | 'success'
  const [scrapedInfo, setScrapedInfo] = useState(null);

  const handleQuickSave = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setScrapeState('scraping');
    
    // Simulate scraper steps
    setTimeout(() => {
      setScrapeState('summarizing');
      
      setTimeout(() => {
        // Mock meta details based on common inputs
        const isYoutube = urlInput.includes('youtube.com') || urlInput.includes('youtu.be');
        const isPaper = urlInput.includes('arxiv.org') || urlInput.includes('.pdf') || urlInput.includes('paper');
        
        let title = 'Saved Knowledge Node';
        let type = 'Website';
        let tags = ['Backend'];
        let summary = 'Saved web context digested by Second Brain AI engine.';

        if (isYoutube) {
          title = 'Advanced Caching Patterns with Redis';
          type = 'YouTube';
          tags = ['Backend', 'Caching', 'Redis'];
          summary = 'A comprehensive 24-minute walkthrough outlining cluster routing, stale reads prevention, and eviction configurations.';
        } else if (isPaper) {
          title = 'Raft: A Consensus Algorithm for Replicated Logs';
          type = 'Research Paper';
          tags = ['Systems', 'Distributed', 'Consensus'];
          summary = 'Deep-dive review of Raft leader election, log replication, and safety guarantees vs traditional Paxos approaches.';
        } else if (urlInput.includes('mongodb')) {
          title = 'MongoDB Indexing & Explain Plans';
          type = 'Blog Article';
          tags = ['Database', 'MongoDB', 'Performance'];
          summary = 'Expert strategies for building compound indexes, diagnosing COLLSCAN bottlenecks, and reviewing winning plans.';
        }

        const newRes = addResource({
          title,
          type,
          url: urlInput,
          tags,
          summary
        });

        setScrapedInfo(newRes);
        setScrapeState('success');
        setUrlInput('');

        setTimeout(() => {
          setScrapeState('idle');
          setScrapedInfo(null);
        }, 3000);

      }, 1000);
    }, 1000);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'YouTube': return <Video size={16} style={{ color: '#ef4444' }} />;
      case 'Research Paper': return <FileText size={16} style={{ color: '#a855f7' }} />;
      case 'Website': return <Globe size={16} style={{ color: '#06b6d4' }} />;
      default: return <Bookmark size={16} style={{ color: '#10b981' }} />;
    }
  };

  // Filter and search logic
  const filteredResources = resources.filter(res => {
    const matchesType = filterType === 'All' || res.type === filterType;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* URL Quick-Saver Scraper Bar */}
      <div className="card-glass" style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.2)'
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: 'var(--color-cyan)' }} />
          AI Resource Scraper
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '14px' }}>
          Paste a YouTube link, research paper, or blog URL. Our engine will scrape the metadata and auto-generate tags and summaries.
        </p>

        <form onSubmit={handleQuickSave} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=... or https://arxiv.org/pdf/..."
            className="input-glass"
            style={{ flex: 1 }}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            required
            disabled={scrapeState !== 'idle'}
          />
          <button
            type="submit"
            className="btn btn-cyan"
            disabled={scrapeState !== 'idle'}
            style={{ minWidth: '120px' }}
          >
            {scrapeState === 'scraping' && 'Scraping...'}
            {scrapeState === 'summarizing' && 'Analyzing...'}
            {scrapeState === 'success' && 'Saved Node!'}
            {scrapeState === 'idle' && 'Quick Save'}
          </button>
        </form>

        {scrapeState === 'success' && scrapedInfo && (
          <div style={{
            marginTop: '14px',
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'var(--color-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Scraped successfully! Saved: <strong>{scrapedInfo.title}</strong> ({scrapedInfo.type})</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Persisted in Second Brain database</span>
          </div>
        )}
      </div>

      {/* Main Grid: Controls Header + Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Resource Categories & Search */}
        <div className="card-glass" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', padding: '16px 20px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'YouTube', 'Website', 'Research Paper', 'Blog Article'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`btn ${filterType === type ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search resource..."
              className="input-glass"
              style={{ paddingLeft: '32px', height: '34px', fontSize: '0.8rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Resources Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredResources.length === 0 ? (
            <div className="card-glass" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No resources match your filters or queries.</p>
            </div>
          ) : (
            filteredResources.map(res => (
              <div key={res.id} className="card-glass" style={{ display: 'flex', flexDirection: 'column', justify: 'space-between', gap: '14px' }}>
                
                {/* Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getTypeIcon(res.type)}
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{res.type}</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Saved {res.savedDate}</span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: '1.4' }}>{res.title}</h4>
                  
                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: '8px 0' }}>
                    {res.tags.map((t, idx) => (
                      <span key={idx} className="badge badge-medium" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{t}</span>
                    ))}
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.5', marginTop: '6px' }}>
                    {res.summary}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', gap: '4px', alignItems: 'center' }}
                  >
                    <Eye size={12} /> Visit URL
                  </a>
                  
                  <button
                    onClick={() => deleteResource(res.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'color 0.2s' }}
                    className="hover-bright"
                    title="Remove from Brain"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
