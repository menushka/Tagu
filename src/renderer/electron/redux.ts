import { ipcRenderer, BrowserWindow } from 'electron';
import { Dispatch } from 'react';
import { ActionTypes } from '../store/types';

const ELECTRON_EVENT = 'ELECTRON_EVENT';

export function setupElectronReduxListeners(dispatch: Dispatch<ActionTypes>) {
  ipcRenderer.on(ELECTRON_EVENT, (_event: any, data: ActionTypes) => {
    dispatch(data);
  });
}

export function dispatchFromElectron(win: BrowserWindow, action: ActionTypes) {
  win.webContents.send(ELECTRON_EVENT, action);
}
