// Passport English: interacciones del sitio (sin dependencias)

const WHATSAPP = '5493512068745';

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

// --- Formulario de inscripción → mensaje de WhatsApp ---
const formulario = document.querySelector('[data-formulario-whatsapp]');

if (formulario) {
    const selectNivel = formulario.querySelector('#nivel');

    // Preselecciona el nivel si se llega desde un curso (?nivel=basic)
    const nivelUrl = new URLSearchParams(window.location.search).get('nivel');
    if (nivelUrl && selectNivel.querySelector(`option[value="${CSS.escape(nivelUrl)}"]`)) {
        selectNivel.value = nivelUrl;
    }

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        if (!formulario.reportValidity()) return;

        const datos = new FormData(formulario);
        const nivel = selectNivel.options[selectNivel.selectedIndex].text;
        const lineas = [
            `¡Hola! Quiero inscribirme en Passport English.`,
            ``,
            `Nombre: ${datos.get('nombre').trim()}`,
            datos.get('email') ? `Email: ${datos.get('email').trim()}` : null,
            `Nivel: ${nivel}`,
            datos.get('horario') ? `Horario preferido: ${datos.get('horario')}` : null,
            datos.get('comentarios').trim() ? `Comentarios: ${datos.get('comentarios').trim()}` : null,
        ].filter((linea) => linea !== null);

        const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`;
        window.open(url, '_blank', 'noopener');
    });
}
