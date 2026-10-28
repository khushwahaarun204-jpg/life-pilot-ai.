import React from 'react';
import {
  X,
  Settings,
  Languages,
  Moon,
  Sun,
  Type,
  Shield,
  Cpu,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  language,
  setLanguage,
  theme,
  toggleTheme,
  fontSize,
  toggleFontSize,
  aiStatus,
}) {
  const isHindi = language === 'hi';

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div
        className="ui-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-xl)',
          padding: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Settings size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {isHindi ? 'सेटिंग्स व प्राथमिकताएं' : 'Settings & Preferences'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            aria-label="Close settings"
            style={{ padding: '0.35rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* 1. Language Preference */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {isHindi ? 'भाषा (Language)' : 'Interface Language'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isHindi ? 'दस्तावेज़ विश्लेषण व इंटरफ़ेस भाषा' : 'Language for interface and document analysis'}
              </div>
            </div>

            <div style={{ display: 'inline-flex', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <button
                onClick={() => setLanguage('en')}
                className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 0, padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`btn btn-sm ${language === 'hi' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 0, padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {/* 2. Theme Preference */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {isHindi ? 'रंग थीम (Theme)' : 'Color Theme'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {theme === 'dark' ? (isHindi ? 'डार्क मोड सक्रिय' : 'Dark mode enabled') : (isHindi ? 'लाइट मोड सक्रिय' : 'Light mode enabled')}
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              <span>{theme === 'dark' ? (isHindi ? 'लाइट मोड' : 'Light Mode') : (isHindi ? 'डार्क मोड' : 'Dark Mode')}</span>
            </button>
          </div>

          {/* 3. Accessibility Font Scale */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {isHindi ? 'सुगम फ़ॉन्ट आकार' : 'Accessible Font Size'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {fontSize === 'large' ? '18px (सुगम बड़ा आकार)' : '16px (मानक आकार)'}
              </div>
            </div>

            <button
              onClick={toggleFontSize}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}
            >
              <Type size={15} />
              <span>{fontSize === 'large' ? 'Normal (16px)' : 'Large (18px)'}</span>
            </button>
          </div>

          {/* 4. AI Engine & Diagnostics */}
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.65rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.88rem' }}>
                <Cpu size={16} color="var(--primary)" />
                <span>{isHindi ? 'एआई इंजन व डायग्नोस्टिक्स' : 'AI Engine & Diagnostics'}</span>
              </div>

              <span className={`badge ${aiStatus?.isLive ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                {aiStatus?.isLive ? 'Gemma 4 Live' : 'Demo Mode'}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div><strong>Model:</strong> <code>{aiStatus?.model || 'gemma-4-26b-a4b-it'}</code></div>
              <div><strong>Provider:</strong> {aiStatus?.provider || 'Google Gemini API'}</div>
              <div>
                <strong>Inference:</strong>{' '}
                {aiStatus?.isLive
                  ? 'Active & verified with HTTP 200 real requests'
                  : 'Local heuristic fallback engine'}
              </div>
            </div>
          </div>

          {/* 5. Privacy Safeguard Info */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem',
            padding: '0.75rem',
            backgroundColor: 'var(--success-bg)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--success-border)',
            fontSize: '0.78rem',
            color: 'var(--success-text)',
          }}>
            <Shield size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <span>
              {isHindi
                ? 'गोपनीयता नीति: आपके दस्तावेज़ कभी भी सर्वर डेटाबेस पर सहेजे नहीं जाते हैं। सहेजी गई योजनाएं पूरी तरह से आपके ब्राउज़र के स्थानीय स्टोरेज में रहती हैं।'
                : 'Privacy Architecture: Documents are never stored or retained on any server database. Saved plans are stored strictly in your browser local storage.'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: 'var(--bg-tertiary)',
        }}>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            {isHindi ? 'पूर्ण' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
