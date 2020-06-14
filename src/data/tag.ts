import * as Realm from 'realm';
import { Database } from '../db/database';

export class Tag {
  static schema: Realm.ObjectSchema = {
    name: 'Tag',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
    },
  };

  id: number;
  name: string;

  constructor(name: string) {
    this.id = Database.UNSET_INDEX;
    this.name = name;
  }

  getPrimaryKey(): string {
    return this.name;
  }
}
