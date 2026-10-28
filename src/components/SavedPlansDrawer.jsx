import React from 'react';
import { X, FolderArchive, Trash2, Calendar, CheckSquare, ArrowRight } from 'lucide-react';

export default function SavedPlansDrawer({
  isOpen,
  onClose,
  savedPlans = [],
  onLoadPlan,
  onDeletePlan,
  language = 'en',
}) {
  const isHindi = language === 'hi';

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'var(--bg-secondary)',
        height: '100%',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid var(--border-color)',
        animation: 'fadeIn 0.2s ease-out',
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FolderArchive size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              {isHindi ? 'सहेजे गए प्लान' : 'Saved Action Plans'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            aria-label="Close drawer"
            style={{ padding: '0.35rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* List of Plans */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {savedPlans.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--text-muted)',
            }}>
              <FolderArchive size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                {isHindi
                  ? 'अभी तक कोई योजना सहेजी नहीं गई है।'
                  : 'No saved plans yet. Any plan you create will automatically be preserved here locally.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {savedPlans.map((plan) => {
                const totalTasks = plan.actionPlan?.length || 0;
                const completedTasks = plan.actionPlan?.filter((t) => t.status === 'completed').length || 0;

                return (
                  <div
                    key={plan.id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      backgroundColor: 'var(--bg-primary)',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.45rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', flex: 1 }}>
                        {plan.title || (isHindi ? 'कार्य योजना' : 'Action Plan')}
                      </h4>
                      <button
                        onClick={() => onDeletePlan(plan.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
                        title={isHindi ? 'हटाएं' : 'Delete'}
                        aria-label="Delete saved plan"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.45,
                      margin: '0 0 0.65rem 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {plan.summary}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.65rem',
                      marginTop: '0.5rem',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckSquare size={13} color="var(--success)" />
                        <span>{completedTasks}/{totalTasks} {isHindi ? 'कार्य पूर्ण' : 'tasks done'}</span>
                      </span>

                      <button
                        onClick={() => {
                          onLoadPlan(plan);
                          onClose();
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                      >
                        <span>{isHindi ? 'लोड करें' : 'Open'}</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-tertiary)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}>
          {isHindi
            ? '🔒 आपकी योजनाएं केवल आपके डिवाइस के स्थानीय संग्रहण में सुरक्षित रहती हैं।'
            : '🔒 Plans are preserved locally in your browser storage for your privacy.'}
        </div>
      </div>
    </div>
  );
}
