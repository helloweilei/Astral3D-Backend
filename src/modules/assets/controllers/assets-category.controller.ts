import { Controller, Get, Query } from "@nestjs/common";
import {
  AssetsCategoryNode,
  AssetsCategoryService,
} from "../services/assets-category.service";

@Controller("assets/assetsCategory")
export class AssetsCategoryController {
  constructor(private readonly assetsCategoryService: AssetsCategoryService) {}

  @Get("treeList")
  async treeList(@Query("type") type?: string): Promise<AssetsCategoryNode[]> {
    return this.assetsCategoryService.treeList(type);
  }
}
