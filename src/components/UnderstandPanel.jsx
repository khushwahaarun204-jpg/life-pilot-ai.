import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  DollarSign,
  AlertOctagon,
  Volume2,
  VolumeX,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { speakText, stopSpeech } from '../utils/speech';

export default function UnderstandPanel({ data, language = 'en' }) {
  const [speaking, setSpeaking] = useState(false);
  const isHindi = language === 'hi';

  if (!data) return null;

  const { summary, facts = [], datesAndAmounts = [], uncertainties = [] } = data;

  const handleReadAloud = () => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
      return;
    }

    let speechScript = summary + '. ';
    if (facts.length > 0) {
      speechScript += (isHindi ? 'मुख्य बातें: ' : 'Key facts: ') + facts.join('. ') + '. ';
    }

    setSpeaking(true);
    speakText(
      speechScript,
      language,
      () => setSpeaking(false),
      () => setSpeaking(false)
    );
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      {/* Title & Speech Accessibility */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FileText size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              {isHindi ? 'दस्तावेज़ को समझें (Understand It)' : 'Understand It — Clear Breakdown'}
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {isHindi ? 'सरल भाषा में मुख्य बिंदु व तथ्यात्मक विवरण' : 'Simple language summary grounded strictly in your source'}
            </span>
          </div>
        </div>

        {/* Audio Speech Button */}
        <button
          onClick={handleReadAloud}
          className={`btn ${speaking ? 'btn-primary' : 'btn-outline'} btn-sm`}
          aria-label={speaking ? 'Stop speech' : 'Listen to summary'}
          title={isHindi ? 'बोलकर सुनाएं' : 'Listen with text-to-speech'}
        >
          {speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>
            {speaking
              ? (isHindi ? 'रोकें' : 'Stop Audio')
              : (isHindi ? 'सुनें (Audio)' : 'Read Aloud')}
          </span>
        </button>
      </div>

      {/* 1. Short Summary Card */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '1.1rem 1.25rem',
        marginBottom: '1.25rem',
        borderLeft: '4px solid var(--primary)',
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {isHindi ? 'सरल सारांश' : 'Plain Language Summary'}
        </div>
        <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-primary)', margin: 0 }}>
          {summary}
        </p>
      </div>

      {/* 2. Key Facts & Requirements */}
      {facts.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <CheckCircle size={16} color="var(--success)" />
            {isHindi ? 'महत्वपूर्ण तथ्य और आवश्यकताएं' : 'Important Facts & Requirements'}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '0.6rem',
          }}>
            {facts.map((fact, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 0.95rem',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.55rem',
                }}
              >
                <span style={{
                  color: 'var(--success)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  lineHeight: 1,
                  marginTop: '0.1rem',
                }}>
                  •
                </span>
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Dates, Deadlines & Amounts */}
      {datesAndAmounts.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Calendar size={16} color="var(--accent-purple)" />
            {isHindi ? 'उल्लिखित समय-सीमाएं और वित्तीय राशियां' : 'Explicit Dates, Deadlines & Amounts'}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
            {datesAndAmounts.map((item, idx) => {
              const isDate = item.type === 'date' || /date|deadline|schedule/i.test(item.label);
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isDate ? 'var(--primary-light)' : 'var(--warning-bg)',
                    border: `1px solid ${isDate ? 'var(--primary-border)' : 'var(--warning-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                  }}
                >
                  {isDate ? (
                    <Calendar size={14} color="var(--primary)" />
                  ) : (
                    <DollarSign size={14} color="var(--warning-text)" />
                  )}
                  <div>
                    <span style={{
                      fontWeight: 600,
                      color: isDate ? 'var(--primary)' : 'var(--warning-text)',
                      display: 'block',
                      fontSize: '0.75rem',
                    }}>
                      {item.label}
                    </span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {item.value}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Uncertainties & Missing Information (Privacy & Accuracy Safeguard) */}
      {uncertainties.length > 0 && (
        <div style={{
          backgroundColor: 'var(--warning-bg)',
          border: '1px solid var(--warning-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.15rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--warning-text)',
            fontWeight: 700,
            fontSize: '0.88rem',
            marginBottom: '0.4rem',
          }}>
            <AlertOctagon size={16} />
            <span>
              {isHindi
                ? 'अनिश्चितताएं व छूटी हुई जानकारी (पुष्टि आवश्यक)'
                : 'Uncertainties & Missing Information (Verify with Sender)'}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--warning-text)', opacity: 0.9, marginBottom: '0.5rem' }}>
            {isHindi
              ? 'AI ने कोई अनुमान नहीं लगाया है। ये बिंदु मूल दस्तावेज़ में स्पष्ट नहीं थे और पुष्टि की मांग करते हैं:'
              : 'Gemma 4 did not invent or guess these missing details. Confirm with the organizer if critical:'}
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            {uncertainties.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
