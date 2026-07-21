import { randomUUID } from "crypto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Scene } from "../entities/scene.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

@Injectable()
export class ScenesService {
  constructor(
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
  ) {}

  async getAll(params: {
    offset: number;
    limit: number;
    sortby?: string;
    order?: "desc" | "asc" | "DESC" | "ASC";
    query?: string;
    search?: string;
  }): Promise<ListPageResult<Scene>> {
    let queryBuilder = this.sceneRepository.createQueryBuilder("scene");

    if (params.query || params.search) {
      const keyword = params.query || params.search;
      queryBuilder = queryBuilder.where("scene.sceneName LIKE :keyword", {
        keyword: `%${keyword}%`,
      });
    }

    if (params.sortby) {
      const order = (params.order?.toUpperCase() === "ASC" ? "ASC" : "DESC") as
        | "ASC"
        | "DESC";
      queryBuilder = queryBuilder.orderBy(`scene.${params.sortby}`, order);
    } else {
      queryBuilder = queryBuilder.orderBy("scene.createTime", "DESC");
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

  async getOne(id: string): Promise<Scene> {
    return this.sceneRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Scene>): Promise<Scene> {
    const scene = this.sceneRepository.create({
      ...data,
      id: data.id || randomUUID(),
    });
    return this.sceneRepository.save(scene);
  }

  async update(id: string, data: Partial<Scene>): Promise<Scene> {
    await this.sceneRepository.update(id, data);
    return this.sceneRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.sceneRepository.delete(id);
  }
}
