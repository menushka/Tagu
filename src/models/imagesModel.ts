import * as fs from 'fs-extra';
import * as path from 'path';

import { Database } from '../db/database';

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

  private constructor() {}

  getImages(search: Tag[] = []): Image[] {
    if (search.length === 0) {
      return ([] as Image[]).concat(Database.instance.images.query());
    } else {
      const filter = search.map(x => `ANY tags.name ==[c] '${x.name}'`).join(' AND ');
      return ([] as Image[]).concat(Database.instance.images.query(filter));
    }
  }

  addImage(addImagePath: string, tags: Tag[]) {
    const fileName = path.basename(addImagePath);
    const newFilePath = path.join(__dirname, '../../', 'images', fileName);
    fs.ensureDirSync(path.join(__dirname, '../../', 'images'));
    fs.copySync(addImagePath, newFilePath);
    console.log('start Image write');
    Database.instance.images.write(new Image(fileName, tags));
    console.log('end Image write');
  }

  removeImage(image: Image) {
    const imagePath = Image.getAbsolutePath(image);
    Database.instance.images.delete(image);
    fs.removeSync(imagePath);
  }
}
