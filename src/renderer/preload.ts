import { contextBridge, ipcRenderer } from 'electron';
import { ElectronHandler } from '../main/preload';
import { Hotkey } from './App';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
  }

  interface HotkeysStorage extends Array<Hotkey>{}
}


export {};
