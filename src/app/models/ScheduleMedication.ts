import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import AgedMedication from './AgedMedication';

@Entity('schedule_medication')
class ScheduleMedication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  medication_id: string;

  @ManyToOne(() => AgedMedication, (medication) => medication.schedules, {
    cascade: true,
  })
  @JoinColumn({ name: 'medication_id' })
  medication: AgedMedication;

  @Column()
  time: string;

  @CreateDateColumn()
  created_at: Date;
}

export default ScheduleMedication;
