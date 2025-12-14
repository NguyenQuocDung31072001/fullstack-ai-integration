import { z } from "zod"

// ============================================================
// Conversation Management Tool Schemas
// ============================================================

export const createConversationInput = z.object({
  firstMessage: z.string().optional(),
})

export const createConversationOutput = z.object({
  conversationId: z.string(),
  success: z.boolean(),
})

export const switchConversationInput = z.object({
  conversationId: z.string(),
})

export const switchConversationOutput = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export const deleteConversationInput = z.object({
  conversationId: z.string(),
})

export const deleteConversationOutput = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export const renameConversationInput = z.object({
  conversationId: z.string(),
  newTitle: z.string(),
})

export const renameConversationOutput = z.object({
  success: z.boolean(),
  error: z.string().optional(),
})

export const listConversationsInput = z.object({
  limit: z.number().optional(),
})

export const listConversationsOutput = z.object({
  conversations: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      messageCount: z.number(),
      updatedAt: z.string(),
    }),
  ),
})

// ============================================================
// UI Control Tool Schemas
// ============================================================

export const showNotificationInput = z.object({
  message: z.string(),
  type: z.enum([
    "success",
    "error",
    "info",
    "warning",
  ]),
  duration: z.number().optional().default(4000),
})

export const showNotificationOutput = z.object({
  shown: z.boolean(),
})

export const toggleSidebarInput = z.object({
  open: z.boolean().optional(),
})

export const toggleSidebarOutput = z.object({
  isOpen: z.boolean(),
})

export const changeModelInput = z.object({
  provider: z.enum([
    "openai",
    "anthropic",
    "gemini",
  ]),
  model: z.string(),
})

export const changeModelOutput = z.object({
  success: z.boolean(),
  provider: z.string(),
  model: z.string(),
})

export const updateUIThemeInput = z.object({
  theme: z.enum(["light", "dark", "auto"]),
})

export const updateUIThemeOutput = z.object({
  theme: z.string(),
  success: z.boolean(),
})

// ============================================================
// Browser API Tool Schemas
// ============================================================

export const saveToStorageInput = z.object({
  key: z.string(),
  value: z.any(),
})

export const saveToStorageOutput = z.object({
  saved: z.boolean(),
  error: z.string().optional(),
})

export const getFromStorageInput = z.object({
  key: z.string(),
})

export const getFromStorageOutput = z.object({
  value: z.any().nullable(),
  found: z.boolean(),
})

export const copyToClipboardInput = z.object({
  text: z.string(),
})

export const copyToClipboardOutput = z.object({
  copied: z.boolean(),
  error: z.string().optional(),
})

export const getUserLocationInput = z.object({})

export const getUserLocationOutput = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  error: z.string().optional(),
  success: z.boolean(),
})
