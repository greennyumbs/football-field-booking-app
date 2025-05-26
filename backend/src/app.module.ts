import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { FieldModule } from './field/field.module';
import { User } from './entities/user.entity';
import { Field } from './entities/field.entity';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'football_booking.db',
      entities: [User, Field, Booking],
      synchronize: true, // Don't use in production
    }),
    AuthModule,
    BookingModule,
    FieldModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
