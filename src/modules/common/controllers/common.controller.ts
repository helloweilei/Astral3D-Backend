import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { CommonService } from "../services/common.service";

@Controller("common")
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `upload-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: any,
    @Query("biz") biz: string = "default",
  ): Promise<string> {
    return this.commonService.upload(file, biz);
  }
}
