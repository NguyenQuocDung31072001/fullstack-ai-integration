import { Injectable } from "@nestjs/common"
import * as fs from "fs"
import * as path from "path"
import {
  Conversation,
  ConversationListItem,
} from "./entities/conversation.entity.js"

@Injectable()
export class ConversationService {
  private readonly storageDir = path.join(
    process.cwd(),
    "data",
    "conversations",
  )

  constructor() {
    // Ensure storage directory exists
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, {
        recursive: true,
      })
    }
  }

  private getFilePath(id: string): string {
    return path.join(
      this.storageDir,
      `${id}.json`,
    )
  }

  private generateTitle(messages: any[]): string {
    // Get first user message or use default
    const firstUserMessage = messages.find(
      (m) => m.role === "user",
    )
    if (
      firstUserMessage &&
      firstUserMessage.parts &&
      firstUserMessage.parts.length > 0
    ) {
      const textPart =
        firstUserMessage.parts.find(
          (p) => p.type === "text",
        )
      if (textPart && textPart.content) {
        // Truncate to 50 characters
        return (
          textPart.content.slice(0, 50) +
          (textPart.content.length > 50
            ? "..."
            : "")
        )
      }
    }
    return "New Conversation"
  }

  async saveConversation(
    conversation: Partial<Conversation>,
  ): Promise<Conversation> {
    const id =
      conversation.id || this.generateId()
    const now = new Date().toISOString()

    const existingConversation =
      await this.getConversation(id).catch(
        () => null,
      )

    const savedConversation: Conversation = {
      id,
      title:
        conversation.title ||
        this.generateTitle(
          conversation.messages || [],
        ),
      messages: conversation.messages || [],
      model: conversation.model,
      provider: conversation.provider,
      createdAt:
        existingConversation?.createdAt || now,
      updatedAt: now,
    }

    const filePath = this.getFilePath(id)
    fs.writeFileSync(
      filePath,
      JSON.stringify(savedConversation, null, 2),
    )

    return savedConversation
  }

  async getConversation(
    id: string,
  ): Promise<Conversation> {
    const filePath = this.getFilePath(id)

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Conversation ${id} not found`,
      )
    }

    const data = fs.readFileSync(
      filePath,
      "utf-8",
    )
    return JSON.parse(data)
  }

  async listConversations(): Promise<
    ConversationListItem[]
  > {
    if (!fs.existsSync(this.storageDir)) {
      return []
    }

    const files = fs.readdirSync(this.storageDir)
    const conversations: ConversationListItem[] =
      []

    for (const file of files) {
      if (file.endsWith(".json")) {
        try {
          const filePath = path.join(
            this.storageDir,
            file,
          )
          const data = fs.readFileSync(
            filePath,
            "utf-8",
          )
          const conversation: Conversation =
            JSON.parse(data)

          conversations.push({
            id: conversation.id,
            title: conversation.title,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            messageCount:
              conversation.messages.length,
          })
        } catch (error) {
          console.error(
            `Error reading conversation file ${file}:`,
            error,
          )
        }
      }
    }

    // Sort by updatedAt descending (most recent first)
    return conversations.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime(),
    )
  }

  async deleteConversation(
    id: string,
  ): Promise<void> {
    const filePath = this.getFilePath(id)

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Conversation ${id} not found`,
      )
    }

    fs.unlinkSync(filePath)
  }

  private generateId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
