document.addEventListener('DOMContentLoaded', async () => {
  // Cargar configuración desde backend
  let whatsappNumber = '';
  let publicKey = '';

  try {
    const response = await fetch('/config');
    const config = await response.json();
    whatsappNumber = config.whatsappNumber;
    publicKey = config.publicKey;
  } catch (err) {
    console.error('Error al cargar configuración:', err);
    // Fallback por si acaso, pero en producción vendrá del servidor
    whatsappNumber = '52'; // reemplazar si es necesario
  }

  // Función para abrir WhatsApp
  function openWhatsApp(message = 'Hola, quiero información de Negocio Online 72H') {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // Botones de WhatsApp
  document.querySelectorAll('.btn-wa-header, .btn-wa-hero, .btn-plan-wa, #floatingWa, .footer-wa').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let plan = btn.getAttribute('data-plan') || '';
      let msg = 'Hola, quiero información de Negocio Online 72H';
      if (plan) {
        msg = `Hola, quiero información del ${plan === 'arranque' ? 'Plan Arranque' : 'Plan Negocio Pro'} de Negocio Online 72H`;
      }
      openWhatsApp(msg);
    });
  });

  // Scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Botones de pago
  document.querySelectorAll('.btn-pay').forEach(button => {
    button.addEventListener('click', async (e) => {
      const plan = button.getAttribute('data-plan');
      if (!plan) return;
      button.disabled = true;
      button.textContent = 'Redirigiendo a Mercado Pago...';
      try {
        const res = await fetch('/create-preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan })
        });
        const data = await res.json();
        if (data.init_point) {
          window.location.href = data.init_point;
        } else {
          alert('Error al crear el pago: ' + (data.error || 'Intenta de nuevo'));
        }
      } catch (error) {
        alert('Error de conexión. Intenta más tarde.');
        console.error(error);
      } finally {
        button.disabled = false;
        button.textContent = plan === 'arranque' ? 'Pagar Plan Arranque' : 'Pagar Plan Pro';
      }
    });
  });
});
