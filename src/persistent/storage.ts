import { remote } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';

export class Storage {

  private static readonly STORAGE_FILE = 'preferences.json';

  static read(): IStorage {
    const filePath = Storage.getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const preferences = fs.readJsonSync(filePath);
      return { ...Storage.defaultStorage(), ...preferences };
    } else {
      return Storage.defaultStorage();
    }
  }

  static write(storage: IStorage): void {
    const filePath = Storage.getStorageFilePath();
    fs.ensureFileSync(filePath);
    fs.writeJsonSync(filePath, storage);
  }

  private static getApplicationPath() {
    const platformDirectory = remote.app.getPath('appData');
    const applicationDirectory = path.join(platformDirectory, remote.app.getName());
    return applicationDirectory;
  }

  private static getStorageFilePath() {
    const applicationDirectory = Storage.getApplicationPath();
    const storageDirectory = path.join(applicationDirectory, Storage.STORAGE_FILE);
    return storageDirectory;
  }

  private static defaultStorage(): IStorage {
    return ({
      dataPath: path.join(Storage.getApplicationPath()),
    });
  }
}

export interface IStorage {
  dataPath: string;
}
