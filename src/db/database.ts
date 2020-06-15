import * as Realm from 'realm';
import * as path from 'path';
import { Image } from '../data/image';
import { Tag } from '../data/tag';

export class Database {
  private static _instance: Database;
  static get instance(): Database {
    if (!Database._instance) {
      Database._instance = new Database();
    }
    return Database._instance;
  }

  public static UNSET_INDEX: number = -1;

  private realm: Realm;
  private schemas: (Realm.ObjectSchema | Realm.ObjectClass)[] = [Image.schema, Tag.schema];

  images: DatabaseType<Image> = new DatabaseType('Image', () => this.realm);
  tags: DatabaseType<Tag> = new DatabaseType('Tag', () => this.realm);

  init(dataPath: string) {
    this.realm = new Realm({
      path: path.join(dataPath, 'data', 'data.realm'),
      schema: this.schemas,
    });
  }

  switch(dataPath: string) {
    this.close();
    this.init(dataPath);
  }

  close() {
    this.realm.close();
  }
}

interface IndexedDatabaseEntry {
  id: number;
}

class DatabaseType<T extends IndexedDatabaseEntry> {

  private name: string;
  private getRealm: () => Realm;

  private get realm() {
    return this.getRealm();
  }

  constructor(name: string, getRealm: () => Realm) {
    this.name = name;
    this.getRealm = getRealm;
  }

  query(filter: string = ''): T[] {
    let objects = this.realm.objects<T>(this.name);
    if (filter != '') {
      objects = objects.filtered(filter);
    }

    // Remove realm connection and convert RealmList to real array
    const purgeRealm = (x: any) => {
      const w = {};
      for (const key of Object.keys(x)) {
        if (x[key].constructor.name === 'List') {
          w[key] = Object.keys(x[key]).map(k => purgeRealm(x[key][k]));
        } else {
          w[key] = x[key];
        }
      }
      return w;
    };

    return objects.map(purgeRealm) as T[];
  }

  write(entry: T): T {
    const value = this.writeMultiple([entry]);
    return value[0];
  }

  writeMultiple(entries: T[]): T[] {
    try {
      let values: T[] = [];
      this.realm.write(() => {
        for (const entry of entries) {
          if (entry.id === Database.UNSET_INDEX) {
            const objects = this.realm.objects<T>(this.name);
            const currentMaxId = objects.length !== 0 ? objects.sorted('id', true)[0].id : -1;
            const newMaxId = currentMaxId + 1;
            values.push(this.realm.create(this.name, { ...entry, id: newMaxId}, true));
          } else {
            values.push(this.realm.create(this.name, entry, true));
          }
        }
      });
      return values;
    } catch (e) {
      console.error(`Write error: ${e}`);
      return [];
    }
  }

  delete(entry: T): boolean {
    return this.deleteMultiple([entry]);
  }

  deleteMultiple(entries: T[]): boolean {
    try {
      this.realm.write(() => {
        for (const entry of entries) {
          this.realm.delete(this.realm.objectForPrimaryKey(this.name, entry.id));
        }
      });
      return true;
    } catch (e) {
      console.error(`Delete error: ${e}`);
      return false;
    }
  }
}
