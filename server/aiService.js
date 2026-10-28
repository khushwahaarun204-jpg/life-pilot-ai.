import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SAMPLES } from './sampleData.js';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const DEFAULT_MODEL = process.env.AI_MODEL || 'gemma-4-26b-a4b-it';
const FALLBACK_TO_DEMO = process.env.FALLBACK_TO_DEMO !== 'false';

// Track real live API verification state (never claim "Gemma 4 Live" without a verified response)
let liveVerificationState = {
  verified: false,
  lastChecked: null,
  error: null,
};

// Helper to sanitize and redact sensitive info if requested
export function redactSensitiveData(text) {
  if (!text) return '';
  // Redact credit cards (16 digits or 4x4)
  let redacted = text.replace(/\b(?:\d{4}[-\s]?){3}\d{4}\b/g, '[REDACTED_CARD]');
  // Redact email addresses
  redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');
  // Redact 10-digit Indian/US phone numbers
  redacted = redacted.replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[REDACTED_PHONE]');
  return redacted;
}

// Get provider status for health check - strictly honest, never fakes live status
export function getAIStatus() {
  if (GEMINI_API_KEY) {
    if (liveVerificationState.verified) {
      return {
        configured: true,
        provider: 'Google Gemini API (Gemma 4)',
        model: DEFAULT_MODEL,
        isDemo: false,
        isLive: true,
        statusLabel: 'Gemma 4 Live',
        note: `Live Gemma 4 model (${DEFAULT_MODEL}) verified and active via Gemini API`,
      };
    } else {
      return {
        configured: true,
        provider: 'Google Gemini API (Gemma 4)',
        model: DEFAULT_MODEL,
        isDemo: false,
        isLive: false,
        statusLabel: 'Gemma 4 (Key Configured)',
        note: liveVerificationState.error
          ? `Gemma 4 API Notice: ${liveVerificationState.error}`
          : `API key configured for ${DEFAULT_MODEL}. Run an analysis to verify live inference.`,
      };
    }
  } else {
    return {
      configured: false,
      provider: 'Built-in Demo Engine',
      model: 'No API Key — Offline Demo Mode',
      isDemo: true,
      isLive: false,
      statusLabel: 'Demo Mode (Offline)',
      note: `Provide GEMINI_API_KEY in .env to connect to live Gemma 4 (${DEFAULT_MODEL}) via Gemini API.`,
    };
  }
}

// Main analysis function
export async function analyzeDocument({ text, language = 'en', privacyRedact = false }) {
  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    throw new Error('Input text must be at least 10 characters long.');
  }

  const processedText = privacyRedact ? redactSensitiveData(text) : text;

  // 1. Try Google Gemini API with Gemma 4 (gemma-4-26b-a4b-it)
  if (GEMINI_API_KEY) {
    try {
      const result = await analyzeWithGemma4(processedText, language);
      liveVerificationState.verified = true;
      liveVerificationState.lastChecked = new Date().toISOString();
      liveVerificationState.error = null;

      return {
        success: true,
        data: result,
        provider: 'Google Gemini API (Gemma 4)',
        model: DEFAULT_MODEL,
        isDemo: false,
        isLive: true,
      };
    } catch (err) {
      liveVerificationState.verified = false;
      liveVerificationState.error = err.message;
      console.warn('Gemma 4 API call failed, evaluating fallback:', err.message);

      if (!FALLBACK_TO_DEMO) {
        throw new Error(`Gemma 4 AI inference failed: ${err.message}`);
      }
    }
  }

  // 2. Fallback to Smart Built-in Engine (clearly identified as Demo Mode)
  const smartResult = generateSmartDemoAnalysis(processedText, language);
  return {
    success: true,
    data: smartResult,
    provider: 'Built-in Demo Engine (Local Heuristics)',
    model: 'offline-demo',
    isDemo: true,
    isLive: false,
    note: GEMINI_API_KEY
      ? `Live Gemma 4 request failed (${liveVerificationState.error}). Displaying local demo fallback.`
      : `Demo mode active. To connect live Gemma 4 (${DEFAULT_MODEL}), set GEMINI_API_KEY in .env file.`,
  };
}

// Gemma 4 analysis implementation via Gemini API
async function analyzeWithGemma4(text, language) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: DEFAULT_MODEL, // gemma-4-26b-a4b-it
    generationConfig: {
      temperature: 0.2, // Low temperature for maximum grounding and strict factuality
    },
  });

  const prompt = buildAnalysisPrompt(text, language);
  const response = await model.generateContent(prompt);
  const responseText = response.response.text();

  const parsed = parseJsonResponse(responseText);
  return validateAnalysisData(parsed);
}

// Prompt builder with strict grounding instructions
function buildAnalysisPrompt(text, language) {
  const langInstruction =
    language === 'hi'
      ? 'CRITICAL: Generate ALL responses in clear, simple everyday Hindi (Devanagari script).'
      : 'Generate all responses in plain, simple, jargon-free English.';

  return `You are LifePilot AI, a compassionate assistant designed to turn complex notices, emails, instructions, circulars, and announcements into clear, actionable plans.

MISSION & AUDIENCE:
Help anyone (parents, students, workers, elderly) understand what they actually need to do without getting overwhelmed.

CRITICAL RELIABILITY & PRIVACY RULES:
1. STRICT FACTUAL GROUNDING: Extract ONLY facts, dates, deadlines, and amounts that are directly stated in the source text.
2. NEVER INVENT: Do NOT hallucinate or guess dates, phone numbers, penalties, or obligations.
3. UNCERTAINTIES: If anything is unclear, ambiguous, missing, or needs user confirmation, explicitly list it under "uncertainties".
4. ACTION PLAN DEADLINES: Only attach a deadline to a task if a specific date or cutoff is explicitly mentioned or clearly stated in the source. If none is given, set "deadline": null.
5. ${langInstruction}
6. OUTPUT REQUIREMENT: Output your completed JSON object inside a \`\`\`json ... \`\`\` code block.

Return a valid JSON object matching this exact structure:
{
  "summary": "A 2 to 3 sentence simple summary of what this document is about.",
  "facts": [
    "Key fact or requirement directly from the text",
    "Another important fact"
  ],
  "datesAndAmounts": [
    { "label": "Short description (e.g. Costume Fee Due / Water Cut Period)", "value": "Explicit date or amount string", "type": "date" | "amount" }
  ],
  "uncertainties": [
    "Information missing from text or details needing confirmation"
  ],
  "actionPlan": [
    {
      "id": "task-1",
      "title": "Clear action-verb task title",
      "description": "Short 1-sentence guidance on how to complete it",
      "priority": "High" | "Medium" | "Low",
      "deadline": "YYYY-MM-DD or readable string, or null if no deadline stated",
      "status": "pending",
      "category": "Category tag (e.g. Financial, Submission, Logistics)"
    }
  ]
}

SOURCE DOCUMENT:
"""
${text}
"""`;
}

// Helper to parse JSON safely from model output, handling thinking preamble and markdown fences
export function parseJsonResponse(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    throw new Error('AI returned an empty response.');
  }

  const trimmed = rawText.trim();

  // Strategy 1: Direct JSON parse (fast path for clean, raw JSON)
  try {
    const direct = JSON.parse(trimmed);
    if (typeof direct === 'object' && direct !== null) {
      return direct;
    }
  } catch (e) {
    // Continue to extraction strategies
  }

  // Strategy 2: Extract from Markdown code fence (e.g. ```json ... ``` or ``` ... ```)
  // Search for code blocks from the end backwards (since models output thinking first and the final JSON block last)
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi;
  const matches = [...trimmed.matchAll(codeBlockRegex)];
  if (matches.length > 0) {
    for (let i = matches.length - 1; i >= 0; i--) {
      const candidate = matches[i][1].trim();
      try {
        const parsed = JSON.parse(candidate);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
      } catch (e) {
        // Continue searching
      }
    }
  }

  // Strategy 3: Find outermost balanced JSON object in the text
  // Scan backwards from the last closing brace to find the valid matching opening brace
  const lastBraceIdx = trimmed.lastIndexOf('}');
  if (lastBraceIdx !== -1) {
    for (let i = 0; i < lastBraceIdx; i++) {
      if (trimmed[i] === '{') {
        const candidate = trimmed.substring(i, lastBraceIdx + 1).trim();
        try {
          const parsed = JSON.parse(candidate);
          if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
          }
        } catch (e) {
          // Keep scanning
        }
      }
    }
  }

  console.error('Failed to parse JSON response. Raw output was:\n', rawText);
  throw new Error('AI returned an invalid JSON response format.');
}

// Validate parsed analysis structure
export function validateAnalysisData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('AI returned invalid analysis data (expected an object).');
  }
  if (!data.summary || typeof data.summary !== 'string' || !data.summary.trim()) {
    throw new Error('AI response is missing required "summary" text.');
  }
  if (!Array.isArray(data.actionPlan)) {
    throw new Error('AI response is missing required "actionPlan" list.');
  }

  // Ensure optional array fields are safe arrays
  if (!Array.isArray(data.facts)) data.facts = [];
  if (!Array.isArray(data.datesAndAmounts)) data.datesAndAmounts = [];
  if (!Array.isArray(data.uncertainties)) data.uncertainties = [];

  return data;
}

// Validate parsed chat structure
export function validateChatData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('AI returned invalid chat data (expected an object).');
  }
  if (!data.answer || typeof data.answer !== 'string' || !data.answer.trim()) {
    throw new Error('AI chat response is missing required "answer" text.');
  }

  if (!Array.isArray(data.facts)) data.facts = [];
  if (!Array.isArray(data.suggestions)) data.suggestions = [];
  if (typeof data.inDocument !== 'boolean') {
    data.inDocument = data.facts.length > 0;
  }

  return data;
}

// Grounded Follow-up Q&A function
export async function answerFollowUpQuestion({ documentText, question, history = [], language = 'en' }) {
  if (!documentText || !question) {
    throw new Error('Both document text and question are required.');
  }

  // 1. Try Google Gemini API with Gemma 4 (gemma-4-26b-a4b-it)
  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: DEFAULT_MODEL, // gemma-4-26b-a4b-it
        generationConfig: {
          temperature: 0.2,
        },
      });

      const prompt = buildChatPrompt(documentText, question, language);
      const response = await model.generateContent(prompt);
      const parsed = parseJsonResponse(response.response.text());
      const validated = validateChatData(parsed);

      liveVerificationState.verified = true;
      liveVerificationState.lastChecked = new Date().toISOString();
      liveVerificationState.error = null;

      return {
        ...validated,
        isDemo: false,
        isLive: true,
        provider: 'Google Gemini API (Gemma 4)',
        model: DEFAULT_MODEL,
      };
    } catch (err) {
      liveVerificationState.verified = false;
      liveVerificationState.error = err.message;
      console.warn('Gemma 4 chat API call failed, using smart fallback:', err.message);

      if (!FALLBACK_TO_DEMO) {
        throw new Error(`Gemma 4 chat API failed: ${err.message}`);
      }
    }
  }

  // 2. Offline grounded Q&A heuristic fallback
  return generateSmartDemoQnA(documentText, question, language);
}

function buildChatPrompt(documentText, question, language) {
  return `You are LifePilot AI. The user is asking a follow-up question about the following document.
GROUNDING INSTRUCTIONS:
1. Ground your answer strictly in the provided document.
2. If the document explicitly contains the answer, cite the facts under "facts".
3. If providing advice or next steps, label them under "suggestions" so the user knows it is a recommendation and not an explicit document fact.
4. If the document does NOT contain the answer, explicitly declare "inDocument": false, state that the document does not mention this, and suggest who they should contact or check with.
5. Language: ${language === 'hi' ? 'Respond in clear Hindi (Devanagari)' : 'Respond in simple English'}.

Format your response as a valid JSON object:
{
  "answer": "Direct, empathetic answer",
  "facts": ["Specific fact from text"],
  "suggestions": ["Optional helpful advice or next step"],
  "inDocument": true
}

DOCUMENT:
"""
${documentText}
"""

USER QUESTION:
"${question}"`;
}

// Smart heuristic analyzer for fallback / demo mode
function generateSmartDemoAnalysis(text, language = 'en') {
  // Check if matches any pre-curated sample exactly or closely
  for (const sample of SAMPLES) {
    if (
      text.includes(sample.title) ||
      text.includes(sample.text.slice(0, 60)) ||
      sample.text.includes(text.slice(0, 60))
    ) {
      return sample.demoResponse[language] || sample.demoResponse['en'];
    }
  }

  // Heuristic extraction for arbitrary user input
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Extract dates via regex
  const dateRegex = /\b(?:\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}(?:st|nd|rd|th)?,? \d{4}|\d{1,2}(?:st|nd|rd|th)? (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi;
  const foundDates = text.match(dateRegex) || [];

  // Extract currency / amounts
  const amountRegex = /(?:₹|\$|€|£|INR|USD)\s?[\d,]+(?:\.\d{2})?|\b[\d,]+\s?(?:rupees|dollars|lakh|crore)\b/gi;
  const foundAmounts = text.match(amountRegex) || [];

  const datesAndAmounts = [];
  [...new Set(foundDates)].slice(0, 4).forEach((d) => {
    datesAndAmounts.push({ label: 'Key Date Mentioned', value: d, type: 'date' });
  });
  [...new Set(foundAmounts)].slice(0, 4).forEach((a) => {
    datesAndAmounts.push({ label: 'Financial Amount', value: a, type: 'amount' });
  });

  const isHindi = language === 'hi';

  const summary = isHindi
    ? `दस्तावेज़ का विश्लेषण पूरा हुआ। इसमें कुल ${lines.length} मुख्य बिंदु हैं और कुछ महत्वपूर्ण समय-सीमाएं और निर्देश दिए गए हैं। नीचे दिए गए कार्यों की समीक्षा करें।`
    : `This document contains ${lines.length} key points with specific guidance and schedule details. Review the extracted facts and prioritize the immediate action items below.`;

  const facts = lines.slice(0, 4).map((line) => line.replace(/^[-*•\d.)\s]+/, ''));
  if (facts.length === 0) {
    facts.push(isHindi ? 'दस्तावेज़ में विशिष्ट निर्देश दिए गए हैं।' : 'Document provides detailed operational instructions.');
  }

  const uncertainties = [
    isHindi
      ? 'कृपया सत्यापित करें कि कोई अतिरिक्त शुल्क या ऑनलाइन लिंक मूल दस्तावेज में छूटा तो नहीं है।'
      : 'Verify if any specific contact numbers or online submission links were omitted in the text.',
    isHindi
      ? 'यदि कोई समय-सीमा छूट गई हो तो संबंधित विभाग से संपर्क करें।'
      : 'Confirm exact working hours and payment receipt procedures with the organizer.',
  ];

  const actionPlan = [];
  const candidateTasks = lines
    .filter((l) => l.length > 15 && l.length < 120 && !l.toLowerCase().includes('dear'))
    .slice(0, 4);

  if (candidateTasks.length > 0) {
    candidateTasks.forEach((taskText, idx) => {
      const cleanTitle = taskText.replace(/^[-*•\d.)\s]+/, '');
      actionPlan.push({
        id: `task-${idx + 1}`,
        title: cleanTitle,
        description: isHindi
          ? 'दस्तावेज़ के अनुसार इस कार्य को समय पर पूरा करें।'
          : 'Complete this step as instructed in the source notice.',
        priority: idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Low',
        deadline: foundDates[idx] || null,
        status: 'pending',
        category: 'Action Item',
      });
    });
  } else {
    actionPlan.push({
      id: 'task-1',
      title: isHindi ? 'दस्तावेज़ की आवश्यक आवश्यकताओं की समीक्षा करें' : 'Review key requirements from document',
      description: isHindi ? 'सभी मुख्य बिंदुओं की पुष्टि करें।' : 'Double-check all highlighted deadlines and amounts.',
      priority: 'High',
      deadline: foundDates[0] || null,
      status: 'pending',
      category: 'General',
    });
  }

  return {
    summary,
    facts,
    datesAndAmounts,
    uncertainties,
    actionPlan,
  };
}

// Smart heuristic for Grounded Q&A fallback
function generateSmartDemoQnA(documentText, question, language = 'en') {
  const isHindi = language === 'hi';
  const qLower = question.toLowerCase();

  // Find relevant sentences containing matching keywords
  const sentences = documentText
    .split(/(?<=[.?!])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const keywords = qLower
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['what', 'when', 'where', 'which', 'about', 'this', 'that', 'with'].includes(w));

  const matchingSentences = sentences.filter((sentence) => {
    const sLower = sentence.toLowerCase();
    return keywords.some((k) => sLower.includes(k));
  });

  if (matchingSentences.length > 0) {
    const primaryCite = matchingSentences[0];
    return {
      answer: isHindi
        ? `दस्तावेज़ के अनुसार: "${primaryCite}"`
        : `Based directly on the source document: "${primaryCite}"`,
      facts: matchingSentences.slice(0, 2),
      suggestions: [
        isHindi
          ? 'यदि इस पर कोई संशय हो, तो जारीकर्ता के आधिकारिक हेल्पलाइन से पुष्टि करें।'
          : 'Cross-check this detail with the contact person mentioned in the notice if you need further clarification.',
      ],
      inDocument: true,
      isDemo: true,
      provider: 'Built-in Demo Engine (Local Heuristics)',
    };
  }

  // Not explicitly found
  return {
    answer: isHindi
      ? `दिए गए दस्तावेज़ में "${question}" के बारे में कोई स्पष्ट जानकारी नहीं मिली है।`
      : `The provided document does not explicitly mention information regarding "${question}".`,
    facts: [],
    suggestions: [
      isHindi
        ? 'सुझाव: संबंधित कार्यालय, स्कूल या आयोजक से सीधे संपर्क करें।'
        : 'Suggestion: Check directly with the sender, office, or coordinator to get an official confirmation.',
    ],
    inDocument: false,
    isDemo: true,
    provider: 'Built-in Demo Engine (Local Heuristics)',
  };
}
