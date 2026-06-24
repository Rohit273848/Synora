import React, { useContext, useState } from 'react';
import { MockDBContext } from '../context/MockDBContext';
import { Target, Calendar, Plus, CheckCircle, ArrowUpRight } from 'lucide-react';

export default function Goals() {
  const { goals, addGoal, toggleMilestone } = useContext(MockDBContext);
  const [activeCategory, setActiveCategory] = useState('Monthly'); // 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
  
  // Modal states for Goal creation
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTimeline, setNewTimeline] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('');

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Parse comma-separated milestones
    const milestones = milestonesInput
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0)
      .map(name => ({ name, completed: false }));

    addGoal({
      title: newTitle,
      category: activeCategory,
      milestones,
      timeline: newTimeline || 'TBD'
    });

    // Reset
    setNewTitle('');
    setNewTimeline('');
    setMilestonesInput('');
    setShowModal(false);
  };

  const filteredGoals = goals.filter(g => g.category === activeCategory);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header section with categories filter and add action */}
      <div className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-cyan" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
          <Plus size={16} /> New Goal Node
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredGoals.length === 0 ? (
          <div className="card-glass" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No goals logged under the {activeCategory} category.</p>
          </div>
        ) : (
          filteredGoals.map(goal => (
            <div key={goal.id} className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{goal.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>
                    <Calendar size={12} />
                    <span>Timeline: {goal.timeline}</span>
                  </div>
                </div>
                <span className={`badge ${goal.status === 'Completed' ? 'badge-success' : 'badge-medium'}`}>
                  {goal.status}
                </span>
              </div>

              {/* Progress Tracker */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>Overall progress</span>
                  <span className="text-gradient" style={{ fontWeight: 'bold' }}>{goal.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${goal.progress}%`,
                    height: '100%',
                    background: 'var(--primary-gradient)',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>
              </div>

              {/* Milestones Checklist */}
              {goal.milestones && goal.milestones.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Milestones
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {goal.milestones.map((milestone, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleMilestone(goal.id, idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          padding: '4px 0'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={milestone.completed}
                          onChange={() => {}} // Controlled by click wrapper
                          style={{ width: '15px', height: '15px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                        />
                        <span style={{
                          color: milestone.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                          textDecoration: milestone.completed ? 'line-through' : 'none',
                          transition: 'color var(--transition-fast)'
                        }}>
                          {milestone.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Creation Modal overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Log {activeCategory} Objective</h3>
              <button onClick={() => setShowModal(false)} className="btn-icon" style={{ width: '28px', height: '28px' }}>×</button>
            </div>

            <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Redis caching layers"
                  className="input-glass"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Timeline Window</label>
                <input
                  type="text"
                  placeholder="e.g. June 24 - July 10"
                  className="input-glass"
                  value={newTimeline}
                  onChange={(e) => setNewTimeline(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '2px', textTransform: 'uppercase' }}>Milestones</label>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '6px' }}>Separate milestones with commas</span>
                <textarea
                  placeholder="e.g. Learn Redis structures, Setup pub-sub nodes, Build Cache-Aside API handlers"
                  className="input-glass"
                  style={{ minHeight: '80px', resize: 'none' }}
                  value={milestonesInput}
                  onChange={(e) => setMilestonesInput(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                Commit Goal Node
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
