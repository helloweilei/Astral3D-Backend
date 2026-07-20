import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { Bim2GltfService } from "../services/bim2gltf.service";
import { Bim2Gltf } from "../entities/bim2gltf.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

@Controller("editor3d/bim2gltf")
export class Bim2GltfController {
  constructor(private readonly bim2GltfService: Bim2GltfService) {}

  @Get("getAll")
  async getAll(
    @Query("offset") offset: number = 0,
    @Query("limit") limit: number = 10,
    @Query("sortby") sortby?: string,
    @Query("order") order?: "desc" | "asc",
    @Query("query") query?: string,
    @Query("search") search?: string,
  ): Promise<ListPageResult<Bim2Gltf>> {
    return this.bim2GltfService.getAll({
      offset,
      limit,
      sortby,
      order,
      query,
      search,
    });
  }

  @Post("uploadRvt")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/bim",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `rvt-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadRvt(@UploadedFile() file: any) {
    return this.bim2GltfService.uploadRvt(file);
  }

  @Post("addAndConversion")
  async addAndConversion(
    @Body() data: Partial<Bim2Gltf>,
    @Query("uname") uname?: string,
  ): Promise<Bim2Gltf> {
    return this.bim2GltfService.addAndConversion(data, uname);
  }
}
