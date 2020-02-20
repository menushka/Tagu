import { BaseDatabase } from './baseDatabase';
import { Image } from '../data/image';

export class ImagesDatabase extends BaseDatabase<Image> {
  name: string = 'Image';
}