import { createStore, applyMiddleware, compose } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import rootReducer from '../reducers/root';

import { ITreeNodeFile } from '../components/FileTree';
import { Tag } from '../data/tag';
import { Image } from '../data/image';

import { SearchOrTag, ActionTypes } from './types';
import { setupElectronReduxListeners } from '../electron/redux';
import { IPreferences } from '../persistent/preferences';

export interface RootState {
  allTags: Tag[];
  leftColumnId: SearchOrTag;
  preferences: {
    open: boolean,
  } & IPreferences;
  search: {
    files: ITreeNodeFile[];
    selectedTags: Tag[];
    selectedFile: Image | null;
  };
  tag: {
    files: ITreeNodeFile[];
    selectedFile: Image | null;
  };
  editTag: {
    tag: Tag | null;
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
  allTags: [],
  leftColumnId: 'search',
  preferences: {
    open: false,
    dataPath: '',
  },
  search: {
    files: [],
    selectedTags: [],
    selectedFile: null,
  },
  tag: {
    files: [],
    selectedFile: null,
  },
  editTag: {
    tag: null,
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

setupElectronReduxListeners(store.dispatch);

export default store;
