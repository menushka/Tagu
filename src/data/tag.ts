import * as Realm from 'realm';

export class Tag {
  static schema: Realm.ObjectSchema = {
    name: 'Tag',
    primaryKey: 'name',
    properties: {
      name: 'string',
    },
  };

  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
