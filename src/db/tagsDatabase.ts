import { BaseDatabase } from './baseDatabase';
import { Tag } from '../data/tag';

export class TagsDatabase extends BaseDatabase<Tag> {
  name: string = 'Tag';
}