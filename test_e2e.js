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

  // 6. Test Frontend Serving
  console.log('6️⃣ Testing Frontend HTML Serving...');
  try {
    const frontendRes = await fetch(`${BASE_URL}/`);
    const html = await frontendRes.text();
    if (!html.includes('LifePilot AI')) throw new Error('Frontend does not contain LifePilot title');
    console.log('   HTML size:', html.length, 'bytes');
    console.log('   ✅ Frontend static serving passed!\n');
  } catch (e) {
    console.error('   ❌ Frontend serving error:', e.message);
    process.exit(1);
  }

  console.log('🎉 ALL 6 VERIFICATION SUITES PASSED FLAWLESSLY!');
}

testLifePilot();
