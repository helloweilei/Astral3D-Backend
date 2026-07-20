import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type SupportType = 'Model' | 'Material' | 'Texture' | 'Billboard' | 'HDR';

@Entity('assets_category')
export class AssetsCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  key: string;

  @Column({ type: 'varchar', length: 100 })
  label: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pkey: string;

  @Column({ type: 'int', default: 0 })
  sortNum: number;

  @Column({ type: 'varchar', length: 20 })
  type: SupportType;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;
}
