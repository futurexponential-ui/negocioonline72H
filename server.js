// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const preferenceApi = new Preference(client);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Endpoint público para exponer configuración al frontend
app.get('/config', (req, res) => {
  res.json({
    whatsappNumber: process.env.WHATSAPP_NUMBER,
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
  });
});

// Crear preferencia de pago
app.post('/create-preference', async (req, res) => {
  try {
    const { plan } = req.body;
    let title, price;

    if (plan === 'arranque') {
      title = 'Plan Arranque - Negocio Online 72H';
      price = 1999;
    } else if (plan === 'pro') {
      title = 'Plan Negocio Pro - Negocio Online 72H';
      price = 2999;
    } else {
      return res.status(400).json({ error: 'Plan no válido' });
    }

    const baseUrl = process.env.BASE_URL;

    const body = {
      items: [
        {
          id: plan,
          title: title,
          quantity: 1,
          unit_price: price,
          currency_id: 'MXN',
        },
      ],
      back_urls: {
        success: `${baseUrl}/success.html`,
        failure: `${baseUrl}/failure.html`,
        pending: `${baseUrl}/pending.html`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/webhook`,
    };

    const preference = await preferenceApi.create({ body });

    res.json({ init_point: preference.init_point });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Webhook para notificaciones de Mercado Pago
app.post('/webhook', (req, res) => {
  console.log('Notificación de Mercado Pago:', req.body);
  // Aquí se puede procesar el pago (ej: marcar pedido como pagado)
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${process.env.BASE_URL}`);
});
