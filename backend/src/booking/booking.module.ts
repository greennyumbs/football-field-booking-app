import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from '../entities/booking.entity';
import { Field } from '../entities/field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Field])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
