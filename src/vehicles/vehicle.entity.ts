// src/vehicles/vehicle.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { AccessHistory } from '../access-history/access-history.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  plate: string;

  @Column('simple-array', { nullable: true })
  imageLinks: string[];

  @ManyToOne(() => User, (user) => user.vehicles)
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => AccessHistory, (history) => history.vehicle)
  accessHistory: AccessHistory[];
}
