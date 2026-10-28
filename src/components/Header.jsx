import React from 'react';
import {
  Compass,
  Moon,
  Sun,
  Type,
  FolderArchive,
  ShieldAlert,
  Cpu,
  Menu,
  Settings,
  Sparkles,
} from 'lucide-react';

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
  onToggleMobileMenu,
  onOpenSettings,
}) {
  const isHindi = language === 'hi';

  const isLive = Boolean(aiStatus?.isLive);
  const isDemo = Boolean(aiStatus?.isDemo);

  return (
    <header className="app-topbar">
      {/* Left: Mobile Menu Trigger + Brand Info (for mobile view when sidebar is hidden) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button
          onClick={onToggleMobileMenu}
          className="btn btn-ghost btn-sm mobile-only"
          aria-label="Open navigation menu"
          style={{ padding: '0.4rem' }}
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          }}>
            <Compass size={19} />
          </div>

          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}>
              Life Pilot AI
            </div>
            <p style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.2,
            }}>
              {isHindi ? 'कम उलझन। अधिक स्पष्टता। बेहतर कार्य।' : 'Less Confusion. More Clarity. Better Action.'}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Controls & Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
        {/* Real Model Connection Status Pill */}
        <div
          className={`badge ${isLive ? 'badge-success' : (isDemo ? 'badge-warning' : 'badge-neutral')}`}
          title={aiStatus?.note || 'AI Model Status'}
          style={{
            padding: '0.35rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
          }}
        >
          {isLive ? (
            <>
              <Cpu size={13} />
              <span>Gemma 4 Live</span>
            </>
          ) : isDemo ? (
            <>
              <ShieldAlert size={13} />
              <span>Demo Mode (Offline)</span>
            </>
          ) : (
            <>
              <Cpu size={13} />
              <span>{aiStatus?.model || 'Gemma 4'}</span>
            </>
          )}
        </div>

        {/* Saved Plans Shortcut */}
        <button
          onClick={onOpenSaved}
          className="btn btn-secondary btn-sm"
          aria-label="View Saved Plans"
          title="Saved Plans History"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
        >
          <FolderArchive size={14} />
          <span className="desktop-only">{isHindi ? 'सहेजे गए प्लान' : 'Saved Plans'}</span>
          {savedCount > 0 && (
            <span style={{
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '0.68rem',
              padding: '0.05rem 0.35rem',
              borderRadius: '9999px',
              fontWeight: 700,
            }}>
              {savedCount}
            </span>
          )}
        </button>

        {/* Language Toggle (EN / हिन्दी) */}
        <div style={{
          display: 'inline-flex',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setLanguage('en')}
            className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 0, padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
            aria-label="English Language"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`btn btn-sm ${language === 'hi' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 0, padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
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
          title={fontSize === 'large' ? 'Switch to normal font size' : 'Switch to large font size'}
          style={{ padding: '0.35rem 0.5rem' }}
        >
          <Type size={15} />
          <span style={{ fontSize: '0.72rem' }}>{fontSize === 'large' ? '18px' : '16px'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-outline btn-sm"
          aria-label="Toggle Dark/Light Mode"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{ padding: '0.4rem 0.5rem' }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Settings Button */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="btn btn-ghost btn-sm"
            aria-label="Open Settings"
            title="Settings & Diagnostics"
            style={{ padding: '0.4rem 0.5rem' }}
          >
            <Settings size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
