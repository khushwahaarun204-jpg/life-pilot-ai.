import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle,
  Lightbulb,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function FollowUpChat({
  documentText,
  language = 'en',
  onShowToast,
}) {
  const isHindi = language === 'hi';
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  // Suggested questions specified in Phase 8
  const suggestedQuestions = isHindi
    ? [
        'समय-सीमा क्या है?',
        'मुझे क्या करने की आवश्यकता है?',
        'कौन सी फीस या राशियां उल्लिखित हैं?',
      ]
    : [
        'What is the deadline?',
        'What do I need to do?',
        'What fees are mentioned?',
      ];

  const handleAsk = async (queryToAsk) => {
    const q = (queryToAsk || question).trim();
    if (!q || !documentText) return;

    const userMessage = { role: 'user', text: q };
    setChatLog((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText,
          question: q,
          language,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to get answer');
      }

      const botMessage = {
        role: 'assistant',
        data: json.data,
      };

      setChatLog((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          error: isHindi
            ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।'
            : 'Sorry, could not retrieve an answer. Please try again.',
        },
      ]);
      onShowToast?.(err.message || 'Chat error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="ui-card animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Title & Subtitle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.85rem',
      }}>
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
          <MessageSquare size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            {isHindi ? 'एक प्रश्न पूछें' : 'Ask a question'}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {isHindi
              ? 'आपके द्वारा प्रदान की गई जानकारी के आधार पर उत्तर प्राप्त करें।'
              : 'Get answers based on the information you provided.'}
          </span>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          marginBottom: '0.45rem',
        }}>
          <Sparkles size={13} color="var(--primary)" />
          <span>{isHindi ? 'सुझाए गए प्रश्न:' : 'Suggested questions:'}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(sq)}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.78rem',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      {chatLog.length > 0 && (
        <div style={{
          maxHeight: '380px',
          overflowY: 'auto',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          padding: '0.5rem 0',
        }}>
          {chatLog.map((msg, idx) => {
            if (msg.role === 'user') {
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: 'flex-end',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    padding: '0.65rem 0.95rem',
                    borderRadius: '16px 16px 2px 16px',
                    maxWidth: '82%',
                    fontSize: '0.88rem',
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                  }}
                  className="animate-fade-in"
                >
                  {msg.text}
                </div>
              );
            }

            // Error response
            if (msg.error) {
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'var(--danger-bg)',
                    color: 'var(--danger-text)',
                    padding: '0.75rem 1rem',
                    borderRadius: '16px 16px 16px 2px',
                    maxWidth: '85%',
                    fontSize: '0.85rem',
                    border: '1px solid var(--danger-border)',
                  }}
                >
                  {msg.error}
                </div>
              );
            }

            // Structured Grounded Bot Answer
            const { answer, facts = [], suggestions = [], inDocument, provider } = msg.data || {};

            return (
              <div
                key={idx}
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px 16px 16px 2px',
                  padding: '0.95rem 1.1rem',
                  maxWidth: '92%',
                  fontSize: '0.88rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="animate-fade-in"
              >
                {/* Grounding Source Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.55rem' }}>
                  {inDocument ? (
                    <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                      <CheckCircle size={12} />
                      <span>{isHindi ? 'दस्तावेज़ में मिला' : 'Found in document'}</span>
                    </span>
                  ) : (
                    <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
                      <AlertCircle size={12} />
                      <span>{isHindi ? 'दस्तावेज़ में अनुपलब्ध' : 'Not found in document'}</span>
                    </span>
                  )}
                  {provider && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      via {provider}
                    </span>
                  )}
                </div>

                {/* Direct Answer */}
                <p style={{ margin: '0 0 0.65rem 0', lineHeight: 1.55, color: 'var(--text-primary)' }}>
                  {answer}
                </p>

                {/* Verified Facts Cited (Found in document) */}
                {facts.length > 0 && (
                  <div style={{
                    backgroundColor: 'var(--success-bg)',
                    border: '1px solid var(--success-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 0.75rem',
                    marginBottom: '0.5rem',
                    fontSize: '0.8rem',
                  }}>
                    <strong style={{ color: 'var(--success-text)', display: 'block', marginBottom: '0.2rem' }}>
                      {isHindi ? 'दस्तावेज़ से सत्यापित तथ्य:' : 'Verified facts from document:'}
                    </strong>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--success-text)' }}>
                      {facts.map((f, fIdx) => (
                        <li key={fIdx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Differentiated Practical Suggestions */}
                {suggestions.length > 0 && (
                  <div style={{
                    backgroundColor: 'var(--primary-light)',
                    border: '1px solid var(--primary-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.8rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.2rem' }}>
                      <Lightbulb size={13} />
                      <span>{isHindi ? 'व्यावहारिक सुझाव (मार्गदर्शन):' : 'Practical suggestion:'}</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--text-primary)' }}>
                      {suggestions.map((s, sIdx) => (
                        <li key={sIdx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={{
              alignSelf: 'flex-start',
              padding: '0.65rem 1rem',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.825rem',
              color: 'var(--text-muted)',
            }}>
              <Sparkles size={15} className="animate-spin" />
              <span>{isHindi ? 'दस्तावेज़ की जांच कर रहे हैं...' : 'Checking document facts...'}</span>
            </div>
          )}
        </div>
      )}

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isHindi
              ? 'इस दस्तावेज़ के बारे में कोई भी प्रश्न पूछें... (Enter दबाएं)'
              : 'Ask any question about this document... (Press Enter to send)'
          }
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.65rem 0.95rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            lineHeight: 1.4,
          }}
          aria-label="Ask a question about this document"
        />

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn btn-primary btn-sm"
          style={{ padding: '0.65rem 1rem', height: '100%' }}
          aria-label="Send question"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
