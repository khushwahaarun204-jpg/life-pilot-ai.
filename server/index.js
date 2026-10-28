import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  analyzeDocument,
  answerFollowUpQuestion,
  getAIStatus,
  redactSensitiveData,
} from './aiService.js';
import { SAMPLES } from './sampleData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health and AI configuration status endpoint
app.get('/api/health', (req, res) => {
  const status = getAIStatus();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    ai: status,
    version: '1.0.0',
    tagline: 'Less Confusion. More Clarity. Better Action.',
  });
});

// Get sample presets for quick demonstration
app.get('/api/samples', (req, res) => {
  const sampleList = SAMPLES.map(({ id, title, category, icon, text }) => ({
    id,
    title,
    category,
    icon,
    text,
  }));
  res.json({ success: true, samples: sampleList });
});

// Analyze document text and create action plan
app.post('/api/analyze', async (req, res) => {
  try {
    const { text, language = 'en', privacyRedact = false } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text input is required.',
      });
    }

    if (text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least 10 characters of text to analyze.',
      });
    }

    if (text.length > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Text exceeds maximum limit of 50,000 characters.',
      });
    }

    const result = await analyzeDocument({ text, language, privacyRedact });
    res.json(result);
  } catch (error) {
    console.error('Error in /api/analyze:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred during analysis.',
    });
  }
});

// Grounded Follow-up Q&A
app.post('/api/chat', async (req, res) => {
  try {
    const { documentText, question, history = [], language = 'en' } = req.body;

    if (!documentText || !question) {
      return res.status(400).json({
        success: false,
        error: 'Both documentText and question are required.',
      });
    }

    const result = await answerFollowUpQuestion({
      documentText,
      question: question.trim(),
      history,
      language,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in /api/chat:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to answer question.',
    });
  }
});

// Client-side preview redaction helper
app.post('/api/redact-preview', (req, res) => {
  const { text } = req.body;
  const redacted = redactSensitiveData(text || '');
  res.json({ success: true, redacted });
});

// Production: serve built static client if present
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('LifePilot AI API is active. Run Vite dev server for frontend UI.');
    }
  });
});

app.listen(PORT, () => {
  const status = getAIStatus();
  console.log(`🧭 LifePilot AI Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Engine: ${status.provider} [${status.model}] | Demo Mode: ${status.isDemo}`);
});
