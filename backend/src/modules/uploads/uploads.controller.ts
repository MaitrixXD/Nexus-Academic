import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { memoryStorage } from 'multer';

@ApiTags('Uploads')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a file (resume, certificate, report)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  upload(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: string = 'general',
  ) {
    return this.uploadsService.saveFile(user.sub, file, type);
  }
}
