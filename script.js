window.onload = function () {
  const botones = document.querySelectorAll(".ramo");

  // Añadimos listener a cada ramo para aprobarlo al hacer clic
  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      if (boton.disabled) return; // Si está bloqueado o ya aprobado, no hace nada
      aprobar(boton);
    });
  });

  document.getElementById("reset").addEventListener("click", reiniciarMalla);

  cargarProgreso();
  actualizarContador();
  activarRamosSegunPrerequisitos();

  // Toggle para la info de uso
  const toggleBtn = document.getElementById("toggleInfo");
  const infoContenido = document.getElementById("infoContenido");

  toggleBtn.addEventListener("click", () => {
    const visible = infoContenido.style.display === "block";
    infoContenido.style.display = visible ? "none" : "block";
    toggleBtn.textContent = visible ? "¿Cómo usar esta malla? ▼" : "¿Cómo usar esta malla? ▲";
  });
};

function aprobar(boton) {
  boton.classList.add("aprobado");
  boton.disabled = true;

  guardarProgreso();
  actualizarContador();
  activarRamosSegunPrerequisitos();
}

function actualizarContador() {
  const total = document.querySelectorAll(".ramo").length;
  const aprobados = document.querySelectorAll(".ramo.aprobado").length;
  document.getElementById("contador").textContent = `${aprobados}/${total}`;
}

function guardarProgreso() {
  const aprobados = Array.from(document.querySelectorAll(".ramo.aprobado")).map(b => b.id);
  localStorage.setItem("ramos_aprobados", JSON.stringify(aprobados));
}

function cargarProgreso() {
  const data = localStorage.getItem("ramos_aprobados");
  if (!data) return;

  try {
    const aprobados = JSON.parse(data);
    aprobados.forEach(id => {
      const boton = document.getElementById(id);
      if (boton) {
        boton.classList.add("aprobado");
        boton.disabled = true;
        boton.classList.remove("bloqueado");
      }
    });
  } catch (e) {
    console.error("Error al leer progreso guardado:", e);
    localStorage.removeItem("ramos_aprobados");
  }
}

function reiniciarMalla() {
  const botones = document.querySelectorAll(".ramo");
  botones.forEach(boton => {
    boton.classList.remove("aprobado");
  });

  localStorage.removeItem("ramos_aprobados");
  activarRamosSegunPrerequisitos();
  actualizarContador();
}

function activarRamosSegunPrerequisitos() {
  const aprobados = new Set(
    Array.from(document.querySelectorAll(".ramo.aprobado")).map(b => b.id)
  );

  const botones = document.querySelectorAll(".ramo");
  botones.forEach(boton => {
    const prereqData = boton.getAttribute("data-prerequisitos");
    if (!prereqData) {
      // No tiene prerequisitos, desbloqueado siempre
      boton.classList.remove("bloqueado");
      boton.disabled = false;
      return;
    }

    let prereqs;
    try {
      prereqs = JSON.parse(prereqData);
    } catch (e) {
      console.warn(`Prerrequisitos inválidos en ramo ${boton.id}`, e);
      boton.classList.remove("bloqueado");
      boton.disabled = false;
      return;
    }

    // Si el ramo ya está aprobado, siempre debe estar deshabilitado y sin bloqueo
    if (boton.classList.contains("aprobado")) {
      boton.classList.remove("bloqueado");
      boton.disabled = true;
      return;
    }

    // Si todos los prerequisitos están aprobados, desbloqueamos
    const desbloquear = prereqs.length === 0 || prereqs.every(id => aprobados.has(id));

    if (desbloquear) {
      boton.classList.remove("bloqueado");
      boton.disabled = false;
    } else {
      boton.classList.add("bloqueado");
      boton.disabled = true;
    }
  });
}
