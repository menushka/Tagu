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
  EDIT_TAG,
  EDIT_TAG_CANCEL,
  EDIT_FILE,
  EDIT_FILE_CANCEL,
} from '../store/types';
import { Tag } from '../data/tag';
import { File } from '../data/file';
import { FilesModel } from '../models/filesModel';
import { AppThunk } from '../store/store';
import { TagsModel } from '../models/tagsModel';
import { FileTreeHelper } from '../helpers/fileTreeHelper';
import { dispatchUpdateFullUpdate } from './utils/actionUtils';

export { readPreferencesFile, writePreferencesFile } from './preferences/preferencesActionCreators';
export { closePreferences, openPreferences } from './preferences/preferencesActions';

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

export const updateAddTags = (addTags: Tag[]): AppThunk => async (dispatch) => {
  dispatch({
    type: UPDATE_ADD_TAGS,
    addTags,
  });
};

export const saveNewFile = (path: string, tags: Tag[]): AppThunk => async (dispatch, getState) => {
  FilesModel.instance.addFile(path, tags, getState().preferences.dataPath);
  dispatch({
    type: SAVE_NEW_FILE,
  });
  dispatchUpdateFullUpdate(dispatch, getState);
};

export const cancelNewFile = (): ActionTypes => ({
  type: CANCEL_ADD_FILE,
});
//#endregion

//#region Edit files or tags
export const openEditTag = (tag: Tag): AppThunk => async (dispatch) => {
  dispatch({
    type: EDIT_TAG,
    tag,
  });
};

export const closeEditTag = (): AppThunk => async (dispatch) => {
  dispatch({
    type: EDIT_TAG_CANCEL,
  });
};

export const updateEditTag = (tag: Tag, tagName: string): AppThunk => async (dispatch, getState) => {
  TagsModel.instance.updateTag(tag, tagName);
  dispatchUpdateFullUpdate(dispatch, getState);
};

export const openEditFile = (file: File): AppThunk => async (dispatch) => {
  dispatch({
    type: EDIT_FILE,
    file,
  });
};

export const closeEditFile = (): AppThunk => async (dispatch) => {
  dispatch({
    type: EDIT_FILE_CANCEL,
  });
};

export const updateEditFile = (file: File, tags: Tag[]): AppThunk => async (dispatch, getState) => {
  FilesModel.instance.updateFile(file, tags);
  dispatchUpdateFullUpdate(dispatch, getState);
};
//#endregion

//#region File tree management
export const selectFile = (column: SearchOrTag, node: number[]): AppThunk => async (dispatch, getState) => {
  let files;
  let selectedFile;
  switch (column) {
    case 'search':
      files = getState().search.files.map((arr) => { return {...arr}; });
      selectedFile = FileTreeHelper.selectAtPath(files, node);
      selectedFile = selectedFile ? selectedFile : getState().search.selectedFile; // Fallback if not file
      // return { ...state, search: { ...state.search, files, selectedFile } };
      dispatch({
        type: SELECT_FILE,
        newState: {
          search: { files, selectedFile },
        },
      });
      break;
    case 'tag':
      files = getState().tag.files.map((arr) => { return {...arr}; });
      selectedFile = FileTreeHelper.selectAtPath(files, node);
      selectedFile = selectedFile ? selectedFile : getState().tag.selectedFile; // Fallback if not file
      dispatch({
        type: SELECT_FILE,
        newState: {
          tag: { files, selectedFile },
        },
      });
      break;
  }
};

export const deleteFile = (file: File): AppThunk => async (dispatch, getState) => {
  FilesModel.instance.removeFile(file, getState().preferences.dataPath);
  dispatch({
    type: DELETE_FILE,
  });
  dispatchUpdateFullUpdate(dispatch, getState);
};

export const deleteTag = (tag: Tag): AppThunk => async (dispatch, getState) => {
  TagsModel.instance.removeTag(tag);
  dispatch({
    type: DELETE_TAG,
  });
  dispatchUpdateFullUpdate(dispatch, getState);
};

export const updateSearchTags = (searchTags: Tag[]): AppThunk => async (dispatch) => {
  const searchFiles = FileTreeHelper.getFilteredFiles(searchTags);
  dispatch({
    type: UPDATE_SEARCH_TAGS,
    searchTags,
    searchFiles,
  });
};
//#endregion
