// src/users/dto/update-user.dto.ts
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    password?: string;
}
