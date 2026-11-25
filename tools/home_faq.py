"""Nov 25, 2026: Good to Know FAQ for the new Home and /es (7 questions people search for).
One source for the accordion (make_home_draft.py), the FAQPage JSON-LD and the crawler text."""
FAQ = {
 "en": [
  ("What is the best walking tour of Los Angeles for first-time visitors?",
   "Start with the free walking tour of Historic Downtown LA. In about 2.5 hours you see where the city began and how it grew, with a local guide who was born a few minutes away. Guests rate it 4.9 stars across 525 reviews."),
  ("What landmarks do we see on the Historic Downtown LA walking tour?",
   "We start at Walt Disney Concert Hall, then walk past The Broad to Angels Flight and Grand Central Market. We step into the Bradbury Building, pass City Hall and finish at Olvera Street, where Los Angeles began."),
  ("How does a tip-based free walking tour work? How much should I tip?",
   "Booking is free. At the end you tip what the tour was worth to you, in cash or by card, Venmo, PayPal or Revolut. There is no minimum: pay what you feel."),
  ("Are the tours good for solo travelers, couples and families?",
   "Yes. Solo travelers meet people easily on the free tour, since we all walk together. Couples and families love the free walk too, and a private tour lets you go at your own pace."),
  ("Do you offer walking tours in Spanish?",
   "Yes. The free Downtown LA walking tour runs in Spanish at 9:30 AM and in English at 12:30 PM. Private tours are in either language."),
  ("How do private Los Angeles tours work, and do you offer hotel pickup?",
   "Private tours are for up to 4 guests. I pick you up at your hotel and drive. Choose a Sunset Hike (Hollywood and Griffith Observatory), a Beach Day (Santa Monica and Venice) or tell me where you want to go, and I send you a price."),
  ("Where do we meet, and what about parking or Metro?",
   "The free tour meets at Walt Disney Concert Hall, 600 W 1st St. By Metro, take the A or E line to Grand Av Arts/Bunker Hill, a short walk away; driving, park once in a Downtown garage since we stay on foot. Wear comfortable shoes and bring water."),
 ],
 "es": [
  ("¿Cuál es el mejor tour a pie por Los Ángeles para quien viene por primera vez?",
   "Empieza con el free tour a pie por el centro histórico de LA. En unas 2,5 horas ves dónde nació la ciudad y cómo creció, con un guía local que nació a pocos minutos de ahí. Los invitados le dan 4,9 estrellas en 525 reseñas."),
  ("¿Qué lugares vemos en el tour a pie por el centro histórico de LA?",
   "Empezamos en el Walt Disney Concert Hall y caminamos por The Broad hasta Angels Flight y Grand Central Market. Entramos al Bradbury Building, pasamos por City Hall y terminamos en la calle Olvera, donde nació Los Ángeles."),
  ("¿Cómo funciona un free tour con propina? ¿Cuánto debo dejar?",
   "Reservar es gratis. Al final dejas la propina que el tour valió para ti, en efectivo o con tarjeta, Venmo, PayPal o Revolut. No hay mínimo: paga lo que sientas."),
  ("¿Los tours son buenos para viajeros solos, parejas y familias?",
   "Sí. Quien viaja solo conoce gente fácilmente en el free tour, porque caminamos todos juntos. A las parejas y familias también les encanta, y un tour privado te deja ir a tu ritmo."),
  ("¿Tienen tours a pie en español?",
   "Sí. El free tour a pie por el centro de LA sale en español a las 9:30 AM y en inglés a las 12:30 PM. Los tours privados son en el idioma que prefieras."),
  ("¿Cómo funcionan los tours privados por Los Ángeles? ¿Me recogen en el hotel?",
   "Los tours privados son para hasta 4 personas. Te recojo en tu hotel y manejo yo. Elige una caminata al atardecer (Hollywood y el Observatorio Griffith), un día de playa (Santa Monica y Venice) o dime a dónde quieres ir, y te mando un precio."),
  ("¿Dónde nos vemos? ¿Y el estacionamiento o el Metro?",
   "El free tour sale del Walt Disney Concert Hall, 600 W 1st St. En Metro, toma la línea A o E hasta Grand Av Arts/Bunker Hill, a pocos pasos; si vienes en auto, estaciona una vez en un garaje del centro porque vamos a pie. Usa zapatos cómodos y trae agua."),
 ],
}
TXT = {"en": dict(title="Good to Know", sub="Quick answers before you book.", more="Still have a question?", msg="Message Marlon"),
       "es": dict(title="Bueno saber", sub="Respuestas rápidas antes de reservar.", more="¿Tienes otra pregunta?", msg="Escríbele a Marlon")}

def faq_schema(lang):
    return {"@type": "FAQPage", "inLanguage": lang, "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ[lang]]}
