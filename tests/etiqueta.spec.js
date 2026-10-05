const { test, expect, _electron: electron } = require('@playwright/test');
const os = require('os');
const path = require('path');
const fs = require('fs');

const empresas = ['Correo Argentino', 'Andreani', 'OCA'];

test('genera etiqueta PDF por cada empresa', async () => {
  const app = await electron.launch({
    args: ['.'],
    env: { ...process.env, DB_PATH: path.join(os.tmpdir(), `test-${Date.now()}.db`) },
  });
  const page = await app.firstWindow();

  // Cargar una clienta
  await page.click('#btn-nueva');
  const datos = {
    nombre: 'Ana', apellido: 'Pérez', dni: '30111222', telefono: '1155556666',
    calle: 'Av. Siempre Viva', numero: '742', localidad: 'Springfield',
    provincia: 'Buenos Aires', codigoPostal: '1000',
  };
  for (const [k, v] of Object.entries(datos)) await page.fill(`[name=${k}]`, v);
  await page.click('button[type=submit]');
  await expect(page.locator('#lista')).toContainText('Ana Pérez');

  for (const empresa of empresas) {
    const ruta = path.join(os.tmpdir(), `etiqueta-${empresa.replace(/ /g, '')}-${Date.now()}.pdf`);

    // Simula el diálogo de "guardar como"
    await app.evaluate(({ dialog }, r) => {
      dialog.showSaveDialog = async () => ({ canceled: false, filePath: r });
    }, ruta);

    await page.selectOption('#sel-empresa', empresa);
    await page.click('#btn-etiqueta');
    await expect(page.locator('#msg-etiqueta')).toContainText('Etiqueta guardada');

    expect(fs.existsSync(ruta)).toBe(true);
    expect(fs.readFileSync(ruta).subarray(0, 4).toString()).toBe('%PDF');
  }

  await app.close();
});