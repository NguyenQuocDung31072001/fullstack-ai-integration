import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpException,
} from "@nestjs/common"
import { ConversationService } from "./conversation.service.js"
import { Conversation } from "./entities/conversation.entity.js"

@Controller("api/conversations")
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
  ) {}

  @Get()
  async listConversations() {
    try {
      return await this.conversationService.listConversations()
    } catch (error) {
      throw new HttpException(
        error instanceof Error
          ? error.message
          : "Failed to list conversations",
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get(":id")
  async getConversation(@Param("id") id: string) {
    try {
      return await this.conversationService.getConversation(
        id,
      )
    } catch (error) {
      throw new HttpException(
        error instanceof Error
          ? error.message
          : "Conversation not found",
        HttpStatus.NOT_FOUND,
      )
    }
  }

  @Post()
  async saveConversation(
    @Body() conversation: Partial<Conversation>,
  ) {
    try {
      return await this.conversationService.saveConversation(
        conversation,
      )
    } catch (error) {
      throw new HttpException(
        error instanceof Error
          ? error.message
          : "Failed to save conversation",
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Delete(":id")
  async deleteConversation(
    @Param("id") id: string,
  ) {
    try {
      await this.conversationService.deleteConversation(
        id,
      )
      return {
        success: true,
        message:
          "Conversation deleted successfully",
      }
    } catch (error) {
      throw new HttpException(
        error instanceof Error
          ? error.message
          : "Failed to delete conversation",
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
