const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('colorMode', {
    switch: (value) => ipcRenderer.invoke('color-mode:switch', value),
});
