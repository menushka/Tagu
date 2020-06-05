import { ipcRenderer, BrowserWindow } from 'electron';
import { Dispatch } from 'react';
import { ActionTypes } from './types';

const ELECTRON_EVENT = 'ELECTRON_EVENT';

export function listener(dispatch: Dispatch<ActionTypes>) {
  ipcRenderer.on(ELECTRON_EVENT, (_event, data: ActionTypes) => {
    dispatch(data);
  });
}

export function sender(win: BrowserWindow, action: ActionTypes) {
  win.webContents.send(ELECTRON_EVENT, action);
}
