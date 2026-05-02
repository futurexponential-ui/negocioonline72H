# Negocio Online 72H — Landing + Backend con Mercado Pago

Landing page profesional y servidor Node.js para vender el servicio **Negocio Online 72H**.
Integra pagos mediante **Mercado Pago Checkout Pro** y botones de contacto directo por WhatsApp.

## Requisitos
- Node.js 18 o superior
- Cuenta de Mercado Pago (https://www.mercadopago.com.mx)
- Cuenta de WhatsApp Business (opcional, para enlace directo)

## Configuración inicial

1. Clona o descarga este proyecto.
2. Crea un archivo `.env` en la raíz con los siguientes valores:
   ```ini
   MERCADOPAGO_ACCESS_TOKEN=TU_ACCESS_TOKEN
   MERCADOPAGO_PUBLIC_KEY=TU_PUBLIC_KEY
   BASE_URL=http://localhost:3000
   WHATSAPP_NUMBER=521234567890
   PORT=3000
