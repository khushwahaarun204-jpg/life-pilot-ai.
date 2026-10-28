import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeDashboard from './components/HomeDashboard';
import SmartInput from './components/SmartInput';
import AnalysisWorkspace from './components/AnalysisWorkspace';
import SavedPlansDrawer from './components/SavedPlansDrawer';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import { SAMPLE_PRESETS } from './utils/samples';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'lifepilot_saved_plans_v1';

export default function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('lifepilot_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('lifepilot_theme') || 'light');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('lifepilot_font_size') || 'normal');

  // Navigation & View state: 'home' | 'new-analysis' | 'workspace'
  const [activeView, setActiveView] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [aiStatus, setAiStatus] = useState(null);
  const [text, setText] = useState('');
  const [privacyRedact, setPrivacyRedact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPlan, setCurrentPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lifepilot_theme', theme);
  }, [theme]);

  // Sync font size
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('lifepilot_font_size', fontSize);
  }, [fontSize]);

  // Sync language
  useEffect(() => {
    localStorage.setItem('lifepilot_lang', language);
  }, [language]);

  // Load saved plans from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setSavedPlans(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse local saved plans', e);
    }
  }, []);

  // Fetch AI health status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setAiStatus(data.ai);
        }
      } catch (err) {
        console.warn('Backend not responding yet:', err.message);
      }
    };
    fetchStatus();
  }, []);

  // Sync task changes back to currentPlan and savedPlans
  const handleUpdateTasks = (newTasks) => {
    setTasks(newTasks);
    if (currentPlan) {
      const updatedPlan = { ...currentPlan, actionPlan: newTasks };
      setCurrentPlan(updatedPlan);

      const updatedList = savedPlans.map((p) => (p.id === currentPlan.id ? updatedPlan : p));
      setSavedPlans(updatedList);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    }
  };

  // Analyze document
  const handleAnalyze = async () => {
    if (!text || text.trim().length < 10) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language,
          privacyRedact,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze text.');
      }

      const planData = {
        ...json.data,
        id: `plan-${Date.now()}`,
        title: text.slice(0, 48).replace(/\n/g, ' ') + '...',
        createdAt: new Date().toISOString(),
        originalText: text,
      };

      setCurrentPlan(planData);
      setTasks(planData.actionPlan || []);

      // Persist to saved plans
      const updatedList = [planData, ...savedPlans.filter((p) => p.id !== planData.id)].slice(0, 20);
      setSavedPlans(updatedList);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

      // Switch to the split-screen Copilot Workspace!
      setActiveView('workspace');

      setToastMessage(
        language === 'hi'
          ? '✨ विश्लेषण पूरा हुआ! आपकी कार्य योजना तैयार है।'
          : '✨ Analysis complete! Your action plan is ready.'
      );
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred while analyzing the document.');
    } finally {
      setLoading(false);
    }
  };

  // Load a saved plan
  const handleLoadPlan = (plan) => {
    setCurrentPlan(plan);
    setTasks(plan.actionPlan || []);
    setText(plan.originalText || '');
    setActiveView('workspace');
    setIsSavedDrawerOpen(false);
    setToastMessage(
      language === 'hi' ? `योजना "${plan.title}" लोड की गई` : `Plan "${plan.title}" loaded`
    );
  };

  // Delete a saved plan
  const handleDeletePlan = (planId) => {
    const updated = savedPlans.filter((p) => p.id !== planId);
    setSavedPlans(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    if (currentPlan?.id === planId) {
      setCurrentPlan(null);
      setTasks([]);
      setActiveView('home');
    }
    setToastMessage(language === 'hi' ? 'योजना हटाई गई' : 'Plan deleted');
  };

  // Navigation handlers
  const handleNewAnalysis = () => {
    setActiveView('new-analysis');
    setError(null);
  };

  const handleSelectSample = (sample) => {
    setText(sample.text);
    setActiveView('new-analysis');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleFontSize = () => {
    setFontSize((prev) => (prev === 'normal' ? 'large' : 'normal'));
  };

  const handleSidebarNav = (viewId) => {
    if (viewId === 'saved-plans') {
      setIsSavedDrawerOpen(true);
    } else {
      setActiveView(viewId);
    }
  };

  const isHindi = language === 'hi';

  return (
    <div className="app-shell">
      {/* 1. Collapsible Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={handleSidebarNav}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        savedCount={savedPlans.length}
        language={language}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main App Content Wrapper */}
      <div className="app-content">
        {/* Top Header */}
        <Header
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          toggleTheme={toggleTheme}
          fontSize={fontSize}
          toggleFontSize={toggleFontSize}
          aiStatus={aiStatus}
          savedCount={savedPlans.length}
          onOpenSaved={() => setIsSavedDrawerOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Dashboard Viewport */}
        <main className="dashboard-viewport">
          {/* Error Banner */}
          {error && (
            <div style={{
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem 1.2rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--danger-text)',
            }}>
              <AlertTriangle size={18} />
              <div style={{ flex: 1, fontSize: '0.88rem' }}>
                <strong>{isHindi ? 'त्रुटि:' : 'Error:'}</strong> {error}
              </div>
            </div>
          )}

          {/* 1. Home View: Personal Productivity Dashboard */}
          {activeView === 'home' && (
            <HomeDashboard
              savedPlans={savedPlans}
              currentPlan={currentPlan}
              tasks={tasks}
              onNewAnalysis={handleNewAnalysis}
              onLoadPlan={handleLoadPlan}
              onSelectSample={handleSelectSample}
              language={language}
            />
          )}

          {/* 2. New Analysis: Clean AI Workspace */}
          {activeView === 'new-analysis' && (
            <div className="animate-fade-in" style={{ maxWidth: '880px', margin: '0 auto' }}>
              <SmartInput
                text={text}
                setText={setText}
                onAnalyze={handleAnalyze}
                loading={loading}
                language={language}
                privacyRedact={privacyRedact}
                setPrivacyRedact={setPrivacyRedact}
              />
            </div>
          )}

          {/* 3. Analysis Results: Dedicated Split-Screen AI Copilot */}
          {activeView === 'workspace' && currentPlan && (
            <AnalysisWorkspace
              currentPlan={currentPlan}
              tasks={tasks}
              setTasks={handleUpdateTasks}
              originalText={text}
              onNewAnalysis={handleNewAnalysis}
              language={language}
              onShowToast={setToastMessage}
            />
          )}
        </main>

        {/* Clean Application Footer */}
        <footer style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.25rem 1.75rem',
          marginTop: 'auto',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <strong>Life Pilot AI</strong> — Less Confusion. More Clarity. Better Action.
              <div style={{ fontSize: '0.75rem', marginTop: '0.15rem' }}>
                Powered by Google Gemma 4 (<code>gemma-4-26b-a4b-it</code>).
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={15} color="var(--success)" />
                {isHindi ? 'गोपनीयता प्रथम: कोई डेटा सर्वर पर नहीं' : 'Privacy-First: Zero Server Data Retention'}
              </span>
              <span>MIT License</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Saved Plans History Drawer Modal */}
      <SavedPlansDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPlans={savedPlans}
        onLoadPlan={handleLoadPlan}
        onDeletePlan={handleDeletePlan}
        language={language}
      />

      {/* Preferences & Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        fontSize={fontSize}
        toggleFontSize={toggleFontSize}
        aiStatus={aiStatus}
      />

      {/* Non-blocking Toast Alerts */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
