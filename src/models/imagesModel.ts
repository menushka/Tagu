import { ImagesDatabase } from '../db/imagesDatabase';

import { Image } from '../data/image';
import { Tag } from '../data/tag';

export class ImagesModel {
  private static _instance: ImagesModel;
  static get instance(): ImagesModel {
    if (!ImagesModel._instance) {
      ImagesModel._instance = new ImagesModel();
    }
    return ImagesModel._instance;
  }

  private db: ImagesDatabase;

  private constructor() {
    this.db = new ImagesDatabase();
  }

  initalize() {
    this.db.connect();
  }

  getImages(search: Tag[] = []): Image[] {
    if (search.length === 0) {
      return this.db.getAll();
    } else {
      const filter = search.map(x => `ANY tags.name ==[c] '${x.name}'`).join(' AND ');
      return this.db.getAll(filter);
    }
  }

  addImage(image: Image) {
    this.db.write(image);
  }
}
