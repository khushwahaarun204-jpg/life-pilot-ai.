import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  HelpCircle,
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

  // Quick prompt suggestions
  const suggestedQuestions = isHindi
    ? [
        'सबसे पहली अंतिम तिथि क्या है?',
        'क्या कोई जुर्माना या विलंब शुल्क है?',
        'मुझे किससे और कब संपर्क करना चाहिए?',
        'कौन सी जानकारी दस्तावेज में स्पष्ट नहीं है?',
      ]
    : [
        'What is the very first deadline?',
        'Are there any penalties or extra fees mentioned?',
        'Who do I contact for questions or support?',
        'What requirements are not clearly stated?',
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

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
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
          <MessageSquare size={18} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            {isHindi ? 'दस्तावेज़ से जुड़े प्रश्न पूछें (Follow-up Questions)' : 'Ask Grounded Follow-up Questions'}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {isHindi
              ? 'सख्त तथ्यात्मक उत्तर — केवल दस्तावेज़ में दी गई जानकारी के आधार पर'
              : 'Grounded strictly in your source — distinguishing verified facts from suggestions'}
          </span>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div style={{ marginBottom: '1.1rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.45rem' }}>
          {isHindi ? '💡 त्वरित प्रश्न सुझाव:' : '💡 Quick questions to try:'}
        </span>
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
          gap: '0.9rem',
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
                    padding: '0.65rem 1rem',
                    borderRadius: '16px 16px 2px 16px',
                    maxWidth: '80%',
                    fontSize: '0.9rem',
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
                    fontSize: '0.88rem',
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
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px 16px 16px 2px',
                  padding: '1rem 1.15rem',
                  maxWidth: '90%',
                  fontSize: '0.9rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="animate-fade-in"
              >
                {/* Grounding Source Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.55rem' }}>
                  {inDocument ? (
                    <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                      <CheckCircle size={12} />
                      <span>{isHindi ? 'मूल दस्तावेज़ से सत्यापित' : 'Verified in Source Document'}</span>
                    </span>
                  ) : (
                    <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
                      <AlertCircle size={12} />
                      <span>{isHindi ? 'दस्तावेज़ में अनुपलब्ध - मार्गदर्शन' : 'Not Stated in Document (Guidance)'}</span>
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

                {/* Verified Facts Cited */}
                {facts.length > 0 && (
                  <div style={{
                    backgroundColor: 'var(--success-bg)',
                    border: '1px solid var(--success-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 0.75rem',
                    marginBottom: '0.5rem',
                    fontSize: '0.82rem',
                  }}>
                    <strong style={{ color: 'var(--success-text)', display: 'block', marginBottom: '0.2rem' }}>
                      {isHindi ? 'सत्यापित उद्धरण:' : 'Document Citations:'}
                    </strong>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--success-text)' }}>
                      {facts.map((f, fIdx) => (
                        <li key={fIdx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Differentiated Suggestions */}
                {suggestions.length > 0 && (
                  <div style={{
                    backgroundColor: 'var(--primary-light)',
                    border: '1px solid var(--primary-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.82rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.2rem' }}>
                      <Lightbulb size={13} />
                      <span>{isHindi ? 'व्यावहारिक सुझाव / सलाह (अनुशंसा):' : 'Practical Suggestion / Next Step (Advice):'}</span>
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
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}>
              <Sparkles size={16} className="animate-spin" />
              <span>{isHindi ? 'दस्तावेज़ की जांच कर रहे हैं...' : 'Checking document facts...'}</span>
            </div>
          )}
        </div>
      )}

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        style={{ display: 'flex', gap: '0.5rem' }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={
            isHindi
              ? 'दस्तावेज़ के बारे में कोई भी प्रश्न पूछें...'
              : 'Ask any specific question about your notice or instructions...'
          }
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
          }}
          aria-label="Ask follow-up question"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.25rem' }}
        >
          <Send size={16} />
          <span>{isHindi ? 'पूछें' : 'Ask'}</span>
        </button>
      </form>
    </div>
  );
}
