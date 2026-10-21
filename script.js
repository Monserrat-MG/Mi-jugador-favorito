/* =========================================================
   MI JUGADOR FAVORITO 💙⚽
   JavaScript: música, videos y animaciones.
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // 1. ELEMENTOS PRINCIPALES
    // =====================================================

    const musica = document.getElementById("musica");
    const botonMusica = document.getElementById("boton-musica");
    const iconoMusica = document.getElementById("icono-musica");
    const textoMusica = document.getElementById("texto-musica");
    const particulas = document.getElementById("particulas");

    const videos = document.querySelectorAll(".video-recuerdo");

    // =====================================================
    // 2. MÚSICA DE FONDO
    // =====================================================

    if (musica) {
        musica.volume = 0.45;
        musica.loop = true;
        musica.preload = "auto";
    }

    // Actualiza la apariencia del botón musical.

    function actualizarBotonMusica(sonando) {
        if (!botonMusica || !iconoMusica || !textoMusica) {
            return;
        }

        if (sonando) {
            iconoMusica.textContent = "♫";
            textoMusica.textContent = "Música activada";
            botonMusica.setAttribute("aria-label", "Pausar música");
            botonMusica.setAttribute("aria-pressed", "true");
            botonMusica.classList.add("musica-activa");
        } else {
            iconoMusica.textContent = "♪";
            textoMusica.textContent = "Activar música";
            botonMusica.setAttribute("aria-label", "Activar música");
            botonMusica.setAttribute("aria-pressed", "false");
            botonMusica.classList.remove("musica-activa");
        }
    }

    // Intenta iniciar la canción al cargar la página.
    // Algunos navegadores bloquean el audio automático.

    async function iniciarMusica() {
        if (!musica) {
            return false;
        }

        try {
            await musica.play();

            actualizarBotonMusica(true);
            return true;

        } catch (error) {
            actualizarBotonMusica(false);

            console.info(
                "La reproducción automática está bloqueada. " +
                "Pulsa el botón de música para iniciarla."
            );

            return false;
        }
    }

    // El botón permite reproducir y pausar la canción.

    if (botonMusica && musica) {
        botonMusica.addEventListener("click", async () => {
            if (musica.paused) {
                try {
                    await musica.play();
                    actualizarBotonMusica(true);
                } catch (error) {
                    actualizarBotonMusica(false);
                    console.warn(
                        "No se pudo reproducir la canción.",
                        error
                    );
                }
            } else {
                musica.pause();
                actualizarBotonMusica(false);
            }
        });
    }

    // Sincroniza el botón si el audio cambia de estado.

    if (musica) {
        musica.addEventListener("play", () => {
            actualizarBotonMusica(true);
        });

        musica.addEventListener("pause", () => {
            actualizarBotonMusica(false);
        });

        musica.addEventListener("ended", () => {
            if (musica.loop) {
                return;
            }

            actualizarBotonMusica(false);
        });

        musica.addEventListener("error", () => {
            actualizarBotonMusica(false);

            console.error(
                "No se pudo cargar la música. " +
                "Revisa que exista assets/hora-cero.mp3."
            );
        });
    }

    // =====================================================
    // 3. VIDEOS SIEMPRE SILENCIADOS
    // =====================================================

    videos.forEach((video) => {
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;

        // Impide que los controles permitan activar el audio.
        // Así la música es la única pista sonora de la página.

        video.addEventListener("volumechange", () => {
            if (!video.muted || video.volume !== 0) {
                video.muted = true;
                video.volume = 0;
            }
        });

        // Si empieza un video, mantenemos la música activa
        // cuando el navegador lo permita.

        video.addEventListener("play", () => {
            video.muted = true;
            video.volume = 0;

            if (musica && musica.paused) {
                iniciarMusica();
            }
        });

        video.addEventListener("loadedmetadata", () => {
            video.muted = true;
            video.volume = 0;
        });

        video.addEventListener("error", () => {
            console.warn(
                "No se pudo cargar un video. " +
                "Comprueba la ruta y el formato del archivo."
            );
        });
    });

    // =====================================================
    // 4. PARTÍCULAS AZULES
    // =====================================================

    function crearParticulas() {
        if (!particulas) {
            return;
        }

        const cantidad = window.innerWidth < 600 ? 14 : 28;
        const fragmento = document.createDocumentFragment();

        for (let i = 0; i < cantidad; i++) {
            const particula = document.createElement("span");

            particula.className = "particula";

            particula.style.left = `${Math.random() * 100}%`;
            particula.style.top = `${30 + Math.random() * 70}%`;

            particula.style.animationDuration =
                `${5 + Math.random() * 8}s`;

            particula.style.animationDelay =
                `${Math.random() * 8}s`;

            const tamano = 2 + Math.random() * 2;

            particula.style.width = `${tamano}px`;
            particula.style.height = `${tamano}px`;

            fragmento.appendChild(particula);
        }

        particulas.appendChild(fragmento);
    }

    crearParticulas();

    // =====================================================
    // 5. ANIMACIONES AL DESPLAZARSE
    // =====================================================

    document.documentElement.classList.add("js-listo");

    const elementosAnimados = document.querySelectorAll(
        ".encabezado-seccion, " +
        ".recuerdo, " +
        ".orgullo-icono, " +
        ".frase-destacada, " +
        ".estadistica, " +
        ".carta-borde"
    );

    elementosAnimados.forEach((elemento) => {
        elemento.classList.add("animar-entrada");
    });

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(
            (entradas, observer) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("visible");
                        observer.unobserve(entrada.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        elementosAnimados.forEach((elemento) => {
            observador.observe(elemento);
        });

    } else {
        elementosAnimados.forEach((elemento) => {
            elemento.classList.add("visible");
        });
    }

    // =====================================================
    // 6. DESVANECIMIENTO SUAVE DE LA MÚSICA AL PAUSAR
    // =====================================================

    let volumenAnterior = musica ? musica.volume : 0.45;

    if (musica) {
        musica.addEventListener("play", () => {
            if (musica.volume === 0) {
                musica.volume = volumenAnterior || 0.45;
            }
        });
    }

    // =====================================================
    // 7. INICIO DE LA EXPERIENCIA
    // =====================================================

    // El intento se realiza después de cargar el DOM.
    iniciarMusica();

    console.log(
        "⚽ Página de mi jugador favorito cargada. 💙"
    );

});