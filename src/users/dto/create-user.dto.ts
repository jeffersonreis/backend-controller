// src/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
