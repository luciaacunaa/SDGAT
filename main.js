const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  const clientas = require('./db');

  ipcMain.handle('clientas:crear', (_e, data) => {
    const obligatorios = ['nombre', 'apellido', 'dni', 'telefono', 'calle', 'numero', 'localidad', 'provincia', 'codigoPostal'];
    for (const c of obligatorios) {
      if (!data[c] || !String(data[c]).trim()) throw new Error(`Falta ${c}`);
    }
    return clientas.crear({ ...data, piso: data.piso || '' }).lastInsertRowid;
  });

  ipcMain.handle('clientas:listar', () => clientas.listar());

  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  win.loadFile('renderer/index.html');
});

app.on('window-all-closed', () => app.quit());