import * as Realm from 'realm';
import * as path from 'path';
import { Tag } from './tag';
import { Database } from '../db/database';

export class Image {
  static schema: Realm.ObjectSchema = {
    name: 'Image',
    primaryKey: 'id',
    properties: {
      id: 'int',
      path: 'string',
      fileType: 'string',
      tags: 'Tag[]',
    },
  };

  id: number;
  path: string;
  fileType: string;
  tags: Tag[];

  constructor(path: string, tags: Tag[] = []) {
    this.id = Database.UNSET_INDEX;
    this.path = path;
    this.fileType = '';
    this.tags = tags;
  }

  static getAbsolutePath(image: Image, dataPath: string) {
    return path.join(dataPath, 'images', image.path);
  }
}
