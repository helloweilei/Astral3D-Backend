import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssetsModule } from "./modules/assets/assets.module";
import { Editor3dModule } from "./modules/editor3d/editor3d.module";
import { CommonModule } from "./modules/common/common.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      database: "astral3d",
      autoLoadEntities: true,
      synchronize: true,
      charset: "utf8",
    }),
    AssetsModule,
    Editor3dModule,
    CommonModule,
  ],
})
export class AppModule {}
