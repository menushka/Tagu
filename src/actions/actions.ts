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
  UPDATE_ADD_TAGS,
  DELETE_TAG,
} from '../store/types';
import { Tag } from '../data/tag';
import { Image } from '../data/image';
import { ImagesModel } from '../models/imagesModel';

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

export const updateAddTags = (addTags: Tag[]): ActionTypes => ({
  type: UPDATE_ADD_TAGS,
  addTags,
});

export const saveNewFile = (path: string, tags: Tag[]): ActionTypes => {
  ImagesModel.instance.addImage(path, tags);
  return {
    type: SAVE_NEW_FILE,
    path,
    tags,
  };
};

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

export const deleteFile = (file: Image): ActionTypes => ({
  type: DELETE_FILE,
  file,
});

export const deleteTag = (tag: Tag): ActionTypes => ({
  type: DELETE_TAG,
  tag,
});

export const updateSearchTags = (searchTags: Tag[]): ActionTypes => ({
  type: UPDATE_SEARCH_TAGS,
  searchTags,
});
//#endregion
