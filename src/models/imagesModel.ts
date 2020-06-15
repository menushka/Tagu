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

  addImage(addImagePath: string, tags: Tag[], dataPath: string) {
    const fileName = path.basename(addImagePath);
    const newFilePath = path.join(dataPath, 'images', fileName);
    fs.ensureDirSync(path.join(dataPath, 'images'));
    fs.copySync(addImagePath, newFilePath);

    // Because Realm doesn't auto increment, new Tags must be written first and merged with Image
    const writtenNewTags = Database.instance.tags.writeMultiple(tags.filter(tag => tag.id === Database.UNSET_INDEX));
    for (const tag of writtenNewTags) {
      tags.find(t => t.name === tag.name)!.id = tag.id;
    }

    Database.instance.images.write(new Image(fileName, tags));
  }

  updateImage(image: Image, tags: Tag[]) {
    const writtenNewTags = Database.instance.tags.writeMultiple(tags.filter(tag => tag.id === Database.UNSET_INDEX));
    for (const tag of writtenNewTags) {
      tags.find(t => t.name === tag.name)!.id = tag.id;
    }
    image.tags = tags;

    Database.instance.images.write(image);
  }

  removeImage(image: Image, dataPath: string) {
    const imagePath = Image.getAbsolutePath(image, dataPath);
    Database.instance.images.delete(image);
    fs.removeSync(imagePath);
  }
}
