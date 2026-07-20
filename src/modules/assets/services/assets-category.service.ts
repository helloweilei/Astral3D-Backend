import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AssetsCategory } from "../entities/assets-category.entity";

type AssetsCategoryNode = AssetsCategory & {
  children?: AssetsCategoryNode[];
};

@Injectable()
export class AssetsCategoryService {
  constructor(
    @InjectRepository(AssetsCategory)
    private assetsCategoryRepository: Repository<AssetsCategory>,
  ) {}

  async treeList(type?: string): Promise<AssetsCategory[]> {
    let queryBuilder =
      this.assetsCategoryRepository.createQueryBuilder("category");

    if (type) {
      queryBuilder = queryBuilder.where("category.type = :type", { type });
    }

    const categories = await queryBuilder
      .orderBy("category.sortNum", "ASC")
      .getMany();

    return this.buildTree(categories);
  }

  private buildTree(categories: AssetsCategory[]): AssetsCategoryNode[] {
    const map = new Map<number | string, AssetsCategoryNode>();
    const result: AssetsCategoryNode[] = [];

    categories.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    categories.forEach((cat) => {
      const node = map.get(cat.id);
      if (cat.pkey && node) {
        const parent = Array.from(map.values()).find((p) => p.key === cat.pkey);
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
