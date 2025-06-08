// src/vehicles/dto/create-vehicle.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl, Matches } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}([0-9]{4}|[0-9]{1}[A-Z]{1}[0-9]{2})$/, {
    message: 'A placa deve estar no formato XXXNNNN (antigo) ou XXXNXNN (Mercosul).',
  })
  plate: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imageLinks?: string[];
}
