import { ADD_FILE, REMOVE_FILE, ActionTypes, CANCEL_ADD_FILE } from '../store/types';

export function addFile(path: string): ActionTypes {
  return {
    type: ADD_FILE,
    payload: path
  };
}

export function cancelAddFile(): ActionTypes {
  return {
    type: CANCEL_ADD_FILE
  };
}

export function removeFile(): ActionTypes {
  return {
    type: REMOVE_FILE,
    payload: ''
  };
}
