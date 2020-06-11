import { createStore, applyMiddleware, compose } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import rootReducer from '../reducers/root';

import { ITreeNodeFile } from '../components/FileTree';
import { Tag } from '../data/tag';
import { Image } from '../data/image';
import { FileTreeHelper } from '../helpers/fileTreeHelper';

import { TagsModel } from '../models/tagsModel';
import { SearchOrTag, ActionTypes } from './types';
import { listener } from './electronListener';

export interface RootState {
  allTags: Tag[];
  leftColumnId: SearchOrTag;
  preferences: {
    open: boolean,
    dataPath: string,
  };
  search: {
    files: ITreeNodeFile[];
    selectedTags: Tag[];
    selectedFile: Image | null;
  };
  tag: {
    files: ITreeNodeFile[];
    selectedFile: Image | null;
  };
  new: {
    droppedFile: string | null;
    selectedTags: Tag[];
  };
}

export type AppDispatch = ThunkDispatch<
  RootState,
  void,
  ActionTypes
>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  ActionTypes
>;

export const initialState: RootState = {
  allTags: TagsModel.instance.getTags(),
  leftColumnId: 'search',
  preferences: {
    open: false,
    dataPath: '',
  },
  search: {
    files: FileTreeHelper.getFilteredFiles(),
    selectedTags: [],
    selectedFile: null,
  },
  tag: {
    files: FileTreeHelper.getFilesByTag(),
    selectedFile: null,
  },
  new: {
    droppedFile: null,
    selectedTags: [],
  },
};

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

listener(store.dispatch);

export default store;
