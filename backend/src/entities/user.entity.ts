import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;
}
