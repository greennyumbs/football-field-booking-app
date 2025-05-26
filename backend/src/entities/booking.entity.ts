import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Field } from './field.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
  @ManyToOne(() => Field, (field) => field.bookings)
  @JoinColumn({ name: 'fieldId' })
  field: Field;

  @Column()
  fieldId: number;

  @Column({ type: 'text' })
  bookingDate: string; // Store as ISO date string (YYYY-MM-DD)

  @Column({ type: 'text' })
  startTime: string; // Store as time string (HH:mm)

  @Column({ type: 'text' })
  endTime: string; // Store as time string (HH:mm)

  @Column()
  duration: number; // in hours

  @Column({ type: 'real' })
  totalPrice: number;
  @Column({
    type: 'text',
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @Column({ type: 'text', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string;
}
