/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { GlobalKeyboardListener } from 'node-global-key-listener';
import Store from 'electron-store';
import { Hotkey } from '../renderer/App';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

const store = new Store();

// IPC listener
ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

// const v = new GlobalKeyboardListener();

const ks = require('node-key-sender');

// v.addListener(function (e, down) {
//   console.log("Event listener setup complete");
//   if(e.state === "DOWN"){
//     // console.log(
//     //     `${e.name} ${e.state == "DOWN" ? "DOWN" : "UP  "} [${e.rawKey ? e.rawKey._nameRaw : ""}]`
//     // );
    
//     if(e.name){
//       var aux = store.get("hotkeys")
      
//       var rawStoredHotkeys = aux ? aux as string : "[]"

//       var storedHotkeys = JSON.parse(rawStoredHotkeys) as HotkeysStorage
//       if(storedHotkeys){
//         for(var i = 0; i < storedHotkeys.length; i++){
//           var hotkey = storedHotkeys[i]
//           if(hotkey.hotkey == e.name && hotkey.active){
//             try {
//               ks.sendText(hotkey.text);
//               console.log(`${e.name}: ${hotkey.text}`);
//             } catch (error) {
//               console.error('Error sending text:', error);
//             }
//             break
//           }
//         }
//       }
//       // console.log(store.get(e.name))
//     }

//     // mainWindow?.webContents.send("key-pressed", e) cd imssss
//   }
// });

function registerHotkey(hotkey: Hotkey) {
  if (hotkey.active) {
    globalShortcut.unregister(hotkey.hotkey);
    const registered = globalShortcut.register(hotkey.hotkey, () => {
      try {
        ks.sendText(hotkey.text);
        console.log(`${hotkey.hotkey}: ${hotkey.text}`);
      } catch (error) {
        console.error('Error sending text:', error);
      }
    });

    if (!registered) {
      console.log(`Failed to register shortcut: ${hotkey.hotkey}`);
    }
  }
}

// Register all hotkeys from the store
function registerGlobalShortcuts() {
  const aux = store.get("hotkeys");
  const rawStoredHotkeys = aux ? aux as string: "[]";
  const storedHotkeys = JSON.parse(rawStoredHotkeys) as HotkeysStorage;

  if (storedHotkeys && Array.isArray(storedHotkeys)) {
    storedHotkeys.forEach(hotkey => {
      registerHotkey(hotkey);
    });
  }
}

app.on('ready', () => {
  registerGlobalShortcuts();
  console.log("Global shortcuts registered");

  // Watch for changes in the store
  store.onDidChange('hotkeys', (newHotkeys: any, oldHotkeys: any) => {
    const newHotkeysParsed = JSON.parse(newHotkeys) as HotkeysStorage;
    const oldHotkeysParsed = JSON.parse(oldHotkeys) as HotkeysStorage;

    // Find added hotkeys
    newHotkeysParsed.forEach(newHotkey => {
      const isAdded = !oldHotkeysParsed.find(oldHotkey => JSON.stringify(oldHotkey) === JSON.stringify(newHotkey));
      if (isAdded) {
        registerHotkey(newHotkey);
      }
    });

    // Optionally, handle removed or updated hotkeys
    // oldHotkeysParsed.forEach(oldHotkey => {
    //   const isRemoved = !newHotkeysParsed.find(newHotkey => newHotkey.hotkey === oldHotkey.hotkey);
    //   if (isRemoved) {
    //     globalShortcut.unregister(oldHotkey.hotkey);
    //   }
    // });
  });
});

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});