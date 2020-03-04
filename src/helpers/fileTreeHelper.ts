import * as fs from 'fs-extra';
import * as path from 'path';
import { Image } from '../data/image';
import { ITreeNodeFile } from '../components/FileTree';
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

  static selectAtPath(nodes: ITreeNodeFile[], path: number[]): Image {
    const node = FileTreeHelper.forSpecificNode(nodes, path);
    if (node.type === 'file') {
      FileTreeHelper.forAllNode(nodes, x => x.isSelected = false);
      node.isSelected = !node.isSelected;
    } else {
      node.isExpanded = !node.isExpanded;
    }
    return node.image!;
  }

  static toggleFolderAtPath(nodes: ITreeNodeFile[], path: number[]) {
    FileTreeHelper.forSpecificNode(nodes, path, x => x.isExpanded = !x.isExpanded);
  }

  static exportTreeToPath(nodes: ITreeNodeFile[], path: string) {
    console.log(nodes, path);
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

  private static forAllNode(nodes: ITreeNodeFile[], callback: (node: ITreeNodeFile) => void) {
    for (const node of nodes) {
        callback(node);
        FileTreeHelper.forAllNode((node.childNodes ?? []) as ITreeNodeFile[], callback);
    }
  }

  private static forSpecificNode(nodes: ITreeNodeFile[], path: number[], callback?: (node: ITreeNodeFile) => void): ITreeNodeFile {
    if (path.length <= 1) {
      if (callback) {
        callback(nodes[path[0]]);
      }
      return nodes[path[0]];
    } else {
      return FileTreeHelper.forSpecificNode(nodes[path[0]].childNodes as ITreeNodeFile[], path.slice(1, path.length), callback);
    }
  }
}
