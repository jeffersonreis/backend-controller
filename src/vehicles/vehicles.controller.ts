// src/vehicles/vehicles.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/role.enum';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Request() req, @Body() createVehicleDto: CreateVehicleDto) {
    const userId = req.user.id;
    return this.vehiclesService.create(userId, createVehicleDto);
  }

  @Get()
  async findAll(@Request() req) {
    if (req.user.role === Role.Admin) {
      return this.vehiclesService.findAll();
    } else {
      return this.vehiclesService.findByUser(req.user.id);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
      const vehicle = await this.vehiclesService.findOne(+id);
      if (!vehicle) return null; // Ou throw NotFoundException

      if (req.user.role === Role.Admin || vehicle.userId === req.user.id) {
          return vehicle;
      } else {
          throw new UnauthorizedException('You do not have permission to access this vehicle.');
      }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto, @Request() req) {
      return this.vehiclesService.update(+id, updateVehicleDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
      return this.vehiclesService.remove(+id, req.user);
  }

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') vehicleId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    
    return this.vehiclesService.addImageToVehicle(+vehicleId, file, req.user);
  }

}
