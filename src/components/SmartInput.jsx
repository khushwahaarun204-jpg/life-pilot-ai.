import React from 'react';
import {
  FileText,
  Sparkles,
  Shield,
  Trash2,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/samples';

const MAX_CHAR_LIMIT = 50000;

export default function SmartInput({
  text,
  setText,
  onAnalyze,
  loading,
  language = 'en',
  privacyRedact,
  setPrivacyRedact,
}) {
  const isHindi = language === 'hi';
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isTooShort = charCount > 0 && charCount < 10;
  const isOverLimit = charCount > MAX_CHAR_LIMIT;

  // Sample chips specified in Phase 4: "College Notice", "Long Email", "Event Details"
  const sampleChips = [
    {
      id: 'college-notice',
      label: isHindi ? 'कॉलेज / स्कूल नोटिस' : 'College Notice',
      sample: SAMPLE_PRESETS[0], // School & College Notice
    },
    {
      id: 'long-email',
      label: isHindi ? 'लंबा ईमेल' : 'Long Email',
      sample: SAMPLE_PRESETS[1], // Apartment maintenance memo / email
    },
    {
      id: 'event-details',
      label: isHindi ? 'कार्यक्रम विवरण' : 'Event Details',
      sample: SAMPLE_PRESETS[2], // Medical / Event protocol
    },
  ];

  const handleSelectChip = (sample) => {
    if (sample && sample.text) {
      setText(sample.text);
    }
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="ui-card animate-fade-in" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* 1. Header Section */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div>
          <h2 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 0.35rem 0',
            color: 'var(--text-primary)',
          }}>
            {isHindi ? 'आइए चीज़ों को और स्पष्ट बनाएं।' : "Let's make things clearer."}
          </h2>
          <p style={{
            fontSize: '0.92rem',
            color: 'var(--text-secondary)',
            margin: 0,
            fontWeight: 500,
          }}>
            {isHindi
              ? 'आपकी जानकारी अंदर। एक स्पष्ट कार्य योजना बाहर।'
              : 'Your information in. A clear plan out.'}
          </p>
        </div>

        {text && (
          <button
            onClick={handleClear}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--danger-text)', padding: '0.35rem 0.65rem' }}
            title={isHindi ? 'साफ़ करें' : 'Clear input text'}
          >
            <Trash2 size={15} />
            <span>{isHindi ? 'हटाएं' : 'Clear'}</span>
          </button>
        )}
      </div>

      {/* 2. Functional Sample Chips */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}>
          <Sparkles size={14} color="var(--primary)" />
          <span>{isHindi ? 'त्वरित उदाहरण चुनें:' : 'Try a realistic sample prompt:'}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {sampleChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => handleSelectChip(chip.sample)}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                padding: '0.35rem 0.85rem',
                fontWeight: 600,
              }}
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Input Label with Document Icon */}
      <label
        htmlFor="document-input"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.9rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.55rem',
        }}
      >
        <FileText size={16} color="var(--primary)" />
        <span>{isHindi ? 'आप क्या समझना चाहते हैं?' : 'What would you like to understand?'}</span>
      </label>

      {/* 4. Spacious Clean Textarea */}
      <div style={{ position: 'relative' }}>
        <textarea
          id="document-input"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHAR_LIMIT))}
          placeholder={
            isHindi
              ? 'अपना नोटिस, ईमेल, असाइनमेंट या निर्देश यहां पेस्ट करें...'
              : 'Paste your notice, email, assignment, or instructions here...'
          }
          rows={7}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1.15rem',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${isOverLimit ? 'var(--danger-border)' : 'var(--border-color)'}`,
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            lineHeight: 1.65,
            resize: 'vertical',
            fontFamily: 'var(--font-body)',
            transition: 'border-color 0.2s',
          }}
          aria-label="Document text to analyze"
        />
      </div>

      {/* 5. Character Counter & Privacy Shield Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '0.85rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Compact Privacy Redaction Control */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.825rem',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          userSelect: 'none',
        }}>
          <input
            type="checkbox"
            checked={privacyRedact}
            onChange={(e) => setPrivacyRedact(e.target.checked)}
            className="task-checkbox"
            style={{ width: '1.15rem', height: '1.15rem' }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Shield size={14} color="var(--primary)" />
            <strong>Privacy Shield:</strong>
            <span>
              {isHindi
                ? 'व्यक्तिगत फोन/ईमेल स्वचालित रूप से छुपाएं'
                : 'Auto-redact personal phone & email numbers'}
            </span>
          </span>
        </label>

        {/* Live Counter */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          <span style={{ color: isOverLimit ? 'var(--danger-text)' : undefined, fontWeight: 600 }}>
            {charCount.toLocaleString()} / {MAX_CHAR_LIMIT.toLocaleString()}
          </span>
          <span style={{ margin: '0 0.4rem' }}>•</span>
          <span>{wordCount} {isHindi ? 'शब्द' : 'words'}</span>
        </div>
      </div>

      {/* Short input feedback warning */}
      {isTooShort && (
        <div style={{
          marginTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.82rem',
          color: 'var(--warning-text)',
        }}>
          <AlertCircle size={15} />
          <span>
            {isHindi
              ? 'सार्थक विश्लेषण के लिए कृपया कम से कम 10 अक्षर दर्ज करें।'
              : 'Please enter at least 10 characters for a meaningful analysis.'}
          </span>
        </div>
      )}

      {/* 6. Primary Action Button */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onAnalyze}
          disabled={loading || charCount < 10 || isOverLimit}
          className="btn btn-primary btn-lg"
          style={{
            minWidth: '280px',
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
          }}
        >
          {loading ? (
            <>
              <Sparkles size={18} className="animate-spin" />
              <span>{isHindi ? 'आपकी जानकारी समझी जा रही है...' : 'Making sense of your information...'}</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>{isHindi ? 'इसे मेरी कार्य योजना में बदलें' : 'Turn this into my action plan'}</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
