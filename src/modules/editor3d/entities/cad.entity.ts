import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cad')
export class Cad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  fileName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnail: string;

  @Column({ type: 'varchar', length: 500 })
  filePath: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  converterFilePath: string;

  @Column({ type: 'int', default: 0 })
  conversionStatus: number;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;
}
