import { Database } from '../db/database';

export class Tag {
  id: number;
  name: string;

  constructor(name: string)
  constructor(name: string, id: number)
  constructor(name: string, id?: number) {
    this.id = id ?? Database.UNSET_INDEX;
    this.name = name;
  }
}
