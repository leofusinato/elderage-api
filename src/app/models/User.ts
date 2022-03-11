import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import Aged from './Aged';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  password_reset_token: string;

  @Column({ type: 'date' })
  password_reset_expires: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany((type) => Aged, {
    cascade: true,
  })
  @JoinTable()
  ageds: Aged[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
}

export default User;
