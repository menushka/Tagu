import * as fs from 'fs-extra';
import * as path from 'path';

import { Database } from '../db/database';

import { File } from '../data/file';
import { Tag } from '../data/tag';

export class FilesModel {
  private static _instance: FilesModel;
  static get instance(): FilesModel {
    if (!FilesModel._instance) {
      FilesModel._instance = new FilesModel();
    }
    return FilesModel._instance;
  }

  private constructor() {}

  getFiles(search: Tag[] = []): File[] {
    if (search.length === 0) {
      return ([] as File[]).concat(Database.instance.files.query());
    } else {
      const filter = search.map(x => `ANY tags.name ==[c] '${x.name}'`).join(' AND ');
      return ([] as File[]).concat(Database.instance.files.query(filter));
    }
  }

  addFile(addFilePath: string, tags: Tag[], dataPath: string) {
    const fileName = path.basename(addFilePath);
    const newFilePath = path.join(dataPath, 'files', fileName);
    fs.ensureDirSync(path.join(dataPath, 'files'));
    fs.copySync(addFilePath, newFilePath);

    // Because Realm doesn't auto increment, new Tags must be written first and merged with File
    const writtenNewTags = Database.instance.tags.writeMultiple(tags.filter(tag => tag.id === Database.UNSET_INDEX));
    for (const tag of writtenNewTags) {
      tags.find(t => t.name === tag.name)!.id = tag.id;
    }

    Database.instance.files.write(new File(fileName, tags));
  }

  updateFile(file: File, tags: Tag[]) {
    const writtenNewTags = Database.instance.tags.writeMultiple(tags.filter(tag => tag.id === Database.UNSET_INDEX));
    for (const tag of writtenNewTags) {
      tags.find(t => t.name === tag.name)!.id = tag.id;
    }
    file.tags = tags;

    Database.instance.files.write(file);
  }

  removeFile(file: File, dataPath: string) {
    const filePath = File.getAbsolutePath(file, dataPath);
    Database.instance.files.delete(file);
    fs.removeSync(filePath);
  }
}
