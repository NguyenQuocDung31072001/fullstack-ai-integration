// Client-side tool registry
// These tools can be executed client-side by the backend via special handling

import { createConversationToolsWithContext } from "./definitions/conversation-tools"
import { createUIToolsWithContext } from "./definitions/ui-tools"
import { createBrowserTools } from "./definitions/browser-tools"

// Factory function to create all client tools with context access
export const createAllClientTools = (
  getContext: () => any,
) => {
  const conversationTools =
    createConversationToolsWithContext(getContext)
  const uiTools =
    createUIToolsWithContext(getContext)
  const browserTools = createBrowserTools()

  return {
    ...conversationTools,
    ...uiTools,
    ...browserTools,
  }
}

// Export schemas for backend if needed
export * from "./schemas"

// Export type for all tools
export type AllClientTools = ReturnType<
  typeof createAllClientTools
>
