// Automated verification script for LifePilot AI API and Frontend

async function testLifePilot() {
  console.log('🧪 Starting LifePilot AI verification tests...\n');

  const BASE_URL = 'http://localhost:3001';

  // 1. Health check
  console.log('1️⃣ Testing /api/health...');
  try {
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const health = await healthRes.json();
    console.log('   Status:', health.status);
    console.log('   AI Provider:', health.ai.provider);
    console.log('   AI Model:', health.ai.model);
    console.log('   Demo Mode Active:', health.ai.isDemo);
    if (health.status !== 'healthy') throw new Error('Health check failed');
    console.log('   ✅ Health check passed!\n');
  } catch (e) {
    console.error('   ❌ Health check error:', e.message);
    process.exit(1);
  }

  // 2. Samples endpoint
  console.log('2️⃣ Testing /api/samples...');
  try {
    const samplesRes = await fetch(`${BASE_URL}/api/samples`);
    const samplesData = await samplesRes.json();
    console.log(`   Retrieved ${samplesData.samples.length} presets:`);
    samplesData.samples.forEach((s) => console.log(`   - [${s.category}] ${s.title}`));
    if (!samplesData.samples || samplesData.samples.length === 0) throw new Error('No samples found');
    console.log('   ✅ Samples endpoint passed!\n');
  } catch (e) {
    console.error('   ❌ Samples error:', e.message);
    process.exit(1);
  }

  // 3. Document Analysis in English
  console.log('3️⃣ Testing /api/analyze (English)...');
  const sampleText = `DELHI PUBLIC ACADEMY - NOTICE
Date: October 24, 2026
Circular No: DPA/2026/108
Sub: 15th Annual Day Celebration & Term II Fee Clearance
1. Consent & Costume Fee: A non-refundable costume deposit of ₹1,800 must be deposited with the respective class teacher by Friday, November 6, 2026.
2. Rehearsal Attendance: Full dress rehearsal will take place on November 12, 2026.
3. Term II Tuition Fees: Parents are requested to clear all pending Term II school fees amounting to ₹14,500 latest by November 10, 2026.`;

  try {
    const analyzeRes = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: sampleText,
        language: 'en',
        privacyRedact: false,
      }),
    });
    const analyzeData = await analyzeRes.json();
    if (!analyzeData.success) throw new Error('Analysis failed: ' + JSON.stringify(analyzeData));

    console.log('   Summary:', analyzeData.data.summary.slice(0, 100) + '...');
    console.log(`   Facts extracted (${analyzeData.data.facts.length}):`, analyzeData.data.facts[0]);
    console.log(`   Dates & Amounts (${analyzeData.data.datesAndAmounts.length}):`, analyzeData.data.datesAndAmounts[0]);
    console.log(`   Action Items (${analyzeData.data.actionPlan.length}):`, analyzeData.data.actionPlan[0]?.title);
    console.log('   ✅ English analysis passed!\n');
  } catch (e) {
    console.error('   ❌ Analysis error:', e.message);
    process.exit(1);
  }

  // 4. Document Analysis in Hindi
  console.log('4️⃣ Testing /api/analyze (Hindi - हिन्दी)...');
  try {
    const analyzeHiRes = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: sampleText,
        language: 'hi',
        privacyRedact: false,
      }),
    });
    const analyzeHiData = await analyzeHiRes.json();
    if (!analyzeHiData.success) throw new Error('Hindi Analysis failed');

    console.log('   Hindi Summary:', analyzeHiData.data.summary.slice(0, 100) + '...');
    console.log('   Hindi First Task:', analyzeHiData.data.actionPlan[0]?.title);
    console.log('   ✅ Hindi analysis passed!\n');
  } catch (e) {
    console.error('   ❌ Hindi analysis error:', e.message);
    process.exit(1);
  }

  // 5. Follow-up Grounded Q&A
  console.log('5️⃣ Testing /api/chat (Grounded Q&A)...');
  try {
    const chatRes = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentText: sampleText,
        question: 'What is the costume deposit amount and when is it due?',
        language: 'en',
      }),
    });
    const chatData = await chatRes.json();
    if (!chatData.success) throw new Error('Chat failed');

    console.log('   Answer:', chatData.data.answer);
    console.log('   In Document:', chatData.data.inDocument);
    console.log('   Verified Citations:', chatData.data.facts);
    console.log('   ✅ Grounded Q&A passed!\n');
  } catch (e) {
    console.error('   ❌ Chat error:', e.message);
    process.exit(1);
  }

  // 6. Test Privacy Redaction Helper
  console.log('6️⃣ Testing /api/redact-preview...');
  try {
    const redactRes = await fetch(`${BASE_URL}/api/redact-preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Contact me at john.doe@example.com or call 9876543210 regarding invoice.',
      }),
    });
    const redactData = await redactRes.json();
    if (!redactData.success || !redactData.redacted.includes('[REDACTED_EMAIL]')) {
      throw new Error('Privacy redaction failed');
    }
    console.log('   Redacted output:', redactData.redacted);
    console.log('   ✅ Privacy redaction helper passed!\n');
  } catch (e) {
    console.error('   ❌ Privacy redaction error:', e.message);
    process.exit(1);
  }

  // 7. Test Graceful Error Handling (Empty & Short Input)
  console.log('7️⃣ Testing Graceful Error Handling (Empty & Short input)...');
  try {
    const emptyRes = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '' }),
    });
    if (emptyRes.status !== 400) throw new Error('Expected 400 for empty text');
    const emptyJson = await emptyRes.json();
    console.log('   Empty text rejection:', emptyJson.error);

    const shortRes = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Too short' }),
    });
    if (shortRes.status !== 400) throw new Error('Expected 400 for text < 10 chars');
    const shortJson = await shortRes.json();
    console.log('   Short text rejection:', shortJson.error);

    const badChatRes = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentText: 'Some doc', question: '' }),
    });
    if (badChatRes.status !== 400) throw new Error('Expected 400 for missing question');
    console.log('   ✅ Graceful error handling validated!\n');
  } catch (e) {
    console.error('   ❌ Error handling test error:', e.message);
    process.exit(1);
  }

  // 8. Test Frontend Serving
  console.log('8️⃣ Testing Frontend HTML Serving...');
  try {
    const frontendRes = await fetch(`${BASE_URL}/`);
    const html = await frontendRes.text();
    if (!html.includes('Life Pilot AI') && !html.includes('LifePilot AI')) throw new Error('Frontend does not contain Life Pilot AI title');
    console.log('   HTML size:', html.length, 'bytes');
    console.log('   ✅ Frontend static serving passed!\n');
  } catch (e) {
    console.error('   ❌ Frontend serving error:', e.message);
    process.exit(1);
  }

  // 9. Robust JSON Parser & Output Validation Test Suite
  console.log('9️⃣ Testing Gemma 4 JSON Parser & Validation Suite...');
  try {
    const { parseJsonResponse, validateAnalysisData, validateChatData } = await import('./server/aiService.js');

    // Case A: Fenced JSON with preceding thinking text (Gemma 4 thinking model output)
    const thinkingFenced = `* Input received.
* Analyzing constraints and generating plan...
* Key requirement: { "temp": true } in scratchpad.
\`\`\`json
{
  "summary": "This is a verified test summary.",
  "facts": ["Fact 1", "Fact 2"],
  "datesAndAmounts": [{"label": "Deposit Due", "value": "Nov 15", "type": "date"}],
  "uncertainties": ["Check room number"],
  "actionPlan": [{"id": "t1", "title": "Submit fee", "description": "Pay at room 102", "priority": "High", "deadline": "2026-11-15", "status": "pending", "category": "Finance"}]
}
\`\`\``;
    const parsedA = parseJsonResponse(thinkingFenced);
    validateAnalysisData(parsedA);
    if (parsedA.summary !== 'This is a verified test summary.' || parsedA.actionPlan.length !== 1) {
      throw new Error('Case A failed: thinking fenced extraction');
    }
    console.log('   ✅ Case A passed: Fenced JSON with preceding thinking text');

    // Case B: Raw clean JSON without markdown code fences
    const rawClean = JSON.stringify({
      summary: 'Clean raw JSON without any markdown code fences.',
      facts: ['Explicit fact'],
      actionPlan: [{ id: '1', title: 'Task 1' }],
    });
    const parsedB = parseJsonResponse(rawClean);
    validateAnalysisData(parsedB);
    if (parsedB.summary !== 'Clean raw JSON without any markdown code fences.') {
      throw new Error('Case B failed: clean raw JSON');
    }
    console.log('   ✅ Case B passed: Clean raw JSON (no fences)');

    // Case C: Raw JSON with preceding thinking text (no code fences)
    const thinkingRaw = `* Internal reasoning trace...
* Draft bracket: { "scratch": 1 }
* Final Output:
{
  "summary": "Thinking raw summary",
  "facts": [],
  "actionPlan": []
}`;
    const parsedC = parseJsonResponse(thinkingRaw);
    validateAnalysisData(parsedC);
    if (parsedC.summary !== 'Thinking raw summary') {
      throw new Error('Case C failed: thinking raw JSON');
    }
    console.log('   ✅ Case C passed: Preceding thinking with raw JSON');

    // Case D: Malformed JSON must throw error (not silently pass)
    let malformedCaught = false;
    try {
      parseJsonResponse('Here is your answer without any valid JSON structure at all: hello world.');
    } catch (err) {
      malformedCaught = true;
    }
    if (!malformedCaught) throw new Error('Case D failed: malformed JSON did not throw error');
    console.log('   ✅ Case D passed: Malformed JSON rejected cleanly');

    // Case E: Chat data validation
    const validChat = validateChatData({
      answer: 'The deadline is November 15 according to the notice.',
      facts: ['Notice specifies Nov 15 deadline'],
    });
    if (validChat.answer.length === 0 || validChat.inDocument !== true) {
      throw new Error('Case E failed: chat validation');
    }
    console.log('   ✅ Case E passed: Grounded chat validation');

    console.log('   ✅ Gemma 4 Parser & Validation Suite passed!\n');
  } catch (e) {
    console.error('   ❌ JSON Parser test error:', e.message);
    process.exit(1);
  }

  console.log('🎉 ALL 9 VERIFICATION SUITES PASSED FLAWLESSLY!');
}

testLifePilot();
