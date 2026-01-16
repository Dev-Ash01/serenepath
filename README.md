# SerenePath: AI Therapeutic Companion

A zero-cost, privacy-focused AI mental wellness chatbot that provides empathetic, therapist-like conversations with intelligent token optimization.

## 🌟 Key Features

- **Therapeutic Conversations**: Understands user scenarios, provides comfort and guidance like a therapist
- **Smart Token Optimization**: Uses keyword mapping + context compression to reduce API calls while maintaining context
- **Session Memory**: Temporary memory throughout conversation for accurate, relatable responses
- **Emotion-Aware Responses**: Detects emotional state and adapts tone accordingly
- **Crisis Escalation**: Detects crisis signals and provides resources
- **Zero-Cost Deployment**: Free tier Google Gemini API + Firebase + Vercel
- **Privacy-First**: Minimal data retention, encrypted storage, user control
- **Mobile-Responsive**: Beautiful UI optimized for all devices

## 🏗️ Tech Stack

**Frontend:**
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- ONNX Runtime (client-side sentiment detection)

**Backend:**
- Vercel Functions (serverless)
- Firebase (Auth, Firestore, Storage)
- Google Gemini API (free tier)

**Deployment:**
- GitHub (repository)
- Vercel (frontend + backend)
- Firebase (database)

## 📊 Architecture

```
User Input
    ↓
Client-Side Processing (ONNX emotion detection)
    ↓
Keyword Extraction & Context Compression
    ↓
Gemini API Call (optimized prompt with keyword map)
    ↓
Session Memory (temporary, in-app)
    ↓
Emotion-Aware Response Generation
    ↓
Crisis Detection
    ↓
Display Response & Update Memory
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git
- GitHub account
- Vercel account (free)
- Firebase account (free)
- Google AI Studio account

### Installation

1. **Clone repository**
```bash
git clone https://github.com/yourusername/serenepath.git
cd serenepath
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup** (create `.env.local`)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

GEMINI_API_KEY=your_gemini_api_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

## 🎯 How It Works

### 1. Smart Token Optimization

Instead of sending the entire conversation history:

```javascript
// ❌ Inefficient: 3000 tokens
"User messages: I feel sad, I can't sleep, my job is stressful, my family doesn't understand..."

// ✅ Efficient: 300 tokens
Keyword Map:
- emotions: [sadness, insomnia]
- contexts: [job_stress, family_conflict]
- intensity: moderate
- trend: worsening
Session Summary: "User experiencing stress at work and home, affecting sleep"
```

### 2. Temporary Session Memory

Conversation state stored in browser memory (IndexedDB):

```json
{
  "sessionId": "sess_123",
  "startTime": "2026-01-15T17:00:00Z",
  "keywordMap": {
    "emotions": ["anxiety", "sadness"],
    "situations": ["job_interview", "family_pressure"],
    "themes": ["self_doubt", "perfectionism"]
  },
  "emotionalTrajectory": [
    { "turn": 1, "emotion": "anxious", "intensity": 0.8 },
    { "turn": 2, "emotion": "anxious", "intensity": 0.7 },
    { "turn": 3, "emotion": "calm", "intensity": 0.3 }
  ],
  "messages": [ /* last 5 for context */ ],
  "therapistNotes": "User ruminating on interview performance, needs grounding"
}
```

### 3. Therapeutic Prompt Engineering

```javascript
const therapeuticPrompt = `
You are a compassionate therapist. Your role:
- Understand the user's situation deeply
- Validate their emotions without judgment
- Guide them toward insight and comfort
- Suggest practical coping strategies
- Never diagnose or prescribe

User's emotional context:
${keywordMap}

Emotional trajectory: ${emotionalTrend}

Previous session themes: ${sessionThemes}

Respond with warmth, genuine understanding, and therapeutic skill.
Keep responses conversational, not robotic.
`;
```

## 📁 Project Structure

```
serenepath/
├── public/
│   └── models/
│       └── distilbert-emotion.onnx
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts (Gemini integration)
│   │   └── page.module.css
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── CrisisModal.tsx
│   │   └── SessionReminder.tsx
│   ├── lib/
│   │   ├── firebase.ts (Firebase config)
│   │   ├── gemini.ts (Gemini API wrapper)
│   │   ├── sessionMemory.ts (Conversation state)
│   │   ├── keywords.ts (Keyword extraction)
│   │   ├── emotion.ts (ONNX emotion detection)
│   │   └── crisis.ts (Crisis detection)
│   ├── hooks/
│   │   ├── useSessionMemory.ts
│   │   └── useChatHistory.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🔐 Security & Privacy

- End-to-end encrypted messages (optional)
- Minimal data retention (30 days)
- Firebase security rules (read/write restrictions)
- No tracking, no ads, no data selling
- User-initiated deletion
- GDPR compliant

## 📋 Disclaimers

**Important:** SerenePath is NOT a substitute for professional mental health treatment. It:
- Cannot diagnose mental health conditions
- Cannot prescribe or manage medications
- Is not therapy, though it mimics therapeutic techniques
- Should not be used in emergencies (use crisis lines instead)

See [DISCLAIMERS.md](./DISCLAIMERS.md) for full details.

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](./LICENSE)

## 🆘 Crisis Resources

If you or someone you know is in crisis:
- **US**: 988 Suicide & Crisis Lifeline
- **India**: AASRA: 9820466726 | iCall: 1860 2662 345
- **UK**: Samaritans: 116 123
- **Canada**: 1-833-456-4566
- **Australia**: 1300 659 467

## 📧 Contact & Support

- Issues: [GitHub Issues](https://github.com/yourusername/serenepath/issues)
- Email: support@serenepath.dev
- Documentation: [Docs](./docs/)

---

**Built with ❤️ for mental wellness**
