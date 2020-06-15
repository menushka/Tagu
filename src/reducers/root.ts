import { cloneDeep, isArray, mergeWith } from 'lodash';
import {
  RecursivePartial,
  ActionTypes,
  DROP_FILE,
  SAVE_NEW_FILE,
  CANCEL_ADD_FILE,
  SELECT_FILE,
  SWITCH_COLUMN,
  UPDATE_ADD_TAGS,
  UPDATE_SEARCH_TAGS,
  OPEN_PREFERENCES,
  CLOSE_PREFERENCES,
  READ_PREFERENCES_FILE,
  UPDATE_IMAGES_AND_TAGS,
  WRITE_PREFERENCES_FILE,
  EDIT_TAG,
  EDIT_TAG_CANCEL,
  EDIT_FILE,
  EDIT_FILE_CANCEL,
} from '../store/types';
import { initialState, RootState } from '../store/store';

function mergeState(state: RootState, newState: RecursivePartial<RootState>) {
  return cloneDeep(mergeWith(state, newState, (objValue: any, srcValue: any) => {
    if (isArray(objValue)) {
      return srcValue;
    } else {
      return undefined;
    }
  }));
}

export default function rootReducer(
  state = initialState,
  action: ActionTypes,
): RootState {
  switch (action.type) {
    case READ_PREFERENCES_FILE:
      return mergeState(state, { preferences: action.preferences });
    case WRITE_PREFERENCES_FILE:
      return mergeState(state, { preferences: action.preferences });
    case DROP_FILE:
      return { ...state, new: { ...state.new, droppedFile: action.path } };
    case UPDATE_ADD_TAGS:
      return { ...state, new: { ...state.new, selectedTags: action.addTags } };
    case SAVE_NEW_FILE:
      return { ...state, new: { ...state.new, droppedFile: null } };
    case CANCEL_ADD_FILE:
      return { ...state, new: { ...state.new, droppedFile: null } };
    case EDIT_FILE:
      return { ...state, editFile: { ...state.editFile, file: action.file } };
    case EDIT_FILE_CANCEL:
      return { ...state, editFile: { ...state.editFile, file: null } };
    case EDIT_TAG:
      return { ...state, editTag: { ...state.editTag, tag: action.tag } };
    case EDIT_TAG_CANCEL:
      return { ...state, editTag: { ...state.editTag, tag: null } };
    case UPDATE_IMAGES_AND_TAGS:
      return mergeState(state, action.newState);
    case SWITCH_COLUMN:
      return { ...state, leftColumnId: action.id };
    case OPEN_PREFERENCES:
      return { ...state, preferences: { ...state.preferences, open: true } };
    case CLOSE_PREFERENCES:
      return { ...state, preferences: { ...state.preferences, open: false } };
    case SELECT_FILE:
      return mergeState(state, action.newState);
    case UPDATE_SEARCH_TAGS:
      return { ...state, search: { ...state.search,
        selectedTags: action.searchTags,
        files: action.searchFiles,
      } };
    default:
      return state;
  }
}
