import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Aged from './Aged';

@Entity('aged_events')
class AgedEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  aged_id: string;

  @ManyToOne(() => Aged, (aged) => aged.contacts, { cascade: true })
  @JoinColumn({ name: 'aged_id' })
  aged: Aged;

  @CreateDateColumn()
  date: Date;

  @Column()
  local: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;
}

export default AgedEvent;
