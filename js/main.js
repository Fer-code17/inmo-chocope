document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // SELECTORES DEL DOM
    // -------------------------------------------------------------
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

    // Controles Modal
    const modal = document.getElementById('modal-details');
    const btnCerrarModal = document.getElementById('modal-close');
    const botonesDetalles = document.querySelectorAll('.btn-details');

    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalAddress = document.getElementById('modal-address');
    const modalSpecs = document.getElementById('modal-specs');
    const modalDescription = document.getElementById('modal-description');
    const modalBadge = document.getElementById('modal-badge');
    const modalWsp = document.getElementById('modal-wsp');

    // Menú Hamburguesa Móvil
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // -------------------------------------------------------------
    // 1. MENU MÓVIL
    // -------------------------------------------------------------
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // -------------------------------------------------------------
    // 2. CONMUTADOR DE MONEDA (USD / PEN)
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // 3. MOTOR DE FILTRADO Y BÚSQUEDA
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // 4. CONTROL DEL MODAL DE DETALLES
    // -------------------------------------------------------------
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

            if (modalTitle) modalTitle.textContent = titulo;
            if (modalAddress) modalAddress.textContent = `📍 ${direccion}`;
            if (modalSpecs) modalSpecs.textContent = `Metraje: ${area} • ${specs}`;
            if (modalDescription) modalDescription.textContent = desc;
            if (modalBadge) modalBadge.textContent = cat;

            const esAlquiler = tarjetaPadre.innerText.includes('/mes');
            if (modalPrice) {
                if (divisaActual === 'USD') {
                    modalPrice.textContent = `$${precioUsd} ${esAlquiler ? '/mes' : ''}`;
                } else {
                    modalPrice.textContent = `S/. ${precioPen} ${esAlquiler ? '/mes' : ''}`;
                }
            }

            if (modalWsp) {
                const mensajeWsp = encodeURIComponent(`Hola Inmobiliaria AM, me interesa la propiedad: "${titulo}". Quisiera agendar una visita.`);
                modalWsp.href = `https://api.whatsapp.com/send?phone=51900000000&text=${mensajeWsp}`;
            }

            modal.classList.remove('hidden');
        });
    });

    if (btnCerrarModal && modal) {
        btnCerrarModal.addEventListener('click', () => modal.classList.add('hidden'));
    }

    if (modal) {
        window.addEventListener('click', (e) => { 
            if (e.target === modal) modal.classList.add('hidden'); 
        });
    }
});