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

@Entity("astral_3d_assets_category")
export class AssetsCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, nullable: true, comment: "类型" })
  type: SupportType;

  @Column({
    name: "pcode",
    type: "varchar",
    length: 255,
    nullable: true,
    comment: "父级编码",
  })
  pcode: string;

  @Column({ name: "code", type: "varchar", length: 255, comment: "编码" })
  code: string;

  @Column({ name: "name", type: "varchar", length: 255, comment: "文件名" })
  name: string;

  @Column({ name: "sort_num", type: "int", nullable: true, comment: "序号" })
  sortNum: number;

  @Column({
    type: "tinyint",
    default: 0,
    comment: "删除标记，0 未删除 1 已删除",
  })
  delTag: number;

  @CreateDateColumn({
    name: "createTime",
    type: "datetime",
    nullable: true,
  })
  createTime: Date;

  @UpdateDateColumn({
    name: "updateTime",
    type: "datetime",
  })
  updateTime: Date;

  @Column({ name: "delTime", type: "datetime", nullable: true })
  delTime: Date | null;
}
