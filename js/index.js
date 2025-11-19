function showProfiles(profiles, query) {
  const grid = document.querySelector(".student-grid");
  const mainSection = document.querySelector("section");

  grid.innerHTML = "";

  const existingError = mainSection.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  if (profiles.length === 0) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = `${config.sin_resultados} ${query}`;
    errorMessage.classList.add("error-message", "centered-message");
    mainSection.appendChild(errorMessage);
    return;
  }

  profiles.forEach((perfil) => {
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

function filterProfiles(query) {
  const normalizedQuery = query.toLowerCase().trim();

  const filteredPerfiles = perfiles.filter((perfil) => {
    return perfil.nombre.toLowerCase().includes(normalizedQuery);
  });

  showProfiles(filteredPerfiles, query);
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

  const searchContainer = document.querySelector(".nav-search");

  if (searchContainer && navSearchInput) {
    searchContainer.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = navSearchInput.value;
      console.log("Buscando:", query);
      filterProfiles(query);
    });
  }

  filterProfiles("");
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
    showProfiles(perfiles);
  };

  document.head.appendChild(configScript);

  console.log("Configuración");
}

window.addEventListener("DOMContentLoaded", initialize);
