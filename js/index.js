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

function applyConfig() {
  document.title = `${config.sitio[0]}${config.sitio[1]} ${config.sitio[2]}`;

  const navTitle = document.querySelector(".nav-title");
  navTitle.innerHTML = `${config.sitio[0]}<span>${config.sitio[1]}</span> ${config.sitio[2]}`;

  const navGreeting = document.querySelector(".nav-greeting");
  navGreeting.textContent = `${config.saludo},`;

  const navSearchInput = document.querySelector(
    '.nav-search input[type="text"]'
  );
  navSearchInput.placeholder = `${config.nombre}...`;

  const navSearchButton = document.querySelector(
    '.nav-search button[type="submit"]'
  );
  navSearchButton.textContent = config.buscar;

  const footer = document.querySelector("footer");
  footer.style.color = config.color;

  const footerParagraph = document.querySelector("footer p");
  footerParagraph.textContent = config.copyRight;

  console.log("applyConfig");
}

function initialize() {
  const params = new URLSearchParams(location.search);
  let lang = params.get("lang") || "ES";
  lang = lang.toUpperCase();

  const validLang = ["ES", "EN", "PT"].includes(lang) ? lang : "ES";

  console.log(validLang);

  const configScript = document.createElement("script");
  configScript.src = `conf/config${validLang}.json`;
  configScript.type = "text/javascript";
  configScript.defer = true;

  configScript.onload = () => {
    applyConfig();
    showStudents(perfiles);
  };

  document.head.appendChild(configScript);

  console.log("Configuración");
}

window.addEventListener("DOMContentLoaded", initialize);
