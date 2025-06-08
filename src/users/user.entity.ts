// src/users/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';
import { AccessHistory } from '../access-history/access-history.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // 'user' ou 'admin'
  role: string;

  // Relacionamento: Um usuário tem muitos veículos
  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles: Vehicle[];

  // Relacionamento: Um usuário tem muitos registros de histórico de acesso
  @OneToMany(() => AccessHistory, (history) => history.user)
  accessHistory: AccessHistory[];

  // Hook para hashear a senha antes de salvar
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
