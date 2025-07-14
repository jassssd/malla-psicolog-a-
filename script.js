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
  activarRamosSinPrerequisito();

  // Listener para el botón que muestra/oculta la info
  const toggleBtn = document.getElementById("toggleInfo");
  const infoContenido = document.getElementById("infoContenido");

  toggleBtn.addEventListener("click", function () {
    const visible = infoContenido.style.display === "block";
    infoContenido.style.display = visible ? "none" : "block";
    this.textContent = visible ? "¿Cómo usar esta malla? ▼" : "¿Cómo usar esta malla? ▲";
  });
};

function aprobar(boton) {
  boton.classList.add("aprobado");
  boton.disabled = true;

  guardarProgreso();
  actualizarContador();
  activarRamosSinPrerequisito();
}

function actualizarContador() {
  const total = document.querySelectorAll(".ramo").length;
  const aprobados = document.querySelectorAll(".ramo.aprobado").length;
  document.getElementById("contador").textContent = `${aprobados}/${total}`;
}

function guardarProgreso() {
  const aprobados = Array.from(
    document.querySelectorAll(".ramo.aprobado")
  ).map((b) => b.id);
  localStorage.setItem("ramos_aprobados", JSON.stringify(aprobados));
}

function cargarProgreso() {
  const data = localStorage.getItem("ramos_aprobados");
  if (!data) return;

  const aprobados = JSON.parse(data);
  aprobados.forEach((id) => {
    const boton = document.getElementById(id);
    if (boton) {
      boton.classList.add("aprobado");
      boton.disabled = true;
    }
  });

  actualizarContador();
  activarRamosSinPrerequisito();
}

function reiniciarMalla() {
  const botones = document.querySelectorAll(".ramo");
  botones.forEach((boton) => {
    boton.classList.remove("aprobado");
    boton.disabled = boton.classList.contains("bloqueado");
  });
  localStorage.removeItem("ramos_aprobados");
  actualizarContador();
  activarRamosSinPrerequisito();
}

function activarRamosSinPrerequisito() {
  const ramos = document.querySelectorAll('.ramo');
  const aprobados = new Set(
    Array.from(document.querySelectorAll('.ramo.aprobado')).map(b => b.id)
  );

  ramos.forEach(ramo => {
    if (ramo.classList.contains('bloqueado')) {
      const prereqData = ramo.getAttribute('data-prerequisitos');
      if (!prereqData) return;
      const prereqs = JSON.parse(prereqData);

      const todosAprobados = prereqs.every(id => aprobados.has(id));

      if (todosAprobados) {
        ramo.classList.remove('bloqueado');
        ramo.disabled = false;
      } else {
        ramo.classList.add('bloqueado');
        ramo.disabled = true;
      }
    }
  });
}
