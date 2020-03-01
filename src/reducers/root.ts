import { DROP_FILE, SAVE_NEW_FILE, CANCEL_ADD_FILE, REMOVE_FILE, ActionTypes } from '../store/types';
import { initialState, RootState } from '../store/store';
import { ImagesModel } from '../models/imagesModel';

function override(state: RootState, override: Partial<RootState>): RootState {
  return Object.assign({}, state, override);
}

export default function rootReducer(
  state = initialState,
  action: ActionTypes,
): RootState {
  switch (action.type) {
    case DROP_FILE:
      return override(state, { droppedFile: action.path });
    case SAVE_NEW_FILE:
      ImagesModel.instance.addImage(action.path, action.tags);
      return override(state, { droppedFile: null });
    case CANCEL_ADD_FILE:
      return override(state, { droppedFile: null });
    case REMOVE_FILE:
      return state;
    default:
      return state;
  }
}
