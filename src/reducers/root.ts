import { ActionTypes, DROP_FILE, SAVE_NEW_FILE, CANCEL_ADD_FILE, SELECT_FILE, SWITCH_COLUMN, DELETE_FILE } from '../store/types';
import { initialState, RootState } from '../store/store';
import { ImagesModel } from '../models/imagesModel';
import { FileTreeHelper } from '../helpers/fileTreeHelper';

export default function rootReducer(
  state = initialState,
  action: ActionTypes,
): RootState {
  switch (action.type) {
    case DROP_FILE:
      return { ...state, droppedFile: action.path };
    case SAVE_NEW_FILE:
      ImagesModel.instance.addImage(action.path, action.tags);
      return { ...state, droppedFile: null };
    case CANCEL_ADD_FILE:
      return { ...state, droppedFile: null };
    case SWITCH_COLUMN:
      return { ...state, leftColumnId: action.id };
    case SELECT_FILE:
      let files;
      let selectedFile;
      switch (action.column) {
        case 'search':
          files = state.search.files.map((arr) => { return {...arr}; });
          selectedFile = FileTreeHelper.selectAtPath(files, action.node);
          selectedFile = selectedFile ? selectedFile : state.search.selectedFile; // Fallback if not file
          return { ...state, search: { ...state.search, files, selectedFile } };
        case 'tag':
          files = state.tag.files.map((arr) => { return {...arr}; });
          selectedFile = FileTreeHelper.selectAtPath(files, action.node);
          selectedFile = selectedFile ? selectedFile : state.tag.selectedFile; // Fallback if not file
          return { ...state, tag: { ...state.tag, files, selectedFile } };
      }
    case DELETE_FILE:
      return state;
    default:
      return state;
  }
}
