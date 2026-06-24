import React, { useContext } from 'react';
import { MockDBContext } from '../context/MockDBContext';
import { Activity, Compass, CheckCircle2, ChevronRight, Check } from 'lucide-react';

export default function Trackers() {
  const { trackers, toggleTrackerTopic } = useContext(MockDBContext);

  const calculateTrackerProgress = (tracker) => {
    const topics = tracker.topics;
    if (topics.length === 0) return 0;
    
    let totalScore = 0;
    topics.forEach(t => {
      if (t.completed) totalScore += 100;
      else if (t.progress !== undefined) totalScore += t.progress;
    });
    return Math.round(totalScore / topics.length);
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Overview Intro banner */}
      <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--color-cyan)' }}>
          <Activity size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Habits & Learning Roadmaps</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>Track your curriculum progress and core habit completions on the fly.</p>
        </div>
      </div>

      {/* Grid of Trackers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
        {trackers.map(tracker => {
          const overallProgress = calculateTrackerProgress(tracker);
          
          return (
            <div key={tracker.id} className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Tracker Card Head */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{tracker.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{tracker.topics.length} topics mapped</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="text-gradient" style={{ fontWeight: 800, fontSize: '1.25rem' }}>{overallProgress}%</span>
                  <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Completion</span>
                </div>
              </div>

              {/* Slider Progress Bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${overallProgress}%`,
                  height: '100%',
                  background: 'var(--cyan-gradient)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>

              {/* Topics Checklists */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                {tracker.topics.map((topic, index) => {
                  const isProgressType = topic.progress !== undefined;
                  const score = isProgressType ? topic.progress : (topic.completed ? 100 : 0);

                  return (
                    <div
                      key={index}
                      onClick={() => toggleTrackerTopic(tracker.id, index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                      className="hover-bright"
                    >
                      {/* Left topic label + checkbox icon */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          background: score >= 100 ? 'var(--color-cyan)' : 'rgba(255,255,255,0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: score >= 100 ? 'none' : '1px solid var(--border-color)',
                          color: 'black',
                          flexShrink: 0
                        }}>
                          {score >= 100 && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span style={{
                          fontSize: '0.85rem',
                          color: score >= 100 ? 'var(--text-secondary)' : 'var(--text-primary)',
                          textDecoration: score >= 100 ? 'line-through' : 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {topic.name}
                        </span>
                      </div>

                      {/* Right indicator (completed checkbox / increment button) */}
                      <div>
                        {isProgressType ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                              {topic.progress}%
                            </span>
                            <div style={{
                              width: '40px',
                              height: '4px',
                              background: 'rgba(255,255,255,0.05)',
                              borderRadius: '9999px',
                              overflow: 'hidden'
                            }}>
                              <div style={{ width: `${topic.progress}%`, height: '100%', background: 'var(--color-cyan)' }}></div>
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: score >= 100 ? 'var(--color-cyan)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                            {score >= 100 ? 'Done' : 'Pending'}
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
