// Passport English: interacciones del sitio (sin dependencias)

// --- Menú mobile ---
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu-principal');

if (toggle && menu) {
    const cerrarMenu = () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('abierto');
    };

    toggle.addEventListener('click', () => {
        const abierto = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!abierto));
        menu.classList.toggle('abierto', !abierto);
    });

    // Cerrar con Escape o al elegir un enlace
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && menu.classList.contains('abierto')) {
            cerrarMenu();
            toggle.focus();
        }
    });
    menu.querySelectorAll('a').forEach((enlace) => enlace.addEventListener('click', cerrarMenu));
}

// --- Sombra del header al scrollear ---
const header = document.querySelector('.header-principal');

if (header) {
    // Se agrupa en requestAnimationFrame para no forzar recálculos de layout en cada evento
    let pendiente = false;
    const actualizarHeader = () => {
        if (pendiente) return;
        pendiente = true;
        requestAnimationFrame(() => {
            header.classList.toggle('con-scroll', window.scrollY > 8);
            pendiente = false;
        });
    };
    actualizarHeader();
    window.addEventListener('scroll', actualizarHeader, { passive: true });
}

// --- Año actual en el footer ---
document.querySelectorAll('[data-anio]').forEach((elemento) => {
    elemento.textContent = new Date().getFullYear();
});

// --- Formulario de inscripción → email (FormSubmit) ---
// Envío tradicional: FormSubmit muestra un captcha y vuelve con ?enviado=1.
// (La respuesta automática al alumno no funciona por AJAX ni sin captcha.)
const formulario = document.querySelector('[data-formulario-email]');

if (formulario) {
    const selectNivel = formulario.querySelector('#nivel');
    const contenido = formulario.querySelector('.formulario__contenido');
    const exito = formulario.querySelector('.formulario__exito');
    const boton = formulario.querySelector('button[type="submit"]');
    const params = new URLSearchParams(window.location.search);

    // Preselecciona el nivel si se llega desde un curso (?nivel=basic)
    const nivelUrl = params.get('nivel');
    const opcion = nivelUrl && selectNivel.querySelector(`option[data-nivel="${CSS.escape(nivelUrl)}"]`);
    if (opcion) opcion.selected = true;

    // Vuelta desde FormSubmit después de enviar
    if (params.get('enviado') === '1') {
        contenido.hidden = true;
        exito.hidden = false;
        exito.focus();
    }

    formulario.addEventListener('submit', (evento) => {
        if (!formulario.checkValidity()) return;
        // Evita envíos duplicados por doble clic
        if (boton.disabled) {
            evento.preventDefault();
            return;
        }
        boton.disabled = true;
        boton.textContent = 'Enviando…';
    });

    // Si se vuelve con el botón "atrás", el botón queda habilitado de nuevo
    window.addEventListener('pageshow', () => {
        boton.disabled = false;
        boton.textContent = 'Enviar inscripción';
    });
}
