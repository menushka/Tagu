import * as fs from 'fs-extra';
import * as path from 'path';
import { zip, difference } from 'lodash';

import { Database } from '../db/database';

import { File } from '../data/file';
import { Tag } from '../data/tag';
import { Queries } from '../db/queries';

export class FilesModel {
  private static _instance: FilesModel;
  static get instance(): FilesModel {
    if (!FilesModel._instance) {
      FilesModel._instance = new FilesModel();
    }
    return FilesModel._instance;
  }

  private constructor() {}

  static async initialize() {
    Database.instance.run((db) => {
      db.prepare(Queries.file.initalize).run();
      db.prepare(Queries.fileTags.initalize).run();
    });
  }

  getFiles(search: Tag[] = []): File[] {
    interface SelectReturnType {
      id: number;
      path: string;
      tags: string;
      tag_ids: string;
    }

    const query = search.length === 0 ? Queries.file.get : Queries.file.getByTags(search.length);
    const queryParams = search.length === 0 ? [] : search.map(tag => tag.id.toString());
    const rows = Database.instance.query<SelectReturnType>(query, ...queryParams);
    return rows.map(row => new File(
      row.path,
      zip(row.tags.split(','), row.tag_ids.split(',')).map(x => new Tag(x[0]!, parseInt(x[1]!))),
      row.id,
    ));
  }

  addFile(addFilePath: string, tags: Tag[], dataPath: string) {
    const fileName = path.basename(addFilePath);
    const newFilePath = path.join(dataPath, 'files', fileName);
    fs.ensureDirSync(path.join(dataPath, 'files'));
    fs.copySync(addFilePath, newFilePath);

    Database.instance.run((db) => {
      const createTagStatement = db.prepare(Queries.tags.create);
      const unwrittenTags = tags.filter(tag => tag.id === Database.UNSET_INDEX);
      for (const tag of unwrittenTags) {
        const result = createTagStatement.run(tag.name);
        tag.id = parseInt(`${result.lastInsertRowid}`);
      }

      const createFileStatement = db.prepare(Queries.file.create);
      const fileResult = createFileStatement.run(fileName);
      const fileId = parseInt(`${fileResult.lastInsertRowid}`);

      const createFileTagsStatement = db.prepare(Queries.fileTags.create);
      for (const tag of tags) {
        createFileTagsStatement.run(fileId, tag.id);
      }
    });
  }

  updateFile(file: File, newTags: Tag[]) {
    const currentTags = file.tags;

    const tagsToAdd = difference(newTags, currentTags);
    const tagsToRemove = difference(currentTags, newTags);

    Database.instance.run((db) => {
      db.prepare(Queries.fileTags.deleteByIds(tagsToRemove.length)).run(...tagsToRemove.map(tag => tag.id));

      const createFileTagsStatement = db.prepare(Queries.fileTags.create);
      for (const tag of tagsToAdd) {
        createFileTagsStatement.run(file.id, tag.name);
      }
    });
  }

  removeFile(file: File, dataPath: string) {
    Database.instance.run((db) => {
      db.prepare(Queries.fileTags.deleteByFileId).run(file.id);
      db.prepare(Queries.file.deleteById).run(file.id);
    });
    const filePath = File.getAbsolutePath(file, dataPath);
    fs.removeSync(filePath);
  }
}
