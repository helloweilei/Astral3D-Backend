import { ApiProperty } from '@nestjs/swagger';

export class ListPageResult<T> {
  @ApiProperty()
  current: number;

  @ApiProperty()
  items: T[];

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  pages: number;

  @ApiProperty()
  total: number;

  constructor(current: number, items: T[], pageSize: number, total: number) {
    this.current = current;
    this.items = items;
    this.pageSize = pageSize;
    this.pages = Math.ceil(total / pageSize);
    this.total = total;
  }
}
