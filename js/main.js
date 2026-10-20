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
    const actualizarHeader = () => header.classList.toggle('con-scroll', window.scrollY > 8);
    actualizarHeader();
    window.addEventListener('scroll', actualizarHeader, { passive: true });
}

// --- Año actual en el footer ---
document.querySelectorAll('[data-anio]').forEach((elemento) => {
    elemento.textContent = new Date().getFullYear();
});

// --- Formulario de inscripción → email (FormSubmit) ---
const formulario = document.querySelector('[data-formulario-email]');

if (formulario) {
    const selectNivel = formulario.querySelector('#nivel');
    const contenido = formulario.querySelector('.formulario__contenido');
    const exito = formulario.querySelector('.formulario__exito');
    const error = formulario.querySelector('.formulario__error');
    const boton = formulario.querySelector('button[type="submit"]');
    const params = new URLSearchParams(window.location.search);

    const mostrarExito = () => {
        contenido.hidden = true;
        exito.hidden = false;
        exito.focus();
    };

    // Preselecciona el nivel si se llega desde un curso (?nivel=basic)
    const nivelUrl = params.get('nivel');
    if (nivelUrl && selectNivel.querySelector(`option[value="${CSS.escape(nivelUrl)}"]`)) {
        selectNivel.value = nivelUrl;
    }

    // Vuelta desde FormSubmit cuando el envío se hizo sin JS
    if (params.get('enviado') === '1') mostrarExito();

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        if (!formulario.reportValidity()) return;

        const datos = Object.fromEntries(new FormData(formulario));
        // En el email, el nivel aparece con su nombre completo y no con el valor interno
        datos.nivel = selectNivel.options[selectNivel.selectedIndex].text;

        error.hidden = true;
        boton.disabled = true;
        boton.textContent = 'Enviando…';

        let respuesta;
        try {
            respuesta = await fetch(formulario.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(datos),
            });
        } catch {
            // Sin conexión con el servicio vía JS: se envía de forma tradicional y FormSubmit redirige de vuelta
            HTMLFormElement.prototype.submit.call(formulario);
            return;
        }

        try {
            const resultado = await respuesta.json().catch(() => ({}));
            if (!respuesta.ok || String(resultado.success) === 'false') {
                // Ej.: "This form needs Activation" mientras no se confirme el email en FormSubmit
                throw new Error(resultado.message || `HTTP ${respuesta.status}`);
            }
            formulario.reset();
            mostrarExito();
        } catch (motivo) {
            console.error('Formulario de inscripción:', motivo.message);
            error.hidden = false;
        } finally {
            boton.disabled = false;
            boton.textContent = 'Enviar inscripción';
        }
    });
}
