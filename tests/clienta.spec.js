const { test, expect, _electron: electron } = require('@playwright/test');
const os = require('os');
const path = require('path');

test('alta de clienta', async () => {
  const app = await electron.launch({
    args: ['.'],
    env: { ...process.env, DB_PATH: path.join(os.tmpdir(), `test-${Date.now()}.db`) },
  });
  const page = await app.firstWindow();

  await page.click('#btn-nueva');
  await page.fill('[name=nombre]', 'Ana');
  await page.fill('[name=apellido]', 'Pérez');
  await page.fill('[name=dni]', '30111222');
  await page.fill('[name=telefono]', '1155556666');
  await page.fill('[name=calle]', 'Av. Siempre Viva');
  await page.fill('[name=numero]', '742');
  await page.fill('[name=localidad]', 'Springfield');
  await page.fill('[name=provincia]', 'Buenos Aires');
  await page.fill('[name=codigoPostal]', '1000');
  await page.click('button[type=submit]');

  await expect(page.locator('#lista')).toContainText('Ana Pérez');
  await app.close();
});