# Frontend - TanStack AI Chat with Client Tools

A modern AI chat application built with React, TypeScript, TanStack AI, and Tailwind CSS, featuring comprehensive client-side tools for UI control, conversation management, and browser API access.

## 🚀 Features

- **Multi-Provider Support**: OpenAI, Anthropic Claude, and Google Gemini
- **Real-time Streaming**: Server-Sent Events (SSE) for token-by-token responses
- **Conversation Management**: Create, switch, rename, and delete conversations
- **Client Tools**: 13 client-side tools for AI to control the application
- **Type-Safe**: Full TypeScript coverage with Zod schemas
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Toast Notifications**: React Hot Toast for user feedback
- **Error Handling**: Comprehensive error boundaries and validation

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **TanStack AI React** - AI state management and streaming
- **Tailwind CSS** - Styling
- **Zod** - Runtime validation
- **React Hot Toast** - Notifications
- **Vite** - Build tool

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

Opens on `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
```

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

## 🎯 Client Tools

The application exposes 13 client-side tools that the AI can use:

### Conversation Management Tools

1. **create_conversation** - Start a new conversation
2. **switch_conversation** - Load an existing conversation
3. **delete_conversation** - Remove a conversation permanently
4. **rename_conversation** - Change conversation title
5. **list_conversations** - Get all available conversations

### UI Control Tools

6. **show_notification** - Display toast notifications (success, error, info, warning)
7. **toggle_sidebar** - Show/hide the conversation sidebar
8. **change_model** - Switch AI provider and model
9. **update_ui_theme** - Change theme (light, dark, auto)

### Browser API Tools

10. **save_to_storage** - Save data to localStorage
11. **get_from_storage** - Retrieve data from localStorage
12. **copy_to_clipboard** - Copy text to user's clipboard
13. **get_user_location** - Get user's geographic coordinates (requires permission)

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Chat.tsx     # Main chat interface with TanStack AI
│   │   ├── ConversationList.tsx
│   │   ├── ModelSelector.tsx
│   │   ├── ToolRenderer.tsx
│   │   └── ErrorBoundary.tsx
│   ├── context/         # React Context for state management
│   │   └── AppContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   └── useConversations.ts
│   ├── tools/           # Client-side tool definitions
│   │   ├── index.ts
│   │   ├── schemas.ts   # Zod validation schemas
│   │   └── definitions/
│   │       ├── conversation-tools.ts
│   │       ├── ui-tools.ts
│   │       └── browser-tools.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   └── styles/          # CSS files
│       └── assistant-ui-theme.css
```

## 🔌 How Client Tools Work

1. **Tool Registration**: Tools are registered in `tools/index.ts` and exposed globally via `window.__clientTools`

2. **Context Access**: Tools receive app context via closure, allowing them to:

   - Access and modify app state
   - Call React state setters
   - Interact with the DOM
   - Use browser APIs

3. **Backend Integration**: The backend can instruct the frontend to execute tools by sending special messages/instructions

4. **Type Safety**: All tools have:
   - Zod input schemas for validation
   - Zod output schemas for type safety
   - TypeScript types for IDE support

## 📝 Example Tool Usage

```typescript
// Creating a new tool
export const createCustomTools = (
  getContext: () => any,
) => {
  return {
    my_custom_tool: async (input: {
      param: string
    }) => {
      try {
        const context = getContext()
        // Access app state
        context.setModelConfig({
          provider: "openai",
          model: "gpt-4o",
        })

        // Use browser APIs
        localStorage.setItem("key", input.param)

        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error.message,
        }
      }
    },
  }
}
```

## 🎨 Styling

The application uses:

- **Tailwind CSS** for utility classes
- **Custom CSS** for specific styling needs
- **Gradient avatars** for user and AI messages
- **Color-coded tool displays**:
  - Blue boxes for tool calls
  - Green boxes for tool results
  - Purple boxes for extended thinking

## 🔒 Type Safety

All components and tools are fully typed:

```typescript
import { UIMessage } from "./types"

// Messages are typed
const [messages, setMessages] = useState<
  UIMessage[]
>([])

// Tools have input/output types
type ToolInput = z.infer<typeof myToolInputSchema>
type ToolOutput = z.infer<
  typeof myToolOutputSchema
>
```

## 🚨 Error Handling

- **Error Boundaries**: Catch React errors and display fallback UI
- **Try-Catch Blocks**: All async operations are wrapped
- **Toast Notifications**: User-friendly error messages
- **Validation**: Zod schemas validate all tool inputs

## 🎯 Best Practices

1. **State Management**: Use AppContext for global state
2. **Tool Design**: Keep tools focused and single-purpose
3. **Error Handling**: Always return success/error status
4. **Type Safety**: Use Zod schemas for runtime validation
5. **User Feedback**: Show notifications for important actions

## 🔄 Message Flow

```
User Input → TanStack AI → SSE Connection → Backend
    ↓
Backend Response Stream → TanStack AI → UI Update
    ↓
Tool Execution (if requested) → Update App State → UI Update
```

## 📚 Additional Resources

- [TanStack AI Docs](https://tanstack.com/ai)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod](https://zod.dev)

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Add Zod schemas for new data types
3. Create tool definitions for new capabilities
4. Update this README when adding features

## 📄 License

MIT
