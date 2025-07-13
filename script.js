function aprobar(boton, siguienteId) {
  boton.classList.remove('bloqueado');
  boton.classList.add('aprobado');
  boton.disabled = true;

  if (siguienteId) {
    const siguiente = document.getElementById(siguienteId);
    if (siguiente) {
      siguiente.classList.remove('bloqueado');
      siguiente.disabled = false;
    }
  }
}
