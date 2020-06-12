import { Database } from '../db/database';

import { Tag } from '../data/tag';

export class TagsModel {

  // Singleton Handling
  private static _instance: TagsModel;
  static get instance(): TagsModel {
    if (!TagsModel._instance) {
      TagsModel._instance = new TagsModel();
    }
    return TagsModel._instance;
  }

  private constructor() {}

  getTags(): Tag[] {
    return ([] as Tag[]).concat(Database.instance.tags.query());
  }

  removeTag(tag: Tag) {
    Database.instance.tags.delete(tag);
  }
}
