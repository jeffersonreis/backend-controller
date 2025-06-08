// src/database/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { AuthModule } from '../../auth/auth.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
