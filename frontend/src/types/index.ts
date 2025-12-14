import { UIMessage } from "@tanstack/ai-react"

// Re-export UIMessage for convenience
export type { UIMessage }

// App state interface for Context
export interface AppState {
  activeConversationId?: string
  isSidebarOpen: boolean
  modelConfig: ModelConfig
  conversations: ConversationListItem[]
}

// Model configuration
export interface ModelConfig {
  provider: "openai" | "anthropic" | "gemini"
  model: string
}

// Conversation types
export interface ConversationListItem {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
}

export interface Conversation {
  id: string
  title: string
  messages: UIMessage[]
  model?: string
  provider?: string
  createdAt: string
  updatedAt: string
}

// Tool result types
export interface ToolResult {
  success: boolean
  error?: string
}

export interface ConversationToolResult
  extends ToolResult {
  conversationId?: string
  conversations?: ConversationListItem[]
}

export interface StorageToolResult
  extends ToolResult {
  value?: any
  saved?: boolean
  copied?: boolean
}

export interface LocationResult {
  latitude?: number
  longitude?: number
  error?: string
}
