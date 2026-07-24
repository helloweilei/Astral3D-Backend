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
import { AssetsInfoService } from "../services/assets-info.service";
import { AssetsInfo } from "../entities/assets-info.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

@Controller("assets/assetsInfo")
export class AssetsInfoController {
  constructor(private readonly assetsInfoService: AssetsInfoService) {}

  @Get("getAll")
  async getAll(
    @Query("offset") offset: number = 0,
    @Query("limit") limit: number = 10,
    @Query("sortby") sortby?: string,
    @Query("order") order?: "desc" | "asc",
    @Query("query") query?: string,
    @Query("search") search?: string,
    @Query("category") category?: string,
  ): Promise<ListPageResult<AssetsInfo>> {
    return this.assetsInfoService.getAll({
      offset,
      limit,
      sortby,
      order,
      query,
      search,
      category,
    });
  }

  @Post()
  async create(@Body() data: Partial<AssetsInfo>): Promise<AssetsInfo> {
    return this.assetsInfoService.create(data);
  }

  @Put()
  async update(@Body() data: Partial<AssetsInfo>): Promise<AssetsInfo> {
    return this.assetsInfoService.update(data);
  }

  @Delete(":id")
  async remove(@Param("id") id: number): Promise<void> {
    return this.assetsInfoService.remove(id);
  }

  @Get("selectTags")
  async selectTags(
    @Query("type") type: string,
    @Query("category") category: string,
  ): Promise<string[]> {
    return this.assetsInfoService.selectTags(type, category);
  }
}
