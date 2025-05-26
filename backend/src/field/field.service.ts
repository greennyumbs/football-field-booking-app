import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Field } from '../entities/field.entity';

@Injectable()
export class FieldService {
  constructor(
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) {}

  async getAllFields() {
    return this.fieldRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getFieldById(id: number) {
    return this.fieldRepository.findOne({ where: { id } });
  }
}
