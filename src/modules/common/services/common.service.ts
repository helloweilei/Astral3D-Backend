import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonService {
  async upload(file: { filename: string }, biz: string): Promise<string> {
    return `/uploads/${biz}/${file.filename}`;
  }
}
