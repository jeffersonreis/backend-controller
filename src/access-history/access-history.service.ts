// src/access-history/access-history.service.ts

import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessHistory } from './access-history.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { GateService } from '../gate/gate.service';

@Injectable()
export class AccessHistoryService {
  constructor(
    @InjectRepository(AccessHistory)
    private accessHistoryRepository: Repository<AccessHistory>,

    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,

    private cloudinaryService: CloudinaryService,

    private gateService: GateService,
  ) {}

  // Registra acesso se a placa pertencer a um veículo cadastrado
  async logAccess(plate: string, file: Express.Multer.File): Promise<AccessHistory | null> {
    const vehicle = await this.vehicleRepository.findOne({ where: { plate }, relations: ['user'] });

    // Requisito: só registrar se a placa for conhecida
    if (!vehicle) {
      console.log(`[AccessHistory] Placa ${plate} não cadastrada. Acesso ignorado.`);
      return null;
    }

    let uploadedImageUrl: string | undefined = undefined;

    // Tenta fazer o upload da imagem, se houver
    if (file) {
      try {
        const cloudinaryResponse = await this.cloudinaryService.uploadFile(file);
        if (cloudinaryResponse?.secure_url) {
          uploadedImageUrl = cloudinaryResponse.secure_url;
          console.log(`[AccessHistory] Imagem enviada para Cloudinary: ${uploadedImageUrl}`);
        } else {
          console.warn('[AccessHistoryService] Upload bem-sucedido, mas secure_url ausente.');
        }
      } catch (error) {
        console.error('[AccessHistoryService] Erro ao enviar imagem para o Cloudinary:', error);
      }
    } else {
      console.log('[AccessHistoryService] Nenhum arquivo enviado para a placa', plate);
    }

    // Cria e salva o registro de acesso
    const newAccess = this.accessHistoryRepository.create({
      timestamp: new Date(),
      plate,
      imageLink: uploadedImageUrl,
      vehicle,
      vehicleId: vehicle.id,
      user: vehicle.user,
      userId: vehicle.user.id,
    });

    const savedAccess = await this.accessHistoryRepository.save(newAccess);
    console.log(`[AccessHistory] Acesso registrado para ${plate} (Usuário: ${vehicle.user.username})`);

    // Abre portão
    // this.gateService.setCommand(true);
    console.log(`[AccessHistory] Comando de abertura do portão definido para true.`);

    return savedAccess;
  }

  // Retorna todos os acessos (Admin)
  findAll(): Promise<AccessHistory[]> {
    return this.accessHistoryRepository.find({ relations: ['vehicle', 'user'] });
  }

  // Retorna acessos do usuário autenticado
  findByUser(userId: number): Promise<AccessHistory[]> {
    return this.accessHistoryRepository.find({
      where: { userId },
      relations: ['vehicle'],
    });
  }

  // Retorna um acesso específico (usado com permissões)
  async findOne(id: number): Promise<AccessHistory> {
    const accessHistory = await this.accessHistoryRepository.findOne({
      where: { id },
      relations: ['vehicle', 'user'],
    });

    if (!accessHistory) {
      throw new NotFoundException(`AccessHistory with id ${id} not found`);
    }

    return accessHistory;
  }
}
