const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  crearClienta: (d) => ipcRenderer.invoke('clientas:crear', d),
  listarClientas: () => ipcRenderer.invoke('clientas:listar'),
  listarEmpresas: () => ipcRenderer.invoke('etiquetas:empresas'),
  generarEtiqueta: (id, empresa) => ipcRenderer.invoke('etiquetas:generar', id, empresa),
});