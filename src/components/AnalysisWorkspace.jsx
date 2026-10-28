import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  PlusCircle,
  Copy,
  Check,
  Share2,
  FolderArchive,
  ArrowLeft,
  Columns,
  Layers,
} from 'lucide-react';
import UnderstandPanel from './UnderstandPanel';
import ActionPlanner from './ActionPlanner';
import FollowUpChat from './FollowUpChat';

export default function AnalysisWorkspace({
  currentPlan,
  tasks,
  setTasks,
  originalText,
  onNewAnalysis,
  language = 'en',
  onShowToast,
}) {
  const isHindi = language === 'hi';
  const [copiedDoc, setCopiedDoc] = useState(false);
  const [mobileTab, setMobileTab] = useState('copilot'); // 'doc' or 'copilot'

  if (!currentPlan) return null;

  const docText = originalText || currentPlan.originalText || '';
  const wordCount = docText.trim() ? docText.trim().split(/\s+/).length : 0;
  const charCount = docText.length;

  const handleCopyOriginal = async () => {
    try {
      await navigator.clipboard.writeText(docText);
      setCopiedDoc(true);
      setTimeout(() => setCopiedDoc(false), 2000);
      onShowToast?.(isHindi ? 'मूल दस्तावेज़ कॉपी किया गया' : 'Original text copied to clipboard');
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Workspace Top Toolbar */}
      <div className="ui-card" style={{ padding: '0.85rem 1.25rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          {/* Back & Plan Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <button
              onClick={onNewAnalysis}
              className="btn btn-ghost btn-sm"
              title={isHindi ? 'नया विश्लेषण' : 'Start New Analysis'}
              style={{ padding: '0.35rem 0.55rem' }}
            >
              <ArrowLeft size={16} />
              <span className="desktop-only">{isHindi ? 'नया विश्लेषण' : 'New Analysis'}</span>
            </button>

            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {currentPlan.title || (isHindi ? 'विश्लेषण परिणाम' : 'Analysis Results')}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {isHindi ? 'मूल दस्तावेज़ और एआई कोपायलट' : 'Split-Screen Document & AI Copilot'}
              </div>
            </div>
          </div>

          {/* Right Toolbar Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Mobile View Switcher (Tabs) */}
            <div className="mobile-only" style={{ display: 'none' }}>
              <div className="ui-tabs-list">
                <button
                  onClick={() => setMobileTab('doc')}
                  className={`ui-tabs-trigger ${mobileTab === 'doc' ? 'active' : ''}`}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                >
                  <FileText size={13} />
                  <span>{isHindi ? 'मूल दस्तावेज़' : 'Document'}</span>
                </button>
                <button
                  onClick={() => setMobileTab('copilot')}
                  className={`ui-tabs-trigger ${mobileTab === 'copilot' ? 'active' : ''}`}
                  style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                >
                  <Sparkles size={13} />
                  <span>{isHindi ? 'एआई कोपायलट' : 'AI Copilot'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={onNewAnalysis}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 600 }}
            >
              <PlusCircle size={15} />
              <span>{isHindi ? 'नया दस्तावेज़' : 'New Document'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Split-Screen Main Layout Grid */}
      <div className="split-workspace-grid">
        {/* LEFT PANEL: Original Document */}
        <div
          className={`doc-panel-box ${mobileTab === 'copilot' ? 'hide-on-mobile' : ''}`}
        >
          {/* Document Panel Header */}
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <FileText size={16} color="var(--primary)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {isHindi ? 'मूल स्रोत दस्तावेज़' : 'Original Document'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-neutral" style={{ fontSize: '0.68rem' }}>
                {wordCount} {isHindi ? 'शब्द' : 'words'}
              </span>
              <button
                onClick={handleCopyOriginal}
                className="btn btn-ghost btn-sm"
                title={isHindi ? 'कॉपी करें' : 'Copy original text'}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              >
                {copiedDoc ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                <span className="desktop-only">{copiedDoc ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Document Panel Body */}
          <div className="doc-panel-body">
            {docText ? (
              docText
            ) : (
              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {isHindi ? 'कोई मूल पाठ उपलब्ध नहीं है।' : 'No original text available.'}
              </span>
            )}
          </div>

          {/* Document Panel Footer */}
          <div style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          }}>
            {isHindi
              ? '🔒 आपका दस्तावेज़ सुरक्षित है और केवल आपके डिवाइस पर विश्लेषण हेतु प्रयुक्त हुआ है।'
              : '🔒 Your document is private and was analyzed without server retention.'}
          </div>
        </div>

        {/* RIGHT PANEL: AI Understanding, Action Checklist & Follow-up Q&A */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          className={mobileTab === 'doc' ? 'hide-on-mobile' : ''}
        >
          {/* 1. Understand It Breakdown (Summary, Key Details, Dates, Amounts) */}
          <UnderstandPanel
            data={currentPlan}
            language={language}
          />

          {/* 2. Action Planner Checklist */}
          <ActionPlanner
            tasks={tasks}
            setTasks={setTasks}
            fullPlan={currentPlan}
            language={language}
            onShowToast={onShowToast}
          />

          {/* 3. Grounded Follow-up Questions Chat */}
          <FollowUpChat
            documentText={docText}
            language={language}
            onShowToast={onShowToast}
          />
        </div>
      </div>

      {/* Responsive mobile visibility style */}
      <style>{`
        @media (max-width: 1024px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
