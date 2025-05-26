import { Controller, Get, Param } from '@nestjs/common';
import { FieldService } from './field.service';

@Controller('fields')
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Get()
  async getAllFields() {
    return this.fieldService.getAllFields();
  }

  @Get(':id')
  async getFieldById(@Param('id') id: number) {
    return this.fieldService.getFieldById(id);
  }
}
