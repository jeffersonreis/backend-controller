// src/vehicles/vehicles.service.ts
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { User } from '../users/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(userId: number, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
        const existingVehicle = await this.vehiclesRepository.findOne({
      where: { plate: vehicleData.plate },
    });

    if (existingVehicle) {
      throw new ConflictException(`A placa "${vehicleData.plate}" já está cadastrada.`);
    }

    const newVehicle = this.vehiclesRepository.create({ ...vehicleData, user, userId: user.id });
    return this.vehiclesRepository.save(newVehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({ relations: ['user'] });
  }

  async findByUser(userId: number): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({ where: { userId } });
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id }, relations: ['user'] });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async findByPlate(plate: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({ where: { plate }, relations: ['user'] });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with plate ${plate} not found`);
    }
    return vehicle;
  }


  async update(id: number, updateData: Partial<Vehicle>, requestingUser: User): Promise<Vehicle> {
      const vehicle = await this.findOne(id);
      if (!vehicle) {
          throw new NotFoundException(`Vehicle with ID ${id} not found`);
      }

      if (requestingUser.role !== 'admin' && vehicle.userId !== requestingUser.id) {
          throw new UnauthorizedException('You do not have permission to update this vehicle.');
      }

      await this.vehiclesRepository.update(id, updateData);
      return this.findOne(id);
  }

  async remove(id: number, requestingUser: User): Promise<void> {
      const vehicle = await this.findOne(id);
      if (!vehicle) {
          throw new NotFoundException(`Vehicle with ID ${id} not found`);
      }

      if (requestingUser.role !== 'admin' && vehicle.userId !== requestingUser.id) {
          throw new UnauthorizedException('You do not have permission to delete this vehicle.');
      }

      await this.vehiclesRepository.delete(id);
  }

  async addImageToVehicle(vehicleId: number, file: Express.Multer.File, requestingUser: User): Promise<Vehicle> {
    const vehicle = await this.findOne(vehicleId);

    if (requestingUser.role !== 'admin' && vehicle.userId !== requestingUser.id) {
        throw new UnauthorizedException('You do not have permission to add images to this vehicle.');
    }
    const uploadResult = await this.cloudinaryService.uploadFile(file);
    
    if (!uploadResult || !uploadResult.secure_url) {
        throw new NotFoundException('Image upload failed or secure_url not returned.');
    }

    if (!vehicle.imageLinks) {
        vehicle.imageLinks = [];
    }
    vehicle.imageLinks.push(uploadResult.secure_url);

    await this.vehiclesRepository.save(vehicle);
    return vehicle;
  }

  async removeImageFromVehicle(vehicleId: number, imageUrl: string, requestingUser: User): Promise<Vehicle> {
    const vehicle = await this.findOne(vehicleId);

    if (requestingUser.role !== 'admin' && vehicle.userId !== requestingUser.id) {
      throw new UnauthorizedException('You do not have permission to remove images from this vehicle.');
    }
    
    const index = vehicle.imageLinks.indexOf(imageUrl);

    if (index === -1) {
      throw new NotFoundException(`Image URL ${imageUrl} not found for this vehicle.`);
    }
    
    vehicle.imageLinks.splice(index, 1);

    await this.vehiclesRepository.save(vehicle);
    return vehicle;
  }
}
