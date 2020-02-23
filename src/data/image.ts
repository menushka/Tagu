import * as Realm from 'realm';
import * as path from 'path';
import { Tag } from './tag';

export class Image {
  static schema: Realm.ObjectSchema = {
    name: 'Image',
    primaryKey: 'path',
    properties: {
      path: 'string',
      fileType: 'string',
      tags: 'Tag[]',
    }
  };

  path: string;
  fileType: string;
  tags: Tag[];

  constructor(path: string, tags: Tag[] = []) {
    this.path = path;
    this.fileType = '';
    this.tags = tags;
  }

  static getAbsolutePath(image: Image) {
    return path.join(__dirname, '../../', 'images', image.path);
  }
}
