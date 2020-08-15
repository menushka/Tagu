import * as Sqlite from 'better-sqlite3';

import { Queries } from './queries/queries';

import { Tag } from '../data/tag';

const Integer = Math.trunc;

class FileStatements {
  create(db: Sqlite.Database, name: string): number {
    const createFileStatement = db.prepare(Queries.file.create);
    const fileResult = createFileStatement.run(name);
    return parseInt(`${fileResult.lastInsertRowid}`);
  }

  deleteById(db: Sqlite.Database, id: number) {
    db.prepare(Queries.file.deleteById).run(Integer(id));
  }
}

class FileTagStatements {
  create(db: Sqlite.Database, fileId: number, tags: Tag[]) {
    const createFileTagsStatement = db.prepare(Queries.fileTags.create);
    for (const tag of tags) {
      createFileTagsStatement.run(fileId, Integer(tag.id));
    }
  }

  deleteByIds(db: Sqlite.Database, ids: number[]) {
    db.prepare(Queries.fileTags.deleteByIds(ids.length)).run(...ids.map(id => Integer(id)));
  }

  deleteByFileId(db: Sqlite.Database, id: number) {
    db.prepare(Queries.fileTags.deleteByFileId).run(Integer(id));
  }
}

class TagStatements {
  create(db: Sqlite.Database, tags: Tag[]): Tag[] {
    const createTagStatement = db.prepare(Queries.tags.create);
    for (const tag of tags) {
      const result = createTagStatement.run(tag.name);
      tag.id = parseInt(`${result.lastInsertRowid}`);
    }
    return tags;
  }

  updateByNameAndId(db: Sqlite.Database, name: string, id: number) {
    db.prepare(Queries.tags.updateByNameAndId).run(name, Integer(id));
  }

  removeById(db: Sqlite.Database, id: number) {
    db.prepare(Queries.tags.removeById).run(Integer(id));
  }
}

export class Statements {
  static files = new FileStatements();
  static fileTags = new FileTagStatements();
  static tags = new TagStatements();
}
