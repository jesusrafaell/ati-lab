function showStudents(listaPerfiles) {
  const grid = document.querySelector(".student-grid");

  grid.innerHTML = "";

  listaPerfiles.forEach((perfil) => {
    const listItem = document.createElement("li");

    const img = document.createElement("img");
    img.src = perfil.imagen;
    img.alt = `Foto de ${perfil.nombre}`;

    const nameParagraph = document.createElement("p");
    nameParagraph.textContent = perfil.nombre;

    listItem.appendChild(img);
    listItem.appendChild(nameParagraph);

    grid.appendChild(listItem);
  });
}

function initializeConfiguration() {
  document.title = `${config.sitio[0]}${config.sitio[1]} ${config.sitio[2]}`;

  document.querySelector(
    ".nav-title"
  ).innerHTML = `${config.sitio[0]}<span>${config.sitio[1]}</span> ${config.sitio[2]}`;

  document.querySelector(".nav-greeting").textContent = `${config.saludo},`;

  document.querySelector(
    '.nav-search input[type="text"]'
  ).placeholder = `${config.nombre}...`;
  document.querySelector('.nav-search button[type="submit"]').textContent =
    config.buscar;

  document.querySelector("footer p").textContent = config.copyRight;

  showStudents(perfiles);

  console.log("Configuración");
}

window.addEventListener("DOMContentLoaded", initializeConfiguration);
