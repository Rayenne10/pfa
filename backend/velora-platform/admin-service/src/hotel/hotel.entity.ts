import { Room } from 'src/room/room.entity';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];
}