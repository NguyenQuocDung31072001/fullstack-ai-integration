# Fullstack AI Chat Application

A production-ready chat application built with **NestJS** backend and **React + Vite + Tailwind CSS** frontend, powered by [TanStack AI](https://tanstack.com/ai). Features include multi-model AI support (OpenAI, Anthropic, Google Gemini), conversation persistence, and tool/function calling.

## 🚀 Features

- **Multi-Model Support**: Switch between OpenAI GPT-4, Anthropic Claude, and Google Gemini models
- **Real-time Streaming**: Server-Sent Events (SSE) for streaming AI responses
- **Conversation History**: Persistent conversation storage with file-based JSON backend
- **Tool Calling**: Built-in function calling examples (weather, product search, time)
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- **Type-Safe**: Full TypeScript implementation across frontend and backend
- **Production-Ready**: Proper error handling, loading states, and user feedback

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn** or **pnpm**
- **API Keys**: At least one of the following:
  - OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))
  - Anthropic API Key ([Get one here](https://console.anthropic.com/))
  - Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## 🛠️ Installation

### 1. Clone and Setup

```bash
cd fullstack-ai-integration
```

### 2. Configure Environment Variables

Create a `.env` file in the **root** directory:

```bash
# OpenAI (Required if using OpenAI models)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Anthropic (Required if using Anthropic models)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here

# Google Gemini (Required if using Gemini models)
GEMINI_API_KEY=your-gemini-api-key-here
```

**Note**: You need at least one API key configured. The application will use OpenAI by default.

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🚦 Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run start:dev
```

Backend will start on: **http://localhost:3000**

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will start on: **http://localhost:5173**

The application will automatically open in your browser at **http://localhost:5173**

## 📖 Usage Guide

### Starting a Conversation

1. The app opens with an empty chat interface
2. Select your preferred AI model from the dropdown (top-right)
3. Type your message in the input box
4. Press "Send" or hit Enter

### Switching Models

Click the model selector dropdown in the header to choose from:

- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-4 Turbo
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Haiku
- **Google Gemini**: Gemini 2.0 Flash, Gemini 1.5 Pro

### Managing Conversations

- **New Conversation**: Click "New Conversation" in the sidebar
- **Load Conversation**: Click any conversation in the sidebar to continue
- **Delete Conversation**: Hover over a conversation and click the trash icon
- **Auto-Save**: Conversations are automatically saved as you chat

### Using Tools/Functions

The AI can automatically call built-in tools when relevant:

- **Weather**: Ask "What's the weather in San Francisco?"
- **Product Search**: Ask "Find me laptops under $1000"
- **Time**: Ask "What time is it in Tokyo?"

Tool calls and results are displayed in the chat with special formatting.

## 🏗️ Project Structure

```
fullstack-ai-integration/
├── backend/                  # NestJS Backend
│   ├── src/
│   │   ├── chat/            # Chat module (streaming, multi-model)
│   │   │   ├── chat.controller.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── chat.module.ts
│   │   │   └── dto/
│   │   ├── conversation/    # Conversation persistence
│   │   │   ├── conversation.controller.ts
│   │   │   ├── conversation.service.ts
│   │   │   ├── conversation.module.ts
│   │   │   └── entities/
│   │   ├── tools/           # Function calling tools
│   │   │   ├── tools.service.ts
│   │   │   └── tools.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── data/                # Conversation storage (auto-created)
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.tsx            # Main chat component
│   │   │   ├── ConversationList.tsx # Sidebar
│   │   │   └── ModelSelector.tsx    # Model dropdown
│   │   ├── hooks/
│   │   │   └── useConversations.ts  # Conversation management
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── .env                     # Environment variables
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Chat

- **POST** `/api/chat` - Stream chat responses
  - Body: `{ messages, conversationId?, model?, provider? }`
  - Returns: Server-Sent Events stream

### Conversations

- **GET** `/api/conversations` - List all conversations
- **GET** `/api/conversations/:id` - Get specific conversation
- **POST** `/api/conversations` - Save/update conversation
- **DELETE** `/api/conversations/:id` - Delete conversation

## 🎨 Customization

### Adding New Tools

Edit `backend/src/tools/tools.service.ts`:

```typescript
import { toolDefinition } from "@tanstack/ai"
import { z } from "zod"

const myToolDef = toolDefinition({
  name: "myTool",
  description:
    "Description of what the tool does",
  inputSchema: z.object({
    param: z
      .string()
      .describe("Parameter description"),
  }),
})

const myTool = myToolDef.server(
  async ({ param }) => {
    // Your tool implementation
    return { result: "some data" }
  },
)

// Add to getTools() return array
```

### Styling

All styles use Tailwind CSS. Customize in:

- `frontend/tailwind.config.js` - Theme configuration
- `frontend/src/index.css` - Global styles
- Component files - Component-specific styles

## 🐛 Troubleshooting

### Backend won't start

- Check if port 3000 is available
- Verify Node.js version (>= 18)
- Ensure dependencies are installed: `cd backend && npm install`

### Frontend won't connect

- Verify backend is running on http://localhost:3000
- Check browser console for CORS errors
- Ensure frontend is running on http://localhost:5173

### API Key Issues

- Verify `.env` file is in the root directory (not backend/)
- Check API key format (no spaces, quotes, or extra characters)
- Restart backend after adding/changing API keys
- Test API key with provider's official tools

### "Model not found" errors

- Ensure you have the correct API key for the selected provider
- Check model name spelling in `ModelSelector.tsx`
- Verify API key has access to the specific model

## 📚 Technology Stack

- **Backend Framework**: NestJS 10
- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **AI Integration**: TanStack AI (alpha)
- **Language**: TypeScript 5
- **AI Providers**: OpenAI, Anthropic, Google Gemini
- **Data Storage**: File-based JSON

## 🤝 Contributing

This is a demonstration project following the [TanStack AI Quick Start guide](https://tanstack.com/ai/latest/docs/getting-started/quick-start). Feel free to:

- Report issues
- Suggest features
- Submit pull requests
- Fork and customize for your needs

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- Built with [TanStack AI](https://tanstack.com/ai)
- Inspired by modern AI chat interfaces
- Uses OpenAI, Anthropic, and Google Gemini APIs

## 🔗 Resources

- [TanStack AI Documentation](https://tanstack.com/ai/latest/docs/getting-started/overview)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**Happy Chatting! 🎉**

For questions or issues, please check the troubleshooting section or create an issue in the repository.
