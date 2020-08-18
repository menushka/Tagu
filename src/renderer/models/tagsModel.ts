import { Database } from '../db/database';

import { Tag } from '../data/tag';
import { Queries } from '../db/queries/queries';
import { Statements } from '../db/statements';

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

  static async initialize() {
    Database.instance.run((db) => {
      db.prepare(Queries.tags.initalize).run();
    });
  }

  getTags(): Tag[] {
    interface SelectReturnType {
      id: number;
      name: string;
    }
    const rows = Database.instance.query<SelectReturnType>(Queries.tags.get);
    return rows.map(row => new Tag(
      row.name,
      row.id,
    ));
  }

  updateTag(tag: Tag, tagName: string) {
    Database.instance.run((db) => {
      Statements.tags.updateByNameAndId(db, tagName, tag.id);
    });
  }

  removeTag(tag: Tag) {
    Database.instance.run((db) => {
      Statements.fileTags.deleteByTagId(db, tag.id);
      Statements.tags.removeById(db, tag.id);
    });
  }
}
