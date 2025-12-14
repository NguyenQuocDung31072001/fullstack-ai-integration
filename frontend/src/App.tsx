import {
  useState,
  useEffect,
  useRef,
} from "react"
import { Toaster } from "react-hot-toast"
import { Chat } from "./components/Chat"
import { ConversationList } from "./components/ConversationList"
import {
  ModelSelector,
  ModelConfig,
} from "./components/ModelSelector"
import { useConversations } from "./hooks/useConversations"
import { AppProvider } from "./context/AppContext"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { UIMessage } from "./types"

function App() {
  const [
    activeConversationId,
    setActiveConversationId,
  ] = useState<string | undefined>()
  const [activeMessages, setActiveMessages] =
    useState<UIMessage[]>([])

  const [modelConfig, setModelConfig] =
    useState<ModelConfig>({
      provider: "openai",
      model: "gpt-4o",
    })
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(true)

  const {
    conversations,
    isLoading,
    error,
    loadConversation,
    saveConversation,
    deleteConversation,
    fetchConversations,
  } = useConversations()

  const isHydratingRef = useRef(false)

  // Auto-save conversation when messages change (skip hydration loads)
  useEffect(() => {
    // Skip the first run after loading an existing conversation
    if (isHydratingRef.current) {
      isHydratingRef.current = false
      return
    }

    // Do not save when no conversation is selected or no messages yet
    if (
      !activeConversationId ||
      activeMessages.length === 0
    ) {
      return
    }

    const saveTimeout = setTimeout(() => {
      saveConversation({
        id: activeConversationId,
        messages: activeMessages,
        model: modelConfig.model,
        provider: modelConfig.provider,
      })
    }, 1000) // Debounce save by 1 second

    return () => clearTimeout(saveTimeout)
  }, [
    activeMessages,
    activeConversationId,
    modelConfig,
  ])

  const handleNewConversation = () => {
    setActiveConversationId(undefined)
    setActiveMessages([])
  }

  const handleSelectConversation = async (
    id: string,
  ) => {
    const conversation = await loadConversation(
      id,
    )

    if (conversation) {
      setActiveConversationId(conversation.id)
      isHydratingRef.current = true
      setActiveMessages(conversation.messages)
      if (
        conversation.model &&
        conversation.provider
      ) {
        setModelConfig({
          model: conversation.model,
          provider: conversation.provider as
            | "openai"
            | "anthropic"
            | "gemini",
        })
      }
    }
  }

  const handleDeleteConversation = async (
    id: string,
  ) => {
    const success = await deleteConversation(id)
    if (success && activeConversationId === id) {
      handleNewConversation()
    }
  }

  const handleMessagesChange = (
    messages: UIMessage[],
  ) => {
    setActiveMessages(messages)
  }

  // Context value for AppProvider
  const contextValue = {
    activeConversationId,
    setActiveConversationId,
    isSidebarOpen,
    setIsSidebarOpen,
    modelConfig,
    setModelConfig,
    conversations,
    handleNewConversation,
    handleSelectConversation,
    handleDeleteConversation,
    loadConversation,
    saveConversation,
    deleteConversation,
    fetchConversations,
  }

  return (
    <ErrorBoundary>
      <AppProvider value={contextValue}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#363636",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          {isSidebarOpen && (
            <ConversationList
              conversations={conversations}
              activeConversationId={
                activeConversationId
              }
              onSelectConversation={
                handleSelectConversation
              }
              onNewConversation={
                handleNewConversation
              }
              onDeleteConversation={
                handleDeleteConversation
              }
              isLoading={isLoading}
            />
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setIsSidebarOpen(
                      !isSidebarOpen,
                    )
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={
                    isSidebarOpen
                      ? "Hide sidebar"
                      : "Show sidebar"
                  }
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  TanStack AI Chat
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <ModelSelector
                  value={modelConfig}
                  onChange={setModelConfig}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Chat Component */}
            <div className="flex-1 overflow-hidden">
              <Chat
                key={activeConversationId}
                conversationId={
                  activeConversationId
                }
                initialMessages={activeMessages}
                modelConfig={modelConfig}
                onMessagesChange={
                  handleMessagesChange
                }
              />
            </div>
          </div>
        </div>
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App
