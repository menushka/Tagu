import { BaseDatabase } from './baseDatabase';
import { Tag } from '../data/tag';

export class TagsDatabase extends BaseDatabase<Tag> {
  name = 'Tag';
  schemas = [Tag.schema];
  getPrimaryKey = (entry: Tag) => { return entry.name; };
}
