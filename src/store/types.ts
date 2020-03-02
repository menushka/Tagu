import { Tag } from '../data/tag';
import { Image } from '../data/image';

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
export const UPDATE_ADD_TAGS = 'UPDATE_ADD_TAGS';
export const SAVE_NEW_FILE = 'SAVE_NEW_FILE';
export const CANCEL_ADD_FILE = 'CANCEL_ADD_FILE';

interface DropFile {
  type: typeof DROP_FILE;
  path: string;
}

interface UpdateAddTags {
  type: typeof UPDATE_ADD_TAGS;
  addTags: Tag[];
}

interface SaveNewFile {
  type: typeof SAVE_NEW_FILE;
  path: string;
  tags: Tag[];
}

interface CancelAddFile {
  type: typeof CANCEL_ADD_FILE;
}

type NewFilesActionTypes = DropFile | UpdateAddTags | SaveNewFile | CancelAddFile;
//#endregion

//#region File tree management
export const SELECT_FILE = 'SELECT_FILE';
export const TOGGLE_FOLDER = 'TOGGLE_FOLDER';
export const DELETE_FILE = 'DELETE_FILE';
export const DELETE_TAG = 'DELETE_TAG';
export const UPDATE_SEARCH_TAGS = 'UPDATE_SEARCH_TAGS';

interface SelectFile {
  type: typeof SELECT_FILE;
  column: SearchOrTag;
  node: number[];
}

interface DeleteFile {
  type: typeof DELETE_FILE;
  file: Image;
}

interface DeleteTag {
  type: typeof DELETE_TAG;
  tag: Tag;
}

interface UpdateSearchTags {
  type: typeof UPDATE_SEARCH_TAGS;
  searchTags: Tag[];
}

type FileTreeActionTypes = SelectFile | DeleteFile | DeleteTag | UpdateSearchTags;
//#endregion

export type ActionTypes = UIStateActionTypes | NewFilesActionTypes | FileTreeActionTypes;
