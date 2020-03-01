import { ADD_FILE, REMOVE_FILE, ActionTypes, CANCEL_ADD_FILE } from '../store/types';
import { initialState, RootState } from '../store/store';

export default function rootReducer(
  state = initialState,
  action: ActionTypes
): RootState {
  switch (action.type) {
    case ADD_FILE:
      return {
        files: state.files,
        selectedFile: state.selectedFile,
        droppedFile: action.payload
      };
    case CANCEL_ADD_FILE:
      return {
        files: state.files,
        selectedFile: state.selectedFile,
        droppedFile: null
      };
    case REMOVE_FILE:
      return state;
    default:
      return state;
  }
}
