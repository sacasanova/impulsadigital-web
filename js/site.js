// Impulsa Digital — comportamiento del sitio
(function () {
  var WA_NUMBER = '524431601868';

  // Medición: envía eventos a Google Analytics solo si está instalado.
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }

  // Menú móvil
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menú');
      }
    });
  }

  // Enlaces de WhatsApp con mensaje prellenado según el botón
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(a.getAttribute('data-wa'));
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', function () {
      track('clic_whatsapp', { origen: a.getAttribute('data-origen') || 'general' });
    });
  });

  // Botones de paquete: preseleccionan la opción en el formulario
  var interes = document.getElementById('interes');
  document.querySelectorAll('[data-interes]').forEach(function (a) {
    a.addEventListener('click', function () {
      var value = a.getAttribute('data-interes');
      if (interes) interes.value = value;
      track('clic_paquete', { paquete: value });
    });
  });

  // Formulario de contacto (Formspree)
  var form = document.getElementById('contactForm');
  if (form) {
    var status = document.getElementById('formStatus');
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = 'Enviando…';
      btn.disabled = true;
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('respuesta ' + res.status);
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Recibimos tu mensaje. Te respondemos en menos de 24 horas hábiles.';
          track('envio_formulario');
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.';
        })
        .then(function () {
          btn.disabled = false;
        });
    });
  }

  // Año del pie
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
