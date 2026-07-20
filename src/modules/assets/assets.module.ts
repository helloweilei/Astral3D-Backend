import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssetsCategory } from "./entities/assets-category.entity";
import { AssetsInfo } from "./entities/assets-info.entity";
import { AssetsCategoryController } from "./controllers/assets-category.controller";
import { AssetsInfoController } from "./controllers/assets-info.controller";
import { AssetsCategoryService } from "./services/assets-category.service";
import { AssetsInfoService } from "./services/assets-info.service";

@Module({
  imports: [TypeOrmModule.forFeature([AssetsCategory, AssetsInfo])],
  controllers: [AssetsCategoryController, AssetsInfoController],
  providers: [AssetsCategoryService, AssetsInfoService],
})
export class AssetsModule {}
