import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
} from "typeorm";
import AgedContact from "./AgedContact";
import User from "./User";

@Entity("ageds")
class Aged {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column({ type: "date" })
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
}

export default Aged;
