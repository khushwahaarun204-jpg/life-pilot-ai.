# 🧭 Life Pilot AI

> **"Less Confusion. More Clarity. Better Action."**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24+-339933.svg)](https://nodejs.org/)
[![Google Gemma](https://img.shields.io/badge/AI-Google_Gemma_4-4285F4.svg)](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api)
[![Design](https://img.shields.io/badge/Design-shadcn%2Fui_Dashboard-000000.svg)](https://ui.shadcn.com/)

---

## 🎯 Mission & Product Identity

Millions of students, parents, busy workers, and everyday users receive complex notices every day:
- **School circulars** with hidden deadlines, fees, and dress rehearsal timings.
- **Apartment association memos** announcing water cuts and elevator maintenance.
- **Pre-surgery hospital sheets** with strict fasting schedules and medication guidelines.
- **Freelance milestone agreements** with billing deadlines and tax conditions.

Too often, critical steps are missed due to jargon and cognitive overload. **Life Pilot AI** converts everyday text into **organized, understandable, and strictly grounded action plans** using **Google Gemma 4** (`gemma-4-26b-a4b-it`) hosted on the **Google Gemini API**.

### Four Core Architecture Pillars
1. **Personal Productivity Dashboard**: Live tracking of real pending tasks, completed tasks, upcoming deadlines, saved plans, and quick actions.
2. **Clean AI Workspace**: Distraction-free document input with realistic sample prompts, character counter, and Privacy Shield.
3. **Split-Screen AI Copilot**: Side-by-side view featuring the original document on the left and the AI breakdown, action checklist, and grounded Q&A on the right.
4. **shadcn/ui-Inspired Design System**: Clean typography (Outfit & Plus Jakarta Sans), collapsible sidebar navigation, crisp cards, status badges, and subtle micro-animations.

---

## 🚀 Key Features

### 1. 📝 Smart Input with 1-Click Presets
- Paste notices, circulars, doctor instructions, emails, or government memos.
- Includes pre-configured realistic announcements for instant testing:
  - **School Annual Day & Fee Notice**
  - **Apartment Water Supply & Elevator Maintenance**
  - **Pre-Surgery Medical Guidelines**
  - **Freelance Scope & Milestone Billing**
- **Privacy Shield**: Built-in toggle to automatically redact sensitive phone numbers, email addresses, and credit cards before processing.
- Live character counter, word count, and reading time estimation.

### 2. 🧠 "Understand It" Grounded Breakdown
- **Plain Language Summary**: 2–3 sentences explaining what is happening without jargon.
- **Important Facts & Requirements**: Direct, verified points extracted from the text.
- **Explicit Dates, Deadlines & Amounts**: Highlighted visual chips distinguishing calendar dates from financial amounts.
- **Uncertainties & Missing Information**: A dedicated caution box highlighting missing details (e.g. unknown payment methods or unstated times) so users know what to confirm with the sender.
- **Read Aloud (Speech Synthesis)**: Integrated Web Speech API audio narration in both English and Hindi for students, elderly, and visually impaired users.

### 3. ✅ Interactive Action Planner
- Structured checklist of actionable steps with clear action-verb titles.
- Priority levels: **High** (Crimson), **Medium** (Amber), **Low** (Blue).
- Explicit Deadlines only when supported by the text or entered by the user.
- Interactive completion checkboxes with celebration confetti when all tasks are finished!
- Filter by: **All**, **Pending**, **Completed**, or **High Priority**.
- **Add Custom Tasks**: Add your own tasks with deadlines and priorities.
- **Export Options**:
  - 📅 **Export to Calendar (.ics)**: Import dated tasks directly into Google Calendar, Apple Calendar, or Outlook with one click.
  - 📋 **Copy Checklist**: Formatted plain-text checklist with `[x]` / `[ ]` for messaging apps or notes.
  - 📄 **Download Markdown**: Complete structured report for archival.

### 4. 📊 Daily Dashboard
- Real-time stat counters: Pending Tasks, Completed Tasks, Upcoming Deadlines, and High-Priority Alerts.
- Visual Progress Bar tracking percentage completion.
- One-click button to reset or analyze new information.
- Local Storage history preserving your recent plans securely on your device.

### 5. 🌐 Accessible & Bilingual AI (English + हिन्दी)
- Full support for simple English and **हिन्दी (Hindi)** with native Devanagari script.
- Accessible font size toggle (**16px** / **18px**) for easy reading.
- Sleek **Dark Mode** and warm **Light Mode** toggles.
- WCAG AA compliant contrast ratios, accessible focus rings, and screen-reader labels.

### 6. 💬 Grounded Follow-up Questions (Anti-Hallucination Q&A)
- Ask specific questions about the pasted document.
- Clear badges distinguishing:
  - 🟢 **Verified in Document**: Direct citations quoted from source text.
  - 🟡 **Practical Suggestion / Next Step**: Advice clearly labeled as a recommendation rather than an explicit source fact.
  - ⚠️ **Not in Document**: Honest declaration if the document does not mention the requested detail.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Vanilla CSS Design System, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express, CORS, Dotenv, REST API |
| **AI Integration** | Google Generative AI SDK (`@google/generative-ai`), Google Gemini API running **Gemma 4** (`gemma-4-26b-a4b-it`) |
| **Official Docs** | [Run Gemma with the Gemini API](https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api) |
| **Security & Privacy** | Backend proxy prevents API key exposure; optional client-side PII redaction; zero cloud storage of user documents |
| **Export Formats** | iCalendar (.ics), Markdown (.md), Clipboard Text |

---

## ⚙️ Prerequisites

- **Node.js** v18.0.0 or higher (Tested on Node v24.21.0)
- **npm** v9.0.0 or higher

---

## 📥 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/LifePilot.git
   cd LifePilot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *(On Windows PowerShell, use `npm.cmd install` if script execution policies are enabled)*

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your Google Gemini API key:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   AI_MODEL=gemma-4-26b-a4b-it
   FALLBACK_TO_DEMO=true
   ```

   - **Get a Key**: Obtain a free Google Gemini API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
   - **Supported Gemma 4 Models on Gemini API**:
     - `gemma-4-26b-a4b-it` (Default: 26B/4B active MoE with thinking)
     - `gemma-4-31b-it` (31B parameter dense)
   - **Offline Demo Mode**: If `GEMINI_API_KEY` is not provided, LifePilot automatically runs in safe **Demo Mode (Offline)** using built-in presets and heuristics. Live status is only declared when an actual API request succeeds.

---

## 🏃 Running the Application

### Option A: Development Mode (Vite Client + Express Server)
```bash
npm run dev
```
*(On Windows PowerShell: `npm.cmd run dev`)*
- Client runs on: `http://localhost:5173`
- Backend API runs on: `http://localhost:3001` (proxied automatically)

### Option B: Production Server (Fastest Single-Command Launch)
```bash
npm run build
npm start
```
*(On Windows PowerShell: `npm.cmd run build` then `npm.cmd start`)*
Open your browser to:
👉 **`http://localhost:3001`**

---

## 🧪 Testing the Application

An automated end-to-end verification script is included to test all API routes, groundings, privacy redaction, and error handling:

```bash
node test_e2e.js
```

### Verified Test Suites:
1. `GET /api/health` — Provider health and honest model status reporting
2. `GET /api/samples` — Availability of pre-curated presets
3. `POST /api/analyze` (English) — Summary, dates/amounts chips, uncertainties, and prioritized checklist
4. `POST /api/analyze` (Hindi) — Native Devanagari output with localized action items
5. `POST /api/chat` — Grounded follow-up Q&A and citation defense
6. `POST /api/redact-preview` — Sensitive PII redaction (email, phone, credit card)
7. `POST /api/analyze` (Validation) — Graceful handling of empty input and text < 10 characters
8. `GET /` — Production frontend bundle serving

---

## 📖 Repeatable Demonstration Walkthrough

Follow these steps to demonstrate LifePilot AI in under 2 minutes:

1. **Launch the Application**:
   Visit `http://localhost:3001`.
2. **Select a Sample Notice**:
   Click on the preset chip **"School Annual Day & Fees"**. The circular will populate into the text area.
3. **Run AI Analysis**:
   Click **"Analyze & Create Action Plan"**.
4. **Inspect the Output**:
   - Check the **Daily Dashboard** showing 5 pending tasks and 0 completed tasks.
   - Read the **Plain Language Summary** and click **"Read Aloud (Audio)"** to hear the speech synthesizer.
   - Review the **Explicit Dates & Amounts** (₹1,800 deposit, ₹14,500 tuition fee, Nov 6 deadline).
   - Check the **Uncertainties Box** noting that payment method (online vs cash) is unstated in the circular.
5. **Interact with Action Checklist**:
   - Check the box for *"Pay ₹1,800 costume deposit"*. Watch the progress bar increment to 20%!
   - Click **"Add Task"**, enter *"Buy white formal shoes for Annual Day"*, and click Save.
6. **Ask a Follow-up Question**:
   - In the Q&A section, click the quick question *"What is the very first deadline?"*.
   - Notice the green badge: **"Verified in Source Document"** with exact quotation.
7. **Test Accessibility & Language**:
   - Click **"हिन्दी"** in the top navigation bar to switch to Hindi.
   - Click the **Font Size Toggle (18px)** and **Dark Mode** toggle.
8. **Export Tasks**:
   - Click **"Calendar (.ics)"** to download the calendar event file for Google/Apple Calendar.

---

## 🔒 Reliability, Grounding & Privacy Safeguards

- **Never Expose Secrets**: API keys are isolated strictly on the Node.js backend.
- **Hallucination Defense**: The AI prompt strictly enforces extraction of only explicit source facts. Missing details are routed to the *Uncertainties* alert.
- **Untrusted Input Handling**: Input text is validated, sanitized, and bounded by character limits.
- **Client-Side Storage**: Documents and action plans are preserved only in browser `localStorage`. No user documents are permanently stored on the server.
- **Privacy Shield**: One-click regex redactor wipes credit cards, phone numbers, and emails before analysis.

---

## 🚀 Publishing to GitHub

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "feat: complete LifePilot AI web application for Hacktoberfest"

# 4. Create a new repository on GitHub (e.g. LifePilot-AI)
# 5. Link and push to GitHub:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/LifePilot-AI.git
git push -u origin main
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free for open source, educational, and personal use.

---

*Built with ❤️ for Hacktoberfest 2026: AI for Everyone.*
