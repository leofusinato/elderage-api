import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import AgedContact from './AgedContact';
import AgedMedication from './AgedMedication';
import User from './User';

@Entity('ageds')
class Aged {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column({ type: 'date' })
  birthdate: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => AgedContact, (agedContact) => agedContact.aged)
  contacts: AgedContact[];

  @OneToMany(() => AgedMedication, (agedMedication) => agedMedication.aged)
  medications: AgedMedication[];

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.ageds)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

export default Aged;
