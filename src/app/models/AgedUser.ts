import { Entity, Column, PrimaryColumn, JoinColumn } from 'typeorm';
import Aged from './Aged';
import User from './User';

@Entity('users_ageds_ageds')
class AgedUser {
  @PrimaryColumn()
  usersId: string;

  @PrimaryColumn()
  agedsId: string;

  @Column()
  owner: boolean;

  @JoinColumn({ name: 'usersId' })
  user: User;

  @JoinColumn({ name: 'agedsId' })
  aged: Aged;
}

export default AgedUser;
