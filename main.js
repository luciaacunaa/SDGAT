const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  const clientas = require('./db');
  const etiquetas = require('./etiquetas');

  ipcMain.handle('clientas:crear', (_e, data) => {
    const obligatorios = ['nombre', 'apellido', 'dni', 'telefono', 'calle', 'numero', 'localidad', 'provincia', 'codigoPostal'];
    for (const c of obligatorios) {
      if (!data[c] || !String(data[c]).trim()) throw new Error(`Falta ${c}`);
    }
    return clientas.crear({ ...data, piso: data.piso || '' }).lastInsertRowid;
  });

  ipcMain.handle('clientas:listar', () => clientas.listar());
  ipcMain.handle('etiquetas:empresas', () => etiquetas.EMPRESAS);

  ipcMain.handle('etiquetas:generar', async (_e, clientaId, empresa) => {
    const clienta = clientas.obtener(clientaId);
    if (!clienta) throw new Error('La clienta no existe');

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Guardar etiqueta',
      defaultPath: `etiqueta-${clienta.apellido}-${empresa}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    if (canceled) return null;

    await etiquetas.generar(clienta, empresa, filePath);
    return filePath;
  });

  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  win.loadFile('renderer/index.html');
});

app.on('window-all-closed', () => app.quit());