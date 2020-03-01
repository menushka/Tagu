import {
  ActionTypes,
  SearchOrTag,
  DROP_FILE,
  SAVE_NEW_FILE,
  CANCEL_ADD_FILE,
  DELETE_FILE,
  SELECT_FILE,
  UPDATE_SEARCH_TAGS,
  SWITCH_COLUMN,
} from '../store/types';
import { Tag } from '../data/tag';

//#region UI State handling
export const switchColumn = (id: SearchOrTag): ActionTypes => ({
  type: SWITCH_COLUMN,
  id,
});
//#endregion

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

//#region File tree management
export const selectFile = (column: SearchOrTag, node: number[]): ActionTypes => ({
  type: SELECT_FILE,
  column,
  node,
});

export const deleteFile = (column: SearchOrTag, id: string): ActionTypes => ({
  type: DELETE_FILE,
  column,
  id,
});

export const updateSearchTags = (searchTags: Tag[]): ActionTypes => ({
  type: UPDATE_SEARCH_TAGS,
  searchTags,
});
//#endregion
