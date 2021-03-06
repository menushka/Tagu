import { ipcMain, ipcRenderer, dialog, BrowserWindow } from 'electron';

const ELECTRON_FILE_DIALOG_EVENT = 'ELECTRON_FILE_DIALOG_EVENT';

interface ShowDialogOptions {
  title?: string;
  message?: string;
  buttonLabel?: string;
}

export function setupElectronFileDialogListeners(win: BrowserWindow) {
  ipcMain.on(ELECTRON_FILE_DIALOG_EVENT, async (_event: any, data: ShowDialogOptions) => {
    const result = await dialog.showOpenDialog(win, {
      title: data.title,
      message: data.message,
      buttonLabel: data.buttonLabel,
      properties: ['openDirectory', 'createDirectory'],
    });
    win.webContents.send(ELECTRON_FILE_DIALOG_EVENT, result);
  });
}

export function showOpenDialog(title?: string, message?: string, buttonLabel?: string): Promise<Electron.OpenDialogReturnValue> {
  return new Promise((resolve) => {
      ipcRenderer.once(ELECTRON_FILE_DIALOG_EVENT, (_event: any, data: Electron.OpenDialogReturnValue) => {
        resolve(data);
      });
      ipcRenderer.send(ELECTRON_FILE_DIALOG_EVENT, { title, message, buttonLabel } as ShowDialogOptions);
  });
}
