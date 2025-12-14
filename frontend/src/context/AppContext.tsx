import {
  createContext,
  useContext,
  ReactNode,
} from "react"
import {
  ModelConfig,
  ConversationListItem,
  Conversation,
} from "../types"

export interface AppContextValue {
  // Conversation state
  activeConversationId?: string
  setActiveConversationId: (id?: string) => void

  // UI state
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void

  // Model configuration
  modelConfig: ModelConfig
  setModelConfig: (config: ModelConfig) => void

  // Conversations
  conversations: ConversationListItem[]

  // Actions
  handleNewConversation: () => void
  handleSelectConversation: (
    id: string,
  ) => Promise<void>
  handleDeleteConversation: (
    id: string,
  ) => Promise<void>

  // Conversation hook functions
  loadConversation: (
    id: string,
  ) => Promise<Conversation | null>
  saveConversation: (
    conversation: Partial<Conversation>,
  ) => Promise<Conversation | null>
  deleteConversation: (
    id: string,
  ) => Promise<boolean>
  fetchConversations: () => Promise<void>
}

const AppContext = createContext<
  AppContextValue | undefined
>(undefined)

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error(
      "useAppContext must be used within an AppProvider",
    )
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
  value: AppContextValue
}

export function AppProvider({
  children,
  value,
}: AppProviderProps) {
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
