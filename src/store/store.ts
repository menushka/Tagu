import { createStore, compose } from 'redux';
import rootReducer from '../reducers/root';

import { Image } from '../data/image';

export interface RootState {
  files: string[];
  selectedFile: Image | null;
  droppedFile: string | null;
}

export const initialState: RootState = {
  files: [],
  selectedFile: null,
  droppedFile: null
};

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers());
export default store;
