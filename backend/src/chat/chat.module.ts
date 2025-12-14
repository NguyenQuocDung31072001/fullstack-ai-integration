import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';
import { ToolsModule } from '../tools/tools.module.js';

@Module({
  imports: [ToolsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

