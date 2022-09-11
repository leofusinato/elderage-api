import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Aged from './Aged';

@Entity('aged_contacts')
class AgedContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  aged_id: string;

  @ManyToOne(() => Aged, (aged) => aged.contacts, { cascade: true })
  @JoinColumn({ name: 'aged_id' })
  aged: Aged;

  @Column()
  type: number;

  @Column()
  description: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;
}

export default AgedContact;
