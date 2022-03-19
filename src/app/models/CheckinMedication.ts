import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import AgedMedication from './AgedMedication';
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'medication_id' })
  medication: AgedMedication;

  @CreateDateColumn()
  created_at: Date;
}

export default CheckinMedication;
