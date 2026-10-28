import React from 'react';
import { Compass, Moon, Sun, Type, Sparkles, FolderArchive, ShieldAlert, Cpu } from 'lucide-react';

export default function Header({
  language,
  setLanguage,
  theme,
  toggleTheme,
  fontSize,
  toggleFontSize,
  aiStatus,
  savedCount,
  onOpenSaved,
}) {
  const isHindi = language === 'hi';

  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-secondary)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      transition: 'background-color 0.2s',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.9rem',
        paddingBottom: '0.9rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Brand & Mission Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          }}>
            <Compass size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                LifePilot AI
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                Hacktoberfest
              </span>
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              margin: 0,
            }}>
              {isHindi ? 'कम उलझन। अधिक स्पष्टता। बेहतर कार्य।' : 'Less Confusion. More Clarity. Better Action.'}
            </p>
          </div>
        </div>

        {/* Action Controls & Accessibility Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* AI Status Badge */}
          <div
            className={`badge ${aiStatus?.isDemo ? 'badge-warning' : 'badge-success'}`}
            title={aiStatus?.note || 'AI Model Status'}
            style={{ padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            {aiStatus?.isDemo ? <ShieldAlert size={13} /> : <Cpu size={13} />}
            <span>
              {aiStatus?.isDemo ? 'Demo Mode' : (aiStatus?.model || 'Gemma 4 Live')}
            </span>
          </div>

          {/* Saved Plans Button */}
          <button
            onClick={onOpenSaved}
            className="btn btn-secondary btn-sm"
            aria-label="View Saved Plans"
            title="Saved Plans History"
          >
            <FolderArchive size={15} />
            <span>{isHindi ? 'सहेजे गए प्लान' : 'Saved Plans'}</span>
            {savedCount > 0 && (
              <span style={{
                background: 'var(--primary)',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '0.1rem 0.4rem',
                borderRadius: '10px',
                fontWeight: 700,
              }}>
                {savedCount}
              </span>
            )}
          </button>

          {/* Language Toggle */}
          <div style={{
            display: 'inline-flex',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setLanguage('en')}
              className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 0, padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
              aria-label="English Language"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`btn btn-sm ${language === 'hi' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 0, padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
              aria-label="Hindi Language"
            >
              हिन्दी
            </button>
          </div>

          {/* Accessible Font Size Toggle */}
          <button
            onClick={toggleFontSize}
            className="btn btn-outline btn-sm"
            aria-label="Toggle Font Size"
            title={fontSize === 'large' ? 'Switch to normal font size' : 'Switch to large accessible font size'}
            style={{ padding: '0.4rem' }}
          >
            <Type size={16} />
            <span style={{ fontSize: '0.75rem' }}>{fontSize === 'large' ? '18px' : '16px'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline btn-sm"
            aria-label="Toggle Dark/Light Mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ padding: '0.4rem 0.55rem' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
