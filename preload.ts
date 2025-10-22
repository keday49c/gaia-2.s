import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel: string, ...args: any[]) => {
      ipcRenderer.send(channel, ...args);
    },
    on: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    once: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    },
    invoke: (channel: string, ...args: any[]) => {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
  app: {
    getVersion: () => ipcRenderer.invoke("get-app-version"),
    getAppPath: () => ipcRenderer.invoke("get-app-path"),
    getUserDataPath: () => ipcRenderer.invoke("get-user-data-path"),
  },
  window: {
    minimize: () => ipcRenderer.invoke("minimize-window"),
    maximize: () => ipcRenderer.invoke("maximize-window"),
    close: () => ipcRenderer.invoke("close-window"),
  },
});

