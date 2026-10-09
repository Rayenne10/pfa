import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoomType } from 'src/enums/room-type.enum';
import { Hotel } from 'src/hotel/hotel.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomNumber: string;

  @Column()
  hotelId: number;

  @Column({
    type: 'enum',
    enum: RoomType,
  })
  type: RoomType;

  @Column()
  capacity: number;

  // Prix par nuit
  @Column('float')
  price: number;

  // État général (hors service, maintenance, etc.)
  @Column({ default: true })
  isActive: boolean;

  // Description optionnelle
  @Column({ type: 'text', nullable: true })
  description?: string;

  // Équipements (WiFi, AC, TV…)
  @Column({ type: 'json', nullable: true })
  features?: string[];

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date | null;
}