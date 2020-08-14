import * as path from 'path';
import { Tag } from './tag';
import { Database } from '../db/database';

export class File {
  id: number;
  path: string;
  fileType: string;
  tags: Tag[];

  constructor(path: string, tags: Tag[])
  constructor(path: string, tags: Tag[], id: number)
  constructor(path: string, tags: Tag[], id?: number) {
    this.id = id ?? Database.UNSET_INDEX;
    this.path = path;
    this.tags = tags;
  }

  static getAbsolutePath(file: File, dataPath: string) {
    return path.join(dataPath, 'files', file.path);
  }
}
