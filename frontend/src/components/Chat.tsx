import {
  useEffect,
  useRef,
  useState,
} from "react"
import {
  useChat,
  fetchServerSentEvents,
} from "@tanstack/ai-react"
import { useAppContext } from "../context/AppContext"
import { createAllClientTools } from "../tools"
import { ModelConfig } from "./ModelSelector"
import { UIMessage } from "../types"

interface ChatProps {
  conversationId?: string
  initialMessages?: UIMessage[]
  modelConfig: ModelConfig
  onMessagesChange?: (
    messages: UIMessage[],
  ) => void
}

export function Chat({
  conversationId,
  initialMessages,
  modelConfig,
  onMessagesChange,
}: ChatProps) {
  const [input, setInput] = useState("")
  const messagesEndRef =
    useRef<HTMLDivElement>(null)
  const appContext = useAppContext()

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000"

  // Create client tools with context access (for future use)
  const clientTools = createAllClientTools(
    () => appContext,
  )

  // Make tools available globally for backend to call
  useEffect(() => {
    ;(window as any).__clientTools = clientTools
  }, [clientTools])

  const { messages, sendMessage, isLoading } =
    useChat({
      connection: fetchServerSentEvents(
        `${API_URL}/api/chat`,
        {
          body: {
            model: modelConfig.model,
            provider: modelConfig.provider,
            conversationId,
          },
        },
      ),
      initialMessages: initialMessages || [],
    })

  // Notify parent of message changes
  useEffect(() => {
    if (onMessagesChange && messages.length > 0) {
      onMessagesChange(messages)
    }
  }, [messages, onMessagesChange])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage(input)
      setInput("")
    }
  }

  const renderMessagePart = (
    part: any,
    idx: number,
  ) => {
    if (part.type === "thinking") {
      return (
        <div
          key={idx}
          className="text-sm text-purple-600 italic mb-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100"
        >
          <span className="font-semibold">
            💭 Thinking:
          </span>{" "}
          {part.content}
        </div>
      )
    }

    if (part.type === "text") {
      return (
        <div
          key={idx}
          className="whitespace-pre-wrap"
        >
          {part.content}
        </div>
      )
    }

    if (part.type === "tool-call") {
      return (
        <div
          key={idx}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-semibold text-blue-900 text-sm">
              Tool: {part.name}
            </span>
          </div>
          {part.input && (
            <div className="text-xs text-blue-700 mb-2">
              <span className="font-semibold">
                Input:
              </span>
              <pre className="mt-1 bg-blue-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(
                  part.input,
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
        </div>
      )
    }

    if (part.type === "tool-result") {
      return (
        <div
          key={idx}
          className="bg-green-50 border border-green-200 rounded-lg p-3 my-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-semibold text-green-900 text-sm">
              Result: {part.name}
            </span>
          </div>
          {part.result && (
            <div className="text-xs text-green-700">
              <pre className="bg-green-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(
                  part.result,
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg">
                Start a conversation
              </p>
              <p className="text-sm mt-2">
                Send a message to begin chatting
                with AI
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  AI
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.parts.map(
                  (part: any, idx: number) =>
                    renderMessagePart(part, idx),
                )}
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                  U
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              AI
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <span className="loading-dot w-2 h-2 bg-gray-500 rounded-full"></span>
                <span className="loading-dot w-2 h-2 bg-gray-500 rounded-full"></span>
                <span className="loading-dot w-2 h-2 bg-gray-500 rounded-full"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={
                !input.trim() || isLoading
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <span>Send</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
