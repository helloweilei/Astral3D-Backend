import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
} from "@nestjs/common";
import { ScenesService } from "../services/scenes.service";
import { Scene } from "../entities/scene.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

@Controller("editor3d/scenes")
export class ScenesController {
  constructor(private readonly scenesService: ScenesService) {}

  @Get("getAll")
  async getAll(
    @Query("offset") offset: number = 0,
    @Query("limit") limit: number = 10,
    @Query("sortby") sortby?: string,
    @Query("order") order?: "desc" | "asc",
    @Query("query") query?: string,
    @Query("search") search?: string,
  ): Promise<ListPageResult<Scene>> {
    return this.scenesService.getAll({
      offset,
      limit,
      sortby,
      order,
      query,
      search,
    });
  }

  @Get("get/:id")
  async getOne(@Param("id") id: string): Promise<Scene> {
    return this.scenesService.getOne(id);
  }

  @Post("add")
  async create(@Body() data: Partial<Scene>): Promise<Scene> {
    return this.scenesService.create(data);
  }

  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Body() data: Partial<Scene>,
  ): Promise<Scene> {
    return this.scenesService.update(id, data);
  }

  @Delete("del/:id")
  async remove(@Param("id") id: string): Promise<void> {
    return this.scenesService.remove(id);
  }
}
