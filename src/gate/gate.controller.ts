// src/gate/gate.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { GateService } from './gate.service';
import { GateCommandDto } from './dto/gate-command.dto';

@Controller('gate')
export class GateController {
  constructor(private readonly gateService: GateService) {}

  // Endpoint para o ESP8266 consultar o comando (GET)
  @Get('command')
  getCommand() {
    console.log(`[GateController] GET /gate/command requested`);
    // Retorna { command: true } ou { command: false } e reseta a flag
    return { command: this.gateService.getCommandAndReset() };
  }

  @Post('command')
  handleGateCommand(@Body() gateCommandDto: GateCommandDto) {
    console.log(`[GateController] POST /gate/command received with command: ${gateCommandDto.command}`);
    this.gateService.setCommand(gateCommandDto.command);
    return { status: 'success', message: `Gate command received: ${gateCommandDto.command}` };
  }
}
