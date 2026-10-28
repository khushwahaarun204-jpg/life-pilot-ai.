import React from 'react';
import {
  Compass,
  Home,
  PlusCircle,
  FolderArchive,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeView,
  setActiveView,
  collapsed,
  setCollapsed,
  savedCount = 0,
  language = 'en',
  isMobileOpen = false,
  setIsMobileOpen,
  onOpenSettings,
}) {
  const isHindi = language === 'hi';

  const navItems = [
    {
      id: 'home',
      label: isHindi ? 'होम' : 'Home',
      icon: Home,
      badge: null,
      tooltip: isHindi ? 'होम डैशबोर्ड' : 'Productivity Dashboard',
    },
    {
      id: 'new-analysis',
      label: isHindi ? 'नया विश्लेषण' : 'New Analysis',
      icon: PlusCircle,
      badge: null,
      tooltip: isHindi ? 'नया दस्तावेज़ विश्लेषण करें' : 'AI Document Workspace',
    },
    {
      id: 'saved-plans',
      label: isHindi ? 'सहेजे गए प्लान' : 'Saved Plans',
      icon: FolderArchive,
      badge: savedCount > 0 ? savedCount : null,
      tooltip: isHindi ? 'सहेजे गए प्लान देखें' : 'View Saved Plans',
    },
    {
      id: 'settings',
      label: isHindi ? 'सेटिंग्स' : 'Settings',
      icon: Settings,
      badge: null,
      tooltip: isHindi ? 'प्राथमिकताएं व सेटिंग्स' : 'Preferences & Diagnostics',
    },
  ];

  const handleNavClick = (id) => {
    if (id === 'settings') {
      onOpenSettings?.();
    } else {
      setActiveView(id);
    }
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const sidebarContent = (isMobile = false) => (
    <>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.28)',
            flexShrink: 0,
          }}>
            <Compass size={22} />
          </div>
          {(!collapsed || isMobile) && (
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
              }}>
                Life Pilot AI
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}>
                {isHindi ? 'दैनिक स्पष्टता' : 'Everyday Clarity'}
              </div>
            </div>
          )}
        </div>

        {isMobile ? (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="btn btn-ghost btn-sm"
            aria-label="Close sidebar"
            style={{ padding: '0.35rem' }}
          >
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.35rem', color: 'var(--text-muted)' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={collapsed && !isMobile ? item.tooltip : undefined}
              data-tooltip={collapsed && !isMobile ? item.tooltip : undefined}
              style={{
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                padding: collapsed && !isMobile ? '0.75rem 0' : '0.65rem 0.85rem',
              }}
            >
              <Icon size={19} style={{ flexShrink: 0 }} />
              {(!collapsed || isMobile) && (
                <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
              )}
              {(!collapsed || isMobile) && item.badge !== null && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer info */}
      <div className="sidebar-footer">
        {(!collapsed || isMobile) ? (
          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <ShieldCheck size={16} color="var(--success)" style={{ flexShrink: 0 }} />
            <span>
              {isHindi ? '100% निजी व सुरक्षित' : 'Privacy-First Architecture'}
            </span>
          </div>
        ) : (
          <div
            title="Privacy First Architecture"
            data-tooltip="Privacy-First"
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '0.5rem 0',
              color: 'var(--success)',
            }}
          >
            <ShieldCheck size={20} />
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} desktop-only`} style={{ display: 'none' }}>
        {sidebarContent(false)}
      </aside>

      {/* Inline styles for responsive display */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-only { display: flex !important; }
          .mobile-only { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="sidebar-mobile-overlay" onClick={() => setIsMobileOpen(false)}>
          <div className="sidebar-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
