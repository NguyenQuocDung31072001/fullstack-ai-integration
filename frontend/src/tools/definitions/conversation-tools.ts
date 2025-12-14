// Conversation management tool functions
// These are simple functions that can be called by server-side tool executions

export const createConversationToolsWithContext =
  (getContext: () => any) => {
    return {
      create_conversation: async (_input: {
        firstMessage?: string
      }) => {
        try {
          const context = getContext()
          context.handleNewConversation()

          const conversationId =
            crypto.randomUUID()

          return {
            conversationId,
            success: true,
          }
        } catch (error) {
          console.error(
            "Error creating conversation:",
            error,
          )
          return {
            conversationId: "",
            success: false,
          }
        }
      },

      switch_conversation: async (input: {
        conversationId: string
      }) => {
        try {
          const context = getContext()
          await context.handleSelectConversation(
            input.conversationId,
          )

          return {
            success: true,
          }
        } catch (error) {
          console.error(
            "Error switching conversation:",
            error,
          )
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to switch conversation",
          }
        }
      },

      delete_conversation: async (input: {
        conversationId: string
      }) => {
        try {
          const context = getContext()
          await context.handleDeleteConversation(
            input.conversationId,
          )

          return {
            success: true,
          }
        } catch (error) {
          console.error(
            "Error deleting conversation:",
            error,
          )
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to delete conversation",
          }
        }
      },

      rename_conversation: async (input: {
        conversationId: string
        newTitle: string
      }) => {
        try {
          const context = getContext()

          const conversation =
            await context.loadConversation(
              input.conversationId,
            )
          if (!conversation) {
            return {
              success: false,
              error: "Conversation not found",
            }
          }

          await context.saveConversation({
            ...conversation,
            title: input.newTitle,
          })

          // State is automatically updated by saveConversation

          return {
            success: true,
          }
        } catch (error) {
          console.error(
            "Error renaming conversation:",
            error,
          )
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to rename conversation",
          }
        }
      },

      list_conversations: async (input: {
        limit?: number
      }) => {
        try {
          const context = getContext()
          let conversations =
            context.conversations

          if (input.limit) {
            conversations = conversations.slice(
              0,
              input.limit,
            )
          }

          return {
            conversations: conversations.map(
              (c: any) => ({
                id: c.id,
                title: c.title,
                messageCount: c.messageCount,
                updatedAt: c.updatedAt,
              }),
            ),
          }
        } catch (error) {
          console.error(
            "Error listing conversations:",
            error,
          )
          return {
            conversations: [],
          }
        }
      },
    }
  }
