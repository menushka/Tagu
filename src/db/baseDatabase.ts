import * as Realm from 'realm';

export abstract class BaseDatabase<T> {
  abstract name: string;
  abstract schemas: (Realm.ObjectSchema | Realm.ObjectClass)[];
  abstract getPrimaryKey: (entry: T) => string;

  private realm: Realm;
  private onUpdateCallbacks: (() => void)[] = [];

  connect() {
    this.realm = new Realm({
      path: 'data/data.realm',
      schema: this.schemas,
    });
    this.realm.addListener('change', () => {
      for (const callback of this.onUpdateCallbacks) {
        callback();
      }
    });
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

  delete(entry: T) {
    this.deleteMultiple([entry]);
  }

  deleteMultiple(entries: T[]) {
    this.realm.write(() => {
      for (const entry of entries) {
        this.realm.delete(this.realm.objectForPrimaryKey(this.name, this.getPrimaryKey(entry)));
      }
    });
  }

  query(filter: string = '', realm: Realm = this.realm): T[] {
    if (filter != '') {
      return realm.objects<T>(this.name).filtered(filter).map(x => JSON.parse(JSON.stringify(x)));
    } else {
      return realm.objects<T>(this.name).map(x => JSON.parse(JSON.stringify(x)));
    }
  }

  observe(onUpdate: () => void) {
    this.onUpdateCallbacks.push(onUpdate);
  }

  close() {
    this.realm.close();
  }
}
