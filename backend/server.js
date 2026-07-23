require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Dominios autorizados
const origenesPermitidos = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'https://fer-code17.github.io'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite Postman y solicitudes locales sin Origin
    if (!origin || origenesPermitidos.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS'));
  }
}));

app.use(express.json());

// Configuración del correo
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function escaparHtml(texto = '') {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Comprobar que el backend está funcionando
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'Backend de Inmobiliaria AM funcionando'
  });
});

// Recibir una consulta
app.post('/api/contacto', async (req, res) => {
  try {
    const {
      nombre,
      celular,
      correo,
      tipoConsulta,
      mensaje
    } = req.body;

    if (!nombre || !celular || !correo || !tipoConsulta || !mensaje) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Completa todos los campos.'
      });
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(correo)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Ingresa un correo válido.'
      });
    }

    const datosSeguros = {
      nombre: escaparHtml(nombre.trim()),
      celular: escaparHtml(celular.trim()),
      correo: correo.trim().toLowerCase(),
      tipoConsulta: escaparHtml(tipoConsulta.trim()),
      mensaje: escaparHtml(mensaje.trim())
    };

    // Correo que recibe la inmobiliaria
    await transporter.sendMail({
      from: `"Inmobiliaria AM" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: datosSeguros.correo,
      subject: `Nueva consulta: ${datosSeguros.tipoConsulta}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto">
          <div style="background:#0B1E36;color:white;padding:25px">
            <h2 style="margin:0">Nueva consulta inmobiliaria</h2>
          </div>

          <div style="padding:25px;border:1px solid #e2e8f0">
            <p><strong>Nombre:</strong> ${datosSeguros.nombre}</p>
            <p><strong>Celular:</strong> ${datosSeguros.celular}</p>
            <p><strong>Correo:</strong> ${datosSeguros.correo}</p>
            <p><strong>Tipo de consulta:</strong> ${datosSeguros.tipoConsulta}</p>

            <hr style="border:none;border-top:1px solid #e2e8f0">

            <p><strong>Mensaje:</strong></p>
            <p>${datosSeguros.mensaje}</p>

            <p style="color:#64748b;font-size:13px">
              Puedes responder directamente a este correo para comunicarte
              con el cliente.
            </p>
          </div>
        </div>
      `
    });

    // Confirmación para el cliente
    await transporter.sendMail({
      from: `"Inmobiliaria AM" <${process.env.EMAIL_USER}>`,
      to: datosSeguros.correo,
      replyTo: process.env.EMAIL_TO,
      subject: 'Hemos recibido tu consulta - Inmobiliaria AM',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto">
          <div style="background:#0B1E36;color:white;padding:25px">
            <h2 style="margin:0">Consulta recibida correctamente</h2>
          </div>

          <div style="padding:25px;border:1px solid #e2e8f0">
            <p>Hola <strong>${datosSeguros.nombre}</strong>,</p>

            <p>
              Hemos recibido correctamente tu consulta. Uno de nuestros
              asesores revisará la información y se comunicará contigo.
            </p>

            <div style="background:#f8fafc;padding:18px;border-radius:8px">
              <p><strong>Tipo:</strong> ${datosSeguros.tipoConsulta}</p>
              <p><strong>Mensaje enviado:</strong></p>
              <p>${datosSeguros.mensaje}</p>
            </div>

            <p>
              Gracias por comunicarte con
              <strong>Inmobiliaria AM</strong>.
            </p>
          </div>
        </div>
      `
    });

    return res.json({
      ok: true,
      mensaje: 'Consulta enviada. Revisa tu correo para ver la confirmación.'
    });

  } catch (error) {
    console.error('Error enviando correo:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'No se pudo enviar el correo. Inténtalo nuevamente.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});