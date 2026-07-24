import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Req,
  Res,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { Response } from "express";
import { CommonService } from "../services/common.service";

@Controller("common")
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = join(process.cwd(), "__uploads");
          if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `upload-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: any): Promise<string> {
    return this.commonService.upload(file);
  }
  @Get("static/*path")
  async getFile(
    @Param("path") path: string[],
    @Res() res: Response,
  ): Promise<void> {
    if (path[0] !== "__uploads") {
      throw new NotFoundException();
    }

    const fullPath = join(process.cwd(), path.join("/"));

    res.sendFile(fullPath);
  }
}
