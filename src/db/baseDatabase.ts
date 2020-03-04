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

  async write(entry: T): Promise<T> {
    const value = await this.writeMultiple([entry]);
    return value[0];
  }

  async writeMultiple(entries: T[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      try {
        this.realm.write(() => {
          let values = [];
          for (const entry of entries) {
            values.push(this.realm.create(this.name, entry, true));
          }
          return resolve(values);
        });
      } catch {
        reject();
      }
    });
  }

  async delete(entry: T): Promise<void> {
    await this.deleteMultiple([entry]);
  }

  async deleteMultiple(entries: T[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.realm.write(() => {
          for (const entry of entries) {
            this.realm.delete(this.realm.objectForPrimaryKey(this.name, this.getPrimaryKey(entry)));
          }
          resolve();
        });
      } catch {
        reject();
      }
    });
  }

  async query(filter: string = '', realm: Realm = this.realm): Promise<T[]> {
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
