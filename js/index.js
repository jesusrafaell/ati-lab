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

  console.log("Configuración");
}

window.addEventListener("DOMContentLoaded", initializeConfiguration);
