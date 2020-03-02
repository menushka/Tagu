import { BaseDatabase } from './baseDatabase';
import { Image } from '../data/image';
import { Tag } from '../data/tag';

export class ImagesDatabase extends BaseDatabase<Image> {
  name = 'Image';
  schemas = [Image.schema, Tag.schema];
  getPrimaryKey = (entry: Image) => { return entry.path; };
}
