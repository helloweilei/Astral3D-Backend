import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { readFile, writeFile } from "fs/promises";
import { basename, dirname, extname, join, resolve } from "path";
import { pathToFileURL } from "url";
import { Repository } from "typeorm";
import { convertDwgToDxf, init } from "dwgdxf";
import { Cad } from "../entities/cad.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

export const CAD_STORAGE_PATH = "./__uploads/cad";
let converterReady: Promise<void> | undefined;

@Injectable()
export class CadService {
  constructor(
    @InjectRepository(Cad)
    private cadRepository: Repository<Cad>,
  ) {}

  async getAll(params: {
    offset: number;
    limit: number;
    sortby?: string;
    order?: "desc" | "asc" | "DESC" | "ASC";
    query?: string;
    search?: string;
  }): Promise<ListPageResult<Cad>> {
    let queryBuilder = this.cadRepository.createQueryBuilder("cad");

    if (params.query || params.search) {
      const keyword = params.query || params.search;
      queryBuilder = queryBuilder.where("cad.fileName LIKE :keyword", {
        keyword: `%${keyword}%`,
      });
    }

    if (params.sortby) {
      const order = (params.order?.toUpperCase() === "ASC" ? "ASC" : "DESC") as
        | "ASC"
        | "DESC";
      queryBuilder = queryBuilder.orderBy(`cad.${params.sortby}`, order);
    } else {
      queryBuilder = queryBuilder.orderBy("cad.createTime", "DESC");
    }

    const total = await queryBuilder.getCount();
    const items = await queryBuilder
      .offset(params.offset)
      .limit(params.limit)
      .getMany();

    return new ListPageResult(
      params.offset / params.limit + 1,
      items,
      params.limit,
      total,
    );
  }

  async dwg2dxf(
    file: { filename: string; originalname: string; size: number },
    data: Partial<Cad>,
    uname?: string,
  ): Promise<Cad> {
    const extension = extname(file.originalname).toLowerCase();
    const isImage = [".png", ".jpg", ".jpeg"].includes(extension);
    if (!isImage && extension !== ".dwg" && extension !== ".dxf") {
      throw new BadRequestException(
        "Only DWG, DXF, PNG, JPG and JPEG files are supported",
      );
    }

    const uploadedPath = join(CAD_STORAGE_PATH, file.filename);
    let converterFilePath: string | undefined;

    if (extension === ".dwg") {
      const converterWasmPath = pathToFileURL(
        join(dirname(require.resolve("dwgdxf")), "wasm"),
      ).href;
      converterReady ??= init({ wasmBase: converterWasmPath });
      await converterReady;

      const dwgBytes = await readFile(resolve(uploadedPath));
      const dxfBytes = await convertDwgToDxf(new Uint8Array(dwgBytes));
      const dxfFilename = `${basename(file.filename, extension)}.dxf`;
      converterFilePath = join(CAD_STORAGE_PATH, dxfFilename);
      await writeFile(resolve(converterFilePath), dxfBytes);
    }

    const cad = this.cadRepository.create({
      ...data,
      filePath: uploadedPath,
      fileName: file.originalname,
      thumbnail: isImage ? uploadedPath : data.thumbnail,
      converterFilePath: converterFilePath ?? uploadedPath,
      conversionStatus: 1,
    });

    const saved = await this.cadRepository.save(cad);

    return saved;
  }
}
