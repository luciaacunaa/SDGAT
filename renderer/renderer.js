const form = document.getElementById('form');
const lista = document.getElementById('lista');
const error = document.getElementById('error');

document.getElementById('btn-nueva').onclick = () => (form.hidden = false);

async function cargar() {
  const clientas = await window.api.listarClientas();
  lista.innerHTML = clientas.length
    ? clientas.map((c) => `<li>${c.nombre} ${c.apellido} - ${c.dni}</li>`).join('')
    : '<li>Todavía no hay clientas</li>';

  document.getElementById('sel-clienta').innerHTML = clientas
    .map((c) => `<option value="${c.id}">${c.apellido}, ${c.nombre}</option>`)
    .join('');
}

async function cargarEmpresas() {
  const empresas = await window.api.listarEmpresas();
  document.getElementById('sel-empresa').innerHTML = empresas
    .map((e) => `<option>${e}</option>`)
    .join('');
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  const vacios = Object.entries(data).filter(([k, v]) => k !== 'piso' && !v.trim());
  if (vacios.length) {
    error.textContent = 'Completá todos los campos obligatorios';
    return;
  }

  error.textContent = '';
  try {
    await window.api.crearClienta(data);
    form.reset();
    form.hidden = true;
    cargar();
  } catch (err) {
    error.textContent = 'No se pudo guardar: ' + err.message;
  }
};

document.getElementById('btn-etiqueta').onclick = async () => {
  const msg = document.getElementById('msg-etiqueta');
  const id = document.getElementById('sel-clienta').value;
  const empresa = document.getElementById('sel-empresa').value;
  if (!id) {
    msg.textContent = 'Primero cargá una clienta';
    return;
  }
  try {
    const ruta = await window.api.generarEtiqueta(Number(id), empresa);
    msg.textContent = ruta ? `Etiqueta guardada en: ${ruta}` : 'Cancelado';
  } catch (err) {
    msg.textContent = 'Error: ' + err.message;
  }
};

cargar();
cargarEmpresas();