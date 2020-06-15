import * as path from 'path';
import { File } from '../data/file';
import { ITreeNodeFile } from '../components/FileTree';
import { Tag } from '../data/tag';
import { TagsModel } from '../models/tagsModel';
import { FilesModel } from '../models/filesModel';

export class FileTreeHelper {
  static getFilteredFiles(search: Tag[] = []): ITreeNodeFile[] {
    return FileTreeHelper.transformToFiles(FilesModel.instance.getFiles(search));
  }

  static getFilesByTag(): ITreeNodeFile[] {
    const files: ITreeNodeFile[] = [];
    const tags = TagsModel.instance.getTags();
    for (const tag of tags) {
      const tagFiles = FileTreeHelper.transformToFiles(FilesModel.instance.getFiles([tag]));
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

  static selectAtPath(nodes: ITreeNodeFile[], path: number[]): File {
    const node = FileTreeHelper.forSpecificNode(nodes, path);
    if (node.type === 'file') {
      FileTreeHelper.forAllNode(nodes, x => x.isSelected = false);
      node.isSelected = !node.isSelected;
    } else {
      node.isExpanded = !node.isExpanded;
    }
    return node.file!;
  }

  static toggleFolderAtPath(nodes: ITreeNodeFile[], path: number[]) {
    FileTreeHelper.forSpecificNode(nodes, path, x => x.isExpanded = !x.isExpanded);
  }

  static exportTreeToPath(nodes: ITreeNodeFile[], path: string) {
    console.log(nodes, path);
  }

  private static transformToFiles(files: File[]): ITreeNodeFile[] {
    return files.map(file => {
      return {
        id: `file_${file.path}`,
        label: path.basename(file.path),
        type: 'file',
        file: file,
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
