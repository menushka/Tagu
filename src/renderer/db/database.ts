// import * as Sqlite from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs-extra';
import { FilesModel } from '../models/filesModel';
import { TagsModel } from '../models/tagsModel';

export class Database {
  private static _instance: Database;
  static get instance(): Database {
    if (!Database._instance) {
      Database._instance = new Database();
    }
    return Database._instance;
  }

  public static UNSET_INDEX: number = -1;

  private db: any;

  init(dataPath: string) {
    const dataFolder = path.join(dataPath, 'data');
    const databaseFile = path.join(dataFolder, 'data.db');
    fs.ensureDirSync(dataFolder);

    // this.db = new Sqlite(databaseFile);
    TagsModel.initialize();
    FilesModel.initialize();
  }

  switch(dataPath: string) {
    this.close();
    this.init(dataPath);
  }

  close() {
    this.db.close();
  }

  query<T>(query: string, ...params: any[]): T[] {
    return this.db.prepare(query).all(...params);
  }

  run(callback: (db: any) => void) {
    this.db.transaction(() => {
      callback(this.db);
    })();
  }
}
