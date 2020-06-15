import { ThunkDispatch } from 'redux-thunk';
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
  OPEN_PREFERENCES,
  CLOSE_PREFERENCES,
  READ_PREFERENCES_FILE,
  WRITE_PREFERENCES_FILE,
  UPDATE_IMAGES_AND_TAGS,
  EDIT_TAG,
  EDIT_TAG_CANCEL,
  EDIT_FILE,
  EDIT_FILE_CANCEL,
} from '../store/types';
import { Tag } from '../data/tag';
import { Image } from '../data/image';
import { IPreferences, Preferences } from '../persistent/preferences';
import { ImagesModel } from '../models/imagesModel';
import { AppThunk, RootState } from '../store/store';
import { TagsModel } from '../models/tagsModel';
import { FileTreeHelper } from '../helpers/fileTreeHelper';
import { Database } from '../db/database';

function dispatchUpdateFullUpdate(dispatch: ThunkDispatch<RootState, unknown, ActionTypes>, getState: () => RootState) {
  const allTags = TagsModel.instance.getTags();
  const searchFiles = FileTreeHelper.getFilteredFiles(getState().search.selectedTags);
  const tagFiles = FileTreeHelper.getFilesByTag();
  dispatch({
    type: UPDATE_IMAGES_AND_TAGS,
    newState: {
      allTags,
      search: {
        files: searchFiles,
      },
      tag: {
        files: tagFiles,
      },
    },
  });
}

//#region Preferences IO handling
export const readPreferencesFile = (): AppThunk => async (dispatch, getState) => {
  const preferences = Preferences.read();
  Database.instance.init(preferences.dataPath);
  dispatch({
    type: READ_PREFERENCES_FILE,
    preferences,
  });
  dispatchUpdateFullUpdate(dispatch, getState);
};

export const writePreferencesFile = (preferences: IPreferences): AppThunk => async (dispatch, getState) => {
  Preferences.write(preferences);
  Database.instance.switch(preferences.dataPath);
  dispatch({
    type: WRITE_PREFERENCES_FILE,
    preferences,
  });
  dispatchUpdateFullUpdate(dispatch, getState);
};
//#endregion

//#region UI State handling
export const switchColumn = (id: SearchOrTag): ActionTypes => ({
  type: SWITCH_COLUMN,
  id,
});

export const openPreferences = (): ActionTypes => ({
  type: OPEN_PREFERENCES,
});

export const closePreferences = (): ActionTypes => ({
  type: CLOSE_PREFERENCES,
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
  ImagesModel.instance.addImage(path, tags, getState().preferences.dataPath);
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

export const openEditFile = (file: Image): AppThunk => async (dispatch) => {
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

export const updateEditFile = (file: Image, tags: Tag[]): AppThunk => async (dispatch, getState) => {
  ImagesModel.instance.updateImage(file, tags);
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

export const deleteFile = (file: Image): AppThunk => async (dispatch, getState) => {
  ImagesModel.instance.removeImage(file, getState().preferences.dataPath);
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
