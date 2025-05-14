import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Visit } from './visit.entity';

@Entity()
export class User {
  @ApiProperty({ 
    description: 'Unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    description: 'Username for identification',
    example: 'hikerlover42'
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ 
    description: 'User\'s display name',
    example: 'Mountain Explorer',
    required: false
  })
  @Column({ nullable: true })
  displayName: string;

  @ApiHideProperty()
  @OneToMany(() => Visit, visit => visit.user)
  visits: Visit[];
} 