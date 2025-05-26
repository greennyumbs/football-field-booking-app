import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Field } from '../entities/field.entity';
import { CreateBookingDto } from '../dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) {}

  async createBooking(userId: number, createBookingDto: CreateBookingDto) {
    const { fieldId, bookingDate, startTime, duration, notes } =
      createBookingDto;

    // Find the field
    const field = await this.fieldRepository.findOne({
      where: { id: fieldId },
    });
    if (!field) {
      throw new NotFoundException('Field not found');
    }

    // Calculate end time
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const endHour = startHour + duration;
    const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;

    // Check for overlapping bookings
    const overlappingBookings = await this.bookingRepository.find({
      where: {
        fieldId,
        bookingDate: bookingDate, // Keep as string
        status: BookingStatus.CONFIRMED,
      },
    });

    const hasOverlap = overlappingBookings.some((booking) => {
      const existingStart = booking.startTime;
      const existingEnd = booking.endTime;
      return startTime < existingEnd && endTime > existingStart;
    });

    if (hasOverlap) {
      throw new BadRequestException('Time slot is already booked');
    }

    // Calculate total price
    const totalPrice = field.pricePerHour * duration;

    // Create booking
    const booking = this.bookingRepository.create({
      userId,
      fieldId,
      bookingDate: bookingDate, // Keep as string (YYYY-MM-DD format)
      startTime,
      endTime,
      duration,
      totalPrice,
      notes,
      status: BookingStatus.CONFIRMED,
    });

    return this.bookingRepository.save(booking);
  }

  async getBookingsByField(fieldId: number, date: string) {
    return this.bookingRepository.find({
      where: {
        fieldId,
        bookingDate: date, // Keep as string
        status: BookingStatus.CONFIRMED,
      },
      relations: ['user'],
      order: { startTime: 'ASC' },
    });
  }

  async getUserBookings(userId: number) {
    return this.bookingRepository.find({
      where: { userId },
      relations: ['field'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllBookings() {
    return this.bookingRepository.find({
      relations: ['user', 'field'],
      order: { createdAt: 'DESC' },
    });
  }
}
