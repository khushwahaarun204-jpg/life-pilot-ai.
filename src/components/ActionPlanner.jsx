import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Download,
  Copy,
  Check,
  Filter,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportToICS, exportToMarkdown, copyChecklistToClipboard } from '../utils/export';

export default function ActionPlanner({
  tasks = [],
  setTasks,
  fullPlan,
  language = 'en',
  onShowToast,
}) {
  const isHindi = language === 'hi';
  const [filter, setFilter] = useState('all'); // all, pending, completed, high
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDeadline, setNewDeadline] = useState('');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Toggle task completion
  const handleToggleTask = (id) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        return { ...t, status: nextStatus };
      }
      return t;
    });

    setTasks(updated);

    // If all tasks are completed, trigger celebration!
    const allDone = updated.length > 0 && updated.every((t) => t.status === 'completed');
    if (allDone) {
      triggerConfetti();
      onShowToast?.(
        isHindi
          ? '🎉 बधाई हो! आपने सभी कार्य पूरे कर लिए हैं!'
          : '🎉 Congratulations! You have completed all tasks in this plan!'
      );
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#7c3aed'],
      });
    } catch (e) {
      // ignore
    }
  };

  // Delete task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    onShowToast?.(isHindi ? 'कार्य हटा दिया गया' : 'Task removed');
  };

  // Add custom task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      id: `custom-task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || (isHindi ? 'उपयोगकर्ता द्वारा जोड़ा गया कार्य' : 'User added task'),
      priority: newPriority,
      deadline: newDeadline.trim() || null,
      status: 'pending',
      category: isHindi ? 'कस्टम' : 'Custom',
    };

    setTasks([...tasks, newTask]);
    setNewTitle('');
    setNewDesc('');
    setNewPriority('Medium');
    setNewDeadline('');
    setIsAddingTask(false);
    onShowToast?.(isHindi ? 'नया कार्य जोड़ा गया!' : 'New task added to plan!');
  };

  // Copy checklist
  const handleCopy = async () => {
    const ok = await copyChecklistToClipboard(tasks);
    if (ok) {
      onShowToast?.(isHindi ? 'चेकलिस्ट क्लिपबोर्ड पर कॉपी हो गई!' : 'Checklist copied to clipboard!');
    }
  };

  // Export to calendar
  const handleExportICS = () => {
    exportToICS(tasks, fullPlan?.summary?.slice(0, 30) || 'LifePilot Plan');
    onShowToast?.(isHindi ? 'कैलेंडर फाइल (.ics) डाउनलोड हो गई!' : 'Calendar (.ics) file exported!');
  };

  // Export markdown
  const handleExportMarkdown = () => {
    if (fullPlan) {
      exportToMarkdown({ ...fullPlan, actionPlan: tasks });
      onShowToast?.(isHindi ? 'प्लान मार्कडाउन डाउनलोड हो गया!' : 'Action plan exported as Markdown!');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'high') return t.priority === 'High';
    return true;
  });

  return (
    <div className="ui-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Top Header & Export Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckSquare size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {isHindi ? 'आपकी कार्य योजना' : 'Your Action Plan'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isHindi ? 'सत्यापित प्राथमिकताओं व तिथियों के साथ' : 'Prioritized checklist with verified deadlines'}
            </span>
          </div>
        </div>

        {/* Action Buttons: Add Task & Exports */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
          >
            <Plus size={14} />
            <span>{isHindi ? 'कार्य जोड़ें' : 'Add Task'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="btn btn-outline btn-sm"
            title={isHindi ? 'चेकलिस्ट कॉपी करें' : 'Copy checklist to clipboard'}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          >
            <Copy size={13} />
            <span>{isHindi ? 'कॉपी' : 'Copy'}</span>
          </button>

          <button
            onClick={handleExportICS}
            className="btn btn-outline btn-sm"
            title={isHindi ? 'कैलेंडर फाइल (.ics)' : 'Export to Calendar (.ics)'}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          >
            <Calendar size={13} />
            <span>{isHindi ? '.ics' : '.ics'}</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="btn btn-outline btn-sm"
            title={isHindi ? 'मार्कडाउन डाउनलोड करें' : 'Download as Markdown'}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          >
            <Download size={13} />
            <span>{isHindi ? 'MD' : 'MD'}</span>
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        marginBottom: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          marginBottom: '0.35rem',
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            {isHindi ? 'प्रगति:' : 'Progress:'} {completedTasks} / {totalTasks} {isHindi ? 'पूर्ण' : 'completed'}
          </span>
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
            {percentComplete}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${percentComplete}%`,
            height: '100%',
            backgroundColor: percentComplete === 100 ? 'var(--success)' : 'var(--primary)',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        marginBottom: '1rem',
        flexWrap: 'wrap',
      }}>
        {[
          { key: 'all', label: isHindi ? 'सभी' : 'All', count: tasks.length },
          { key: 'pending', label: isHindi ? 'लंबित' : 'Pending', count: tasks.filter((t) => t.status !== 'completed').length },
          { key: 'completed', label: isHindi ? 'पूर्ण' : 'Completed', count: tasks.filter((t) => t.status === 'completed').length },
          { key: 'high', label: isHindi ? 'उच्च प्राथमिकता' : 'High Priority', count: tasks.filter((t) => t.priority === 'High').length },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`btn btn-sm ${filter === item.key ? 'btn-primary' : 'btn-ghost'}`}
            style={{
              padding: '0.25rem 0.65rem',
              fontSize: '0.78rem',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <span>{item.label}</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.85, marginLeft: '0.25rem', fontWeight: 700 }}>
              ({item.count})
            </span>
          </button>
        ))}
      </div>

      {/* Add Task Form Modal/Accordion */}
      {isAddingTask && (
        <form
          onSubmit={handleAddTask}
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-focus)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1rem',
          }}
          className="animate-fade-in"
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--primary)' }}>
            {isHindi ? 'नया कार्य जोड़ें' : 'Add New Task'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem', marginBottom: '0.65rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                {isHindi ? 'कार्य शीर्षक *' : 'Task Title *'}
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={isHindi ? 'उदा: फीस रसीद प्राप्त करें' : 'e.g. Call office for confirmation'}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                {isHindi ? 'संक्षिप्त विवरण' : 'Description'}
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder={isHindi ? 'विवरण या संदर्भ' : 'Optional notes'}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                {isHindi ? 'प्राथमिकता' : 'Priority'}
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              >
                <option value="High">{isHindi ? 'उच्च (High)' : 'High'}</option>
                <option value="Medium">{isHindi ? 'मध्यम (Medium)' : 'Medium'}</option>
                <option value="Low">{isHindi ? 'कम (Low)' : 'Low'}</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                {isHindi ? 'समय-सीमा' : 'Deadline'}
              </label>
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem' }}>
              {isHindi ? 'सहेजें' : 'Save Task'}
            </button>
          </div>
        </form>
      )}

      {/* Compact, Readable Task Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {filteredTasks.length === 0 ? (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-color)',
          }}>
            <p style={{ margin: 0, fontSize: '0.88rem' }}>
              {isHindi ? 'इस फ़िल्टर में कोई कार्य नहीं है।' : 'No tasks match the selected filter.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            const priorityClass =
              task.priority === 'High'
                ? 'badge-priority-high'
                : task.priority === 'Medium'
                ? 'badge-priority-medium'
                : 'badge-priority-low';

            return (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.95rem',
                  backgroundColor: isDone ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                  border: `1px solid ${isDone ? 'var(--border-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.15s ease',
                  opacity: isDone ? 0.65 : 1,
                  gap: '0.75rem',
                }}
                className="animate-fade-in"
              >
                {/* Checkbox and Content */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => handleToggleTask(task.id)}
                    className="task-checkbox"
                    style={{ marginTop: '0.15rem' }}
                    aria-label={`Mark "${task.title}" as complete`}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        textDecoration: isDone ? 'line-through' : 'none',
                        wordBreak: 'break-word',
                      }}>
                        {task.title}
                      </span>

                      {/* Priority Badge */}
                      <span className={`badge ${priorityClass}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                        {task.priority || 'Medium'}
                      </span>

                      {/* Deadline Badge */}
                      {task.deadline && (
                        <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                          <Calendar size={11} />
                          <span>{task.deadline}</span>
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        margin: '0.25rem 0 0 0',
                        lineHeight: 1.4,
                        textDecoration: isDone ? 'line-through' : 'none',
                      }}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="btn btn-ghost btn-sm"
                  style={{
                    color: 'var(--text-muted)',
                    padding: '0.25rem',
                    flexShrink: 0,
                  }}
                  title={isHindi ? 'हटाएं' : 'Delete task'}
                  aria-label="Delete task"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
