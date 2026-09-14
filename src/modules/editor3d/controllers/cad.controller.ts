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
import { CAD_STORAGE_PATH, CadService } from "../services/cad.service";
import { Cad } from "../entities/cad.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

@Controller("editor3d/cad")
export class CadController {
  constructor(private readonly cadService: CadService) {}

  @Get("getAll")
  async getAll(
    @Query("offset") offset: number = 0,
    @Query("limit") limit: number = 10,
    @Query("sortby") sortby?: string,
    @Query("order") order?: "desc" | "asc",
    @Query("query") query?: string,
    @Query("search") search?: string,
  ): Promise<ListPageResult<Cad>> {
    return this.cadService.getAll({
      offset,
      limit,
      sortby,
      order,
      query,
      search,
    });
  }

  @Post("dwg2dxf")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: CAD_STORAGE_PATH,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `cad-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async dwg2dxf(
    @UploadedFile() file: any,
    @Body() data: Partial<Cad>,
    @Query("uname") uname?: string,
  ): Promise<Cad> {
    return this.cadService.dwg2dxf(file, data, uname);
  }
}
