document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('contact-form');

  if (!formulario) {
    return;
  }

  const estado = document.getElementById('contact-form-status');
  const boton = document.getElementById('contact-submit');

  function mostrarEstado(mensaje, tipo) {
    const estilos = {
      cargando: 'bg-sky-50 border-sky-200 text-sky-700',
      exito: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      error: 'bg-red-50 border-red-200 text-red-700'
    };

    estado.className =
      `border rounded-lg px-4 py-3 text-sm ${estilos[tipo]}`;

    estado.textContent = mensaje;
  }

  formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!formulario.reportValidity()) {
      return;
    }

    const datos = {
      nombre: document.getElementById('contact-name').value.trim(),
      celular: document.getElementById('contact-phone').value.trim(),
      correo: document.getElementById('contact-email').value.trim(),
      tipoConsulta: document.getElementById('contact-type').value,
      mensaje: document.getElementById('contact-message').value.trim()
    };

    const textoOriginal = boton.textContent;

    boton.disabled = true;
    boton.textContent = 'Enviando consulta...';

    mostrarEstado(
      'Enviando tu consulta y la confirmación...',
      'cargando'
    );

    try {
      const respuesta = await fetch(
        `${window.APP_CONFIG.apiBaseUrl}/api/contacto`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || 'No se pudo enviar la consulta.'
        );
      }

      mostrarEstado(resultado.mensaje, 'exito');
      formulario.reset();

    } catch (error) {
      console.error(error);

      mostrarEstado(
        error.message ||
          'No se pudo conectar con el servidor.',
        'error'
      );

    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
});