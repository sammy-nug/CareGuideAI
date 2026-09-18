# CareGuide AI 🏥

An intelligent, ethical, and culturally accessible health navigation assistant designed to help individuals understand everyday health concerns, identify red-flag emergency symptoms, and prepare effectively for consultations with licensed healthcare professionals.

CareGuide AI is built for **information, triage navigation, and clinical visit preparation**—not for diagnosis, prescription, or medical treatment.

---

## 🌟 Key Features

### 1. 🛡️ Deterministic Pre-LLM Safety Screening
- **Zero-Latency Emergency Guardrail**: Intercepts life-threatening symptoms (such as crushing chest pain, acute breathlessness, sudden facial drooping/weakness, severe hemorrhage, or anaphylaxis) before the probabilistic AI is even called.
- **Direct Emergency Shortcuts**: Surfaces one-tap emergency calling for Nigeria (112 / 199) and international standards (911 / 112) along with clear, life-saving advice.
- **Fail-Safe Curated Health Engine**: If the Gemini API is unavailable, CareGuide seamlessly falls back to an internal, verified clinical knowledge engine ensuring uninterrupted operation and patient safety.

### 2. 💬 Empathetic Bilingual Symptom Navigation
- **Dual Language Support**: Full support for both **English** and **Nigerian Pidgin English (`pcm`)**, making health navigation accessible to broader communities.
- **Contextual Patient Intake**: Optional capture of patient age group, symptom duration, and severity indicators for more relevant information.
- **Structured Response Format**:
  - Empathetic acknowledgment of the concern.
  - Clear **Urgency Level Indicator** (🟢 Green / 🟡 Yellow / 🔴 Red).
  - Explicit **"Why am I seeing this recommendation?"** contributing clinical factors.
  - Safe, supportive self-care information.
  - 2–3 targeted questions to ask a doctor or nurse.

### 3. 📋 Doctor Visit Summary Generator
- Converts the conversational intake into a clean, printable clinical briefing sheet.
- Outlines the chief complaint, timeline, reported symptoms, contextual factors, and prioritized questions for the medical provider.
- Includes one-click **Print / Save PDF** styling and clipboard export.

### 4. 📚 Curated Health Information Library
- Searchable and categorizable repository covering 15 common health topics (e.g., Malaria, Typhoid, Migraines, Acid Reflux, Respiratory Infections, Dehydration).
- Each topic provides verified overviews, common symptoms, safe supportive home care, red-flag warning signs, and doctor discussion points.
- Instant "Start Check on This" jump directly into the conversation flow.

### 5. 🔍 Transparent AI Pipeline Demonstration
- An interactive walkthrough detailing the multi-stage system architecture: User Input & Intake ➔ Deterministic Safety Screen ➔ Grounded Retrieval & Synthesis ➔ Medical Sanitization & Guardrails ➔ User Navigation Display.
- Transparently articulates the boundaries of artificial intelligence in healthcare.

### 6. 🌓 Responsive Dark & Light Mode
- High-contrast, accessible UI compliant with modern readability and contrast standards.
- Persistent theme toggle stored in `localStorage` across page reloads.

---

## 🏗️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion, Lucide React
- **Backend**: Node.js, Express, `tsx`
- **AI / LLM**: `@google/genai` (Gemini 3.8 Flash model via server-side API proxy)
- **Deployment**: Single-bundle CommonJS output via `esbuild` for Cloud Run container hosting

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- A Google Gemini API key (optional for core features; the built-in curated engine handles offline/fallback states)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd careguide-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

---

## 📦 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express server with Vite middleware on port 3000 using `tsx` |
| `npm run build` | Builds the client static bundle with Vite and compiles `server.ts` to `dist/server.cjs` with `esbuild` |
| `npm run start` | Runs the compiled production server (`dist/server.cjs`) |
| `npm run lint` | Type-checks the entire TypeScript codebase using `tsc --noEmit` |

---

## 🔌 API Architecture

All Gemini and safety-critical functions are proxied through server-side routes to protect API keys and guarantee rigorous output sanitization:

- `GET /api/health` — Returns system status, timestamp, and Gemini configuration health.
- `POST /api/safety-check` — Evaluates text against deterministic emergency keywords and returns detected categories and immediate actions.
- `POST /api/chat` — The primary conversational endpoint. Evaluates pre-LLM safety, sends sanitized prompts to Gemini 3.8 Flash, post-processes responses through the medical safety filter (removing dosages and diagnostic claims), or falls back to curated rules.

---

## ⚠️ Medical & Regulatory Disclaimer

**CareGuide AI is an educational and health navigation tool only.** It is not a licensed medical provider, diagnostic engine, medical device, or prescription service.

- If you or someone around you is experiencing a medical emergency (such as severe chest pain, breathing difficulty, sudden weakness or numbness, severe bleeding, or loss of consciousness), **call emergency services immediately (112 / 199 / 911) or proceed to the nearest emergency medical facility.**
- Never delay seeking professional medical evaluation or disregard qualified medical advice because of information provided by this application.

## Author
**Samuel Emmanuel**
