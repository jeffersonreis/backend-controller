// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AccessHistoryModule } from './access-history/access-history.module';
import { GateModule } from './gate/gate.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './database/seed/seed.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', 
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    VehiclesModule,
    AccessHistoryModule,
    CloudinaryModule,
    GateModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}