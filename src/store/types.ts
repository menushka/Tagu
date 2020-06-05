import { Tag } from '../data/tag';
import { Image } from '../data/image';
import { IPreferences } from '../persistent/preferences';

//#region Preferences IO handling
export const READ_PREFERENCES_FILE = 'READ_PREFERENCES_FILE';
export const WRITE_PREFERENCES_FILE = 'WRITE_PREFERENCES_FILE';

interface ReadPreferencesFile {
  type: typeof READ_PREFERENCES_FILE;
  preferences: IPreferences;
}

interface WritePreferencesFile {
  type: typeof WRITE_PREFERENCES_FILE;
}

type PreferencesActionTypes = ReadPreferencesFile | WritePreferencesFile;
//#endregion

//#region UI State handling
export type SearchOrTag = 'search' | 'tag';

export const SWITCH_COLUMN = 'SWITCH_COLUMN';
export const OPEN_PREFERENCES = 'OPEN_PREFERENCES';
export const CLOSE_PREFERENCES = 'CLOSE_PREFERENCES';

interface SwitchColumn {
  type: typeof SWITCH_COLUMN;
  id: SearchOrTag;
}

interface OpenPreferences {
  type: typeof OPEN_PREFERENCES;
}

interface ClosePreferences {
  type: typeof CLOSE_PREFERENCES;
}

type UIStateActionTypes = SwitchColumn | OpenPreferences | ClosePreferences;
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

export type ActionTypes = PreferencesActionTypes | UIStateActionTypes | NewFilesActionTypes | FileTreeActionTypes;
