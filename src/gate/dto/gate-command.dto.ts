// src/gate/dto/gate-command.dto.ts
import { IsBoolean } from 'class-validator';

export class GateCommandDto {
  @IsBoolean()
  command: boolean;
}