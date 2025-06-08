// src/vehicles/vehicles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './vehicle.entity';
import { User } from '../users/user.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, User]),
    CloudinaryModule
  ],
  providers: [VehiclesService],
  controllers: [VehiclesController],
  exports: [VehiclesService],
})
export class VehiclesModule {}
