document.addEventListener('DOMContentLoaded', () => {
    // Selectores DOM
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    const tarjetasPropiedades = document.querySelectorAll('.property-card');
    const preciosPantalla = document.querySelectorAll('.display-price');
    
    // Controles Divisa
    const btnUsd = document.getElementById('currency-usd');
    const btnPen = document.getElementById('currency-pen');
    let divisaActual = 'USD';

    // Controles Buscador
    const searchLocation = document.getElementById('search-location');
    const searchText = document.getElementById('search-text');
    const btnSearch = document.getElementById('btn-search');

    // Controles Modal Extendido
    const modal = document.getElementById('modal-details');
    const btnCerrarModal = document.getElementById('modal-close');
    const botonesDetalles = document.querySelectorAll('.btn-details');

    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalSpecs = document.getElementById('modal-specs');
    const modalDescription = document.getElementById('modal-description');
    const modalBadge = document.getElementById('modal-badge');
    const modalLocationTag = document.getElementById('modal-location-tag');
    const modalCrumbCat = document.getElementById('modal-crumb-cat');
    const modalCrumbTitle = document.getElementById('modal-crumb-title');
    const modalAddressVal = document.getElementById('modal-address-val');
    const modalAreaVal = document.getElementById('modal-area-val');
    const modalWsp = document.getElementById('modal-wsp');
    const modalFormMsg = document.getElementById('modal-form-msg');
    const modalContactForm = document.getElementById('modal-contact-form');

    // Elementos Galería Modal
    const modalMainImg = document.getElementById('modal-main-img');
    const modalThumbs = document.querySelectorAll('.modal-gallery-thumb');

    // Menú Hamburguesa Móvil
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // 1. MENÚ MÓVIL
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. CONMUTADOR DE MONEDA (USD / PEN)
    function cambiarMoneda(moneda) {
        divisaActual = moneda;

        if (btnUsd && btnPen) {
            if (moneda === 'USD') {
                btnUsd.classList.add('bg-brand-navy', 'text-white');
                btnUsd.classList.remove('text-slate-600');
                btnPen.classList.remove('bg-brand-navy', 'text-white');
                btnPen.classList.add('text-slate-600');
            } else {
                btnPen.classList.add('bg-brand-navy', 'text-white');
                btnPen.classList.remove('text-slate-600');
                btnUsd.classList.remove('bg-brand-navy', 'text-white');
                btnUsd.classList.add('text-slate-600');
            }
        }

        preciosPantalla.forEach(precio => {
            const usdVal = parseFloat(precio.getAttribute('data-usd')).toLocaleString('en-US');
            const penVal = parseFloat(precio.getAttribute('data-pen')).toLocaleString('es-PE');
            const esAlquiler = precio.innerText.includes('/mes');

            if (moneda === 'USD') {
                precio.innerHTML = `$${usdVal} ${esAlquiler ? '<span class="text-xs font-normal text-slate-400">/mes</span>' : ''}`;
            } else {
                precio.innerHTML = `S/. ${penVal} ${esAlquiler ? '<span class="text-xs font-normal text-slate-400">/mes</span>' : ''}`;
            }
        });
    }

    if (btnUsd && btnPen) {
        btnUsd.addEventListener('click', () => cambiarMoneda('USD'));
        btnPen.addEventListener('click', () => cambiarMoneda('PEN'));
    }

    // 3. FILTRADO Y BÚSQUEDA
    function ejecutarFiltros() {
        const botonActivo = document.querySelector('.filter-btn.active');
        const categoriaActiva = botonActivo ? botonActivo.getAttribute('data-filter') : 'todos';
        const ubicacionSeleccionada = searchLocation ? searchLocation.value : 'todos';
        const textoBusqueda = searchText ? searchText.value.toLowerCase().trim() : '';

        tarjetasPropiedades.forEach(tarjeta => {
            const catTarjeta = tarjeta.getAttribute('data-category');
            const ubiTarjeta = tarjeta.getAttribute('data-location-tag');
            const palabrasClave = (tarjeta.getAttribute('data-keywords') || '').toLowerCase();

            const cumpleCategoria = (categoriaActiva === 'todos' || catTarjeta === categoriaActiva);
            const cumpleUbicacion = (ubicacionSeleccionada === 'todos' || ubiTarjeta === ubicacionSeleccionada);
            const cumpleTexto = (textoBusqueda === '' || palabrasClave.includes(textoBusqueda));

            if (cumpleCategoria && cumpleUbicacion && cumpleTexto) {
                tarjeta.classList.remove('hidden');
            } else {
                tarjeta.classList.add('hidden');
            }
        });
    }

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            botonesFiltro.forEach(b => {
                b.classList.remove('bg-brand-navy', 'border-brand-navy', 'text-white', 'active');
                b.classList.add('bg-white', 'border-slate-200', 'text-slate-700');
            });

            boton.classList.remove('bg-white', 'border-slate-200', 'text-slate-700');
            boton.classList.add('bg-brand-navy', 'border-brand-navy', 'text-white', 'active');
            
            ejecutarFiltros();
        });
    });

    if (btnSearch) {
        btnSearch.addEventListener('click', ejecutarFiltros);
    }

    if (searchText) {
        searchText.addEventListener('keyup', (e) => { 
            if (e.key === 'Enter') ejecutarFiltros(); 
        });
    }

    // 4. LÓGICA DE GALERÍA EN MODAL (CAMBIO DE IMAGEN AL HACER CLIC EN MINIATURA)
    modalThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            if (modalMainImg) {
                modalMainImg.src = thumb.src;
            }
            modalThumbs.forEach(t => {
                t.classList.remove('border-brand-cyan', 'border-2');
                t.classList.add('border-slate-200', 'border');
            });
            thumb.classList.remove('border-slate-200', 'border');
            thumb.classList.add('border-brand-cyan', 'border-2');
        });
    });

    // 5. APERTURA Y CARGA DEL MODAL ESTILO "NEXO INMOBILIARIO"
    botonesDetalles.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tarjetaPadre = e.target.closest('.property-card');
            if (!tarjetaPadre || !modal) return;

            const titulo = tarjetaPadre.getAttribute('data-title');
            const precioUsd = parseFloat(tarjetaPadre.getAttribute('data-price-usd')).toLocaleString('en-US');
            const precioPen = parseFloat(tarjetaPadre.getAttribute('data-price-pen')).toLocaleString('es-PE');
            const direccion = tarjetaPadre.getAttribute('data-address');
            const area = tarjetaPadre.getAttribute('data-area');
            const specs = tarjetaPadre.getAttribute('data-specs');
            const desc = tarjetaPadre.getAttribute('data-description');
            const cat = tarjetaPadre.getAttribute('data-category');

            // Obtener URLs de imágenes múltiples
            const img1 = tarjetaPadre.getAttribute('data-img1') || tarjetaPadre.querySelector('img').src;
            const img2 = tarjetaPadre.getAttribute('data-img2') || img1;
            const img3 = tarjetaPadre.getAttribute('data-img3') || img1;

            // Asignar imágenes a la galería
            if (modalMainImg) modalMainImg.src = img1;
            if (modalThumbs[0]) modalThumbs[0].src = img1;
            if (modalThumbs[1]) modalThumbs[1].src = img2;
            if (modalThumbs[2]) modalThumbs[2].src = img3;

            // Resetear bordes de miniaturas
            modalThumbs.forEach((t, index) => {
                if (index === 0) {
                    t.classList.add('border-brand-cyan', 'border-2');
                    t.classList.remove('border-slate-200');
                } else {
                    t.classList.remove('border-brand-cyan', 'border-2');
                    t.classList.add('border-slate-200');
                }
            });

            // Llenar textos del modal
            if (modalTitle) modalTitle.textContent = titulo;
            if (modalCrumbTitle) modalCrumbTitle.textContent = titulo;
            if (modalCrumbCat) modalCrumbCat.textContent = cat;
            if (modalBadge) modalBadge.textContent = cat;
            if (modalLocationTag) modalLocationTag.textContent = direccion;
            if (modalAddressVal) modalAddressVal.textContent = direccion;
            if (modalAreaVal) modalAreaVal.textContent = area;
            if (modalSpecs) modalSpecs.textContent = `${area} • ${specs}`;
            if (modalDescription) modalDescription.textContent = desc;

            const esAlquiler = tarjetaPadre.innerText.includes('/mes');
            if (modalPrice) {
                if (divisaActual === 'USD') {
                    modalPrice.textContent = `$${precioUsd} ${esAlquiler ? '/mes' : ''}`;
                } else {
                    modalPrice.textContent = `S/. ${precioPen} ${esAlquiler ? '/mes' : ''}`;
                }
            }

            // Mensaje predeterminado para el formulario y WhatsApp
            const textoMensaje = `Hola Inmobiliaria AM, estoy interesado en el inmueble "${titulo}" (${direccion}). Deseo mayor información y coordinar una visita.`;
            
            if (modalFormMsg) {
                modalFormMsg.value = textoMensaje;
            }

            if (modalWsp) {
                modalWsp.href = `https://api.whatsapp.com/send?phone=51900000000&text=${encodeURIComponent(textoMensaje)}`;
            }

            // Mostrar Modal
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden'); // Bloquear scroll del fondo
        });
    });

    // Cierre del modal
    function cerrarModal() {
        if (modal) {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    }

    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', cerrarModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
    }

    if (modalContactForm) {
        modalContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Gracias! Tu consulta ha sido registrada. Un asesor de Inmobiliaria AM se pondrá en contacto contigo.');
            cerrarModal();
        });
    }
});