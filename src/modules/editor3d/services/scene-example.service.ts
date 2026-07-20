import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SceneExample } from "../entities/scene-example.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

@Injectable()
export class SceneExampleService {
  constructor(
    @InjectRepository(SceneExample)
    private sceneExampleRepository: Repository<SceneExample>,
  ) {}

  async getAll(params: {
    offset: number;
    limit: number;
    sortby?: string;
    order?: "desc" | "asc" | "DESC" | "ASC";
    query?: string;
    search?: string;
  }): Promise<ListPageResult<SceneExample>> {
    let queryBuilder =
      this.sceneExampleRepository.createQueryBuilder("example");

    if (params.query || params.search) {
      const keyword = params.query || params.search;
      queryBuilder = queryBuilder.where("example.sceneName LIKE :keyword", {
        keyword: `%${keyword}%`,
      });
    }

    if (params.sortby) {
      const order = (params.order?.toUpperCase() === "ASC" ? "ASC" : "DESC") as
        | "ASC"
        | "DESC";
      queryBuilder = queryBuilder.orderBy(`example.${params.sortby}`, order);
    } else {
      queryBuilder = queryBuilder.orderBy("example.createTime", "DESC");
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

  async getOne(id: number): Promise<SceneExample> {
    return this.sceneExampleRepository.findOne({ where: { id } });
  }

  async create(data: Partial<SceneExample>): Promise<SceneExample> {
    const example = this.sceneExampleRepository.create(data);
    return this.sceneExampleRepository.save(example);
  }

  async remove(id: number): Promise<void> {
    await this.sceneExampleRepository.delete(id);
  }
}
