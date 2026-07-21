import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("scene")
export class Scene {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50 })
  sceneType: string;

  @Column({ type: "varchar", length: 200 })
  sceneName: string;

  @Column({ type: "text", nullable: true })
  sceneIntroduction: string;

  @Column({ type: "int", default: 1 })
  sceneVersion: number;

  @Column({ type: "int", default: 0 })
  projectType: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  coverPicture: string;

  @Column({ type: "tinyint", default: 0 })
  hasDrawing: boolean;

  @Column({ type: "varchar", length: 500, nullable: true })
  zip: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  zipSize: string;

  @Column({ type: "varchar", nullable: true })
  exampleSceneId?: string;

  @CreateDateColumn({ type: "timestamp" })
  createTime: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateTime: Date;
}
