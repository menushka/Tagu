import { DROP_FILE, SAVE_NEW_FILE, CANCEL_ADD_FILE, REMOVE_FILE, ActionTypes, SELECT_FILE, UPDATE_SEARCH_TAGS } from '../store/types';
import { Tag } from '../data/tag';
import { Image } from '../data/image';

//#region Adding new files
export function onDropFile(path: string): ActionTypes {
  return {
    type: DROP_FILE,
    path: path,
  };
}

export function saveNewFile(path: string, tags: Tag[]): ActionTypes {
  return {
    type: SAVE_NEW_FILE,
    path: path,
    tags: tags,
  };
}

export function cancelNewFile(): ActionTypes {
  return {
    type: CANCEL_ADD_FILE,
  };
}
//#endregion

//#region Editing existing files
export function removeFile(image: Image): ActionTypes {
  return {
    type: REMOVE_FILE,
    removeImage: image,
  };
}
//#endregion

//#region File tree management
export function selectFile(column: 'search' | 'tag', file: Image | null): ActionTypes {
  return {
    type: SELECT_FILE,
    column: column,
    file: file,
  };
}

export function updateSearchTags(tags: Tag[]): ActionTypes {
  return {
    type: UPDATE_SEARCH_TAGS,
    searchTags: tags,
  };
}
//#endregion
