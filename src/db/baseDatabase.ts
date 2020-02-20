import * as Realm from 'realm';

export abstract class BaseDatabase<T> {
  abstract name: string;
  abstract schemas: (Realm.ObjectSchema | Realm.ObjectClass)[];

  private realm: Realm;

  connect() {
    this.realm = new Realm({
      path: 'data/data.realm',
      schema: this.schemas
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
