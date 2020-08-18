import { Tag } from '../data/tag';
import { IPreferences } from '../persistent/preferences';
import { ITreeNodeFile } from '../components/FileTree';
import { RootState } from './store';
import { File } from '../data/file';

export type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

//#region Preferences IO handling
export const READ_PREFERENCES_FILE = 'READ_PREFERENCES_FILE';
export const WRITE_PREFERENCES_FILE = 'WRITE_PREFERENCES_FILE';

interface ReadPreferencesFile {
  type: typeof READ_PREFERENCES_FILE;
  preferences: IPreferences;
}

interface WritePreferencesFile {
  type: typeof WRITE_PREFERENCES_FILE;
  preferences: IPreferences;
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
export const UPDATE_FILES_AND_TAGS = 'UPDATE_FILES_AND_TAGS';

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
}

interface CancelAddFile {
  type: typeof CANCEL_ADD_FILE;
}

interface UpdateFilesAndTags {
  type: typeof UPDATE_FILES_AND_TAGS;
  newState: RecursivePartial<RootState>;
}

type NewFilesActionTypes = DropFile | UpdateAddTags | SaveNewFile | CancelAddFile | UpdateFilesAndTags;
//#endregion

//#region Edit files or tags
export const EDIT_TAG = 'EDIT_TAG';
export const EDIT_TAG_CANCEL = 'EDIT_TAG_CANCEL';
export const EDIT_FILE = 'EDIT_FILE';
export const EDIT_FILE_CANCEL = 'EDIT_FILE_CANCEL';

interface EditTag {
  type: typeof EDIT_TAG;
  tag: Tag;
}

interface EditTagCancel {
  type: typeof EDIT_TAG_CANCEL;
}

interface EditFile {
  type: typeof EDIT_FILE;
  file: File;
}

interface EditFileCancel {
  type: typeof EDIT_FILE_CANCEL;
}

type EditActionTypes = EditTag | EditTagCancel | EditFile | EditFileCancel;
//#endregion

//#region File tree management
export const SELECT_FILE = 'SELECT_FILE';
export const TOGGLE_FOLDER = 'TOGGLE_FOLDER';
export const DELETE_FILE = 'DELETE_FILE';
export const DELETE_TAG = 'DELETE_TAG';
export const UPDATE_SEARCH_TAGS = 'UPDATE_SEARCH_TAGS';

interface SelectFile {
  type: typeof SELECT_FILE;
  newState: RecursivePartial<RootState>;
}

interface DeleteFile {
  type: typeof DELETE_FILE;
}

interface DeleteTag {
  type: typeof DELETE_TAG;
}

interface UpdateSearchTags {
  type: typeof UPDATE_SEARCH_TAGS;
  searchTags: Tag[];
  searchFiles: ITreeNodeFile[];
}

type FileTreeActionTypes = SelectFile | DeleteFile | DeleteTag | UpdateSearchTags;
//#endregion

export type ActionTypes = PreferencesActionTypes | UIStateActionTypes | NewFilesActionTypes | EditActionTypes | FileTreeActionTypes;
