import * as fs from 'fs-extra';
import * as path from 'path';
import { zip, difference } from 'lodash';

import { Database } from '../db/database';

import { File } from '../data/file';
import { Tag } from '../data/tag';
import { Queries } from '../db/queries/queries';
import { Statements } from '../db/statements';

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
      const existingTags = tags.filter(tag => tag.id !== Database.UNSET_INDEX);
      const unwrittenTags = tags.filter(tag => tag.id === Database.UNSET_INDEX);

      const newTags = Statements.tags.create(db, unwrittenTags);
      const finalTags = existingTags.concat(newTags);

      const fileId = Statements.files.create(db, fileName);
      Statements.fileTags.create(db, fileId, finalTags);
    });
  }

  updateFile(file: File, newTags: Tag[]) {
    const currentTags = file.tags;

    const tagsToAdd = difference(newTags, currentTags);
    const tagsToRemove = difference(currentTags, newTags);

    Database.instance.run((db) => {
      Statements.fileTags.deleteByIds(db, tagsToRemove.map(tag => tag.id));
      Statements.fileTags.create(db, file.id, tagsToAdd);
    });
  }

  removeFile(file: File, dataPath: string) {
    Database.instance.run((db) => {
      Statements.fileTags.deleteByFileId(db, file.id);
      Statements.files.deleteById(db, file.id);
    });
    const filePath = File.getAbsolutePath(file, dataPath);
    fs.removeSync(filePath);
  }
}
