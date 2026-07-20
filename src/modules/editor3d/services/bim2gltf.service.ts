import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Bim2Gltf } from "../entities/bim2gltf.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

@Injectable()
export class Bim2GltfService {
  constructor(
    @InjectRepository(Bim2Gltf)
    private bim2GltfRepository: Repository<Bim2Gltf>,
  ) {}

  async getAll(params: {
    offset: number;
    limit: number;
    sortby?: string;
    order?: "desc" | "asc" | "DESC" | "ASC";
    query?: string;
    search?: string;
  }): Promise<ListPageResult<Bim2Gltf>> {
    let queryBuilder = this.bim2GltfRepository.createQueryBuilder("bim");

    if (params.query || params.search) {
      const keyword = params.query || params.search;
      queryBuilder = queryBuilder.where("bim.fileName LIKE :keyword", {
        keyword: `%${keyword}%`,
      });
    }

    if (params.sortby) {
      const order = (params.order?.toUpperCase() === "ASC" ? "ASC" : "DESC") as
        | "ASC"
        | "DESC";
      queryBuilder = queryBuilder.orderBy(`bim.${params.sortby}`, order);
    } else {
      queryBuilder = queryBuilder.orderBy("bim.createTime", "DESC");
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

  async uploadRvt(file: {
    filename: string;
    originalname: string;
    size: number;
  }): Promise<{ filePath: string; fileName: string; fileSize: number }> {
    return {
      filePath: `/uploads/bim/${file.filename}`,
      fileName: file.originalname,
      fileSize: file.size,
    };
  }

  async addAndConversion(
    data: Partial<Bim2Gltf>,
    uname?: string,
  ): Promise<Bim2Gltf> {
    const bim = this.bim2GltfRepository.create({
      ...data,
      conversionStatus: 1,
    });

    const saved = await this.bim2GltfRepository.save(bim);

    if (uname) {
    }

    return saved;
  }
}
