export const ADD_FILE = 'ADD_FILE';
export const CANCEL_ADD_FILE = 'CANCEL_ADD_FILE';
export const REMOVE_FILE = 'REMOVE_FILE';

interface AddFile {
  type: typeof ADD_FILE;
  payload: string;
}

interface CancelAddFile {
  type: typeof CANCEL_ADD_FILE;
}

interface RemoveFile {
  type: typeof REMOVE_FILE;
  payload: string;
}

export type ActionTypes = AddFile | CancelAddFile | RemoveFile;
