import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    const convs = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: { include: { user: { select: { id: true, email: true, role: true, studentProfile: { select: { firstName: true, lastName: true, avatarUrl: true } }, industryProfile: { select: { companyName: true, logoUrl: true } } } } } },
            messages: { orderBy: { sentAt: 'desc' }, take: 1 }
          }
        }
      }
    });
    return convs.map(cp => cp.conversation);
  }

  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, role: true, studentProfile: { select: { firstName: true, lastName: true } }, industryProfile: { select: { companyName: true } } } } },
      orderBy: { sentAt: 'asc' }
    });
  }

  async sendMessage(userId: string, conversationId: string, content: string) {
    return this.prisma.message.create({
      data: { conversationId, senderId: userId, content }
    });
  }

  async startConversation(userId: string, recipientId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: {
        participants: { every: { userId: { in: [userId, recipientId] } } }
      }
    });
    if (existing) return existing;

    return this.prisma.conversation.create({
      data: { participants: { create: [{ userId }, { userId: recipientId }] } }
    });
  }
}
