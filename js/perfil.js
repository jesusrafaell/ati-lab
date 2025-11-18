function loadProfileScript(ci) {
  const script = document.createElement("script");
  script.src = `${ci}/perfil.json`;
  script.type = "text/javascript";
  script.defer = true;

  script.onload = () => {
    renderProfile(perfil);
    applyConfigToProfile();
  };

  document.head.appendChild(script);
}

function renderProfile(data) {
  document.title = data.nombre;
  document.getElementById("profile-name").textContent = data.nombre;
  document.getElementById("profile-desc").textContent = data.descripcion;

  document.getElementById("profile-photo").src = `${data.ci}/${data.ci}.jpg`;
  document.getElementById("profile-photo").alt = `Foto de ${data.nombre}`;

  document.getElementById("data-color").textContent = data.color;

  const libros = Array.isArray(data.libro) ? data.libro.join(", ") : data.libro;
  document.getElementById("data-book").textContent = libros;

  const music = Array.isArray(data.musica)
    ? data.musica.join(", ")
    : data.musica;
  document.getElementById("data-music").textContent = music;

  const videoGames = Array.isArray(data.video_juego)
    ? data.video_juego.join(", ")
    : data.video_juego;

  document.getElementById("data-video").textContent = videoGames;

  const languages = Array.isArray(data.lenguajes)
    ? data.lenguajes.join(", ")
    : data.lenguajes;
  document.getElementById("data-languages").textContent = languages;

  const emailAnchor = document.getElementById("profile-email");
  emailAnchor.textContent = data.email;
  emailAnchor.href = `mailto:${data.email}`;
}

function applyConfigToProfile() {
  document.getElementById("label-color").textContent = config.color + ":";
  document.getElementById("label-book").textContent = config.libro + ":";
  document.getElementById("label-music").textContent = config.musica + ":";
  document.getElementById("label-video").textContent = config.video_juego + ":";
  document.getElementById("label-languages").textContent =
    config.lenguajes + ":";

  const emailText = config.email;
  const pElement = document.querySelector(".content > p");

  if (pElement) {
    const emailAnchor = document.getElementById("profile-email");
    const phraseSpan = document.createElement("span");

    pElement.innerHTML = "";

    phraseSpan.textContent = emailText
      .replace(" [email]", "")
      .replace("[email]", "")
      .trim();

    pElement.appendChild(phraseSpan);
    pElement.appendChild(emailAnchor);
  }
  console.log("Config Perfil");
}

function initialize() {
  const params = new URLSearchParams(location.search);
  const ci = params.get("ci");
  const lang = params.get("lang") || "ES";
  lang = lang.toUpperCase();

  const validLang = ["ES", "EN", "PT"].includes(lang) ? lang : "ES";

  const configScript = document.createElement("script");
  configScript.src = `conf/config${validLang}.json`;
  configScript.type = "text/javascript";
  configScript.defer = true;

  configScript.onload = () => {
    applyConfigToProfile();

    if (ci) {
      loadProfileScript(ci);
    } else {
      console.log("Error: Cedula not found");
    }
  };

  document.head.appendChild(configScript);
}

window.addEventListener("DOMContentLoaded", initialize);
