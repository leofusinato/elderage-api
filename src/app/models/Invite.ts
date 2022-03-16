import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Aged from './Aged';
import User from './User';

@Entity('invites')
class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  aged_id: string;

  @ManyToOne(() => Aged, { cascade: true })
  @JoinColumn({ name: 'aged_id' })
  aged: Aged;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'guest_id' })
  guest: User;

  @Column()
  user_id: string;

  @Column()
  guest_id: string;

  @Column()
  situation: number;

  @CreateDateColumn()
  created_at: Date;
}

export default Invite;
