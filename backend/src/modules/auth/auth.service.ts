import {
  Injectable, UnauthorizedException, ConflictException,
  BadRequestException, NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OnboardingDto } from './dto/onboarding.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ── Register ──────────────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    
    // Mock OTP — just log to console for prototype
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    console.log(`[OTP] User ${dto.email} — OTP: ${otp}  (mock, not sent via email)`);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role as Role,
        isVerified: true, // auto-verify for prototype (skip OTP step)
        otpHash,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      }
    });

    const tokens = this.generateTokens(user.id, user.role, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      message: 'Registration successful',
      user: { id: user.id, email: user.email, role: user.role },
      ...tokens,
    };
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account suspended');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = this.generateTokens(user.id, user.role, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    // Get profile info for redirect
    const profileInfo = await this.getProfileInfo(user.id, user.role);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ...profileInfo,
      },
      ...tokens,
    };
  }

  // ── Onboarding ─────────────────────────────────────────────────────────────
  async completeOnboarding(userId: string, dto: OnboardingDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === Role.STUDENT) {
      await this.prisma.studentProfile.upsert({
        where: { userId },
        create: {
          userId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          institution: dto.institution,
          department: dto.department,
          year: dto.year,
          bio: dto.bio,
        },
        update: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          institution: dto.institution,
          department: dto.department,
          year: dto.year,
          bio: dto.bio,
        },
      });
    } else if (user.role === Role.INDUSTRY) {
      await this.prisma.industryProfile.upsert({
        where: { userId },
        create: {
          userId,
          companyName: dto.companyName || 'My Company',
          industry: dto.industry,
          location: dto.location,
          description: dto.bio,
        },
        update: {
          companyName: dto.companyName || 'My Company',
          industry: dto.industry,
          location: dto.location,
          description: dto.bio,
        },
      });
    } else if (user.role === Role.ACADEMICIAN) {
      await this.prisma.academicianProfile.upsert({
        where: { userId },
        create: {
          userId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          institution: dto.institution,
          department: dto.department,
          designation: dto.designation,
          bio: dto.bio,
        },
        update: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          institution: dto.institution,
          department: dto.department,
          designation: dto.designation,
          bio: dto.bio,
        },
      });
    }

    return { message: 'Onboarding complete', role: user.role };
  }

  // ── Refresh Token ──────────────────────────────────────────────────────────
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'nexus-jwt-refresh-secret-dev',
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const tokens = this.generateTokens(user.id, user.role, user.email);
      await this.saveRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // ── Logout ─────────────────────────────────────────────────────────────────
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logged out successfully' };
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  private generateTokens(userId: string, role: string, email: string) {
    const payload = { sub: userId, role, email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'nexus-jwt-refresh-secret-dev',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    });
    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }

  private async getProfileInfo(userId: string, role: Role) {
    if (role === Role.STUDENT) {
      const p = await this.prisma.studentProfile.findUnique({ where: { userId } });
      return p ? { firstName: p.firstName, lastName: p.lastName, profileId: p.id } : {};
    }
    if (role === Role.INDUSTRY) {
      const p = await this.prisma.industryProfile.findUnique({ where: { userId } });
      return p ? { companyName: p.companyName, profileId: p.id } : {};
    }
    if (role === Role.ACADEMICIAN) {
      const p = await this.prisma.academicianProfile.findUnique({ where: { userId } });
      return p ? { firstName: p.firstName, lastName: p.lastName, profileId: p.id } : {};
    }
    if (role === Role.INSTITUTION_ADMIN) {
      const p = await this.prisma.institutionProfile.findUnique({ where: { userId } });
      return p ? { institutionName: p.institutionName, profileId: p.id } : {};
    }
    return {};
  }
}
