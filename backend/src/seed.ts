import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { Repository } from 'typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const fieldRepository = app.get<Repository<Field>>(getRepositoryToken(Field));

  // Check if fields already exist
  const existingFields = await fieldRepository.count();
  if (existingFields > 0) {
    console.log('Fields already exist, skipping seed...');
    await app.close();
    return;
  }

  // Create sample fields
  const fields = [
    {
      name: 'Field 1',
      description: 'Premium grass field with floodlights',
      pricePerHour: 2000,
      isActive: true,
    },
    {
      name: 'Field 2',
      description: 'Artificial turf field suitable for all weather',
      pricePerHour: 1600,
      isActive: true,
    },
    {
      name: 'Field 3',
      description: 'Training field with goal posts',
      pricePerHour: 1000,
      isActive: true,
    },
    {
      name: 'Field 4',
      description: 'Mini field perfect for 5v5 games',
      pricePerHour: 800,
      isActive: true,
    },
  ];

  for (const fieldData of fields) {
    const field = fieldRepository.create(fieldData);
    await fieldRepository.save(field);
    console.log(`Created field: ${field.name}`);
  }

  console.log('Database seeded successfully!');
  await app.close();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
