import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export type SupportType =
  | "Model"
  | "Material"
  | "Texture"
  | "Billboard"
  | "HDR";

@Entity("assets_info")
export class AssetsInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  type: SupportType;

  @Column({ type: "varchar", length: 255 })
  category: string;

  @Column({ type: "varchar", length: 255 })
  thumbnail: string;

  @Column({ type: "bigint" })
  size: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  tags: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  file: string;

  @CreateDateColumn({ type: "timestamp" })
  createTime: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateTime: Date;

  @Column({ type: "tinyint", default: 0 })
  delTag: number;

  @Column({ type: "timestamp", nullable: true })
  delTime: Date;
}
