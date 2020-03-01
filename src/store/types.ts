import { Tag } from '../data/tag';
import { Image } from '../data/image';

//#region Adding new files
export const DROP_FILE = 'DROP_FILE';
export const SAVE_NEW_FILE = 'SAVE_NEW_FILE';
export const CANCEL_ADD_FILE = 'CANCEL_ADD_FILE';

interface DropFile {
  type: typeof DROP_FILE;
  path: string;
}

interface SaveNewFile {
  type: typeof SAVE_NEW_FILE;
  path: string;
  tags: Tag[];
}

interface CancelAddFile {
  type: typeof CANCEL_ADD_FILE;
}

type NewFilesActionTypes = DropFile | SaveNewFile | CancelAddFile;
//#endregion

//#region Editing existing files
export const REMOVE_FILE = 'REMOVE_FILE';

interface RemoveFile {
  type: typeof REMOVE_FILE;
  removeImage: Image;
}

type EditFilesActionType = RemoveFile;
//#endregion

//#region File tree management
export const SELECT_FILE = 'SELECT_FILE';
export const UPDATE_SEARCH_TAGS = 'UPDATE_SEARCH_TAGS';

interface SelectFile {
  type: typeof SELECT_FILE;
  column: 'search' | 'tag';
  file: Image | null;
}

interface UpdateSearchTags {
  type: typeof UPDATE_SEARCH_TAGS;
  searchTags: Tag[];
}

type FileTreeActionTypes = SelectFile | UpdateSearchTags;
//#endregion

export type ActionTypes = NewFilesActionTypes | EditFilesActionType | FileTreeActionTypes;
