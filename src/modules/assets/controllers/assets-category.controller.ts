import { Controller, Get, Query } from '@nestjs/common';
import { AssetsCategoryService } from '../services/assets-category.service';
import { AssetsCategory } from '../entities/assets-category.entity';

@Controller('assets/assetsCategory')
export class AssetsCategoryController {
  constructor(private readonly assetsCategoryService: AssetsCategoryService) {}

  @Get('treeList')
  async treeList(@Query('type') type?: string): Promise<AssetsCategory[]> {
    return this.assetsCategoryService.treeList(type);
  }
}
