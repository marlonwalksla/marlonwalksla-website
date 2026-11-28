# Home page code (Nov 25, 2026)

## EN head
```
<!-- Nov 25, 2026: new Home (two paths, packages, FAQ). Section styles live in the section files. -->
<link rel="alternate" hreflang="en" href="https://www.marlonwalksla.com/" />
<link rel="alternate" hreflang="es" href="https://www.marlonwalksla.com/es" />
<link rel="alternate" hreflang="x-default" href="https://www.marlonwalksla.com/" />
<!-- Nov 25, 2026: the first hero photo (free tour print) is added by the section loader, so announce it here to start downloading right away. -->
<link rel="preload" as="image" href="https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6ae4fd054a1a3af597a87125_Master%20Polaroids%20(1).avif" type="image/avif" fetchpriority="high" />
```
## EN footer
```
<!-- Master initializer (mode switcher, map hooks) -->
<script src="https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/main-init.js?v=1"></script>

<!-- Oct 16, 2026: Spanish Home lives at /es now. Old links like /?lang=es#book go there. -->
<script>
  (function () {
    if (new URLSearchParams(window.location.search).get('lang') === 'es') {
      window.location.replace('/es' + (window.location.hash || ''));
    }
  })();
</script>

<noscript>
<!-- Crawler text. Built by tools/build_home_crawler.py (Nov 25, 2026 Home). Only shown when JavaScript is off. -->
<div class="mw-crawler-text">
<h1>Explore LA with Marlon</h1>
<p>Explore Los Angeles with a local, for solo travelers, couples, friends, and families. Free Walking Tour or Private Tours. 4.9 stars from 525 reviews.</p>
<h2>Free Walking Tour of Historic Downtown LA</h2>
<p>Come walk LA's historic downtown. Start at Bunker Hill, home of LA's arts buildings, then walk backwards in time to Placita Olvera, where the Spanish and Mexican pueblo began.</p>
<p>For first-timers and history lovers. English tour at 12:30 PM and Spanish tour at 9:30 AM. Meet at Walt Disney Concert Hall, 600 W 1st St. Free to book, tip what feels right at the end. About 2.5 hours on foot.</p>
<p>Stops: Walt Disney Concert Hall, The Broad, Angels Flight, Grand Central Market, Bradbury Building, City Hall, Placita Olvera.</p>
<p><a href="/free-walking-tour-los-angeles">Free walking tour in English</a> · <a href="/free-tour-los-angeles-espanol">Free tour en español</a></p>
<h2>Reviews</h2>
<p>525 reviews across Google, Civitatis, GuruWalk, FreeTour.com and Viator, 4.9 average, 295 in Spanish. Google: 329 reviews, 4.95.</p>
<h2>Explore LA With a Local</h2>
<p>The LA you came for, the way locals live it. You already know the places. I'll show you how we live them: where locals eat, the best views and the stories behind them. The instant camera captures the moments.</p>
<h3>Downtown Food Walk: Grand Central Market</h3>
<p>Five hours eating and exploring the historic center. Great for birthdays and big groups. $30 per person · up to 35 guests. <a href="/los-angeles-tours#group-tour">See details</a></p>
<h3>Sunset Hikes: Hollywood + Griffith Observatory</h3>
<p>Hike up to Griffith Observatory for the sunset, then dinner in Hollywood. Up to 4 guests · hotel pickup · ask for a price. <a href="/los-angeles-tours#private-inquiry">See details</a></p>
<h3>Beach Day: Santa Monica + Venice Beach</h3>
<p>The pier, the beach and the Venice Canals. Stay for the sunset. Up to 4 guests · hotel pickup · ask for a price. <a href="/los-angeles-tours#private-inquiry">See details</a></p>
<h2>LA Recommendations Map</h2>
<p>Food, shopping and more, all on one map. <a href="/maps">Explore the map</a></p>
<h2>Meet Your Local Guide</h2>
<p>I was born a few minutes from where my free tour starts, and I grew up speaking Spanish at home. Today I guide walks around Los Angeles in English and Spanish, with my sidekick Ernesto.</p>
<p><a href="/about">About Marlon</a> · <a href="/history">LA history stories</a></p>
<h2>Capturing Moments in LA</h2>
<p>Instant photos from our tours and from my own adventures around the city. <a href="https://www.instagram.com/marlonwalksla/">@marlonwalksla on Instagram</a></p>
<h2>Good to Know</h2>
<h3>What is the best walking tour of Los Angeles for first-time visitors?</h3>
<p>Start with the free walking tour of Historic Downtown LA. In about 2.5 hours you see where the city began and how it grew, with a local guide who was born a few minutes away. Guests rate it 4.9 stars across 525 reviews.</p>
<h3>What landmarks do we see on the Historic Downtown LA walking tour?</h3>
<p>We start at Walt Disney Concert Hall, then walk past The Broad to Angels Flight and Grand Central Market. We step into the Bradbury Building, pass City Hall and finish at Olvera Street, where Los Angeles began.</p>
<h3>How does a tip-based free walking tour work? How much should I tip?</h3>
<p>Booking is free. At the end you tip what the tour was worth to you, in cash or by card, Venmo, PayPal or Revolut. There is no minimum: pay what you feel.</p>
<h3>Are the tours good for solo travelers, couples and families?</h3>
<p>Yes. Solo travelers meet people easily on the free tour, since we all walk together. Couples and families love the free walk too, and a private tour lets you go at your own pace.</p>
<h3>Do you offer walking tours in Spanish?</h3>
<p>Yes. The free Downtown LA walking tour runs in Spanish at 9:30 AM and in English at 12:30 PM. Private tours are in either language.</p>
<h3>How do private Los Angeles tours work, and do you offer hotel pickup?</h3>
<p>Private tours are for up to 4 guests. I pick you up at your hotel and drive. Choose a Sunset Hike (Hollywood and Griffith Observatory), a Beach Day (Santa Monica and Venice) or tell me where you want to go, and I send you a price.</p>
<h3>Where do we meet, and what about parking or Metro?</h3>
<p>The free tour meets at Walt Disney Concert Hall, 600 W 1st St. By Metro, take the A or E line to Grand Av Arts/Bunker Hill, a short walk away; driving, park once in a Downtown garage since we stay on foot. Wear comfortable shoes and bring water.</p>
<p>Still have a question? <a href="https://wa.me/12692670410">Message Marlon</a></p>
</div>
</noscript>
```
## ES head
```
<!-- Nov 25, 2026: new Spanish Home (two paths, packages, FAQ). Section styles live in the section files. -->
<link rel="alternate" hreflang="en" href="https://www.marlonwalksla.com/" />
<link rel="alternate" hreflang="es" href="https://www.marlonwalksla.com/es" />
<link rel="alternate" hreflang="x-default" href="https://www.marlonwalksla.com/" />
<!-- Nov 25, 2026: the first hero photo (free tour print) is added by the section loader, so announce it here to start downloading right away. -->
<link rel="preload" as="image" href="https://cdn.prod.website-files.com/6a050f29c558b4d909196aad/6ae4fd054a1a3af597a87125_Master%20Polaroids%20(1).avif" type="image/avif" fetchpriority="high" />
```
## ES footer
```
<!-- Master initializer (mode switcher, map hooks) -->
<script src="https://cdn.jsdelivr.net/gh/marlonwalksla/marlonwalksla-website@main/main-init.js?v=1"></script>

<noscript>
<!-- Crawler text. Built by tools/build_home_crawler.py (Nov 25, 2026 Home). Only shown when JavaScript is off. -->
<div class="mw-crawler-text">
<h1>Explora LA con Marlon</h1>
<p>Explora Los Ángeles con un local, para viajeros solos, parejas, amigos y familias. Free tour en español o tours privados. 4,9 estrellas en 525 reseñas.</p>
<h2>Free tour a pie por el centro histórico de Los Ángeles</h2>
<p>Ven a caminar por el centro histórico de LA. Empezamos en Bunker Hill, donde están los edificios de las artes de LA, y retrocedemos en el tiempo hasta la Placita Olvera, donde nació el pueblo español y mexicano.</p>
<p>Para primerizos y amantes de la historia. Tour en español a las 9:30 AM y en inglés a las 12:30 PM. Punto de encuentro: Walt Disney Concert Hall, 600 W 1st St. Reserva gratis y deja la propina que quieras al final. Unas 2,5 horas a pie.</p>
<p>Paradas: Walt Disney Concert Hall, The Broad, Angels Flight, Grand Central Market, Bradbury Building, City Hall, Placita Olvera.</p>
<p><a href="/free-tour-los-angeles-espanol">Free tour por Los Ángeles en español</a> · <a href="/free-walking-tour-los-angeles">Free tour in English</a></p>
<h2>Reseñas</h2>
<p>525 reseñas en Google, Civitatis, GuruWalk, FreeTour.com y Viator, promedio de 4,9; 295 en español. Google: 329 reseñas, 4,95.</p>
<h2>Explora LA con un local</h2>
<p>El LA que viniste a ver, como lo vivimos aquí. Ya conoces los lugares. Te enseño cómo los vivimos: dónde comemos, las mejores vistas y las historias detrás. La cámara instantánea captura los momentos.</p>
<h3>Ruta de comida en el centro: Grand Central Market</h3>
<p>Cinco horas comiendo y explorando el centro histórico. Ideal para cumpleaños y grupos grandes. $30 por persona · hasta 35 personas. <a href="/excursiones-los-angeles#group-tour">Ver detalles</a></p>
<h3>Caminatas al atardecer: Hollywood + Observatorio Griffith</h3>
<p>Subimos al Observatorio Griffith para el atardecer y cenamos en Hollywood. Hasta 4 personas · te recojo en tu hotel · pide tu precio. <a href="/excursiones-los-angeles#private-inquiry">Ver detalles</a></p>
<h3>Día de playa: Santa Monica + Venice Beach</h3>
<p>El muelle, la playa y los canales de Venice. Quédate al atardecer. Hasta 4 personas · te recojo en tu hotel · pide tu precio. <a href="/excursiones-los-angeles#private-inquiry">Ver detalles</a></p>
<h2>Mapa de recomendaciones de LA</h2>
<p>Comida, compras y más, todo en un mapa. <a href="/mapa-los-angeles">Explora el mapa</a></p>
<h2>Conoce a tu guía local</h2>
<p>Nací a pocos minutos de donde empieza mi free tour y crecí hablando español en casa. Hoy guío caminatas por Los Ángeles en español y en inglés, con mi compañero Ernesto.</p>
<p><a href="/about">Sobre Marlon</a> · <a href="/historia-de-los-angeles">Historia de LA</a></p>
<h2>Capturando momentos en LA</h2>
<p>Fotos instantáneas de nuestros tours y de mis aventuras por la ciudad. <a href="https://www.instagram.com/marlonwalksla/">@marlonwalksla en Instagram</a></p>
<h2>Bueno saber</h2>
<h3>¿Cuál es el mejor tour a pie por Los Ángeles para quien viene por primera vez?</h3>
<p>Empieza con el free tour a pie por el centro histórico de LA. En unas 2,5 horas ves dónde nació la ciudad y cómo creció, con un guía local que nació a pocos minutos de ahí. Los invitados le dan 4,9 estrellas en 525 reseñas.</p>
<h3>¿Qué lugares vemos en el tour a pie por el centro histórico de LA?</h3>
<p>Empezamos en el Walt Disney Concert Hall y caminamos por The Broad hasta Angels Flight y Grand Central Market. Entramos al Bradbury Building, pasamos por City Hall y terminamos en la calle Olvera, donde nació Los Ángeles.</p>
<h3>¿Cómo funciona un free tour con propina? ¿Cuánto debo dejar?</h3>
<p>Reservar es gratis. Al final dejas la propina que el tour valió para ti, en efectivo o con tarjeta, Venmo, PayPal o Revolut. No hay mínimo: paga lo que sientas.</p>
<h3>¿Los tours son buenos para viajeros solos, parejas y familias?</h3>
<p>Sí. Quien viaja solo conoce gente fácilmente en el free tour, porque caminamos todos juntos. A las parejas y familias también les encanta, y un tour privado te deja ir a tu ritmo.</p>
<h3>¿Tienen tours a pie en español?</h3>
<p>Sí. El free tour a pie por el centro de LA sale en español a las 9:30 AM y en inglés a las 12:30 PM. Los tours privados son en el idioma que prefieras.</p>
<h3>¿Cómo funcionan los tours privados y las excursiones por Los Ángeles? ¿Me recogen en el hotel?</h3>
<p>Los tours privados son para hasta 4 personas. Te recojo en tu hotel y manejo yo. Elige una caminata al atardecer (Hollywood y el Observatorio Griffith), un día de playa (Santa Monica y Venice) o dime a dónde quieres ir, y te mando un precio.</p>
<h3>¿Dónde nos vemos? ¿Y el estacionamiento o el Metro?</h3>
<p>El free tour sale del Walt Disney Concert Hall, 600 W 1st St. En Metro, toma la línea A o E hasta Grand Av Arts/Bunker Hill, a pocos pasos; si vienes en auto, estaciona una vez en un garaje del centro porque vamos a pie. Usa zapatos cómodos y trae agua.</p>
<p>¿Tienes otra pregunta? <a href="https://wa.me/12692670410">Escríbele a Marlon</a></p>
</div>
</noscript>
```
