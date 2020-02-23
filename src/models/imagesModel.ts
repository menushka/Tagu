import * as fs from 'fs-extra';
import * as path from 'path';

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
      return this.db.query();
    } else {
      const filter = search.map(x => `ANY tags.name ==[c] '${x.name}'`).join(' AND ');
      return this.db.query(filter);
    }
  }

  observe(onUpdate: () => void) {
    this.db.observe(onUpdate);
  }

  addImage(addImagePath: string, tags: Tag[]) {
    const fileName = path.basename(addImagePath);
    const newFilePath = path.join(__dirname, '../../', 'images', fileName);
    fs.ensureDirSync(path.join(__dirname, '../../', 'images'));
    fs.copySync(addImagePath, newFilePath);
    this.db.write(new Image(fileName, tags));
  }

  removeImage(image: Image) {
    const imagePath = Image.getAbsolutePath(image);
    this.db.delete(image);
    fs.removeSync(imagePath);
  }
}
