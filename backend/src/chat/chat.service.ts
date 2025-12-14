import { Injectable } from "@nestjs/common"
import { chat } from "@tanstack/ai"
import { openai } from "@tanstack/ai-openai"
import { anthropic } from "@tanstack/ai-anthropic"
import { gemini } from "@tanstack/ai-gemini"
import { ToolsService } from "../tools/tools.service.js"

@Injectable()
export class ChatService {
  constructor(
    private readonly toolsService: ToolsService,
  ) {}

  private getAdapter(provider: string) {
    switch (provider) {
      case "anthropic":
        if (!process.env.ANTHROPIC_API_KEY) {
          throw new Error(
            "ANTHROPIC_API_KEY not configured",
          )
        }
        // Adapter reads from ANTHROPIC_API_KEY environment variable
        return anthropic()

      case "gemini":
        if (!process.env.GEMINI_API_KEY) {
          throw new Error(
            "GEMINI_API_KEY not configured",
          )
        }
        // Gemini adapter reads from GOOGLE_GENERATIVE_AI_API_KEY
        process.env.GOOGLE_GENERATIVE_AI_API_KEY =
          process.env.GEMINI_API_KEY
        return gemini()

      case "openai":
      default:
        if (!process.env.OPENAI_API_KEY) {
          throw new Error(
            "OPENAI_API_KEY not configured",
          )
        }
        // Adapter reads from OPENAI_API_KEY environment variable
        return openai()
    }
  }

  async createChatStream(
    messages: any[],
    model: string = "gpt-4o",
    provider: string = "openai",
    conversationId?: string,
  ) {
    try {
      const adapter = this.getAdapter(provider)
      const tools = this.toolsService.getTools()

      // Create a streaming chat response
      // Cast entire chat call to 'any' to bypass strict adapter type checking
      const stream = (chat as any)({
        adapter,
        messages,
        model,
        conversationId,
        tools,
      })

      return stream
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred",
      )
    }
  }
}
