// src/access-history/access-history.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AccessHistoryService } from './access-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { LogAccessDto } from './dto/log-access.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('access-history')
export class AccessHistoryController {
  constructor(private readonly accessHistoryService: AccessHistoryService) {}

  // Endpoint para registrar um acesso com upload de imagem
  @Post('log')
  @UseInterceptors(FileInterceptor('image'))
  async logAccess(
    @Body() accessData: LogAccessDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.accessHistoryService.logAccess(accessData.plate, file);
  }

  // Apenas admins podem ver todo o histórico
  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.accessHistoryService.findAll();
  }

  // Cada usuário pode ver seu próprio histórico
  @Get('my')
  async findMyHistory(@Request() req) {
    return this.accessHistoryService.findByUser(req.user.id);
  }

  // Detalhes de um registro específico
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const historyEntry = await this.accessHistoryService.findOne(+id);

    if (!historyEntry) return null;

    if (req.user.role === Role.Admin || historyEntry.userId === req.user.id) {
      return historyEntry;
    } else {
      throw new UnauthorizedException('You do not have permission to access this history entry.');
    }
  }
}
