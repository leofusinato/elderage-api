import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import AgedMedication from './AgedMedication';
import ScheduleMedication from './ScheduleMedication';
import User from './User';

@Entity('checkin_medications')
class CheckinMedication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  date_hour_applied: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  medication_id: string;

  @ManyToOne(() => AgedMedication)
  @JoinColumn({ name: 'medication_id' })
  medication: AgedMedication;

  @Column()
  schedule_id: string;

  @ManyToOne(() => ScheduleMedication)
  @JoinColumn({ name: 'schedule_id' })
  schedule: ScheduleMedication;

  @CreateDateColumn()
  created_at: Date;
}

export default CheckinMedication;
