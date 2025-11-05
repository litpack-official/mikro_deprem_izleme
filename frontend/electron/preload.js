const { contextBridge } = require('electron');

// Güvenli API bridge (gerekirse genişletilebilir)
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  version: process.versions.electron
});
