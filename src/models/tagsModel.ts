import { TagsDatabase } from '../db/tagsDatabase';

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

  private db: TagsDatabase;

  private constructor() {
    this.db = new TagsDatabase();
  }

  initalize() {
    this.db.connect();
  }

  getTags(): Tag[] {
    return this.db.query();
  }

  observe(onUpdate: () => void) {
    this.db.observe(onUpdate);
  }

  removeTag(tag: Tag) {
    this.db.delete(tag);
  }
}
