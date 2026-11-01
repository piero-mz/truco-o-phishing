// Banco de correos del juego.
// - En el cuerpo, {{0}}, {{1}}... se reemplazan por los links del arreglo `links`.
// - {nombre} se reemplaza por el nombre del jugador.
// - Todas las marcas son INVENTADAS a propósito (no imitamos empresas reales).
// Si editas este archivo, ejecuta `npm run seed` para regenerar supabase/seed.sql.

export const CORREOS = [
  // ───────────── TRUCOS (phishing) ─────────────
  {
    id: "banco-falso",
    remitente_nombre: "Banco del Más Allá",
    remitente_email: "seguridad@bancodelmasalla-verificacion.xyz",
    asunto: "⚠️ Tu cuenta de ataúd será BLOQUEADA en 2 horas",
    cuerpo:
      "Estimado cliente:\n\nHemos detectado actividad inusual en tu cuenta de ataúd. Si no verificas tu identidad en las próximas 2 horas, tu cuenta será bloqueada para siempre y tus ahorros pasarán al inframundo.\n\n{{0}}\n\nAtentamente,\nÁrea de Seguridad",
    links: [
      { texto: "Verificar mi cuenta ahora", url: "http://bancodelmasalla.verificar-cripta.ru/login", malicioso: true },
    ],
    adjunto: null,
    es_phishing: true,
    senales: [
      "El dominio es bancodelmasalla-verificacion.xyz, no bancodelmasalla.com",
      "Urgencia extrema: 'en 2 horas'",
      "El link lleva a un dominio .ru que no es del banco",
      "Saludo genérico: 'Estimado cliente' en vez de tu nombre",
      "Un banco nunca te pide verificar tu cuenta por un link en un correo",
    ],
    explicacion: "Clásico phishing bancario: urgencia + dominio parecido + link a un sitio falso para robar tu clave.",
  },
  {
    id: "carta-zombi",
    remitente_nombre: "Tus Becinos",
    remitente_email: "zombis.amigables1031@gmail.com",
    asunto: "Fiesta en tu casa!!! abrenos porfavor",
    cuerpo:
      "Querrido becino:\n\nQueremos hacer una fiesta en tu sala esta noche. Por favor deja la puerta habierta y mándanos la clave del wifi y la de tu banco para comprar cerebros... digo, bocaditos.\n\nConfirma aquí: {{0}}\n\nCon cariño,\nLos zombis",
    links: [
      { texto: "Confirmar asistencia", url: "http://fiesta-zombi.tk/confirmar?enviar=clave", malicioso: true },
    ],
    adjunto: null,
    es_phishing: true,
    senales: [
      "Errores de ortografía: 'querrido', 'becino', 'habierta'",
      "Remitente desde un Gmail genérico, no de alguien que conozcas",
      "Te pide la clave del banco (¡nadie legítimo la pide!)",
      "El link apunta a un dominio .tk sospechoso",
    ],
    explicacion: "Los zombis no tocan la puerta, mandan correos. Pedir contraseñas es la señal número uno de phishing.",
  },
  {
    id: "premio-calabaza",
    remitente_nombre: "Calabaza Express",
    remitente_email: "premios@ca1abaza-express.com",
    asunto: "🎉 ¡GANASTE 1000 kg de dulces! Reclama hoy",
    cuerpo:
      "¡Felicidades!\n\nFuiste seleccionado entre millones de clientes para recibir 1000 kg de dulces gratis. Solo debes pagar S/ 9.90 por el envío.\n\n{{0}}\n\nOferta válida solo por hoy.",
    links: [
      { texto: "Reclamar mi premio", url: "https://ca1abaza-express.com/pago-envio", malicioso: true },
    ],
    adjunto: null,
    es_phishing: true,
    senales: [
      "Typosquatting: 'ca1abaza' usa un número 1 en vez de la letra L",
      "Premio demasiado bueno para ser verdad",
      "Te piden pagar para recibir algo 'gratis'",
      "Presión de tiempo: 'solo por hoy'",
    ],
    explicacion: "Si es gratis pero tienes que pagar, es truco. Y fíjate letra por letra en el dominio.",
  },
  {
    id: "netfright-falso",
    remitente_nombre: "Netfright",
    remitente_email: "no-reply@netfright-billing.support",
    asunto: "Tu suscripción de películas de terror fue suspendida",
    cuerpo:
      "Hola,\n\nNo pudimos procesar tu último pago y tu cuenta fue suspendida. Para seguir viendo tus películas de terror, actualiza tu tarjeta en:\n\n{{0}}\n\nEl equipo de Netfright",
    links: [
      { texto: "netfright.com/mi-cuenta", url: "http://netfright-billing.support/actualizar-tarjeta", malicioso: true },
    ],
    adjunto: null,
    es_phishing: true,
    senales: [
      "El texto del link dice netfright.com pero en realidad va a netfright-billing.support",
      "El remitente no es del dominio oficial netfright.com",
      "Te pide datos de tarjeta por correo",
    ],
    explicacion: "El texto de un link puede decir cualquier cosa. Lo que importa es la URL real (pasa el mouse encima).",
  },
  {
    id: "bono-exe",
    remitente_nombre: "Recursos Humanos - Universidad Tenebrosa",
    remitente_email: "rrhh@universidad-tenebrosa.edu.pe.descargas.cc",
    asunto: "Bono de Halloween para todo el personal 💰",
    cuerpo:
      "Estimado colaborador:\n\nPor Halloween, la universidad otorgará un bono especial. Descarga y completa el formulario adjunto antes de las 11:59 pm.\n\n{{0}}\n\nRecursos Humanos",
    links: [
      { texto: "Descargar formulario", url: "http://universidad-tenebrosa.edu.pe.descargas.cc/bono_halloween.pdf.exe", malicioso: true },
    ],
    adjunto: "bono_halloween.pdf.exe",
    es_phishing: true,
    senales: [
      "El dominio real es descargas.cc; 'universidad-tenebrosa.edu.pe' es solo un subdominio engañoso",
      "Doble extensión: .pdf.exe es un programa disfrazado de PDF",
      "Bono inesperado con fecha límite",
    ],
    explicacion: "El dominio verdadero es lo que está justo antes del primer '/' (las dos últimas partes). Y un .exe nunca es un PDF.",
  },
  {
    id: "jefa-bruja",
    remitente_nombre: "Morgana (Gerente General)",
    remitente_email: "morgana.gerente.oficial@outlook.com",
    asunto: "Urgente y confidencial",
    cuerpo:
      "{nombre}, ¿estás disponible?\n\nEstoy en una reunión y no puedo hablar. Necesito que compres 5 tarjetas de regalo de Pociones S.A. de S/ 200 cada una y me envíes los códigos por aquí. No le comentes a nadie, es una sorpresa para el equipo.\n\nTe lo reembolso mañana.\nMorgana",
    links: [],
    adjunto: null,
    es_phishing: true,
    senales: [
      "Tu jefa escribiendo desde un correo personal de Outlook, no el de la empresa",
      "Pide secreto: 'no le comentes a nadie'",
      "Tarjetas de regalo = dinero imposible de rastrear",
      "Urgencia y excusa para no poder hablar por teléfono",
    ],
    explicacion: "Fraude del CEO: no necesita links. Verifica siempre por otro canal (llámala).",
  },
  {
    id: "paquete-acortador",
    remitente_nombre: "Correo del Inframundo",
    remitente_email: "aviso@correo-inframundo.entrega-pendiente.info",
    asunto: "📦 No pudimos entregar tu paquete",
    cuerpo:
      "Tu paquete está retenido por falta de pago de una tasa de S/ 2.50. Si no pagas en 24 horas será devuelto al remitente.\n\nPaga aquí: {{0}}",
    links: [
      { texto: "bit.ly/3xFanTasma", url: "https://bit.ly/3xFanTasma", malicioso: true },
    ],
    adjunto: null,
    es_phishing: true,
    senales: [
      "Link acortado: no puedes ver a dónde lleva realmente",
      "Cobro pequeño para que no lo pienses mucho",
      "No dice qué paquete ni a nombre de quién",
      "Dominio raro: entrega-pendiente.info",
    ],
    explicacion: "Las 'tasas pendientes' pequeñas son un gancho para robarte los datos de la tarjeta.",
  },

  // ───────────── DULCES (legítimos) ─────────────
  {
    id: "junta-vecinal",
    remitente_nombre: "Junta Vecinal Los Cipreses",
    remitente_email: "junta@loscipreses.pe",
    asunto: "Ruta de dulces este 31: horario y recomendaciones",
    cuerpo:
      "Hola, {nombre}:\n\nEste 31 de octubre la ruta de dulces será de 6:00 pm a 9:00 pm. Las casas participantes tendrán una calabaza en la puerta. Recuerden acompañar a los niños.\n\nPuedes ver el mapa de la ruta en {{0}}\n\n¡Feliz Halloween!\nJunta Vecinal",
    links: [
      { texto: "loscipreses.pe/halloween", url: "https://loscipreses.pe/halloween/mapa", malicioso: false },
    ],
    adjunto: null,
    es_phishing: false,
    senales: [
      "El remitente y el link usan el mismo dominio: loscipreses.pe",
      "Te llama por tu nombre",
      "No pide datos, dinero ni contraseñas",
      "Sin urgencia ni amenazas",
    ],
    explicacion: "Información útil, remitente coherente y nada que te pida datos. ¡Dulce!",
  },
  {
    id: "banco-real",
    remitente_nombre: "Banco del Más Allá",
    remitente_email: "notificaciones@bancodelmasalla.com",
    asunto: "Tu estado de cuenta de octubre está disponible",
    cuerpo:
      "Hola, {nombre}:\n\nTu estado de cuenta de octubre ya está disponible en la app y en la banca por internet.\n\nPor tu seguridad, nunca te pediremos tu clave por correo. Ingresa escribiendo {{0}} directamente en tu navegador.\n\nBanco del Más Allá",
    links: [
      { texto: "bancodelmasalla.com", url: "https://bancodelmasalla.com", malicioso: false },
    ],
    adjunto: null,
    es_phishing: false,
    senales: [
      "Dominio oficial: bancodelmasalla.com",
      "El link muestra exactamente a dónde va",
      "Te recuerda que nunca pedirán tu clave",
      "Te llama por tu nombre y no hay urgencia",
    ],
    explicacion: "Compáralo con el correo falso del banco: mismo nombre, pero dominio correcto y sin presión.",
  },
  {
    id: "pedido-real",
    remitente_nombre: "Calabaza Express",
    remitente_email: "pedidos@calabaza-express.com",
    asunto: "Tu pedido #4821 está en camino 🎃",
    cuerpo:
      "Hola, {nombre}:\n\nTu disfraz de vampiro (pedido #4821) llegará mañana entre las 2:00 pm y las 6:00 pm.\n\n{{0}}\n\nGracias por comprar en Calabaza Express.",
    links: [
      { texto: "Seguir mi pedido", url: "https://calabaza-express.com/pedidos/4821", malicioso: false },
    ],
    adjunto: null,
    es_phishing: false,
    senales: [
      "Dominio correcto: calabaza-express.com (con L, no con 1)",
      "Detalles concretos: número de pedido y producto",
      "No pide pagos ni datos",
    ],
    explicacion: "Un correo de seguimiento normal: datos específicos y el link va al dominio oficial.",
  },
  {
    id: "profesor-real",
    remitente_nombre: "Prof. Van Helsing",
    remitente_email: "vhelsing@universidad-tenebrosa.edu.pe",
    asunto: "Recordatorio: entrega del proyecto HaaS",
    cuerpo:
      "Estimados estudiantes:\n\nLes recuerdo que la entrega del proyecto Halloween as a Service es la próxima clase. Suban el link de su despliegue en el aula virtual: {{0}}\n\nSaludos,\nProf. Van Helsing",
    links: [
      { texto: "Aula virtual", url: "https://aulavirtual.universidad-tenebrosa.edu.pe/curso/cloud", malicioso: false },
    ],
    adjunto: null,
    es_phishing: false,
    senales: [
      "Dominio institucional real: universidad-tenebrosa.edu.pe (está al final, no al inicio)",
      "El link es un subdominio de la misma universidad",
      "No pide credenciales ni dinero",
    ],
    explicacion: "Compáralo con el del bono: aquí el dominio termina en .edu.pe, así que sí es de la universidad.",
  },
  {
    id: "netfright-real",
    remitente_nombre: "Netfright",
    remitente_email: "info@netfright.com",
    asunto: "Nuevos estrenos de terror para esta noche 👻",
    cuerpo:
      "Hola, {nombre}:\n\nPreparamos una selección de películas de terror para tu noche de Halloween.\n\n{{0}}\n\nQue disfrutes (y no apagues la luz).",
    links: [
      { texto: "Ver catálogo", url: "https://www.netfright.com/estrenos", malicioso: false },
    ],
    adjunto: null,
    es_phishing: false,
    senales: [
      "Dominio oficial netfright.com en remitente y link",
      "Es solo publicidad: no pide pagos ni datos",
    ],
    explicacion: "Publicidad normal del servicio. Dominio coherente y nada que te pida información.",
  },
];

// Texto a resaltar dentro de la carta al revelar la respuesta.
// Cada posición corresponde a la señal con el mismo índice en `senales`
// (null = esa señal no tiene un texto concreto que marcar).
// {nombre} se reemplaza por el nombre del jugador.
export const MARCAS = {
  "banco-falso": ["bancodelmasalla-verificacion.xyz", "en las próximas 2 horas", "bancodelmasalla.verificar-cripta.ru", "Estimado cliente", "Verificar mi cuenta ahora"],
  "carta-zombi": ["Querrido becino", "@gmail.com", "la de tu banco", "fiesta-zombi.tk"],
  "premio-calabaza": ["ca1abaza-express.com", "1000 kg de dulces gratis", "Solo debes pagar S/ 9.90", "solo por hoy"],
  "netfright-falso": ["netfright.com/mi-cuenta", "netfright-billing.support", "actualiza tu tarjeta"],
  "bono-exe": ["descargas.cc", ".pdf.exe", "bono especial"],
  "jefa-bruja": ["@outlook.com", "No le comentes a nadie", "tarjetas de regalo", "no puedo hablar"],
  "paquete-acortador": ["bit.ly/3xFanTasma", "S/ 2.50", "Tu paquete está retenido", "entrega-pendiente.info"],
  "junta-vecinal": ["loscipreses.pe", "Hola, {nombre}", null, null],
  "banco-real": ["bancodelmasalla.com", null, "nunca te pediremos tu clave por correo", "Hola, {nombre}"],
  "pedido-real": ["calabaza-express.com", "pedido #4821", null],
  "profesor-real": ["universidad-tenebrosa.edu.pe", null, null],
  "netfright-real": ["netfright.com", null],
};

for (const c of CORREOS) c.marcas = MARCAS[c.id] || [];
