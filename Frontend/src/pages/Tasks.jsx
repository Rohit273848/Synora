import React, { useContext, useState } from 'react';
import { MockDBContext } from '../context/MockDBContext';
import { Plus, ListFilter, Calendar, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useContext(MockDBContext);
  const [filterCategory, setFilterCategory] = useState('All'); // 'All' | 'Daily' | 'Weekly' | 'Monthly'
  
  // Modal states for Task creation
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newScope, setNewScope] = useState('Daily');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      category: newScope,
      dueDate: newDueDate,
      status: 'Todo'
    });

    // Reset
    setNewTitle('');
    setNewDesc('');
    setNewPriority('Medium');
    setNewScope('Daily');
    setNewDueDate(new Date().toISOString().split('T')[0]);
    setShowModal(false);
  };

  const shiftStatus = (task, direction) => {
    const statuses = ['Backlog', 'Todo', 'In Progress', 'Done'];
    const curIdx = statuses.indexOf(task.status);
    let nextIdx = curIdx + direction;
    if (nextIdx >= 0 && nextIdx < statuses.length) {
      updateTask(task.id, { status: statuses[nextIdx] });
    }
  };

  const columns = [
    { title: 'Backlog', status: 'Backlog', color: '#64748b' },
    { title: 'To Do', status: 'Todo', color: '#38bdf8' },
    { title: 'In Progress', status: 'In Progress', color: '#a855f7' },
    { title: 'Done', status: 'Done', color: '#34d399' }
  ];

  // Filter tasks based on category selector
  const filteredTasks = tasks.filter(t => filterCategory === 'All' || t.category === filterCategory);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Filters Header */}
      <div className="card-glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <ListFilter size={16} style={{ color: 'var(--text-secondary)' }} />
          {['All', 'Daily', 'Weekly', 'Monthly'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`btn ${filterCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '5px 10px', fontSize: '0.75rem' }}
            >
              {cat} Scope
            </button>
          ))}
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
          <Plus size={16} /> New Task Card
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="kanban-board">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.status);
          
          return (
            <div key={col.status} className="kanban-column">
              {/* Column Head */}
              <div className="kanban-column-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }}></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{col.title}</span>
                </div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '9999px', color: 'var(--text-secondary)' }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Column Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', paddingRight: '2px' }}>
                {colTasks.length === 0 ? (
                  <div style={{
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px 10px',
                    textAlign: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.75rem',
                    marginTop: '4px'
                  }}>
                    Lanes empty
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div key={task.id} className="kanban-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span className={`badge badge-${task.priority.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                          {task.priority}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{task.category}</span>
                      </div>

                      <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: '1.4' }}>
                        {task.title}
                      </h5>

                      {task.description && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {task.description}
                        </p>
                      )}

                      {/* Card Footer Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>
                          <Calendar size={10} />
                          <span>{task.dueDate}</span>
                        </div>

                        {/* Shift buttons simulating Drag & Drop */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                          <button
                            onClick={() => shiftStatus(task, -1)}
                            disabled={task.status === 'Backlog'}
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid var(--border-color)',
                              padding: '2px 4px',
                              borderRadius: '4px',
                              color: 'var(--text-secondary)',
                              cursor: task.status === 'Backlog' ? 'not-allowed' : 'pointer',
                              opacity: task.status === 'Backlog' ? 0.3 : 1
                            }}
                          >
                            <ChevronLeft size={12} />
                          </button>
                          <button
                            onClick={() => shiftStatus(task, 1)}
                            disabled={task.status === 'Done'}
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid var(--border-color)',
                              padding: '2px 4px',
                              borderRadius: '4px',
                              color: 'var(--text-secondary)',
                              cursor: task.status === 'Done' ? 'not-allowed' : 'pointer',
                              opacity: task.status === 'Done' ? 0.3 : 1
                            }}
                          >
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Creation Modal overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Log Task Card</h3>
              <button onClick={() => setShowModal(false)} className="btn-icon" style={{ width: '28px', height: '28px' }}>×</button>
            </div>

            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Audit package.json dependencies"
                  className="input-glass"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Description</label>
                <textarea
                  placeholder="Detailed notes or sub-tasks..."
                  className="input-glass"
                  style={{ minHeight: '60px', resize: 'none' }}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Priority</label>
                  <select
                    className="select-glass"
                    style={{ width: '100%' }}
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Scope Timeline</label>
                  <select
                    className="select-glass"
                    style={{ width: '100%' }}
                    value={newScope}
                    onChange={(e) => setNewScope(e.target.value)}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>Due Date</label>
                <input
                  type="date"
                  className="input-glass"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                Commit Task Card
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
