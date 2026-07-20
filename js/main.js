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

    // 1. CONMUTADOR DE MONEDA
    function cambiarMoneda(moneda) {
        divisaActual = moneda;
        if (moneda === 'USD') {
            btnUsd.classList.add('bg-blue-950', 'text-white');
            btnUsd.classList.remove('text-slate-600');
            btnPen.classList.remove('bg-blue-950', 'text-white');
            btnPen.classList.add('text-slate-600');
        } else {
            btnPen.classList.add('bg-blue-950', 'text-white');
            btnPen.classList.remove('text-slate-600');
            btnUsd.classList.remove('bg-blue-950', 'text-white');
            btnUsd.classList.add('text-slate-600');
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

    btnUsd.addEventListener('click', () => cambiarMoneda('USD'));
    btnPen.addEventListener('click', () => cambiarMoneda('PEN'));

    // 2. MOTOR DE FILTRADO
    function ejecutarFiltros() {
        const categoriaActiva = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const ubicacionSeleccionada = searchLocation.value;
        const textoBusqueda = searchText.value.toLowerCase().trim();

        tarjetasPropiedades.forEach(tarjeta => {
            const catTarjeta = tarjeta.getAttribute('data-category');
            const ubiTarjeta = tarjeta.getAttribute('data-location-tag');
            const palabrasClave = tarjeta.getAttribute('data-keywords').toLowerCase();

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
            botonesFiltro.forEach(b => b.classList.remove('bg-blue-950', 'text-white', 'active'));
            boton.classList.add('bg-blue-950', 'text-white', 'active');
            ejecutarFiltros();
        });
    });

    btnSearch.addEventListener('click', ejecutarFiltros);
    searchText.addEventListener('keyup', (e) => { if (e.key === 'Enter') ejecutarFiltros(); });

    // 3. CONTROL DEL MODAL
    botonesDetalles.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tarjetaPadre = e.target.closest('.property-card');
            
            const titulo = tarjetaPadre.getAttribute('data-title');
            const precioUsd = parseFloat(tarjetaPadre.getAttribute('data-price-usd')).toLocaleString('en-US');
            const precioPen = parseFloat(tarjetaPadre.getAttribute('data-price-pen')).toLocaleString('es-PE');
            const direccion = tarjetaPadre.getAttribute('data-address');
            const area = tarjetaPadre.getAttribute('data-area');
            const specs = tarjetaPadre.getAttribute('data-specs');
            const desc = tarjetaPadre.getAttribute('data-description');
            const cat = tarjetaPadre.getAttribute('data-category');

            modalTitle.textContent = titulo;
            modalAddress.textContent = `📍 ${direccion}`;
            modalSpecs.textContent = `Metraje: ${area} • ${specs}`;
            modalDescription.textContent = desc;
            modalBadge.textContent = cat;

            const esAlquiler = tarjetaPadre.innerText.includes('/mes');
            if (divisaActual === 'USD') {
                modalPrice.textContent = `$${precioUsd} ${esAlquiler ? '/mes' : ''}`;
            } else {
                modalPrice.textContent = `S/. ${precioPen} ${esAlquiler ? '/mes' : ''}`;
            }

            const mensajeWsp = encodeURIComponent(`Hola InmoChocope, me interesa la propiedad: "${titulo}". Quisiera agendar una visita.`);
            modalWsp.href = `https://api.whatsapp.com/send?phone=51999999999&text=${mensajeWsp}`;

            modal.classList.remove('hidden');
        });
    });

    btnCerrarModal.addEventListener('click', () => modal.classList.add('hidden'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
});
// Control del Menú Hamburguesa Móvil
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }