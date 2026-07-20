import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cad } from "../entities/cad.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

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
    const cad = this.cadRepository.create({
      ...data,
      filePath: `/uploads/cad/${file.filename}`,
      fileName: file.originalname,
      conversionStatus: 1,
    });

    const saved = await this.cadRepository.save(cad);

    if (uname) {
    }

    return saved;
  }
}
