import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SmartInput from './components/SmartInput';
import DailyDashboard from './components/DailyDashboard';
import UnderstandPanel from './components/UnderstandPanel';
import ActionPlanner from './components/ActionPlanner';
import FollowUpChat from './components/FollowUpChat';
import SavedPlansDrawer from './components/SavedPlansDrawer';
import Toast from './components/Toast';
import { SAMPLE_PRESETS } from './utils/samples';
import { ShieldCheck, Heart, Sparkles, AlertTriangle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'lifepilot_saved_plans_v1';

export default function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('lifepilot_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('lifepilot_theme') || 'light');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('lifepilot_font_size') || 'normal');

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

  // Sync theme to document element
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

  // Sync tasks changes back to currentPlan and savedPlans
  const handleUpdateTasks = (newTasks) => {
    setTasks(newTasks);
    if (currentPlan) {
      const updatedPlan = { ...currentPlan, actionPlan: newTasks };
      setCurrentPlan(updatedPlan);

      // Update in saved plans list
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
        title: text.slice(0, 45).replace(/\n/g, ' ') + '...',
        createdAt: new Date().toISOString(),
        originalText: text,
      };

      setCurrentPlan(planData);
      setTasks(planData.actionPlan || []);

      // Save to saved plans in localStorage
      const updatedList = [planData, ...savedPlans.filter((p) => p.id !== planData.id)].slice(0, 20);
      setSavedPlans(updatedList);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

      setToastMessage(
        language === 'hi'
          ? '✨ दस्तावेज़ का विश्लेषण पूरा हुआ और कार्य योजना तैयार है!'
          : '✨ Analysis complete! Action plan generated.'
      );

      // Scroll smoothly to dashboard
      setTimeout(() => {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred while analyzing the document.');
    } finally {
      setLoading(false);
    }
  };

  // Analyze new information button
  const handleAnalyzeNew = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load a saved plan
  const handleLoadPlan = (plan) => {
    setCurrentPlan(plan);
    setTasks(plan.actionPlan || []);
    setText(plan.originalText || '');
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
    }
    setToastMessage(language === 'hi' ? 'योजना हटाई गई' : 'Plan deleted');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleFontSize = () => {
    setFontSize((prev) => (prev === 'normal' ? 'large' : 'normal'));
  };

  const isHindi = language === 'hi';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
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
      />

      {/* Main Body */}
      <main style={{ flex: 1, padding: '2rem 0 3rem' }}>
        <div className="container">
          {/* Mission Hero Banner */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
            padding: '1.25rem 1rem',
          }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '0.45rem',
            }}>
              {isHindi
                ? 'दैनिक जानकारी को स्पष्ट, संगठित कार्य योजनाओं में बदलें'
                : 'Turn Everyday Information Into Organized Action'}
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto',
            }}>
              {isHindi
                ? 'छात्रों, अभिभावकों और पेशेवरों के लिए सरल AI सहायक। कम उलझन, अधिक स्पष्टता, बेहतर कार्य।'
                : 'Simple, grounded AI for students, parents, and workers. Less confusion, more clarity, better action.'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--danger-text)',
            }}>
              <AlertTriangle size={20} />
              <div style={{ flex: 1, fontSize: '0.9rem' }}>
                <strong>{isHindi ? 'त्रुटि:' : 'Error:'}</strong> {error}
              </div>
            </div>
          )}

          {/* Daily Dashboard (always visible if tasks exist or above smart input) */}
          {tasks.length > 0 && (
            <DailyDashboard
              tasks={tasks}
              onAnalyzeNew={handleAnalyzeNew}
              language={language}
            />
          )}

          {/* Smart Input Component */}
          <SmartInput
            text={text}
            setText={setText}
            onAnalyze={handleAnalyze}
            loading={loading}
            language={language}
            privacyRedact={privacyRedact}
            setPrivacyRedact={setPrivacyRedact}
          />

          {/* Understand It Panel (when currentPlan exists) */}
          {currentPlan && (
            <UnderstandPanel
              data={currentPlan}
              language={language}
            />
          )}

          {/* Action Planner Component (when tasks exist) */}
          {tasks.length > 0 && (
            <ActionPlanner
              tasks={tasks}
              setTasks={handleUpdateTasks}
              fullPlan={currentPlan}
              language={language}
              onShowToast={setToastMessage}
            />
          )}

          {/* Follow-up Questions Chat (when currentPlan exists) */}
          {currentPlan && (
            <FollowUpChat
              documentText={text}
              language={language}
              onShowToast={setToastMessage}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        padding: '2rem 0',
        marginTop: 'auto',
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            <strong>LifePilot AI</strong> — Hacktoberfest: AI for Everyone
            <div style={{ fontSize: '0.78rem', marginTop: '0.2rem' }}>
              Built with React, Vite, Node.js, and Google Gemma 4.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={16} color="var(--success)" />
              {isHindi ? 'गोपनीयता प्रथम: कोई दस्तावेज़ संग्रहीत नहीं' : 'Privacy First: No Documents Stored on Server'}
            </span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>

      {/* Saved Plans Drawer Modal */}
      <SavedPlansDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPlans={savedPlans}
        onLoadPlan={handleLoadPlan}
        onDeletePlan={handleDeletePlan}
        language={language}
      />

      {/* Non-blocking Toast Alerts */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
