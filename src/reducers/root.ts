import {
  ActionTypes,
  DROP_FILE,
  SAVE_NEW_FILE,
  CANCEL_ADD_FILE,
  SELECT_FILE,
  SWITCH_COLUMN,
  DELETE_FILE,
  UPDATE_ADD_TAGS,
  UPDATE_SEARCH_TAGS,
  DELETE_TAG,
} from '../store/types';
import { initialState, RootState } from '../store/store';
import { ImagesModel } from '../models/imagesModel';
import { FileTreeHelper } from '../helpers/fileTreeHelper';
import { TagsModel } from '../models/tagsModel';

export default function rootReducer(
  state = initialState,
  action: ActionTypes,
): RootState {
  switch (action.type) {
    case DROP_FILE:
      return { ...state, new: { ...state.new, droppedFile: action.path } };
    case UPDATE_ADD_TAGS:
      return { ...state, new: { ...state.new, selectedTags: action.addTags } };
    case SAVE_NEW_FILE:
      ImagesModel.instance.addImage(action.path, action.tags);
      return { ...state,
        allTags: TagsModel.instance.getTags(),
        search: { ...state.search, files: FileTreeHelper.getFilteredFiles(state.search.selectedTags) },
        tag: { ...state.tag, files: FileTreeHelper.getFilesByTag() },
        new: { ...state.new, droppedFile: null },
      };
    case CANCEL_ADD_FILE:
      return { ...state, new: { ...state.new, droppedFile: null } };
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
      ImagesModel.instance.removeImage(action.file);
      return { ...state,
        allTags: TagsModel.instance.getTags(),
        search: { ...state.search, files: FileTreeHelper.getFilteredFiles(state.search.selectedTags) },
        tag: { ...state.tag, files: FileTreeHelper.getFilesByTag() },
        new: { ...state.new, droppedFile: null },
      };
    case DELETE_TAG:
      TagsModel.instance.removeTag(action.tag);
      return { ...state,
        allTags: TagsModel.instance.getTags(),
        search: { ...state.search, files: FileTreeHelper.getFilteredFiles(state.search.selectedTags) },
        tag: { ...state.tag, files: FileTreeHelper.getFilesByTag() },
        new: { ...state.new, droppedFile: null },
      };
    case UPDATE_SEARCH_TAGS:
      return { ...state, search: { ...state.search,
        selectedTags: action.searchTags,
        files: FileTreeHelper.getFilteredFiles(action.searchTags),
      } };
    default:
      return state;
  }
}
