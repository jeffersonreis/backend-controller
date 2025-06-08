// src/access-history/access-history.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessHistoryService } from './access-history.service';
import { AccessHistoryController } from './access-history.controller';
import { AccessHistory } from './access-history.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { User } from '../users/user.entity';
import { GateModule } from '../gate/gate.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessHistory, Vehicle, User]),
    GateModule,
    CloudinaryModule,
  ],
  providers: [AccessHistoryService],
  controllers: [AccessHistoryController],
  exports: [AccessHistoryService],
})
export class AccessHistoryModule {}
