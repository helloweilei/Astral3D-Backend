import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  AssetsCategory,
  SupportType,
} from "../entities/assets-category.entity";

export type AssetsCategoryNode = {
  id: string;
  key: string;
  pkey?: string;
  sortNum?: number;
  label: string;
  type?: SupportType;
  children?: AssetsCategoryNode[];
};

@Injectable()
export class AssetsCategoryService {
  constructor(
    @InjectRepository(AssetsCategory)
    private assetsCategoryRepository: Repository<AssetsCategory>,
  ) {}

  async treeList(type?: string): Promise<AssetsCategoryNode[]> {
    let queryBuilder =
      this.assetsCategoryRepository.createQueryBuilder("category");

    if (type) {
      queryBuilder = queryBuilder.where("category.type = :type", { type });
    }

    const categories = await queryBuilder
      .orderBy("category.sort_num", "ASC")
      .getMany();

    return this.buildTree(categories);
  }

  private buildTree(categories: AssetsCategory[]): AssetsCategoryNode[] {
    const map = new Map<number | string, AssetsCategoryNode>();
    const result: AssetsCategoryNode[] = [];

    categories.forEach((cat) => {
      const node: AssetsCategoryNode = {
        id: String(cat.id),
        key: cat.code,
        pkey: cat.pcode,
        sortNum: cat.sortNum,
        label: cat.name,
        type: cat.type as SupportType,
        children: [],
      };

      map.set(cat.id, node);
    });

    categories.forEach((cat) => {
      const node = map.get(cat.id);
      if (cat.pcode && node) {
        const parent = Array.from(map.values()).find(
          (p) => p.key === cat.pcode,
        );
        if (parent) {
          parent.children?.push(node);
        } else {
          result.push(node);
        }
      } else if (node) {
        result.push(node);
      }
    });

    return result;
  }
}
