import React, { useContext, useState } from 'react';
import { MockDBContext } from '../context/MockDBContext';
import { Sparkles, Calendar, BookOpen, Flame, CheckCircle2, Link, FileText, ArrowRight, TrendingUp } from 'lucide-react';

export default function Dashboard({ setActivePage, setAiQuery }) {
  const { notes, resources, tasks, goals, journals, updateTask } = useContext(MockDBContext);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Statistics
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const totalTasks = tasks.length;
  const learningStreak = 24; // Static streak tracker
  const savedResources = resources.length;
  const notesCreated = notes.length;

  const todayTasks = tasks.filter(t => t.category === 'Daily' && t.status !== 'Done').slice(0, 3);
  const recentResources = resources.slice(0, 3);
  const activeGoals = goals.filter(g => g.status === 'In Progress');

  // Trigger quick ask to AI from dashboard
  const handleAskAI = (query) => {
    setAiQuery(query);
    setActivePage('AI Assistant');
  };

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner / AI Insights */}
      <div className="card-glass" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} style={{ color: 'var(--color-purple)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Synora Insights</h3>
        </div>
        <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          You've dedicated 70% of your notes this week to **MongoDB Aggregations** and **Redis Caching**. 
          To complete your *Become Backend Developer* goal, consider starting the *Implement Redis Caching in API Gateway* high-priority task.
        </p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <button onClick={() => handleAskAI('What did I do about MongoDB?')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
            Ask MongoDB Journey
          </button>
          <button onClick={() => handleAskAI('Show everything I learned about Redis.')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
            Ask Redis Learnings
          </button>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="widgets-grid">
        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--color-primary)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Tasks Finished</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '2px' }}>{completedTasks} / {totalTasks}</div>
          </div>
        </div>

        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', color: '#ef4444' }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Learning Streak</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '2px' }}>{learningStreak} Days</div>
          </div>
        </div>

        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--color-cyan)' }}>
            <Link size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Resources Saved</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '2px' }}>{savedResources}</div>
          </div>
        </div>

        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--color-purple)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Notes Created</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '2px' }}>{notesCreated}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Charts + Widgets, Right side widgets */}
      <div className="dashboard-grid">
        {/* Left Side: Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Knowledge Growth area chart */}
          <div className="card-glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Knowledge Base Growth</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Cumulated notes & saved resources over past week</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-emerald)', fontSize: '0.8rem', fontWeight: 600 }}>
                <TrendingUp size={16} />
                +24% vs last week
              </div>
            </div>

            {/* SVG Chart */}
            <div style={{ position: 'relative', height: '220px', width: '100%' }}>
              <svg viewBox="0 0 500 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="190" x2="500" y2="190" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                {/* X Axis Labels */}
                <text x="5" y="198" fill="var(--text-tertiary)" fontSize="9">Jun 18</text>
                <text x="83" y="198" fill="var(--text-tertiary)" fontSize="9">Jun 19</text>
                <text x="166" y="198" fill="var(--text-tertiary)" fontSize="9">Jun 20</text>
                <text x="250" y="198" fill="var(--text-tertiary)" fontSize="9">Jun 21</text>
                <text x="333" y="198" fill="var(--text-tertiary)" fontSize="9">Jun 22</text>
                <text x="416" y="198" fill="var(--text-tertiary)" fontSize="9">Jun 23</text>
                <text x="480" y="198" fill="var(--text-tertiary)" fontSize="9">Today</text>

                {/* Area under curve */}
                <path
                  d="M 0 190 Q 83 150 166 160 T 333 90 T 416 110 T 500 40 L 500 190 Z"
                  fill="url(#areaGradient)"
                />

                {/* Curve Line */}
                <path
                  d="M 0 190 Q 83 150 166 160 T 333 90 T 416 110 T 500 40"
                  fill="none"
                  stroke="url(#strokeGradient)"
                  strokeWidth="3"
                />

                {/* Nodes */}
                {[
                  { x: 0, y: 190, val: 50 },
                  { x: 83, y: 150, val: 97 },
                  { x: 166, y: 160, val: 125 },
                  { x: 250, y: 110, val: 180 },
                  { x: 333, y: 90, val: 240 },
                  { x: 416, y: 110, val: 290 },
                  { x: 500, y: 40, val: 409 }
                ].map((node, i) => (
                  <g key={i}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={hoveredNode === i ? "6" : "4"}
                      fill="#0b0e1e"
                      stroke={i < 3 ? "#6366f1" : i < 6 ? "#a855f7" : "#06b6d4"}
                      strokeWidth="3"
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoveredNode(i)}
                      onMouseLeave={() => setHoveredNode(null)}
                    />
                    {hoveredNode === i && (
                      <g>
                        <rect x={node.x - 25} y={node.y - 30} width="50" height="20" rx="4" fill="#1e293b" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                        <text x={node.x} y={node.y - 17} fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="bold">{node.val}</text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Journal Activity Heatmap */}
          <div className="card-glass">
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Journal Mood Frequency</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {Array.from({ length: 28 }).map((_, idx) => {
                  // Mock mood values
                  const moods = ['focused', 'happy', 'calm', 'tired', 'anxious', 'none'];
                  const val = idx === 27 ? 'focused' : idx === 26 ? 'happy' : idx === 25 ? 'tired' : moods[idx % 6];
                  
                  // Color assignment
                  let bg = 'rgba(255, 255, 255, 0.02)';
                  let title = 'No entry';
                  if (val === 'focused') { bg = 'rgba(99, 102, 241, 0.6)'; title = 'Focused Mood'; }
                  else if (val === 'happy') { bg = 'rgba(52, 211, 153, 0.6)'; title = 'Happy Mood'; }
                  else if (val === 'calm') { bg = 'rgba(6, 182, 212, 0.6)'; title = 'Calm Mood'; }
                  else if (val === 'tired') { bg = 'rgba(251, 191, 36, 0.5)'; title = 'Tired Mood'; }
                  else if (val === 'anxious') { bg = 'rgba(244, 63, 94, 0.5)'; title = 'Anxious Mood'; }

                  return (
                    <div
                      key={idx}
                      title={title}
                      style={{
                        width: 'calc(100% / 14 - 6px)',
                        paddingBottom: 'calc(100% / 14 - 6px)',
                        background: bg,
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        minWidth: '22px',
                        minHeight: '22px'
                      }}
                    />
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                <span>Past 4 Weeks</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>Low Energy</span>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'rgba(244, 63, 94, 0.5)', borderRadius: '2px' }}></div>
                    <div style={{ width: '8px', height: '8px', background: 'rgba(251, 191, 36, 0.5)', borderRadius: '2px' }}></div>
                    <div style={{ width: '8px', height: '8px', background: 'rgba(6, 182, 212, 0.6)', borderRadius: '2px' }}></div>
                    <div style={{ width: '8px', height: '8px', background: 'rgba(52, 211, 153, 0.6)', borderRadius: '2px' }}></div>
                    <div style={{ width: '8px', height: '8px', background: 'rgba(99, 102, 241, 0.6)', borderRadius: '2px' }}></div>
                  </div>
                  <span>High Focus</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Today's Tasks checklist */}
          <div className="card-glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Today's Checklist</h4>
              <span onClick={() => setActivePage('Tasks')} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                All Tasks <ArrowRight size={12} />
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todayTasks.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textAlign: 'center', padding: '10px 0' }}>No tasks pending for today.</p>
              ) : (
                todayTasks.map(task => (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                      checked={task.status === 'Done'}
                      onChange={() => updateTask(task.id, { status: 'Done' })}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.title}
                      </div>
                      <span className={`badge badge-${task.priority.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '1px 6px', marginTop: '4px' }}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly goals progress */}
          <div className="card-glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Active Goals</h4>
              <span onClick={() => setActivePage('Goals')} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Edit Goals <ArrowRight size={12} />
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeGoals.map(goal => (
                <div key={goal.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>{goal.title}</span>
                    <span className="text-gradient" style={{ fontWeight: 'bold' }}>{goal.progress}%</span>
                  </div>
                  {/* Progress Bar container */}
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${goal.progress}%`,
                      height: '100%',
                      background: 'var(--primary-gradient)',
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource categories donut chart & Saved Resources */}
          <div className="card-glass">
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Recently Saved</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentResources.map(res => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                  className="hover-bright"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{res.title}</span>
                    <span style={{
                      fontSize: '0.65rem',
                      background: res.type === 'YouTube' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(6, 182, 212, 0.1)',
                      color: res.type === 'YouTube' ? '#ef4444' : 'var(--color-cyan)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}>{res.type}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {res.summary}
                  </p>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
