import React from 'react';
import {
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  FolderArchive,
  ArrowRight,
  FileText,
  Shield,
  Check,
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/samples';

export default function HomeDashboard({
  savedPlans = [],
  currentPlan,
  tasks = [],
  onNewAnalysis,
  onLoadPlan,
  onSelectSample,
  language = 'en',
}) {
  const isHindi = language === 'hi';

  // Compute metrics strictly from real application data
  // Aggregate tasks from current active plan or latest saved plans
  const allActiveTasks = tasks.length > 0
    ? tasks
    : (savedPlans.length > 0 && savedPlans[0].actionPlan ? savedPlans[0].actionPlan : []);

  const totalTasks = allActiveTasks.length;
  const completedTasks = allActiveTasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = allActiveTasks.filter((t) => t.status !== 'completed');
  const datedTasks = allActiveTasks.filter((t) => t.deadline);
  const urgentTasks = allActiveTasks.filter((t) => t.priority === 'High' && t.status !== 'completed');
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Welcome Hero Section */}
      <div className="ui-card" style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
        border: '1px solid var(--border-color)',
        padding: '2rem 1.75rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}>
          <div style={{ maxWidth: '640px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.65rem' }}>
              {isHindi ? 'दैनिक जीवन सहायक' : 'Everyday AI Productivity'}
            </span>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              marginBottom: '0.45rem',
              color: 'var(--text-primary)',
            }}>
              {isHindi ? 'लाइफ पायलट एआई में आपका स्वागत है' : 'Welcome to Life Pilot AI'}
            </h1>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {isHindi
                ? 'उलझन भरी जानकारी को स्पष्ट, संगठित अगले कदमों में बदलें।'
                : 'Turn confusing information into clear next steps.'}
            </p>
          </div>

          <button
            onClick={onNewAnalysis}
            className="btn btn-primary btn-lg"
            style={{ fontWeight: 700, boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)' }}
          >
            <PlusCircle size={20} />
            <span>{isHindi ? 'नया विश्लेषण शुरू करें' : 'New Analysis'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 2. Real Metrics Grid (Calculated from actual data) */}
      <div className="metric-grid">
        {/* Pending Tasks */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-title">{isHindi ? 'लंबित कार्य' : 'Pending Tasks'}</span>
            <Clock size={18} color="var(--warning)" />
          </div>
          <div className="metric-card-value">{pendingTasks.length}</div>
          <div className="metric-card-footer">
            {totalTasks > 0 ? (
              <span>{completedTasks} {isHindi ? 'पूर्ण हुए' : 'completed'} ({percentComplete}%)</span>
            ) : (
              <span>{isHindi ? 'कोई सक्रिय कार्य नहीं' : 'No active tasks yet'}</span>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-title">{isHindi ? 'पूर्ण किए गए' : 'Completed Tasks'}</span>
            <CheckCircle2 size={18} color="var(--success)" />
          </div>
          <div className="metric-card-value">{completedTasks}</div>
          <div className="metric-card-footer">
            {totalTasks > 0 ? (
              <span>{totalTasks} {isHindi ? 'कुल कार्यों में से' : 'total items in active plan'}</span>
            ) : (
              <span>{isHindi ? 'शुरू करने के लिए दस्तावेज़ जोड़ें' : 'Add document to begin'}</span>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-title">{isHindi ? 'आगामी समय-सीमाएं' : 'Upcoming Deadlines'}</span>
            <Calendar size={18} color="var(--primary)" />
          </div>
          <div className="metric-card-value">{datedTasks.length}</div>
          <div className="metric-card-footer">
            {datedTasks.length > 0 ? (
              <span>{isHindi ? 'दस्तावेज़ में उल्लिखित तिथियां' : 'Explicit cutoffs in source'}</span>
            ) : (
              <span>{isHindi ? 'कोई तिथि निर्धारित नहीं' : 'No explicit deadlines'}</span>
            )}
          </div>
        </div>

        {/* High Priority Tasks */}
        <div className="metric-card" style={{
          borderColor: urgentTasks.length > 0 ? 'var(--danger-border)' : 'var(--border-color)',
          backgroundColor: urgentTasks.length > 0 ? 'var(--danger-bg)' : 'var(--bg-secondary)',
        }}>
          <div className="metric-card-top">
            <span className="metric-card-title" style={{ color: urgentTasks.length > 0 ? 'var(--danger-text)' : undefined }}>
              {isHindi ? 'उच्च प्राथमिकता' : 'High Priority'}
            </span>
            <AlertTriangle size={18} color={urgentTasks.length > 0 ? 'var(--danger)' : 'var(--text-muted)'} />
          </div>
          <div className="metric-card-value" style={{ color: urgentTasks.length > 0 ? 'var(--danger-text)' : undefined }}>
            {urgentTasks.length}
          </div>
          <div className="metric-card-footer" style={{ color: urgentTasks.length > 0 ? 'var(--danger-text)' : undefined }}>
            {urgentTasks.length > 0 ? (
              <span>{isHindi ? 'तत्काल ध्यान देने योग्य' : 'Requires immediate action'}</span>
            ) : (
              <span>{isHindi ? 'कोई तत्काल कार्य नहीं' : 'No urgent bottlenecks'}</span>
            )}
          </div>
        </div>

        {/* Saved Plans Count */}
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-card-title">{isHindi ? 'सहेजे गए प्लान' : 'Saved Plans'}</span>
            <FolderArchive size={18} color="var(--accent-purple)" />
          </div>
          <div className="metric-card-value">{savedPlans.length}</div>
          <div className="metric-card-footer">
            <span>{isHindi ? 'ब्राउज़र में स्थानीय रूप से सुरक्षित' : 'Preserved in local storage'}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard 2-Column Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Left Column: Recent Analyses & Saved Plans */}
        <div className="ui-card">
          <div className="ui-card-header">
            <div>
              <h2 className="ui-card-title">
                {isHindi ? 'हालिया विश्लेषण व सहेजे गए प्लान' : 'Recent Analyses & Saved Plans'}
              </h2>
              <div className="ui-card-description">
                {isHindi ? 'आपके द्वारा सहेजी गई कार्य योजनाएं' : 'Pick up where you left off or review past summaries'}
              </div>
            </div>
            {savedPlans.length > 0 && (
              <span className="badge badge-neutral">{savedPlans.length} {isHindi ? 'योजनाएं' : 'plans'}</span>
            )}
          </div>

          <div className="ui-card-content" style={{ padding: '1rem' }}>
            {savedPlans.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                color: 'var(--text-muted)',
              }}>
                <FileText size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                  {isHindi ? 'अभी तक कोई योजना नहीं बनाई गई है' : 'No analyses or saved plans yet'}
                </p>
                <p style={{ fontSize: '0.825rem', maxWidth: '320px', margin: '0 auto 1.25rem' }}>
                  {isHindi
                    ? 'स्कूल परिपत्र, अपार्टमेंट सूचना या ईमेल का विश्लेषण करके अपनी पहली योजना बनाएं।'
                    : 'Paste a notice, email, or circular to create your first clear action plan.'}
                </p>
                <button
                  onClick={onNewAnalysis}
                  className="btn btn-secondary btn-sm"
                >
                  <PlusCircle size={14} />
                  <span>{isHindi ? 'पहला दस्तावेज़ विश्लेषण करें' : 'Analyze your first document'}</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {savedPlans.slice(0, 5).map((plan) => {
                  const planTotal = plan.actionPlan?.length || 0;
                  const planDone = plan.actionPlan?.filter((t) => t.status === 'completed').length || 0;
                  const isCurrent = currentPlan?.id === plan.id;

                  return (
                    <div
                      key={plan.id}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isCurrent ? 'var(--primary-border)' : 'var(--border-color)'}`,
                        backgroundColor: isCurrent ? 'var(--primary-light)' : 'var(--bg-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        transition: 'border-color 0.15s ease',
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {plan.title || (isHindi ? 'कार्य योजना' : 'Action Plan')}
                        </div>
                        <div style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginTop: '0.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}>
                          <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span style={{ color: planDone === planTotal && planTotal > 0 ? 'var(--success)' : undefined }}>
                            {planDone}/{planTotal} {isHindi ? 'कार्य पूर्ण' : 'tasks done'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onLoadPlan(plan)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', flexShrink: 0 }}
                      >
                        <span>{isHindi ? 'खोलें' : 'Open'}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Tasks & Upcoming Deadlines */}
        <div className="ui-card">
          <div className="ui-card-header">
            <div>
              <h2 className="ui-card-title">
                {isHindi ? 'लंबित कार्य व समय-सीमाएं' : 'Pending Tasks & Deadlines'}
              </h2>
              <div className="ui-card-description">
                {isHindi ? 'वर्तमान सक्रिय योजना की प्राथमिकताएं' : 'Action items requiring your attention'}
              </div>
            </div>
            {pendingTasks.length > 0 && (
              <span className="badge badge-warning">{pendingTasks.length} {isHindi ? 'लंबित' : 'pending'}</span>
            )}
          </div>

          <div className="ui-card-content" style={{ padding: '1rem' }}>
            {pendingTasks.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                color: 'var(--text-muted)',
              }}>
                <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                  {totalTasks > 0
                    ? (isHindi ? 'शानदार! सभी कार्य पूरे कर लिए गए हैं।' : 'All tasks completed!')
                    : (isHindi ? 'कोई सक्रिय कार्य सूची नहीं है' : 'No active tasks yet')}
                </p>
                <p style={{ fontSize: '0.825rem', maxWidth: '300px', margin: '0 auto' }}>
                  {isHindi
                    ? 'नई कार्य योजना बनाने के लिए दस्तावेज़ पेस्ट करें।'
                    : 'Paste a document to automatically generate a prioritized checklist.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {pendingTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: '0.75rem 0.95rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        color: 'var(--text-primary)',
                      }}>
                        {task.title}
                      </div>
                      {task.deadline && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--primary)',
                          marginTop: '0.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontWeight: 600,
                        }}>
                          <Calendar size={12} />
                          <span>{task.deadline}</span>
                        </div>
                      )}
                    </div>

                    <span className={`badge badge-priority-${(task.priority || 'medium').toLowerCase()}`} style={{ flexShrink: 0 }}>
                      {task.priority || 'Medium'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Quick Sample Exploration Banner */}
      <div className="ui-card" style={{ padding: '1.25rem 1.5rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}>
              <Sparkles size={16} color="var(--primary)" />
              <span>{isHindi ? 'त्वरित अन्वेषण: वास्तविक दस्तावेज़ उदाहरण' : 'Quick Explore: Try Realistic Document Samples'}</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              {isHindi
                ? 'लाइफ पायलट एआई की सटीकता व विश्लेषण देखने के लिए एक उदाहरण चुनें:'
                : 'See how Life Pilot AI extracts key dates, amounts, and tasks instantly:'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {SAMPLE_PRESETS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onSelectSample(sample)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
              >
                <span>{isHindi ? sample.titleHi : sample.title}</span>
                <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{sample.badge}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
