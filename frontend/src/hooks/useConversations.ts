import {
  useState,
  useEffect,
  useCallback,
} from "react"
import { UIMessage } from "../types"

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

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000"
const API_BASE = `${API_URL}/api/conversations`

export function useConversations() {
  const [conversations, setConversations] =
    useState<ConversationListItem[]>([])
  const [isLoading, setIsLoading] =
    useState(false)
  const [error, setError] = useState<
    string | null
  >(null)

  const fetchConversations =
    useCallback(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(API_BASE)
        if (!response.ok) {
          throw new Error(
            "Failed to fetch conversations",
          )
        }
        const data = await response.json()
        setConversations(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred",
        )
      } finally {
        setIsLoading(false)
      }
    }, [])

  const loadConversation = useCallback(
    async (
      id: string,
    ): Promise<Conversation | null> => {
      try {
        const response = await fetch(
          `${API_BASE}/${id}`,
        )
        if (!response.ok) {
          throw new Error(
            "Failed to load conversation",
          )
        }
        return await response.json()
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred",
        )
        return null
      }
    },
    [],
  )

  const saveConversation = useCallback(
    async (
      conversation: Partial<Conversation>,
    ): Promise<Conversation | null> => {
      try {
        const response = await fetch(API_BASE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(conversation),
        })
        if (!response.ok) {
          throw new Error(
            "Failed to save conversation",
          )
        }
        const saved = await response.json()
        console.log({ saved, conversation })

        // Update local state intelligently instead of refetching
        setConversations((prev) => {
          const exists = prev.find(
            (c) => c.id === saved.id,
          )

          if (exists) {
            // UPDATE existing conversation
            return prev
              .map((c) =>
                c.id === saved.id
                  ? {
                      id: saved.id,
                      title: saved.title,
                      createdAt: saved.createdAt,
                      updatedAt: saved.updatedAt,
                      messageCount:
                        saved.messages?.length ||
                        0,
                    }
                  : c,
              )
              .sort(
                (a, b) =>
                  new Date(
                    b.updatedAt,
                  ).getTime() -
                  new Date(a.updatedAt).getTime(),
              )
          } else {
            // NEW conversation - add to beginning
            return [
              {
                id: saved.id,
                title: saved.title,
                createdAt: saved.createdAt,
                updatedAt: saved.updatedAt,
                messageCount:
                  saved.messages?.length || 0,
              },
              ...prev,
            ]
          }
        })

        return saved
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred",
        )
        return null
      }
    },
    [],
  )

  const deleteConversation = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const response = await fetch(
          `${API_BASE}/${id}`,
          {
            method: "DELETE",
          },
        )
        if (!response.ok) {
          throw new Error(
            "Failed to delete conversation",
          )
        }

        // Update local state instead of refetching
        setConversations((prev) =>
          prev.filter((c) => c.id !== id),
        )

        return true
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred",
        )
        return false
      }
    },
    [],
  )

  useEffect(() => {
    fetchConversations()
  }, [])

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    loadConversation,
    saveConversation,
    deleteConversation,
  }
}
