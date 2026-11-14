import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Messages')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations for current user' })
  getConversations(@CurrentUser() user: any) { return this.messagesService.getConversations(user.sub); }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  getMessages(@Param('id') id: string) { return this.messagesService.getMessages(id); }

  @Post('conversations/:id')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  sendMessage(@CurrentUser() user: any, @Param('id') id: string, @Body() body: { content: string }) {
    return this.messagesService.sendMessage(user.sub, id, body.content);
  }

  @Post('start')
  @ApiOperation({ summary: 'Start a conversation with a user' })
  startConversation(@CurrentUser() user: any, @Body() body: { recipientId: string }) {
    return this.messagesService.startConversation(user.sub, body.recipientId);
  }
}
