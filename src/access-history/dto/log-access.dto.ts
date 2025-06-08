// src/access-history/dto/log-access.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class LogAccessDto {
  @IsString()
  @IsNotEmpty()
  plate: string;
}
