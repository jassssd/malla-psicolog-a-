window.onload = function() {
  const botones = document.querySelectorAll('.ramo');
  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      if (boton.disabled) return;

      aprobar(boton);
    });
  });

  document.getElementById('reset').addEventListener('click', reiniciarMalla);

  cargarProgreso();
  actualizarContador();
};

function aprobar(boton) {
  boton.classList.add('aprobado');
  boton.disabled = true;

  const siguientesData = boton.getAttribute('data-siguientes');
  if (siguientesData) {
    const siguientes = JSON.parse(siguientesData);
    siguientes.forEach(id => {
      const sig = document.getElementById(id);
      if (sig && sig.classList.contains('bloqueado')) {
        sig.classList.remove('bloqueado');
        sig.disabled = false;
      }
    });
  }

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

  aprobados.forEach(id => {
    const boton = document.getElementById(id);
    if (boton) {
      const siguientesData = boton.getAttribute('data-siguientes');
      if (siguientesData) {
        const siguientes = JSON.parse(siguientesData);
        siguientes.forEach(sigId => {
          const sigBoton = document.getElementById(sigId);
          if (sigBoton) {
            sigBoton.disabled = false;
            sigBoton.classList.remove('bloqueado');
          }
        });
      }
    }
  });

  actualizarContador();
}

function reiniciarMalla() {
  const botones = document.querySelectorAll('.ramo');
  botones.forEach(boton => {
    boton.classList.remove('aprobado');
    boton.disabled = boton.classList.contains('bloqueado');
  });
  localStorage.removeItem('ramos_aprobados');
  actualizarContador();
}
