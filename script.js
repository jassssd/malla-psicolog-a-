window.onload = function () {
  const botones = document.querySelectorAll(".ramo");
  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      if (boton.disabled) return;
      aprobar(boton);
    });
  });

  document.getElementById("reset").addEventListener("click", reiniciarMalla);

  cargarProgreso();
  actualizarContador();
  activarRamosSegunPrerequisitos();

  // Toggle info ayuda
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
  const aprobados = JSON.parse(data);
  aprobados.forEach(id => {
    const boton = document.getElementById(id);
    if (boton) {
      boton.classList.add("aprobado");
      boton.disabled = true;
      // Al aprobar, seguro ya no es bloqueado
      boton.classList.remove("bloqueado");
    }
  });
}

function reiniciarMalla() {
  const botones = document.querySelectorAll(".ramo");
  botones.forEach(boton => {
    boton.classList.remove("aprobado");
    const prereq = boton.getAttribute("data-prerequisitos");
    if (prereq) {
      // Si tiene prerequisitos, bloqueamos y deshabilitamos
      boton.classList.add("bloqueado");
      boton.disabled = true;
    } else {
      // Si no tiene prereq, habilitamos y desbloqueamos
      boton.classList.remove("bloqueado");
      boton.disabled = false;
    }
  });
  localStorage.removeItem("ramos_aprobados");
  actualizarContador();
  activarRamosSegunPrerequisitos();
}

function activarRamosSegunPrerequisitos() {
  const aprobados = new Set(
    Array.from(document.querySelectorAll(".ramo.aprobado")).map(b => b.id)
  );

  const botones = document.querySelectorAll(".ramo.bloqueado");
  botones.forEach(boton => {
    const prereqData = boton.getAttribute("data-prerequisitos");
    if (!prereqData) return; // Sin prereq no cambia

    const prereqs = JSON.parse(prereqData);
    const desbloquear = prereqs.every(id => aprobados.has(id));

    if (desbloquear) {
      boton.classList.remove("bloqueado");
      boton.disabled = false;
    } else {
      boton.classList.add("bloqueado");
      boton.disabled = true;
    }
  });
}
