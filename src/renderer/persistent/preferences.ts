import { remote } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';

export class Preferences {

  private static readonly PREFERENCES_FILE = 'preferences.json';

  static read(): IPreferences {
    const filePath = Preferences.getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const preferences = fs.readJsonSync(filePath);
      return { ...Preferences.defaultStorage(), ...preferences };
    } else {
      return Preferences.defaultStorage();
    }
  }

  static write(preferences: IPreferences): void {
    const filePath = Preferences.getStorageFilePath();
    fs.outputJSONSync(filePath, preferences);
  }

  private static getApplicationPath() {
    const platformDirectory = remote.app.getPath('appData');
    const applicationDirectory = path.join(platformDirectory, remote.app.getName());
    return applicationDirectory;
  }

  private static getStorageFilePath() {
    const applicationDirectory = Preferences.getApplicationPath();
    const storageDirectory = path.join(applicationDirectory, Preferences.PREFERENCES_FILE);
    return storageDirectory;
  }

  private static defaultStorage(): IPreferences {
    return ({
      dataPath: path.join(Preferences.getApplicationPath()),
    });
  }
}

export interface IPreferences {
  dataPath: string;
}
