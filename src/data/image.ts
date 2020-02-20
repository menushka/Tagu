import { Tag } from './tag';

export class Image {
  path: string;
  fileType: string;
  tags: Tag[];

  constructor(path: string, tags: string[] = []) {
    this.path = path;
    this.fileType = '';
    this.tags = tags.map(x => new Tag(x));
  }
}