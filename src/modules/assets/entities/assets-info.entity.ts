import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type SupportType = 'Model' | 'Material' | 'Texture' | 'Billboard' | 'HDR';

@Entity('assets_info')
export class AssetsInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  type: SupportType;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categoryName: string;

  @Column({ type: 'varchar', length: 500 })
  thumbnail: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  tags: string;

  @Column({ type: 'varchar', length: 500 })
  file: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;
}
