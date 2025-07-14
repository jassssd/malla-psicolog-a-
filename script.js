<script>
function aprobar(boton, siguientes = []) {
  const id = boton.id;
  boton.classList.add('aprobado');
  boton.disabled = true;

  if (!Array.isArray(siguientes)) {
    siguientes = [siguientes];
  }

  siguientes.forEach(id => {
    const sig = document.getElementById(id);
    if (sig && sig.classList.contains('bloqueado')) {
      sig.classList.remove('bloqueado');
      sig.disabled = false;
    }
  });

  // Guardar en localStorage
  guardarProgreso();
  actualizarContador();
}

function actualizarContador() {
  const total = document.querySelectorAll('.ramo').length;
  const aprobados = document.querySelectorAll('.ramo.aprobado').length;
  document.getElementById('contador').textContent = `${aprobados}/${total}`;
}

function guardarProgreso() {
  const aprobados = Array.from(document.querySelectorAll('.ramo.aprobado')).map(b => b.id);
  localStorage.setItem('ramos_aprobados', JSON.stringify(aprobados));
}

function cargarProgreso() {
  const data = localStorage.getItem('ramos_aprobados');
  if (!data) return;

  const aprobados = JSON.parse(data);
  aprobados.forEach(id => {
    const boton = document.getElementById(id);
    if (boton) {
      boton.classList.add('aprobado');
      boton.disabled = true;
    }
  });
}

function reiniciarMalla() {
  const botones = document.querySelectorAll('.ramo');
  botones.forEach(boton => {
    boton.c
