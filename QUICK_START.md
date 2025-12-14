# Quick Start Guide

Follow these steps to get your fullstack AI chat application running:

## Prerequisites

- Node.js v18+ installed
- At least one AI provider API key (OpenAI, Anthropic, or Gemini)

## Setup Steps

### 1. Create Environment File

Create a `.env` file in the `backend` directory:

```bash
cd backend
```

Create `.env` with your API keys:

```env
# Required for OpenAI models (GPT-4, GPT-4o, etc.)
OPENAI_API_KEY=sk-your-key-here

# Optional - for Claude models
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional - for Gemini models
GEMINI_API_KEY=your-key-here
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install  # or yarn install
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

Wait for: `🚀 Backend running on http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev  # or yarn dev
```

Open: `http://localhost:5173`

## You're Ready! 🎉

The chat interface should now be available. Try:
1. Selecting a model from the dropdown
2. Typing a message
3. Watching the AI respond in real-time

## Available Models

### OpenAI
- GPT-4o (fastest, most capable)
- GPT-4o Mini (efficient)
- GPT-4 Turbo

### Anthropic (if ANTHROPIC_API_KEY is set)
- Claude 3.5 Sonnet
- Claude 3 Haiku

### Google Gemini (if GEMINI_API_KEY is set)
- Gemini 2.0 Flash
- Gemini 1.5 Pro

## Troubleshooting

### Backend won't start
- Check that Node.js version is 18+: `node --version`
- Ensure `.env` file exists with at least one API key
- Run `npm install` again in the backend directory

### Frontend won't connect
- Verify backend is running on port 3000
- Check browser console for CORS errors
- Ensure frontend is running on port 5173

### API errors
- Verify API keys are valid and have credits
- Check that you're using the correct environment variable names
- Look at backend logs for detailed error messages

## Project Structure

```
fullstack-ai-integration/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── chat/        # Chat module with AI integration
│   │   ├── conversation/ # Conversation persistence
│   │   ├── tools/       # Function calling tools
│   │   └── main.ts      # Entry point
│   ├── .env            # Your API keys (create this!)
│   └── package.json
│
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   └── App.tsx      # Main app
│   └── package.json
│
└── README.md            # Full documentation
```

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [FIXES_APPLIED.md](./FIXES_APPLIED.md) for technical details about the implementation
- Explore the built-in function calling examples (ask about weather or products)
- Try switching between different AI models to compare responses

Enjoy your AI chat application! 🚀

