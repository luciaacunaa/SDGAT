const form = document.getElementById('form');
const lista = document.getElementById('lista');
const error = document.getElementById('error');

document.getElementById('btn-nueva').onclick = () => (form.hidden = false);

async function cargar() {
  const clientas = await window.api.listarClientas();
  lista.innerHTML = clientas.length
    ? clientas.map((c) => `<li>${c.nombre} ${c.apellido} - ${c.dni}</li>`).join('')
    : '<li>Todavía no hay clientas</li>';
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

cargar();