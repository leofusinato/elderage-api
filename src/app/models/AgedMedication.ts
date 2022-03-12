import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import Aged from './Aged';

@Entity('aged_medication')
class AgedMedication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  aged_id: string;

  @ManyToOne(() => Aged, (aged) => aged.medications, { cascade: true })
  @JoinColumn({ name: 'aged_id' })
  aged: Aged;

  @Column()
  description: string;

  @Column()
  details: string;

  @Column()
  time_type: number;

  @Column()
  time_description: number;

  @CreateDateColumn()
  created_at: Date;
}

export default AgedMedication;
