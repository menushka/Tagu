import { cloneDeep, merge } from 'lodash';
import {
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
} from '../store/types';
import { initialState, RootState } from '../store/store';

export default function rootReducer(
  state = initialState,
  action: ActionTypes,
): RootState {
  switch (action.type) {
    case READ_PREFERENCES_FILE:
      return { ...state, preferences: { ...state.preferences, ...action.preferences } };
    case DROP_FILE:
      return { ...state, new: { ...state.new, droppedFile: action.path } };
    case UPDATE_ADD_TAGS:
      return { ...state, new: { ...state.new, selectedTags: action.addTags } };
    case SAVE_NEW_FILE:
      return { ...state, new: { ...state.new, droppedFile: null } };
    case CANCEL_ADD_FILE:
      return { ...state, new: { ...state.new, droppedFile: null } };
    case UPDATE_IMAGES_AND_TAGS:
      return cloneDeep(merge(state, action.newState));
    case SWITCH_COLUMN:
      return { ...state, leftColumnId: action.id };
    case OPEN_PREFERENCES:
      return { ...state, preferences: { ...state.preferences, open: true } };
    case CLOSE_PREFERENCES:
      return { ...state, preferences: { ...state.preferences, open: false } };
    case SELECT_FILE:
      return cloneDeep(merge(state, action.newState));
    case UPDATE_SEARCH_TAGS:
      return { ...state, search: { ...state.search,
        selectedTags: action.searchTags,
        files: action.searchFiles,
      } };
    default:
      return state;
  }
}
