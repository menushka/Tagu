import * as Realm from 'realm';
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

  private realm: Realm;
  private schemas: (Realm.ObjectSchema | Realm.ObjectClass)[] = [Image.schema, Tag.schema];

  images: DatabaseType<Image> = new DatabaseType('Image', () => this.realm, (entry) => entry.path);
  tags: DatabaseType<Tag> = new DatabaseType('Tag', () => this.realm, (entry) => entry.name);

  private constructor() {
    this.realm = new Realm({
      path: 'data/data.realm',
      schema: this.schemas,
    });
  }

  close() {
    this.realm.close();
  }
}

class DatabaseType<T> {

  private name: string;
  private getRealm: () => Realm;
  private getPrimaryKey: (entry: T) => string;

  private get realm() {
    return this.getRealm();
  }

  constructor(name: string, getRealm: () => Realm, getPrimaryKey: (entry: T) => string) {
    this.name = name;
    this.getRealm = getRealm;
    this.getPrimaryKey = getPrimaryKey;
  }

  query(filter: string = ''): T[] {
    if (filter != '') {
      return this.realm.objects<T>(this.name).filtered(filter).map(x => JSON.parse(JSON.stringify(x)));
    } else {
      return this.realm.objects<T>(this.name).map(x => JSON.parse(JSON.stringify(x)));
    }
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
          values.push(this.realm.create(this.name, entry, true));
        }
      });
      return values;
    } catch {
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
          this.realm.delete(this.realm.objectForPrimaryKey(this.name, this.getPrimaryKey(entry)));
        }
      });
      return true;
    } catch {
      return false;
    }
  }
}
