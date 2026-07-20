import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bim2gltf')
export class Bim2Gltf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  bimFilePath: string;

  @Column({ type: 'bigint' })
  bimFileSize: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnail: string;

  @Column({ type: 'int', nullable: true })
  conversionDuration: number;

  @Column({ type: 'int', default: 0 })
  conversionStatus: number;

  @Column({ type: 'varchar', length: 200 })
  fileName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fileSourceIp: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  gltfFilePath: string;

  @Column({ type: 'bigint', nullable: true })
  gltfFileSize: number;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;
}
