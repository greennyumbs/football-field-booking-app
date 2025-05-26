import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from '../dto/booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  async createBooking(
    @Request() req,
    @Body(ValidationPipe) createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.createBooking(req.user.userId, createBookingDto);
  }

  @Get('field/:fieldId')
  async getFieldBookings(
    @Param('fieldId') fieldId: number,
    @Query('date') date: string,
  ) {
    return this.bookingService.getBookingsByField(fieldId, date);
  }

  @Get('my-bookings')
  async getUserBookings(@Request() req) {
    return this.bookingService.getUserBookings(req.user.userId);
  }

  @Get()
  async getAllBookings() {
    return this.bookingService.getAllBookings();
  }
}
