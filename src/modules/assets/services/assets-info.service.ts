import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AssetsInfo } from "../entities/assets-info.entity";
import { ListPageResult } from "@/common/dto/page-result.dto";

@Injectable()
export class AssetsInfoService {
  constructor(
    @InjectRepository(AssetsInfo)
    private assetsInfoRepository: Repository<AssetsInfo>,
  ) {}

  async getAll(params: {
    offset: number;
    limit: number;
    sortby?: string;
    order?: "desc" | "asc" | "DESC" | "ASC";
    query?: string;
    search?: string;
    category?: string;
  }): Promise<ListPageResult<AssetsInfo>> {
    let queryBuilder = this.assetsInfoRepository.createQueryBuilder("assets");

    const keyword = params.search?.trim();

    let typeFilter: string | undefined;

    if (params.query) {
      const filters = params.query
        .split(/\s+/)
        .map((part) => part.trim())
        .filter(Boolean)
        .reduce<Record<string, string>>((acc, part) => {
          const [field, ...rest] = part.split(":");
          if (rest.length === 0) {
            return acc;
          }
          const value = rest.join(":");
          if (field === "type") {
            acc[field] = value;
          }
          return acc;
        }, {});

      typeFilter = filters.type;
    }

    if (keyword) {
      queryBuilder = queryBuilder.where(
        "assets.name LIKE :keyword OR assets.tags LIKE :keyword",
        { keyword: `%${keyword}%` },
      );
    }

    if (typeFilter) {
      queryBuilder = queryBuilder.andWhere("assets.type = :type", {
        type: typeFilter,
      });
    }

    if (params.category) {
      queryBuilder = queryBuilder.andWhere("assets.category = :category", {
        category: params.category,
      });
    }

    if (params.sortby) {
      const order = (params.order?.toUpperCase() === "ASC" ? "ASC" : "DESC") as
        | "ASC"
        | "DESC";
      queryBuilder = queryBuilder.orderBy(`assets.${params.sortby}`, order);
    } else {
      queryBuilder = queryBuilder.orderBy("assets.createTime", "DESC");
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

  async create(data: Partial<AssetsInfo>): Promise<AssetsInfo> {
    const asset = this.assetsInfoRepository.create(data);
    return this.assetsInfoRepository.save(asset);
  }

  async update(data: Partial<AssetsInfo>): Promise<AssetsInfo> {
    await this.assetsInfoRepository.update(data.id, data);
    return this.assetsInfoRepository.findOne({ where: { id: data.id } });
  }

  async remove(id: number): Promise<void> {
    await this.assetsInfoRepository.delete(id);
  }

  async selectTags(type: string, category: string): Promise<string[]> {
    const assets = await this.assetsInfoRepository.find({
      where: {
        type: type as AssetsInfo["type"],
        category,
      },
      select: {
        tags: true,
      },
    });

    const tagSet = new Set<string>();
    assets.forEach((asset) => {
      if (asset.tags) {
        asset.tags.split(",").forEach((tag) => {
          const trimmedTag = tag.trim();
          if (trimmedTag) tagSet.add(trimmedTag);
        });
      }
    });

    return Array.from(tagSet);
  }
}
