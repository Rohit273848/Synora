import React, { useContext, useState } from 'react';
import { MockDBContext } from '../context/MockDBContext';
import { BarChart3, TrendingUp, Award, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function Analytics() {
  const { notes, resources, tasks, goals } = useContext(MockDBContext);
  const [activeTab, setActiveTab] = useState('weekly'); // 'weekly' | 'monthly'
  const [hoveredChartIndex, setHoveredChartIndex] = useState(null);

  // Statistics summaries
  const totalNotes = notes.length;
  const totalResources = resources.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        
        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px' }}>
          <Clock size={20} style={{ color: 'var(--color-cyan)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Focus Time</span>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>128.5 hrs</h4>
          </div>
        </div>

        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px' }}>
          <CheckCircle2 size={20} style={{ color: 'var(--color-emerald)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Task Completion Rate</span>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </h4>
          </div>
        </div>

        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px' }}>
          <Award size={20} style={{ color: 'var(--color-purple)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Goals Completed</span>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>{completedGoals} / {totalGoals}</h4>
          </div>
        </div>

        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px' }}>
          <FileText size={20} style={{ color: 'var(--color-primary)' }} />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Brain Node Count</span>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>{totalNotes + totalResources} items</h4>
          </div>
        </div>

      </div>

      {/* Main Grid: SVG Visualizations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* SVG Bar Chart: Weekly Study Hours */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Weekly Focus Log</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Learning hours spent per day</p>
          </div>

          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 400 200" width="100%" height="100%">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

              {/* Bars */}
              {[
                { day: 'Mon', hrs: 4.5 },
                { day: 'Tue', hrs: 6.2 },
                { day: 'Wed', hrs: 3.0 },
                { day: 'Thu', hrs: 5.5 },
                { day: 'Fri', hrs: 8.0 },
                { day: 'Sat', hrs: 7.2 },
                { day: 'Sun', hrs: 4.0 }
              ].map((item, idx) => {
                const barWidth = 32;
                const gap = 20;
                const x = 20 + idx * (barWidth + gap);
                const maxHrs = 10;
                const height = (item.hrs / maxHrs) * 150;
                const y = 180 - height;
                const isHovered = hoveredChartIndex === `bar-${idx}`;

                return (
                  <g key={idx} onMouseEnter={() => setHoveredChartIndex(`bar-${idx}`)} onMouseLeave={() => setHoveredChartIndex(null)}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      rx="4"
                      fill="url(#strokeGradient)"
                      opacity={isHovered ? 0.9 : 0.75}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    />
                    <text x={x + barWidth / 2} y="195" fill="var(--text-secondary)" fontSize="9" textAnchor="middle">{item.day}</text>
                    {isHovered && (
                      <g>
                        <rect x={x - 8} y={y - 24} width="48" height="18" rx="4" fill="#1e293b" stroke="rgba(255,255,255,0.15)" />
                        <text x={x + 16} y={y - 12} fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">{item.hrs} hrs</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* SVG Donut Chart: Resource Categories Distribution */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Resource Distribution</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Ratio of materials stored in Brain database</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', height: '180px' }}>
            <div style={{ width: '150px', height: '150px' }}>
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                {/* Ring segment 1 (YouTube - 40%) stroke-dasharray="40 100" stroke-dashoffset="0" */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#6366f1" strokeWidth="12" strokeDasharray="100.5 251.2" strokeDashoffset="0" />
                {/* Ring segment 2 (Websites - 30%) stroke-dasharray="75.3 251.2" stroke-dashoffset="-100.5" */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="75.3 251.2" strokeDashoffset="-100.5" />
                {/* Ring segment 3 (Papers - 20%) stroke-dasharray="50.2 251.2" stroke-dashoffset="-175.8" */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="12" strokeDasharray="50.2 251.2" strokeDashoffset="-175.8" />
                {/* Ring segment 4 (Blogs - 10%) stroke-dasharray="25.2 251.2" stroke-dashoffset="-226" */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="25.2 251.2" strokeDashoffset="-226" />
                
                {/* Inner center text */}
                <circle cx="50" cy="50" r="30" fill="var(--bg-secondary)" />
                <text x="50" y="54" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Brain</text>
              </svg>
            </div>

            {/* Donut Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#6366f1' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>YouTube (40%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#06b6d4' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>Websites (30%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#a855f7' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>Papers (20%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>Articles (10%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
