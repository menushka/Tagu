import { app, BrowserWindow } from 'electron';
import { sender } from './store/electronListener';
import { openPreferences } from './actions/actions';

export function template(win: BrowserWindow): Electron.MenuItemConstructorOptions[] {
  return ([
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        {
          label: 'Preferences',
          click: () => sender(win, openPreferences()),
        },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ]);
}
