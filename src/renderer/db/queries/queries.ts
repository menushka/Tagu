import { FileQueries } from './types/fileQueries';
import { FileTagsQueries } from './types/fileTagsQueries';
import { TagQueries } from './types/tagQueries';

export class Queries {
  static file = new FileQueries();
  static fileTags = new FileTagsQueries();
  static tags = new TagQueries();
}
