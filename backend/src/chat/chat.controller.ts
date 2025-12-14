import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service.js';
import { toStreamResponse } from '@tanstack/ai';
import { ChatRequestDto } from './dto/chat.dto.js';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: ChatRequestDto, @Res() res: Response) {
    try {
      const {
        messages,
        conversationId,
        model = 'gpt-4o',
        provider = 'openai',
      } = body;

      // Get the stream from the service
      const stream = await this.chatService.createChatStream(
        messages,
        model,
        provider,
        conversationId,
      );

      // Convert stream to HTTP response
      const streamResponse = toStreamResponse(stream);

      // Copy headers from streamResponse to NestJS response
      streamResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      // Set status code
      res.status(streamResponse.status || HttpStatus.OK);

      // Pipe the stream body to response
      if (streamResponse.body) {
        const reader = streamResponse.body.getReader();
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
            res.end();
          } catch (error) {
            console.error('Stream error:', error);
            res.end();
          }
        };
        pump();
      } else {
        res.end();
      }
    } catch (error) {
      console.error('Chat error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }
}

