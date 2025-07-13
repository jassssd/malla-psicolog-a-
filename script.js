function aprobar(boton, siguientes) {
  if (boton.classList.contains('aprobado')) return;

  boton.classList.add('aprobado');
  boton.disabled = true;

  guardarEstado(boton.id);

  if (siguientes && siguientes.length > 0) {
    siguientes.forEach(id => {
      const sig = document.getElementById(id);
      if (sig && !sig.classList.contains('aprobado')) {
        sig.disabled = false;
        sig.classList.remove('bloqueado');
      }
    });
  }

  actualizarContador();
}

function guardarEstado(id) {
  let aprobados = JSON.parse(localStorage.getItem('aprobados')) || [];
  if (!aprobados.includes(id)) {
    aprobados.push(id);
    localStorage.setItem('aprobados', JSON.stringify(aprobados));
  }
}

function cargarEstado() {
  const aprobados = JSON.parse(localStorage.getItem('aprobados')) || [];
  aprobados.forEach(id => {
    const ramo = document.getElementById(id);
    if (ramo) {
      ramo.classList.add('aprobado');
      ramo.disabled = true;
    }
  });

  // Desbloqueo simple de los no aprobados
  document.querySelectorAll('.ramo').forEach(btn => {
    if (!btn.classList.contains('aprobado') && !btn.classList.contains('bloqueado')) {
      btn.disabled = false;
    }
  });

  actualizarContador();
}

function reiniciarMalla() {
  if (!confirm("¿Seguro que quieres reiniciar todo el avance?")) return;
  localStorage.removeItem('aprobados');
  document.querySelectorAll('.ramo').forEach(btn => {
    btn.classList.remove('aprobado');
    if (btn.classList.contains('bloqueado')) {
      btn.disabled = true;
    } else {
      btn.disabled = false;
    }
  });
  actualizarContador();
}

function actualizarContador() {
  const total = document.querySelectorAll('.ramo').length;
  const aprobados = document.querySelectorAll('.ramo.aprobado').length;
  document.getElementById('contador').innerText = `${aprobados}/${total}`;
}

window.onload = cargarEstado;
