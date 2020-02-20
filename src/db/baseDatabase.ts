import * as Realm from 'realm';

export abstract class BaseDatabase<T> {
  imageSchema: Realm.ObjectSchema = {
    name: 'Image',
    primaryKey: 'path',
    properties: {
      path: 'string',
      fileType: 'string',
      tags: 'Tag[]',
    }
  };
  tagSchema: Realm.ObjectSchema = {
    name: 'Tag',
    primaryKey: 'name',
    properties: {
      name: 'string',
    }
  };
  abstract name: string;

  private realm: Realm;

  connect() {
    this.realm = new Realm({
      path: 'data/data.realm',
      schema: [this.tagSchema, this.imageSchema]
    });
  }

  getAll(filter: string = ''): T[] {
    if (filter != '') {
      return this.realm.objects<T>(this.name).filtered(filter).map(x => x);
    } else {
      return this.realm.objects<T>(this.name).map(x => x);
    }
  }

  write(entry: T) {
    this.writeMultiple([entry]);
  }

  writeMultiple(entries: T[]) {
    this.realm.write(() => {
      for (const entry of entries) {
        this.realm.create(this.name, entry, true);
      }
    });
  }

  close() {
    this.realm.close();
  }
}