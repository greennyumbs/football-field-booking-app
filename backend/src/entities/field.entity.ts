import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'real' })
  pricePerHour: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Booking, (booking) => booking.field)
  bookings: Booking[];

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;
}
