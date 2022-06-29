import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import Aged from './Aged';

@Entity('anamnesis')
class Anamnesis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  aged_id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Aged, (aged) => aged.anamnesis, { cascade: true })
  @JoinColumn({ name: 'aged_id' })
  aged: Aged;

  @Column()
  heart_rate: number;

  @Column()
  respiratory_frequency: number;

  @Column()
  temperature: number;

  @Column()
  glucose_level: number;

  @Column()
  weight: number;

  @Column()
  observations: string;

  @CreateDateColumn()
  created_at: Date;
}

export default Anamnesis;
