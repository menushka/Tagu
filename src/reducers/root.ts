import { ActionTypes, DROP_FILE, SAVE_NEW_FILE, CANCEL_ADD_FILE, REMOVE_FILE, SELECT_FILE, TOGGLE_FOLDER } from '../store/types';
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
    case REMOVE_FILE:
      return state;
    case SELECT_FILE:
      let files;
      let selectedFile;
      switch (action.column) {
        case 'search':
          files = state.search.files.map((arr) => { return {...arr}; });
          selectedFile = FileTreeHelper.selectAtPath(files, action.node);
          return { ...state, search: { ...state.search, files, selectedFile } };
        case 'tag':
          files = state.tag.files.map((arr) => { return {...arr}; });
          selectedFile = FileTreeHelper.selectAtPath(files, action.node);
          return { ...state, tag: { ...state.tag, files, selectedFile } };
      }
    case TOGGLE_FOLDER:
      files = state.tag.files.map((arr) => { return {...arr}; });
      FileTreeHelper.toggleFolderAtPath(files, action.node);
      return { ...state, tag: { ...state.tag, files } };
    default:
      return state;
  }
}
