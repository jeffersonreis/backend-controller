// src/access-history/access-history.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';
import { User } from '../users/user.entity';

@Entity()
export class AccessHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column()
  plate: string;

  @Column({ nullable: true })
  imageLink: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.accessHistory, {
    nullable: true,
    onDelete: 'SET NULL',
  })  
  vehicle: Vehicle;

  @Column({ nullable: true })
  vehicleId: number;

  @ManyToOne(() => User, (user) => user.accessHistory, { nullable: true })
  user: User;

  @Column({ nullable: true })
  userId: number;
}
