// src/database/seed/seed.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  async seedAdminUser(): Promise<void> {
    const adminUsername = 'admin';
    const adminPassword = 'admin';

    this.logger.log(`Checking if admin user "${adminUsername}" exists...`);

    const existingAdmin = await this.usersService.findByUsername(adminUsername);

    if (existingAdmin) {
      this.logger.log(`Admin user "${adminUsername}" already exists.`);
    } else {
      this.logger.log(`Admin user "${adminUsername}" not found. Creating...`);

      try {        
        const adminUserDto: CreateUserDto = {
          username: adminUsername,
          password: adminPassword,
          role: Role.Admin,          
        };

         await this.usersService.create(adminUserDto);
        this.logger.log(`Admin user "${adminUsername}" created successfully.`);

      } catch (error) {
        this.logger.error(`Failed to create admin user "${adminUsername}":`, error.message);
      }
    }
  }
}
