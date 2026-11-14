import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  async saveFile(uploaderId: string, file: Express.Multer.File, fileType: string) {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`File type not allowed. Allowed: PDF, JPG, PNG`);
    }
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('File too large. Max size: 10MB');
    }

    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'uploads', fileType);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const url = `/uploads/${fileType}/${fileName}`;

    const record = await this.prisma.uploadedFile.create({
      data: {
        uploaderId,
        fileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
        fileType,
        status: 'PENDING',
      }
    });

    return { fileId: record.id, url, fileName };
  }
}
