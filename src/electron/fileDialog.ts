import { ipcMain, ipcRenderer, dialog, BrowserWindow } from 'electron';

const ELECTRON_FILE_DIALOG_EVENT = 'ELECTRON_FILE_DIALOG_EVENT';
type ShowDialogReturnType = string[] | undefined;

export function setupElectronFileDialogListeners(win: BrowserWindow) {
  ipcMain.on(ELECTRON_FILE_DIALOG_EVENT, (_event) => {
    const result = dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
    });
    win.webContents.send(ELECTRON_FILE_DIALOG_EVENT, result);
  });
}

export function showOpenDialog(): Promise<ShowDialogReturnType> {
  return new Promise((resolve) => {
      ipcRenderer.once(ELECTRON_FILE_DIALOG_EVENT, (_event, data: ShowDialogReturnType) => {
        resolve(data);
      });
      ipcRenderer.send(ELECTRON_FILE_DIALOG_EVENT);
  });
}
