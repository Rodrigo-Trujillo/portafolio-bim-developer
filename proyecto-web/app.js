/* ==========================================================
   PORTAFOLIO - Rodrigo Trujillo
   Interacciones: menú móvil, tema claro/oscuro y formulario.
   Sin librerías externas. El formulario NO envía ni guarda datos.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initMenu();
  initTheme();
  initForm();
});

/* ---------- 1. Menú móvil (hamburguesa) ---------- */
function initMenu() {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  // Abrir o cerrar con el botón
  toggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });

  // Cerrar al elegir un enlace
  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setMenu(false);
  });

  // Cerrar con la tecla Escape y devolver el foco al botón
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Cerrar si la pantalla pasa al diseño de escritorio (1200px)
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1200) setMenu(false);
  });
}

/* ---------- 2. Tema claro / oscuro ---------- */
function initTheme() {
  var button = document.getElementById("theme-toggle");
  var root = document.documentElement;
  if (!button) return;

  // Leer la preferencia guardada (puede fallar si el navegador bloquea el almacenamiento)
  function readSavedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      /* Si no se puede guardar, el tema solo dura la sesión */
    }
  }

  function applyTheme(theme) {
    var isDark = theme === "dark";
    if (isDark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    button.setAttribute("aria-pressed", String(isDark));
    button.textContent = isDark ? "Modo claro" : "Modo oscuro";
  }

  // Tema inicial: el guardado o, si no hay, el del sistema operativo
  var saved = readSavedTheme();
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  button.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  });
}

/* ---------- 3. Formulario de contacto (validación básica) ---------- */
function initForm() {
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (!form || !status) return;

  var fields = {
    nombre: {
      input: document.getElementById("nombre"),
      error: document.getElementById("error-nombre"),
      validate: function (value) {
        if (value.length === 0) return "Escribe tu nombre.";
        if (value.length < 2) return "El nombre debe tener al menos 2 caracteres.";
        return "";
      }
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("error-email"),
      validate: function (value) {
        if (value.length === 0) return "Escribe tu correo electrónico.";
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) return "Escribe un correo válido, por ejemplo nombre@dominio.com.";
        return "";
      }
    },
    mensaje: {
      input: document.getElementById("mensaje"),
      error: document.getElementById("error-mensaje"),
      validate: function (value) {
        if (value.length === 0) return "Escribe tu mensaje.";
        if (value.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
        return "";
      }
    }
  };

  // Valida un campo y muestra u oculta su mensaje de error
  function validateField(field) {
    var message = field.validate(field.input.value.trim());
    field.error.textContent = message;
    field.input.classList.toggle("is-invalid", message !== "");
    field.input.setAttribute("aria-invalid", String(message !== ""));
    return message === "";
  }

  // Al salir de un campo se valida; al corregirlo, el error desaparece
  Object.keys(fields).forEach(function (name) {
    var field = fields[name];
    field.input.addEventListener("blur", function () {
      validateField(field);
    });
    field.input.addEventListener("input", function () {
      status.textContent = "";
      if (field.input.classList.contains("is-invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío: no se manda nada a ningún servidor
    status.textContent = "";

    var firstInvalid = null;
    Object.keys(fields).forEach(function (name) {
      var field = fields[name];
      if (!validateField(field) && !firstInvalid) firstInvalid = field.input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Confirmación simulada: los datos no se envían ni se guardan
    status.textContent = "¡Gracias! Tu mensaje pasó la validación. (Simulación: no se envió ningún dato.)";
    form.reset();
  });
}
