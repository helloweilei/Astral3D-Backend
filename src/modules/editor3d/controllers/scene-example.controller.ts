import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Param,
} from "@nestjs/common";
import { SceneExampleService } from "../services/scene-example.service";
import { SceneExample } from "../entities/scene-example.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

@Controller("editor3d/sceneExample")
export class SceneExampleController {
  constructor(private readonly sceneExampleService: SceneExampleService) {}

  @Get()
  async getAll(
    @Query("offset") offset: number = 0,
    @Query("limit") limit: number = 10,
    @Query("sortby") sortby?: string,
    @Query("order") order?: "desc" | "asc",
    @Query("query") query?: string,
    @Query("search") search?: string,
  ): Promise<ListPageResult<SceneExample>> {
    return this.sceneExampleService.getAll({
      offset,
      limit,
      sortby,
      order,
      query,
      search,
    });
  }

  @Get(":id")
  async getOne(@Param("id") id: number): Promise<SceneExample> {
    return this.sceneExampleService.getOne(id);
  }

  @Post()
  async create(@Body() data: Partial<SceneExample>): Promise<SceneExample> {
    return this.sceneExampleService.create(data);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<void> {
    return this.sceneExampleService.remove(id);
  }
}
