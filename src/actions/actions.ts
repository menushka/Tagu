import { ActionTypes, SearchOrTag, DROP_FILE, SAVE_NEW_FILE, CANCEL_ADD_FILE, REMOVE_FILE, SELECT_FILE, UPDATE_SEARCH_TAGS, TOGGLE_FOLDER } from '../store/types';
import { Tag } from '../data/tag';

//#region Adding new files
export const onDropFile = (path: string): ActionTypes => ({
  type: DROP_FILE,
  path,
});

export const saveNewFile = (path: string, tags: Tag[]): ActionTypes => ({
  type: SAVE_NEW_FILE,
  path,
  tags,
});

export const cancelNewFile = (): ActionTypes => ({
  type: CANCEL_ADD_FILE,
});
//#endregion

//#region Editing existing files
export const removeFile = (node: number[]): ActionTypes => ({
  type: REMOVE_FILE,
  node,
});
//#endregion

//#region File tree management
export const selectFile = (column: SearchOrTag, node: number[]): ActionTypes => ({
  type: SELECT_FILE,
  column,
  node,
});

export const toggleFolder = (column: SearchOrTag, node: number[]): ActionTypes => ({
  type: TOGGLE_FOLDER,
  column,
  node,
});

export const updateSearchTags = (searchTags: Tag[]): ActionTypes => ({
  type: UPDATE_SEARCH_TAGS,
  searchTags,
});
//#endregion
