import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Scene } from "./entities/scene.entity";
import { SceneExample } from "./entities/scene-example.entity";
import { Bim2Gltf } from "./entities/bim2gltf.entity";
import { Cad } from "./entities/cad.entity";
import { ScenesController } from "./controllers/scenes.controller";
import { SceneExampleController } from "./controllers/scene-example.controller";
import { Bim2GltfController } from "./controllers/bim2gltf.controller";
import { CadController } from "./controllers/cad.controller";
import { ScenesService } from "./services/scenes.service";
import { SceneExampleService } from "./services/scene-example.service";
import { Bim2GltfService } from "./services/bim2gltf.service";
import { CadService } from "./services/cad.service";

@Module({
  imports: [TypeOrmModule.forFeature([Scene, SceneExample, Bim2Gltf, Cad])],
  controllers: [
    ScenesController,
    SceneExampleController,
    Bim2GltfController,
    CadController,
  ],
  providers: [ScenesService, SceneExampleService, Bim2GltfService, CadService],
})
export class Editor3dModule {}
