import { Tag } from '../data/tag';

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
  node: number[];
}

type EditFilesActionType = RemoveFile;
//#endregion

//#region File tree management
export const SELECT_FILE = 'SELECT_FILE';
export const TOGGLE_FOLDER = 'TOGGLE_FOLDER';
export const UPDATE_SEARCH_TAGS = 'UPDATE_SEARCH_TAGS';

export type SearchOrTag = 'search' | 'tag';

interface SelectFile {
  type: typeof SELECT_FILE;
  column: SearchOrTag;
  node: number[];
}

interface ToggleFolder {
  type: typeof TOGGLE_FOLDER;
  column: SearchOrTag;
  node: number[];
}

interface UpdateSearchTags {
  type: typeof UPDATE_SEARCH_TAGS;
  searchTags: Tag[];
}

type FileTreeActionTypes = SelectFile | ToggleFolder | UpdateSearchTags;
//#endregion

export type ActionTypes = NewFilesActionTypes | EditFilesActionType | FileTreeActionTypes;
