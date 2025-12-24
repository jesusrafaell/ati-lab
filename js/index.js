let appState = {
  lang: "ES",
  config: null,
  perfiles: [],
  query: "",
};

function getValidLang(raw) {
  const up = (raw || "ES").toUpperCase();
  return ["ES", "EN", "PT"].includes(up) ? up : "ES";
}

async function apiFetch(params) {
  const url = new URL("/api", window.location.origin);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, v);
    }
  });

  const resp = await fetch(url.toString(), {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }
  return resp.json();
}

function applyConfig(config) {
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
}

function showError(message) {
  const mainSection = document.querySelector("section");
  const existingError = mainSection.querySelector(".error-message");
  if (existingError) {
    existingError.textContent = message;
  }
}

function renderProfiles(profiles, query) {
  const grid = document.querySelector(".student-grid");
  grid.innerHTML = "";

  if (!profiles || profiles.length === 0) {
    showError(`${appState.config.sin_resultados} ${query}`);
    return;
  }

  showError("");
  profiles.forEach((perfil) => {
    const listItem = document.createElement("li");

    const img = document.createElement("img");
    img.src = perfil.imagen;
    img.alt = `Foto de ${perfil.nombre}`;

    const nameParagraph = document.createElement("p");
    nameParagraph.textContent = perfil.nombre;

    listItem.appendChild(img);
    listItem.appendChild(nameParagraph);

    listItem.addEventListener("click", () => {
      const currentLang = appState.lang;
      window.location.href = `perfil.py?ci=${perfil.ci}&lang=${currentLang}`;
    });

    grid.appendChild(listItem);
  });
}

function filterAndRender(query) {
  const normalizedQuery = (query || "").toLowerCase().trim();
  const filtered = appState.perfiles.filter((p) =>
    p.nombre.toLowerCase().includes(normalizedQuery)
  );
  renderProfiles(filtered, query);
}

async function loadData(lang) {
  try {
    const data = await apiFetch({ lang });
    appState.lang = data.lang;
    appState.config = data.config;
    appState.perfiles = data.perfiles || [];
    applyConfig(appState.config);
    filterAndRender(appState.query);
  } catch (error) {
    console.error("Error loading data:", error);
    showError("Error al cargar los datos");
  }
}

async function initialize() {
  const params = new URLSearchParams(location.search);
  const lang = getValidLang(params.get("lang") || "ES");
  appState.lang = lang;

  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener("change", (e) => {
      appState.lang = getValidLang(e.target.value);
      loadData(appState.lang);
    });
  }

  const navSearchInput = document.querySelector(
    '.nav-search input[type="text"]'
  );
  const searchContainer = document.querySelector(".nav-search");
  if (searchContainer && navSearchInput) {
    searchContainer.addEventListener("submit", (e) => {
      e.preventDefault();
      appState.query = navSearchInput.value;
      filterAndRender(appState.query);
    });
  }

  await loadData(lang);
}

window.addEventListener("DOMContentLoaded", initialize);
