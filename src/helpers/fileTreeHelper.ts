import * as path from 'path';
import { Image } from '../data/image';
import { ITreeNodeFile } from '../components/fileTree';
import { Tag } from '../data/tag';
import { TagsModel } from '../models/tagsModel';
import { ImagesModel } from '../models/imagesModel';

export class FileTreeHelper {
  static getFilteredFiles(search: Tag[] = []): ITreeNodeFile[] {
    return FileTreeHelper.transformToFiles(ImagesModel.instance.getImages(search));
  }

  static getFilesByTag(): ITreeNodeFile[] {
    const files: ITreeNodeFile[] = [];
    const tags = TagsModel.instance.getTags();
    for (const tag of tags) {
      const tagFiles = FileTreeHelper.transformToFiles(ImagesModel.instance.getImages([tag]));
      files.push({
        id: `folder_${tag.name}`,
        label: tag.name,
        type: 'folder',
        tag: tag,
        childNodes: tagFiles,
      });
    }
    return files;
  }

  private static transformToFiles(images: Image[]): ITreeNodeFile[] {
    return images.map(image => {
      return {
        id: `file_${image.path}`,
        label: path.basename(image.path),
        type: 'file',
        image: image,
      } as ITreeNodeFile;
    });
  }
}
