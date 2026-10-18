// ==========================================
// 1. SELECCIÓN DE ELEMENTOS DEL HTML
// ==========================================
const btnTema = document.getElementById('btn-tema');

// Perfil
const btnAbrirPerfil = document.getElementById('btn-abrir-perfil');
const modalPerfil = document.getElementById('modal-perfil');
const btnCerrarPerfil = document.getElementById('cerrar-perfil');
const inputNombre = document.getElementById('input-nombre');
const btnGuardarPerfil = document.getElementById('btn-guardar-perfil');
const nombreHeader = document.getElementById('nombre-perfil-header');
const fotoHeader = document.getElementById('foto-perfil-header');
const inputArchivoPerfil = document.getElementById('input-archivo-perfil');
const btnCambiarFotoPerfil = document.getElementById('btn-cambiar-foto-perfil');

// Galería y Visor
const btnAgregar = document.getElementById('btn-agregar');
const inputArchivo = document.getElementById('input-archivo');
const galeria = document.getElementById('galeria');
const visorImagen = document.getElementById('visor-imagen');
const imgAmpliada = document.getElementById('img-ampliada');
const cerrarVisor = document.getElementById('cerrar-visor');

// Navegación
const btnNavInicio = document.getElementById('nav-inicio');
const btnNavFavoritas = document.getElementById('nav-favoritas');
const btnNavGestionar = document.getElementById('nav-gestionar');
const botonesNav = [btnNavInicio, btnNavFavoritas, btnNavGestionar];

let pestanaActual = 'inicio';
let nuevaFotoPerfilUrl = '';


// ==========================================
// 2. MODO CLARO / OSCURO (CON MEMORIA)
// ==========================================
// Comprobamos si el elemento existe antes de añadir el evento
if (btnTema) {
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Comprobamos si ahora es modo oscuro
        const esOscuro = document.body.classList.contains('dark-mode');
        
        // Cambiamos el icono del botón
        btnTema.textContent = esOscuro ? '☀️' : '🌙';
        
        // Guardamos la preferencia en el navegador
        localStorage.setItem('luti_tema', esOscuro ? 'dark' : 'light');
    });
}


// ==========================================
// 3. ABRIR Y CERRAR MODAL PERFIL
// ==========================================
btnAbrirPerfil.addEventListener('click', () => modalPerfil.classList.add('activo'));
btnCerrarPerfil.addEventListener('click', () => modalPerfil.classList.remove('activo'));
window.addEventListener('click', (e) => {
    if (e.target === modalPerfil) modalPerfil.classList.remove('activo');
});


// ==========================================
// 4. VISOR DE IMAGEN AMPLIADA
// ==========================================
cerrarVisor.addEventListener('click', () => visorImagen.classList.remove('activo'));
visorImagen.addEventListener('click', (e) => {
    if (e.target === visorImagen) visorImagen.classList.remove('activo');
});


// ==========================================
// 5. OBTENER Y GUARDAR FOTOS (localStorage)
// ==========================================
function obtenerFotosGuardadas() {
    const datos = localStorage.getItem('luti_galeria_v2');
    return datos ? JSON.parse(datos) : [];
}

function guardarFotos(listaFotos) {
    localStorage.setItem('luti_galeria_v2', JSON.stringify(listaFotos));
}


// ==========================================
// 6. RENDERIZAR GALERÍA SEGÚN LA PESTAÑA
// ==========================================
function renderizarGaleria() {
    galeria.innerHTML = '';
    const todasLasFotos = obtenerFotosGuardadas();

    // Filtrar según pestaña
    let fotosAMostrar = [];
    if (pestanaActual === 'inicio' || pestanaActual === 'gestionar') {
        fotosAMostrar = todasLasFotos;
    } else if (pestanaActual === 'favoritas') {
        fotosAMostrar = todasLasFotos.filter(f => f.favorita === true);
    }

    // Si no hay fotos en esta sección
    if (fotosAMostrar.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.style.gridColumn = '1 / -1';
        mensaje.style.textAlign = 'center';
        mensaje.style.opacity = '0.7';
        mensaje.style.padding = '20px';

        if (pestanaActual === 'favoritas') {
            mensaje.textContent = 'Aún no has añadido ninguna foto a Favoritas ⭐';
        } else {
            mensaje.textContent = 'No hay fotos subidas. ¡Pulsa el botón + para añadir la primera!';
        }

        galeria.appendChild(mensaje);
        return;
    }

    // Dibujar cada foto
    fotosAMostrar.forEach((foto) => {
        // Encontrar el índice real en la lista completa
        const indiceReal = todasLasFotos.findIndex(f => f.url === foto.url);

        const divItem = document.createElement('div');
        divItem.classList.add('foto-item');

        const img = document.createElement('img');
        img.src = foto.url;

        // Clic en la foto para abrirla en grande
        img.addEventListener('click', () => {
            imgAmpliada.src = foto.url;
            visorImagen.classList.add('activo');
        });

        divItem.appendChild(img);

        // Botón Estrella (Favoritos) - Se muestra en Inicio y Favoritas
        if (pestanaActual === 'inicio' || pestanaActual === 'favoritas') {
            const btnFav = document.createElement('button');
            btnFav.classList.add('btn-foto-accion', 'btn-fav');
            btnFav.innerHTML = foto.favorita ? '⭐' : '☆';
            btnFav.addEventListener('click', (e) => {
                e.stopPropagation();
                alternarFavorito(indiceReal);
            });
            divItem.appendChild(btnFav);
        }

        // Botón Borrar (Papelera) - Se muestra solo en "Gestionar"
        if (pestanaActual === 'gestionar') {
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn-foto-accion', 'btn-borrar');
            btnBorrar.innerHTML = '🗑️';
            btnBorrar.addEventListener('click', (e) => {
                e.stopPropagation();
                borrarFoto(indiceReal);
            });
            divItem.appendChild(btnBorrar);
        }

        galeria.appendChild(divItem);
    });
}


// ==========================================
// 7. FUNCIONES DE ACCIÓN (FAVORITOS Y BORRAR)
// ==========================================
function alternarFavorito(indice) {
    const fotos = obtenerFotosGuardadas();
    if (fotos[indice]) {
        fotos[indice].favorita = !fotos[indice].favorita;
        guardarFotos(fotos);
        renderizarGaleria();
    }
}

function borrarFoto(indice) {
    const fotos = obtenerFotosGuardadas();
    fotos.splice(indice, 1);
    guardarFotos(fotos);
    renderizarGaleria();
}


// ==========================================
// 8. SUBIR NUEVA FOTO A LA GALERÍA
// ==========================================
btnAgregar.addEventListener('click', () => inputArchivo.click());

inputArchivo.addEventListener('change', (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(evento) {
            const fotos = obtenerFotosGuardadas();
            fotos.push({
                url: evento.target.result,
                favorita: false
            });
            guardarFotos(fotos);
            renderizarGaleria();
        };
        lector.readAsDataURL(archivo);
    }
    inputArchivo.value = '';
});


// ==========================================
// 9. NAVEGACIÓN POR PESTAÑAS
// ==========================================
botonesNav.forEach(boton => {
    boton.addEventListener('click', () => {
        botonesNav.forEach(b => b.classList.remove('activo'));
        boton.classList.add('activo');

        if (boton === btnNavInicio) pestanaActual = 'inicio';
        if (boton === btnNavFavoritas) pestanaActual = 'favoritas';
        if (boton === btnNavGestionar) pestanaActual = 'gestionar';

        renderizarGaleria();
    });
});


// ==========================================
// 10. EDITAR PERFIL Y GUARDAR
// ==========================================
btnCambiarFotoPerfil.addEventListener('click', () => inputArchivoPerfil.click());

inputArchivoPerfil.addEventListener('change', (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(evento) {
            nuevaFotoPerfilUrl = evento.target.result;
        };
        lector.readAsDataURL(archivo);
    }
});

btnGuardarPerfil.addEventListener('click', () => {
    const nuevoNombre = inputNombre.value.trim();
    if (nuevoNombre !== '') {
        nombreHeader.textContent = nuevoNombre;
        localStorage.setItem('luti_nombre', nuevoNombre);
    }
    if (nuevaFotoPerfilUrl !== '') {
        fotoHeader.src = nuevaFotoPerfilUrl;
        localStorage.setItem('luti_foto_perfil', nuevaFotoPerfilUrl);
    }
    modalPerfil.classList.remove('activo');
});


// ==========================================
// 11. INICIALIZAR DATOS AL ABRIR LA WEB
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // Cargar perfil
    const nombreGuardado = localStorage.getItem('luti_nombre');
    const fotoGuardada = localStorage.getItem('luti_foto_perfil');

    if (nombreGuardado) {
        nombreHeader.textContent = nombreGuardado;
        inputNombre.value = nombreGuardado;
    }
    if (fotoGuardada) {
        fotoHeader.src = fotoGuardada;
    }

    // Cargar galería limpia
    renderizarGaleria();

    // Cargar tema guardado
    const temaGuardado = localStorage.getItem('luti_tema');
    if (temaGuardado === 'dark') {
        document.body.classList.add('dark-mode');
        if (btnTema) btnTema.textContent = '☀️';
    }
});

// ==========================================
// CONTROL DEL MENÚ DESPLEGABLE MÓVIL
// ==========================================
const btnMenu = document.getElementById('btn-menu');
const menuDesplegable = document.getElementById('menu-desplegable');

btnMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    menuDesplegable.classList.toggle('activo');
});

// Cerrar el menú si se hace clic fuera de él
window.addEventListener('click', (e) => {
    if (!menuDesplegable.contains(e.target) && e.target !== btnMenu) {
        menuDesplegable.classList.remove('activo');
    }
});

// Cerrar menú al hacer clic en cualquier opción
botonesNav.forEach(boton => {
    boton.addEventListener('click', () => {
        menuDesplegable.classList.remove('activo');
    });
});