// Esperar a que el árbol del DOM semántico esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    const tarjetasPropiedades = document.querySelectorAll('.property-card');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            // 1. Limpiar estilos activos de Tailwind en los botones previos
            botonesFiltro.forEach(btn => {
                btn.classList.remove('bg-blue-900', 'text-white', 'active');
                btn.classList.add('bg-white', 'text-slate-600', 'hover:bg-slate-50');
            });

            // 2. Aplicar estilos activos al botón presionado
            boton.classList.add('bg-blue-900', 'text-white', 'active');
            boton.classList.remove('bg-white', 'text-slate-600', 'hover:bg-slate-50');

            const categoriaFiltro = boton.getAttribute('data-filter');

            // 3. Algoritmo de filtrado espacial sobre la rejilla CSS Grid
            tarjetasPropiedades.forEach(tarjeta => {
                const categoriaTarjeta = tarjeta.getAttribute('data-category');

                if (categoriaFiltro === 'todos' || categoriaTarjeta === categoriaFiltro) {
                    tarjeta.classList.remove('hidden');
                } else {
                    tarjeta.classList.add('hidden');
                }
            });
        });
    });
});