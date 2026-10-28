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

  // Separate Dates & Deadlines from Amounts & Fees for crisp clarity
  const dates = datesAndAmounts.filter(
    (item) => item.type === 'date' || /date|deadline|schedule|cutoff|due|rehearsal/i.test(item.label)
  );

  const amounts = datesAndAmounts.filter(
    (item) =>
      item.type === 'amount' ||
      item.type === 'fee' ||
      /fee|amount|deposit|cost|price|rupee|₹|\$|penalty|levy|tax/i.test(item.label) ||
      /[₹$€£]|\d+(?:,\d+)*(?:\.\d+)?\s*(?:rs|inr|usd)/i.test(item.value)
  );

  const handleReadAloud = () => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
      return;
    }

    let speechScript = summary + '. ';
    if (facts.length > 0) {
      speechScript += (isHindi ? 'मुख्य विवरण: ' : 'Key details: ') + facts.join('. ') + '. ';
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
    <div className="ui-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Header & Accessibility Read-Aloud */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
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
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {isHindi ? 'दस्तावेज़ को समझें' : 'Understand It'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isHindi ? 'दस्तावेज़ पर आधारित स्पष्ट विश्लेषण' : 'Clear breakdown grounded in the supplied document'}
            </span>
          </div>
        </div>

        {/* Read-Aloud Accessibility Control */}
        <button
          onClick={handleReadAloud}
          className={`btn ${speaking ? 'btn-primary' : 'btn-outline'} btn-sm`}
          aria-label={speaking ? 'Stop speech' : 'Listen to summary'}
          title={isHindi ? 'बोलकर सुनाएं' : 'Listen with text-to-speech'}
          style={{ padding: '0.35rem 0.75rem' }}
        >
          {speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>
            {speaking
              ? (isHindi ? 'रोकें' : 'Stop Audio')
              : (isHindi ? 'सुनें (Audio)' : 'Read Aloud')}
          </span>
        </button>
      </div>

      {/* 1. Plain-Language Summary (2-3 sentences) */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderLeft: '4px solid var(--primary)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.15rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '0.3rem',
        }}>
          {isHindi ? 'सरल सारांश' : 'Plain-Language Summary'}
        </div>
        <p style={{
          fontSize: '0.98rem',
          lineHeight: 1.65,
          color: 'var(--text-primary)',
          margin: 0,
          fontWeight: 500,
        }}>
          {summary}
        </p>
      </div>

      {/* 2. Key Details & Important Facts */}
      {facts.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--text-primary)',
          }}>
            <CheckCircle size={15} color="var(--success)" />
            <span>{isHindi ? 'मुख्य विवरण व आवश्यकताएं' : 'Important Facts & Key Details'}</span>
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.6rem',
          }}>
            {facts.map((fact, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.7rem 0.85rem',
                  fontSize: '0.86rem',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.55rem',
                }}
              >
                <span style={{
                  color: 'var(--success)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  lineHeight: 1,
                  marginTop: '0.15rem',
                }}>
                  •
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{fact}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Dates & Deadlines */}
      {dates.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--text-primary)',
          }}>
            <Calendar size={15} color="var(--primary)" />
            <span>{isHindi ? 'उल्लिखित समय-सीमाएं व तिथियां' : 'Dates & Deadlines'}</span>
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
            {dates.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.825rem',
                }}
              >
                <Calendar size={14} color="var(--primary)" />
                <div>
                  <span style={{
                    fontWeight: 600,
                    color: 'var(--primary)',
                    display: 'block',
                    fontSize: '0.72rem',
                  }}>
                    {item.label}
                  </span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                    {item.value}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Amounts & Fees (Only when relevant amounts appear in source) */}
      {amounts.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--text-primary)',
          }}>
            <DollarSign size={15} color="var(--warning)" />
            <span>{isHindi ? 'वित्तीय राशियां व शुल्क' : 'Amounts & Fees'}</span>
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
            {amounts.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--warning-bg)',
                  border: '1px solid var(--warning-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.825rem',
                }}
              >
                <DollarSign size={14} color="var(--warning-text)" />
                <div>
                  <span style={{
                    fontWeight: 600,
                    color: 'var(--warning-text)',
                    display: 'block',
                    fontSize: '0.72rem',
                  }}>
                    {item.label}
                  </span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                    {item.value}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Uncertainties & Missing Information (Factuality Safeguard) */}
      {uncertainties.length > 0 && (
        <div style={{
          backgroundColor: 'var(--warning-bg)',
          border: '1px solid var(--warning-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.1rem',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--warning-text)',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '0.35rem',
          }}>
            <AlertOctagon size={15} />
            <span>
              {isHindi
                ? 'अनिश्चितताएं व छूटी हुई जानकारी (पुष्टि आवश्यक)'
                : 'Uncertainties & Missing Information (Verify with Sender)'}
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--warning-text)', opacity: 0.9, marginBottom: '0.45rem' }}>
            {isHindi
              ? 'ये विवरण मूल दस्तावेज़ में स्पष्ट नहीं थे और आयोजक से पुष्टि की मांग करते हैं:'
              : 'These points were not explicitly specified in the source. Confirm if critical:'}
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-primary)' }}>
            {uncertainties.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.2rem' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grounding Attribution Note */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginTop: '0.85rem',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '0.65rem',
      }}>
        <Info size={13} />
        <span>
          {isHindi
            ? 'यह जानकारी आपके द्वारा दिए गए दस्तावेज़ के आधार पर सख्ती से तैयार की गई है।'
            : 'All extracted details are strictly based on the provided source document.'}
        </span>
      </div>
    </div>
  );
}
