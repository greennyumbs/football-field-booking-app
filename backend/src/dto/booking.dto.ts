import {
  IsNumber,
  IsDateString,
  IsString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  fieldId: number;

  @IsDateString()
  bookingDate: string;

  @IsString()
  startTime: string;

  @IsNumber()
  @Min(1)
  @Max(8)
  duration: number; // in hours

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateBookingDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
