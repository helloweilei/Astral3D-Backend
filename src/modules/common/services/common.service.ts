import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonService {
  async upload(file: { filename: string }): Promise<string> {
    return `/__uploads/${file.filename}`;
  }
}
