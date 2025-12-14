import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ChatModule } from "./chat/chat.module.js"
import { ConversationModule } from "./conversation/conversation.module.js"
import { ToolsModule } from "./tools/tools.module.js"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ChatModule,
    ConversationModule,
    ToolsModule,
  ],
})
export class AppModule {}
