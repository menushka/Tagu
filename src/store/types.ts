import { Tag } from '../data/tag';

//#region UI State handling
export type SearchOrTag = 'search' | 'tag';

export const SWITCH_COLUMN = 'SWITCH_COLUMN';

interface SwitchColumn {
  type: typeof SWITCH_COLUMN;
  id: SearchOrTag;
}

type UIStateActionTypes = SwitchColumn;
//#endregion

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

//#region File tree management
export const SELECT_FILE = 'SELECT_FILE';
export const TOGGLE_FOLDER = 'TOGGLE_FOLDER';
export const DELETE_FILE = 'DELETE_FILE';
export const UPDATE_SEARCH_TAGS = 'UPDATE_SEARCH_TAGS';

interface SelectFile {
  type: typeof SELECT_FILE;
  column: SearchOrTag;
  node: number[];
}

interface DeleteFile {
  type: typeof DELETE_FILE;
  column: SearchOrTag;
  id: string;
}

interface UpdateSearchTags {
  type: typeof UPDATE_SEARCH_TAGS;
  searchTags: Tag[];
}

type FileTreeActionTypes = SelectFile | DeleteFile | UpdateSearchTags;
//#endregion

export type ActionTypes = UIStateActionTypes | NewFilesActionTypes | FileTreeActionTypes;
