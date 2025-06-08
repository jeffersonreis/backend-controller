// src/vehicles/dto/update-vehicle.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './create-vehicle.dto';
import { IsOptional, IsArray, IsUrl } from 'class-validator';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    imageLinks?: string[];
}
