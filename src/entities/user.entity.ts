import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Visit } from './visit.entity';

@Entity()
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Username for identification',
    example: 'hikerlover42',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    description: "User's display name",
    example: 'Mountain Explorer',
    required: false,
  })
  @Column({ nullable: true })
  displayName: string;

  @ApiProperty({
    description: 'Auth0 user ID',
    example: 'auth0|1234567890',
    required: false,
  })
  @Column({ unique: true, nullable: true })
  auth0Id: string;

  @ApiProperty({
    description: "User's email address",
    example: 'user@example.com',
    required: false,
  })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({
    description: "User's profile picture URL",
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @Column({ nullable: true })
  picture: string;

  @ApiProperty({
    description: 'When the user was created',
    example: '2024-03-20T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the user was last updated',
    example: '2024-03-20T12:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiHideProperty()
  @OneToMany(() => Visit, () => {})
  visits: Visit[];
}
