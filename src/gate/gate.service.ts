// src/gate/gate.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class GateService {
  private pendingCommand: boolean = false;

  setCommand(value: boolean): void {
    this.pendingCommand = value;
    console.log(`[GateService] pendingCommand set to: ${this.pendingCommand}`);
  }

  getCommandAndReset(): boolean {
    const commandToSend = this.pendingCommand;
    // Reseta o comando após ser consultado pelo ESP8266
    this.pendingCommand = false;
    console.log(`[GateService] Command requested. Sending: ${commandToSend}. Resetting pendingCommand to false.`);
    return commandToSend;
  }
}
