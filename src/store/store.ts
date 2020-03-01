import { createStore, compose } from 'redux';
import rootReducer from '../reducers/root';

import { ITreeNodeFile } from '../components/FileTree';
import { Tag } from '../data/tag';
import { Image } from '../data/image';
import { FileTreeHelper } from '../helpers/fileTreeHelper';

import { ImagesModel } from '../models/imagesModel';
import { TagsModel } from '../models/tagsModel';
import { SearchOrTag } from './types';

ImagesModel.instance.initalize();
TagsModel.instance.initalize();

export interface RootState {
  allTags: Tag[];
  leftColumnId: SearchOrTag;
  search: {
    files: ITreeNodeFile[];
    selectedTags: Tag[];
    selectedFile: Image | null;
  };
  tag: {
    files: ITreeNodeFile[];
    selectedFile: Image | null;
  };
  droppedFile: string | null;
}

export const initialState: RootState = {
  allTags: TagsModel.instance.getTags(),
  leftColumnId: 'search',
  search: {
    files: FileTreeHelper.getFilteredFiles(),
    selectedTags: [],
    selectedFile: null,
  },
  tag: {
    files: FileTreeHelper.getFilesByTag(),
    selectedFile: null,
  },
  droppedFile: null,
};

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers());
export default store;
