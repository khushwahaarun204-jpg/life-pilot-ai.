import React from 'react';
import { CheckCircle2, Clock, Calendar, AlertTriangle, PlusCircle, Sparkles } from 'lucide-react';

export default function DailyDashboard({
  tasks = [],
  onAnalyzeNew,
  filter,
  setFilter,
  language = 'en',
}) {
  const isHindi = language === 'hi';

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const datedTasks = tasks.filter((t) => t.deadline);
  const urgentTasks = tasks.filter((t) => t.priority === 'High' && t.status !== 'completed');

  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
      {/* Top Bar with Title & "Analyze New" Button */}
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
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            {isHindi ? 'दैनिक डैशबोर्ड' : 'Daily Action Dashboard'}
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
            {isHindi
              ? 'आपकी प्राथमिकताओं और आगामी समय-सीमाओं का त्वरित अवलोकन'
              : 'Real-time overview of your priorities, deadlines, and execution progress'}
          </p>
        </div>

        <button
          onClick={onAnalyzeNew}
          className="btn btn-primary btn-sm"
          style={{ fontWeight: 600 }}
        >
          <Sparkles size={15} />
          <span>{isHindi ? 'नया दस्तावेज़ विश्लेषण करें' : 'Analyze New Information'}</span>
        </button>
      </div>

      {/* 4 Quick Stat Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.9rem',
        marginBottom: '1.25rem',
      }}>
        {/* Pending Tasks */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--warning-bg)',
            color: 'var(--warning-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              {pendingTasks}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {isHindi ? 'लंबित कार्य' : 'Pending Tasks'}
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              {completedTasks}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {isHindi ? 'पूर्ण किए गए कार्य' : 'Completed Tasks'}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              {datedTasks.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {isHindi ? 'निश्चित समय-सीमाएं' : 'Upcoming Deadlines'}
            </div>
          </div>
        </div>

        {/* Urgent High-Priority Attention */}
        <div style={{
          backgroundColor: urgentTasks.length > 0 ? 'var(--danger-bg)' : 'var(--bg-secondary)',
          border: `1px solid ${urgentTasks.length > 0 ? 'var(--danger-border)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: 'var(--danger-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--danger-text)' }}>
              {urgentTasks.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--danger-text)', fontWeight: 600 }}>
              {isHindi ? 'उच्च प्राथमिकता' : 'High Priority'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Indicator */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '0.9rem 1.1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
            {isHindi ? 'योजना निष्पादन प्रगति' : 'Action Plan Execution Progress'}
          </span>
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
            {percentComplete}% {isHindi ? 'पूर्ण' : 'Done'} ({completedTasks}/{totalTasks})
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '10px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}>
          <div
            style={{
              width: `${percentComplete}%`,
              height: '100%',
              background: percentComplete === 100
                ? 'var(--success)'
                : 'linear-gradient(90deg, var(--primary) 0%, var(--accent-purple) 100%)',
              transition: 'width 0.4s ease-in-out',
            }}
          />
        </div>
      </div>
    </div>
  );
}
