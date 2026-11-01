-- Generado automáticamente con `npm run seed`. No editar a mano: edita data/correos.js.
-- Pégalo en Supabase → SQL Editor DESPUÉS de schema.sql.

insert into public.correos
  (id, remitente_nombre, remitente_email, asunto, cuerpo, links, adjunto, es_phishing, senales, explicacion, marcas)
values
  ('banco-falso', 'Banco del Más Allá', 'seguridad@bancodelmasalla-verificacion.xyz', '⚠️ Tu cuenta de ataúd será BLOQUEADA en 2 horas', 'Estimado cliente:

Hemos detectado actividad inusual en tu cuenta de ataúd. Si no verificas tu identidad en las próximas 2 horas, tu cuenta será bloqueada para siempre y tus ahorros pasarán al inframundo.

{{0}}

Atentamente,
Área de Seguridad', '[{"texto":"Verificar mi cuenta ahora","url":"http://bancodelmasalla.verificar-cripta.ru/login","malicioso":true}]'::jsonb, null, true, '["El dominio es bancodelmasalla-verificacion.xyz, no bancodelmasalla.com","Urgencia extrema: ''en 2 horas''","El link lleva a un dominio .ru que no es del banco","Saludo genérico: ''Estimado cliente'' en vez de tu nombre","Un banco nunca te pide verificar tu cuenta por un link en un correo"]'::jsonb, 'Clásico phishing bancario: urgencia + dominio parecido + link a un sitio falso para robar tu clave.', '["bancodelmasalla-verificacion.xyz","en las próximas 2 horas","bancodelmasalla.verificar-cripta.ru","Estimado cliente","Verificar mi cuenta ahora"]'::jsonb),
  ('carta-zombi', 'Tus Becinos', 'zombis.amigables1031@gmail.com', 'Fiesta en tu casa!!! abrenos porfavor', 'Querrido becino:

Queremos hacer una fiesta en tu sala esta noche. Por favor deja la puerta habierta y mándanos la clave del wifi y la de tu banco para comprar cerebros... digo, bocaditos.

Confirma aquí: {{0}}

Con cariño,
Los zombis', '[{"texto":"Confirmar asistencia","url":"http://fiesta-zombi.tk/confirmar?enviar=clave","malicioso":true}]'::jsonb, null, true, '["Errores de ortografía: ''querrido'', ''becino'', ''habierta''","Remitente desde un Gmail genérico, no de alguien que conozcas","Te pide la clave del banco (¡nadie legítimo la pide!)","El link apunta a un dominio .tk sospechoso"]'::jsonb, 'Los zombis no tocan la puerta, mandan correos. Pedir contraseñas es la señal número uno de phishing.', '["Querrido becino","@gmail.com","la de tu banco","fiesta-zombi.tk"]'::jsonb),
  ('premio-calabaza', 'Calabaza Express', 'premios@ca1abaza-express.com', '🎉 ¡GANASTE 1000 kg de dulces! Reclama hoy', '¡Felicidades!

Fuiste seleccionado entre millones de clientes para recibir 1000 kg de dulces gratis. Solo debes pagar S/ 9.90 por el envío.

{{0}}

Oferta válida solo por hoy.', '[{"texto":"Reclamar mi premio","url":"https://ca1abaza-express.com/pago-envio","malicioso":true}]'::jsonb, null, true, '["Typosquatting: ''ca1abaza'' usa un número 1 en vez de la letra L","Premio demasiado bueno para ser verdad","Te piden pagar para recibir algo ''gratis''","Presión de tiempo: ''solo por hoy''"]'::jsonb, 'Si es gratis pero tienes que pagar, es truco. Y fíjate letra por letra en el dominio.', '["ca1abaza-express.com","1000 kg de dulces gratis","Solo debes pagar S/ 9.90","solo por hoy"]'::jsonb),
  ('netfright-falso', 'Netfright', 'no-reply@netfright-billing.support', 'Tu suscripción de películas de terror fue suspendida', 'Hola,

No pudimos procesar tu último pago y tu cuenta fue suspendida. Para seguir viendo tus películas de terror, actualiza tu tarjeta en:

{{0}}

El equipo de Netfright', '[{"texto":"netfright.com/mi-cuenta","url":"http://netfright-billing.support/actualizar-tarjeta","malicioso":true}]'::jsonb, null, true, '["El texto del link dice netfright.com pero en realidad va a netfright-billing.support","El remitente no es del dominio oficial netfright.com","Te pide datos de tarjeta por correo"]'::jsonb, 'El texto de un link puede decir cualquier cosa. Lo que importa es la URL real (pasa el mouse encima).', '["netfright.com/mi-cuenta","netfright-billing.support","actualiza tu tarjeta"]'::jsonb),
  ('bono-exe', 'Recursos Humanos - Universidad Tenebrosa', 'rrhh@universidad-tenebrosa.edu.pe.descargas.cc', 'Bono de Halloween para todo el personal 💰', 'Estimado colaborador:

Por Halloween, la universidad otorgará un bono especial. Descarga y completa el formulario adjunto antes de las 11:59 pm.

{{0}}

Recursos Humanos', '[{"texto":"Descargar formulario","url":"http://universidad-tenebrosa.edu.pe.descargas.cc/bono_halloween.pdf.exe","malicioso":true}]'::jsonb, 'bono_halloween.pdf.exe', true, '["El dominio real es descargas.cc; ''universidad-tenebrosa.edu.pe'' es solo un subdominio engañoso","Doble extensión: .pdf.exe es un programa disfrazado de PDF","Bono inesperado con fecha límite"]'::jsonb, 'El dominio verdadero es lo que está justo antes del primer ''/'' (las dos últimas partes). Y un .exe nunca es un PDF.', '["descargas.cc",".pdf.exe","bono especial"]'::jsonb),
  ('jefa-bruja', 'Morgana (Gerente General)', 'morgana.gerente.oficial@outlook.com', 'Urgente y confidencial', '{nombre}, ¿estás disponible?

Estoy en una reunión y no puedo hablar. Necesito que compres 5 tarjetas de regalo de Pociones S.A. de S/ 200 cada una y me envíes los códigos por aquí. No le comentes a nadie, es una sorpresa para el equipo.

Te lo reembolso mañana.
Morgana', '[]'::jsonb, null, true, '["Tu jefa escribiendo desde un correo personal de Outlook, no el de la empresa","Pide secreto: ''no le comentes a nadie''","Tarjetas de regalo = dinero imposible de rastrear","Urgencia y excusa para no poder hablar por teléfono"]'::jsonb, 'Fraude del CEO: no necesita links. Verifica siempre por otro canal (llámala).', '["@outlook.com","No le comentes a nadie","tarjetas de regalo","no puedo hablar"]'::jsonb),
  ('paquete-acortador', 'Correo del Inframundo', 'aviso@correo-inframundo.entrega-pendiente.info', '📦 No pudimos entregar tu paquete', 'Tu paquete está retenido por falta de pago de una tasa de S/ 2.50. Si no pagas en 24 horas será devuelto al remitente.

Paga aquí: {{0}}', '[{"texto":"bit.ly/3xFanTasma","url":"https://bit.ly/3xFanTasma","malicioso":true}]'::jsonb, null, true, '["Link acortado: no puedes ver a dónde lleva realmente","Cobro pequeño para que no lo pienses mucho","No dice qué paquete ni a nombre de quién","Dominio raro: entrega-pendiente.info"]'::jsonb, 'Las ''tasas pendientes'' pequeñas son un gancho para robarte los datos de la tarjeta.', '["bit.ly/3xFanTasma","S/ 2.50","Tu paquete está retenido","entrega-pendiente.info"]'::jsonb),
  ('junta-vecinal', 'Junta Vecinal Los Cipreses', 'junta@loscipreses.pe', 'Ruta de dulces este 31: horario y recomendaciones', 'Hola, {nombre}:

Este 31 de octubre la ruta de dulces será de 6:00 pm a 9:00 pm. Las casas participantes tendrán una calabaza en la puerta. Recuerden acompañar a los niños.

Puedes ver el mapa de la ruta en {{0}}

¡Feliz Halloween!
Junta Vecinal', '[{"texto":"loscipreses.pe/halloween","url":"https://loscipreses.pe/halloween/mapa","malicioso":false}]'::jsonb, null, false, '["El remitente y el link usan el mismo dominio: loscipreses.pe","Te llama por tu nombre","No pide datos, dinero ni contraseñas","Sin urgencia ni amenazas"]'::jsonb, 'Información útil, remitente coherente y nada que te pida datos. ¡Dulce!', '["loscipreses.pe","Hola, {nombre}",null,null]'::jsonb),
  ('banco-real', 'Banco del Más Allá', 'notificaciones@bancodelmasalla.com', 'Tu estado de cuenta de octubre está disponible', 'Hola, {nombre}:

Tu estado de cuenta de octubre ya está disponible en la app y en la banca por internet.

Por tu seguridad, nunca te pediremos tu clave por correo. Ingresa escribiendo {{0}} directamente en tu navegador.

Banco del Más Allá', '[{"texto":"bancodelmasalla.com","url":"https://bancodelmasalla.com","malicioso":false}]'::jsonb, null, false, '["Dominio oficial: bancodelmasalla.com","El link muestra exactamente a dónde va","Te recuerda que nunca pedirán tu clave","Te llama por tu nombre y no hay urgencia"]'::jsonb, 'Compáralo con el correo falso del banco: mismo nombre, pero dominio correcto y sin presión.', '["bancodelmasalla.com",null,"nunca te pediremos tu clave por correo","Hola, {nombre}"]'::jsonb),
  ('pedido-real', 'Calabaza Express', 'pedidos@calabaza-express.com', 'Tu pedido #4821 está en camino 🎃', 'Hola, {nombre}:

Tu disfraz de vampiro (pedido #4821) llegará mañana entre las 2:00 pm y las 6:00 pm.

{{0}}

Gracias por comprar en Calabaza Express.', '[{"texto":"Seguir mi pedido","url":"https://calabaza-express.com/pedidos/4821","malicioso":false}]'::jsonb, null, false, '["Dominio correcto: calabaza-express.com (con L, no con 1)","Detalles concretos: número de pedido y producto","No pide pagos ni datos"]'::jsonb, 'Un correo de seguimiento normal: datos específicos y el link va al dominio oficial.', '["calabaza-express.com","pedido #4821",null]'::jsonb),
  ('profesor-real', 'Prof. Van Helsing', 'vhelsing@universidad-tenebrosa.edu.pe', 'Recordatorio: entrega del proyecto HaaS', 'Estimados estudiantes:

Les recuerdo que la entrega del proyecto Halloween as a Service es la próxima clase. Suban el link de su despliegue en el aula virtual: {{0}}

Saludos,
Prof. Van Helsing', '[{"texto":"Aula virtual","url":"https://aulavirtual.universidad-tenebrosa.edu.pe/curso/cloud","malicioso":false}]'::jsonb, null, false, '["Dominio institucional real: universidad-tenebrosa.edu.pe (está al final, no al inicio)","El link es un subdominio de la misma universidad","No pide credenciales ni dinero"]'::jsonb, 'Compáralo con el del bono: aquí el dominio termina en .edu.pe, así que sí es de la universidad.', '["universidad-tenebrosa.edu.pe",null,null]'::jsonb),
  ('netfright-real', 'Netfright', 'info@netfright.com', 'Nuevos estrenos de terror para esta noche 👻', 'Hola, {nombre}:

Preparamos una selección de películas de terror para tu noche de Halloween.

{{0}}

Que disfrutes (y no apagues la luz).', '[{"texto":"Ver catálogo","url":"https://www.netfright.com/estrenos","malicioso":false}]'::jsonb, null, false, '["Dominio oficial netfright.com en remitente y link","Es solo publicidad: no pide pagos ni datos"]'::jsonb, 'Publicidad normal del servicio. Dominio coherente y nada que te pida información.', '["netfright.com",null]'::jsonb)
on conflict (id) do update set
  remitente_nombre = excluded.remitente_nombre,
  remitente_email  = excluded.remitente_email,
  asunto           = excluded.asunto,
  cuerpo           = excluded.cuerpo,
  links            = excluded.links,
  adjunto          = excluded.adjunto,
  es_phishing      = excluded.es_phishing,
  senales          = excluded.senales,
  explicacion      = excluded.explicacion,
  marcas           = excluded.marcas;
