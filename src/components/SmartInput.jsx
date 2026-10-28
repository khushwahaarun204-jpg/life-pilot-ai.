import React, { useState } from 'react';
import { Sparkles, Shield, Trash2, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/samples';

export default function SmartInput({
  text,
  setText,
  onAnalyze,
  loading,
  language,
  privacyRedact,
  setPrivacyRedact,
}) {
  const isHindi = language === 'hi';
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estReadTime = Math.max(1, Math.ceil(wordCount / 180));

  const handleSelectSample = (sample) => {
    setText(sample.text);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="var(--primary)" />
            {isHindi ? 'दस्तावेज़ या संदेश दर्ज करें' : 'Smart Input — Paste Any Information'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {isHindi
              ? 'स्कूल नोटिस, डॉक्टर के निर्देश, सरकारी परिपत्र, बिल या ईमेल यहां पेस्ट करें।'
              : 'Paste school circulars, apartment notices, medical instructions, bills, or emails.'}
          </p>
        </div>

        {/* Action icons */}
        {text && (
          <button
            onClick={handleClear}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--danger-text)' }}
            title={isHindi ? 'साफ़ करें' : 'Clear input text'}
          >
            <Trash2 size={15} />
            <span>{isHindi ? 'हटाएं' : 'Clear'}</span>
          </button>
        )}
      </div>

      {/* Preset Example Chips for Instant Exploration */}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.45rem' }}>
          {isHindi ? '⚡ तुरंत आज़माने के लिए एक उदाहरण चुनें:' : '⚡ Try with a realistic sample announcement:'}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {SAMPLE_PRESETS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>{isHindi ? sample.titleHi : sample.title}</span>
              <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{sample.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Text Area */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isHindi
              ? 'यहाँ कोई भी परिपत्र, नोटिस, संदेश या ईमेल पेस्ट करें...'
              : 'Paste your notice, medical advice, apartment memo, or email here...\n\nExample: "DELHI PUBLIC ACADEMY - 15th Annual Day on Nov 14 at Siri Fort Auditorium. Pay costume deposit of ₹1,800 by Nov 6..."'
          }
          rows={6}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            resize: 'vertical',
            transition: 'border-color 0.2s',
          }}
          aria-label="Text to analyze"
        />
      </div>

      {/* Meta Footer & Privacy Redaction Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '0.85rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Privacy Redaction Toggle */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.82rem',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
        }}>
          <input
            type="checkbox"
            checked={privacyRedact}
            onChange={(e) => setPrivacyRedact(e.target.checked)}
            className="task-checkbox"
            style={{ width: '1.1rem', height: '1.1rem' }}
          />
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Shield size={14} color="var(--primary)" />
            {isHindi
              ? 'गोपनीयता सुरक्षा: व्यक्तिगत फोन/ईमेल स्वचालित रूप से छुपाएं'
              : 'Privacy Shield: Auto-redact personal phone & email numbers'}
          </span>
        </label>

        {/* Word / Char counter */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>{charCount} {isHindi ? 'अक्षर' : 'chars'}</span>
          <span style={{ margin: '0 0.4rem' }}>•</span>
          <span>{wordCount} {isHindi ? 'शब्द' : 'words'}</span>
          <span style={{ margin: '0 0.4rem' }}>•</span>
          <span>~{estReadTime} {isHindi ? 'मिनट पढ़ना' : 'min read'}</span>
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onAnalyze}
          disabled={loading || charCount < 10}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', maxWidth: '360px', fontWeight: 700 }}
        >
          {loading ? (
            <>
              <Sparkles size={18} className="animate-spin" />
              <span>{isHindi ? 'गहन विश्लेषण हो रहा है...' : 'Analyzing with Gemma 4...'}</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>{isHindi ? 'विश्लेषण करें और कार्य योजना बनाएं' : 'Analyze & Create Action Plan'}</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>

      {charCount > 0 && charCount < 10 && (
        <div style={{
          marginTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          color: 'var(--warning-text)',
        }}>
          <AlertCircle size={14} />
          <span>{isHindi ? 'कृपया विश्लेषण के लिए कम से कम 10 अक्षर दर्ज करें।' : 'Please enter at least 10 characters to analyze.'}</span>
        </div>
      )}
    </div>
  );
}
