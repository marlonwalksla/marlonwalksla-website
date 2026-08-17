/* ==========================================================================
   tour-dtla.js - MarlonWalksLA Downtown LA Interactive Walking Tour
   Repository: marlonwalksla/marlonwalksla-website
   ========================================================================== */

let currentLang = 'en';
let currentStop = 1;
const totalStops = 13;

const tourData = {
  ui: {
    en: {
      title: "Downtown LA Self-Guided Walking Tour",
      desc: "Explore 240 years of Los Angeles history stop-by-stop—from Bunker Hill's architectural heights to the 1781 birthplace at Placita Olvera.",
      stopWord: "STOP",
      ofWord: "OF",
      completeWord: "Complete",
      timelineHead: "⏱️ Chronological Milestones",
      prevBtn: "← Previous Stop",
      nextBtn: "Next Stop: ",
      finishBtn: "🎉 Complete Tour & Book Live Walk",
      mapBtn: "🗺️ Google Maps",
      promoHead: "Want to Experience This With a Local Guide?",
      promoText: "Join Marlon on the top-rated 5-star live walking tour of Downtown Los Angeles! Enjoy interactive trivia, hidden stories, and our local community in person.",
      promoLink: "https://www.freetour.com/los-angeles/free-tour-of-downtown-los-angeles",
      promoBtnText: "Book the Live Free DTLA Tour →"
    },
    es: {
      title: "Tour Autoguiado por el Centro de Los Ángeles",
      desc: "Explora 240 años de historia de Los Ángeles paso a paso—desde las alturas de Bunker Hill hasta el nacimiento de la ciudad en 1781 en Placita Olvera.",
      stopWord: "PARADA",
      ofWord: "DE",
      completeWord: "Completado",
      timelineHead: "⏱️ Hitos Cronológicos",
      prevBtn: "← Parada Anterior",
      nextBtn: "Siguiente: ",
      finishBtn: "🎉 Terminar Tour y Reservar",
      mapBtn: "🗺️ Ver en Google Maps",
      promoHead: "¿Prefieres vivir la experiencia con un guía local?",
      promoText: "¡Únete a Marlon en el tour a pie calificado con 5 estrellas! Disfruta de historia viva, trivias interactivas y secretos locales en español.",
      promoLink: "https://www.civitatis.com/es/los-angeles/free-tour-los-angeles",
      promoBtnText: "Reservar el Free Tour en Español →"
    }
  },
  stops: [
    // 1. Walt Disney Concert Hall
    {
      id: 1,
      mapUrl: "https://maps.google.com/?q=Walt+Disney+Concert+Hall+Los+Angeles",
      en: {
        title: "Walt Disney Concert Hall",
        address: "📍 111 S Grand Ave, Los Angeles, CA 90012",
        short: "1. Disney Hall",
        timeline: [
          { y: "1960s", t: "Dorothy Buffum Chandler founds the Blue Ribbon Committee to turn Bunker Hill into LA's cultural spine." },
          { y: "1987", t: "Lillian Disney donates an initial $50 million in tribute to Walt Disney." },
          { y: "1997", t: "Frank Gehry's Guggenheim Bilbao opens, accelerating global excitement for the DTLA design." },
          { y: "2003", t: "Walt Disney Concert Hall officially opens to international acoustical acclaim." },
          { y: "2009", t: "Maestro Gustavo Dudamel becomes Music & Artistic Director of the Los Angeles Philharmonic." }
        ],
        stories: [
          { h: "🏛️ The Visionaries: Lillian Disney & Frank Gehry", p: "Look around Grand Avenue—it is one of the densest corridors of performing arts institutions in the world. Decades ago, this hill was packed with Victorian boarding houses before being leveled during the 1960s urban renewal project. The transformation was spearheaded by the Blue Ribbon Committee. In 1987, Lillian Disney made an initial $50 million gift in honor of Walt Disney. Architect Frank Gehry was chosen: he grew up in LA, served in the US Army, and drove a delivery truck while studying architecture at USC at night." },
          { h: "📐 Architecture of Movement & Acoustic Physics", p: "The exterior is wrapped in over 12,500 custom-curved stainless steel panels engineered to resemble billowing ship sails caught in the wind. Inside, the 2,265-seat auditorium is lined with warm Douglas fir wood shaped like a curved ship hull. Master acoustician Yasuhisa Toyota designed the vineyard-style seating, surrounding the orchestra with the audience for pristine acoustic clarity without electronic amplification." }
        ],
        callouts: [
          { cls: "box-tip", t: "📸 Hidden Rooftop Garden", d: "Climb the outdoor stairs on Hope St to find the Blue Ribbon Garden, featuring a mosaic rose fountain built from broken blue-and-white Delft china in tribute to Lillian Disney." },
          { cls: "box-lore", t: "🎵 The 'French Fries' Organ", d: "Inside sits the 6,134-pipe organ nicknamed 'the French fries' for its curved, wooden exterior pipes." }
        ]
      },
      es: {
        title: "Sala de Conciertos Walt Disney (Disney Hall)",
        address: "📍 111 S Grand Ave, Los Angeles, CA 90012",
        short: "1. Disney Hall",
        timeline: [
          { y: "Años 60", t: "Dorothy Chandler funda el Comité Blue Ribbon para convertir Bunker Hill en el centro cultural de LA." },
          { y: "1987", t: "Lillian Disney dona $50 millones iniciales en homenaje a Walt Disney." },
          { y: "1997", t: "Abre el Guggenheim Bilbao de Frank Gehry, acelerando el entusiasmo por el proyecto en LA." },
          { y: "2003", t: "Inauguración oficial de la sala con aclamación acústica mundial." },
          { y: "2009", t: "Gustavo Dudamel asume como Director Musical de la Filarmónica de Los Ángeles." }
        ],
        stories: [
          { h: "🏛️ Los Visionarios: Lillian Disney y Frank Gehry", p: "Bunker Hill estuvo repleto de casas victorianas antes de ser aplanado en los años 60. Su transformación cultural fue impulsada por el Comité Blue Ribbon. En 1987, Lillian Disney donó $50 millones para la Filarmónica y contrató a Frank Gehry, quien creció en LA, sirvió en el ejército y manejó camiones mientras estudiaba arquitectura." },
          { h: "📐 Arquitectura de Movimiento y Acústica Pura", p: "El exterior cuenta con más de 12,500 paneles curvos de acero inoxidable que simulan velas de barco infladas por el viento. Por dentro, el auditorio de abeto Douglas evoca el casco de un barco, con asientos estilo viñedo diseñados por el acústico Yasuhisa Toyota sin necesidad de amplificación eléctrica." }
        ],
        callouts: [
          { cls: "box-tip", t: "📸 Jardín Secreto", d: "Sube las escaleras de Hope St hacia el jardín elevado para ver la fuente de rosas hecha con porcelana azul rota de Delft en honor a Lillian Disney." },
          { cls: "box-lore", t: "🎵 Órgano Tubular", d: "Alberga un órgano de 6,134 tubos apodado 'las papas fritas' por sus tubos de madera curvos." }
        ]
      }
    },

    // 2. The Broad
    {
      id: 2,
      mapUrl: "https://maps.google.com/?q=The+Broad+Los+Angeles",
      en: {
        title: "The Broad Museum",
        address: "📍 221 S Grand Ave (Next door to Disney Hall)",
        short: "2. The Broad",
        timeline: [
          { y: "1957", t: "Eli Broad co-founds Kaufman & Broad (KB Home), pioneering affordable suburban housing." },
          { y: "1971", t: "Broad acquires Sun Life Insurance (SunAmerica), forming his second Fortune 500 company." },
          { y: "1984", t: "The Broad Art Foundation is created to lend contemporary masterworks to global museums." },
          { y: "2015", t: "The $140 million museum opens with permanent free admission for the public." }
        ],
        stories: [
          { h: "💼 The Fortune Behind the Art: Eli & Edythe Broad", p: "Eli Broad achieved the rare feat of building two separate Fortune 500 enterprises from scratch: KB Home (constructing hundreds of thousands of suburban tract homes) and SunAmerica (financial retirement annuities). The Broads used their wealth to assemble one of the most prominent postwar and contemporary art collections in the world." },
          { h: "🏛️ 'The Veil and the Vault' Architectural Concept", p: "Designed by Diller Scofidio + Renfro for $140 million. The 'Vault' is the heavy concrete core holding thousands of artworks in archival storage. The 'Veil' is the porous, honeycomb-like exterior shell of 2,000 fiberglass-reinforced panels that wraps the vault, filtering daylight into top-floor galleries without damaging sensitive pigments." }
        ],
        callouts: [
          { cls: "box-lore", t: "🎨 Iconic Artworks Inside", d: "Features Andy Warhol's Campbell's Soup Cans, Single Elvis, and 1964 Alabama Race Riot alongside Jeff Koons' mirror-polished blue Balloon Dog and Tulips." },
          { cls: "box-tip", t: "🎟️ Free Entry Secret", d: "General admission is 100% free. Reserving a free timed-entry ticket online lets you bypass the outdoor standby line." }
        ]
      },
      es: {
        title: "Museo The Broad",
        address: "📍 221 S Grand Ave (Junto al Disney Hall)",
        short: "2. The Broad",
        timeline: [
          { y: "1957", t: "Eli Broad cofunda KB Home, pionera en urbanizaciones suburbanas accesibles." },
          { y: "1971", t: "Broad adquiere SunAmerica, forjando su segunda empresa en Fortune 500." },
          { y: "1984", t: "Nace la Fundación Broad para prestar obras maestras a museos del mundo." },
          { y: "2015", t: "Abre el museo de $140 millones con entrada 100% gratuita." }
        ],
        stories: [
          { h: "💼 La Fortuna de Eli y Edythe Broad", p: "Eli Broad construyó dos imperios Fortune 500 desde cero (KB Home y SunAmerica). La pareja utilizó su patrimonio para reunir una de las colecciones privadas de arte contemporáneo más influyentes del planeta, poniéndola a disposición pública." },
          { h: "🏛️ El Concepto: 'El Velo y la Bóveda'", p: "Diseñado por Diller Scofidio + Renfro. La 'Bóveda' es el núcleo de concreto que resguarda miles de piezas en archivo; el 'Velo' es la estructura exterior de panal con 2,000 paneles de fibra de vidrio que filtra luz natural suave sin dañar las obras." }
        ],
        callouts: [
          { cls: "box-lore", t: "🎨 Obras Maestras", d: "Alberga las latas de sopa de Andy Warhol, retratos de Elvis y el Balloon Dog azul cromado de Jeff Koons." },
          { cls: "box-tip", t: "🎟️ Entrada Gratis", d: "La entrada es gratuita; reservar turno en su web te ahorra la fila exterior." }
        ]
      }
    },

    // 3. Financial District Rest Plaza
    {
      id: 3,
      mapUrl: "https://maps.google.com/?q=California+Plaza+Watercourt+Los+Angeles",
      en: {
        title: "Financial District Rest Plaza",
        address: "📍 California Plaza Watercourt (Between One & Two Cal Plaza)",
        short: "3. Cal Plaza",
        timeline: [
          { y: "1901", t: "Henry Huntington incorporates the Pacific Electric Railway ('Red Cars')." },
          { y: "1925", t: "LA becomes the global per-capita car capital (1 car per 3 residents)." },
          { y: "1940", t: "America's first freeway (Arroyo Seco Parkway / CA-110) connects Pasadena to DTLA." },
          { y: "1948", t: "In-N-Out Burger opens California's first drive-thru with intercoms in Baldwin Park." },
          { y: "1949", t: "Federal antitrust conviction of GM, Firestone, and Standard Oil in US v. National City Lines." }
        ],
        stories: [
          { h: "🚋 Henry Huntington & The Red Car Real Estate Scheme", p: "When Collis Huntington died, his nephew Henry Huntington was passed over for leadership of the Southern Pacific Railroad. He took his fortune south, partnered with banker Isaias W. Hellman, and built the Pacific Electric 'Red Cars' into the largest electric transit network on earth (1,100+ miles). The streetcars were intentionally operated as a loss leader: Huntington laid tracks into empty orange groves owned by his private land syndicates purely to sell suburban real estate, ballooning LA's population from 102,000 in 1900 to 1.2 million by 1930." },
          { h: "🚗 The Monopoly Scandal & The Automotive Shift", p: "As riders bought cars, rail lines lost revenue. In United States v. National City Lines, GM, Firestone Tire, and Standard Oil were convicted of secretly buying up 45+ streetcar networks across the nation, tearing up the rails, and motorizing transit with diesel buses." }
        ],
        callouts: [
          { cls: "box-food", t: "🍔 In-N-Out Secret Menu Lore", d: "• Animal Style: Mustard-seared beef, pickles, caramelized onions, extra spread.<br>• Protein Style: Lettuce-wrapped.<br>• Flying Dutchman: Two beef patties melted with two cheese slices (no bun, no veggies)." }
        ]
      },
      es: {
        title: "Plaza del Distrito Financiero (Descanso)",
        address: "📍 California Plaza Watercourt (Entre One y Two Cal Plaza)",
        short: "3. Cal Plaza",
        timeline: [
          { y: "1901", t: "Henry Huntington funda los tranvías 'Red Cars' de Pacific Electric." },
          { y: "1925", t: "LA se convierte en la capital mundial del automóvil (1 auto por cada 3 habitantes)." },
          { y: "1940", t: "Abre la primera autopista de EE. UU. (Arroyo Seco Parkway / CA-110) hacia DTLA." },
          { y: "1948", t: "In-N-Out Burger abre el primer autoservicio con intercomunicador en Baldwin Park." },
          { y: "1949", t: "Condena federal antimonopolio a GM, Firestone y Standard Oil por desmantelar tranvías." }
        ],
        stories: [
          { h: "🚋 Henry Huntington y el Negocio Inmobiliario", p: "Huntington expandió los tranvías 'Red Cars' a más de 1,100 millas. Los trenes operaban como gancho comercial: tendía vías hacia campos de naranjos propiedad de sus sindicatos para vender terrenos suburbanos, disparando la población de 102,000 en 1900 a 1.2 millones en 1930." },
          { h: "🚗 El Juicio Antimonopolio", p: "En el caso EE. UU. contra National City Lines, se comprobó que GM, Firestone y Standard Oil adquirieron líneas de tranvías para reemplazarlas por autobuses a diésel mientras el automóvil dominaba California." }
        ],
        callouts: [
          { cls: "box-food", t: "🍔 Menú Secreto de In-N-Out", d: "• Animal Style: Carne sellada en mostaza, cebolla caramelizada, salsa extra.<br>• Protein Style: Envuelto en lechuga.<br>• Flying Dutchman: Dos carnes y dos quesos sin pan." }
        ]
      }
    },

    // 4. California Plaza Overlook & U.S. Bank Tower
    {
      id: 4,
      mapUrl: "https://maps.google.com/?q=US+Bank+Tower+Los+Angeles",
      en: {
        title: "California Plaza Overlook & U.S. Bank Tower",
        address: "📍 Upper Terrace overlooking Grand Steps & 4th/Hope",
        short: "4. U.S. Bank Tower",
        timeline: [
          { y: "1989", t: "The 73-story Library Tower (now U.S. Bank Tower) is completed at 1,018 feet." },
          { y: "1996", t: "Incinerated by aliens in the blockbuster movie Independence Day." },
          { y: "2013", t: "Immortalized as the 'Maze Bank Tower' in Grand Theft Auto V." },
          { y: "2017", t: "Wilshire Grand Center claims tallest title at 1,100 ft using its decorative spire." }
        ],
        stories: [
          { h: "🏙️ The Skyscraper Spire Rivalry", p: "The 73-story U.S. Bank Tower (1,018 ft) stood as the tallest skyscraper west of the Mississippi for nearly 30 years. In 2017, the Wilshire Grand Center claimed the official tallest title at 1,100 feet. However, it only wins because of its 294-foot decorative open-air architectural spire—the U.S. Bank Tower’s actual highest occupied roof floor is higher." },
          { h: "⚡ Earthquake Engineering & Logarithmic Physics", p: "The tower was engineered to withstand an 8.3-magnitude earthquake on the San Andreas Fault using a central core braced with steel outriggers. Earthquake magnitude is logarithmic: every whole point represents a 10x increase in ground shaking. An 8.1 quake produces 1,000 times stronger ground shaking ($10^3$) and releases ~32,000 times more seismic energy than a moderate 5.1 temblor." }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 Cinema & Video Game Lore", d: "Featured in Independence Day (1996), San Andreas (2015), and GTA V. From 2016 to 2020, it featured the 'Skyslide'—an outdoor glass slide cantilevered 1,000 feet in the air." }
        ]
      },
      es: {
        title: "Mirador Cal Plaza y Torre U.S. Bank",
        address: "📍 Terraza Superior sobre las Grand Steps y 4th/Hope",
        short: "4. Torre U.S. Bank",
        timeline: [
          { y: "1989", t: "Inauguración de la torre de 73 pisos y 1,018 pies de altura." },
          { y: "1996", t: "Destruida por extraterrestres en la película Día de la Independencia." },
          { y: "2013", t: "Inmortalizada como la 'Torre Maze Bank' en Grand Theft Auto V." },
          { y: "2017", t: "Wilshire Grand le arrebata el récord gracias a su aguja de 294 pies." }
        ],
        stories: [
          { h: "🏙️ La Rivalidad de Rascacielos", p: "La Torre U.S. Bank (1,018 pies) fue el rascacielos más alto al oeste del Misisipi durante 30 años. El Wilshire Grand la superó con 1,100 pies únicamente por su aguja decorativa, aunque el techo habitable de la U.S. Bank sigue siendo más alto." },
          { h: "⚡ Resistencia Antisísmica y Escala Logarítmica", p: "Diseñada para resistir un terremoto de 8.3 en la Falla de San Andrés. La escala es logarítmica: un sismo 8.1 produce 1,000 veces más movimiento ($10^3$) y libera 32,000 veces más energía destructiva que un temblor 5.1." }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 En el Cine y Videojuegos", d: "Blanco del ataque extraterrestre en Día de la Independencia (1996), San Andrés (2015) y cuartel principal en GTA V." }
        ]
      }
    },

    // 5. Angels Flight Railway
    {
      id: 5,
      mapUrl: "https://maps.google.com/?q=Angels+Flight+Railway+Los+Angeles",
      en: {
        title: "Angels Flight Railway",
        address: "📍 351 S Hill St (Top Station at California Plaza)",
        short: "5. Angels Flight",
        timeline: [
          { y: "Dec 31, 1901", t: "Colonel J.W. Eddy opens the funicular on Bunker Hill." },
          { y: "1950s", t: "Surpasses 100 million passengers carried in its first 50 years." },
          { y: "1969", t: "Dismantled and stored in warehouse crates for Bunker Hill redevelopment." },
          { y: "1996", t: "Reassembled and reopened half a block away after 27 years in storage." },
          { y: "2016–2017", t: "Featured in La La Land, accelerating city safety investments to reopen." }
        ],
        stories: [
          { h: "🚋 The World's Shortest Railway", p: "Angels Flight runs along a track length of 298 feet (91 meters) on a steep 33% incline. The twin wooden funicular cars are named Sinai and Olivet, connected to a counterbalanced cable: as one car descends, its gravitational weight pulls the other up the track. In 1901, Bunker Hill was LA’s wealthiest neighborhood; wealthy residents rode it down to shop on Broadway and avoid climbing 200+ wooden steps." },
          { h: "📦 27 Years in Warehouse Storage", p: "During 1960s redevelopment, the hill was graded down. Angels Flight was dismantled and packed into wooden crates in 1969, sitting in storage for 27 years until citizen preservationists forced the city to reassemble and reopen it in 1996." }
        ],
        callouts: [
          { cls: "box-tip", t: "🎟️ Fare & Hours", d: "$1.00 each way (50¢ with a Metro TAP card). Open 365 days a year from 6:45 AM to 10:00 PM." },
          { cls: "box-lore", t: "🎬 Film Noir to Romance", d: "Beyond Ryan Gosling and Emma Stone's kiss in La La Land, it appeared in classic noirs Kiss Me Deadly (1955) and Cry Danger (1951)." }
        ]
      },
      es: {
        title: "Funicular Angels Flight",
        address: "📍 351 S Hill St (Estación Superior en Cal Plaza)",
        short: "5. Angels Flight",
        timeline: [
          { y: "31 dic 1901", t: "El Coronel J.W. Eddy inaugura el funicular en Bunker Hill." },
          { y: "Años 50", t: "Supera los 100 millones de pasajeros transportados en sus primeros 50 años." },
          { y: "1969", t: "Desmantelado y guardado en cajas durante la remodelación urbana." },
          { y: "1996", t: "Reconstruido y reabierto tras 27 años en almacenes." },
          { y: "2016", t: "Aparece en la película ganadora del Óscar La La Land." }
        ],
        stories: [
          { h: "🚋 El Ferrocarril Más Corto del Mundo", p: "Recorre 91 metros (298 pies) en una pendiente del 33%. Sus dos vagones de madera (Sinai y Olivet) funcionan contrapesados por un cable continuo. Transportaba a familias victorianas desde sus mansiones en la colina hacia los comercios de Broadway evitando subir más de 200 escalones." },
          { h: "📦 27 Años en Cajas", p: "En 1969, al aplanarse el cerro, fue guardado en cajas de madera hasta que defensores del patrimonio lograron su reconstrucción en 1996." }
        ],
        callouts: [
          { cls: "box-tip", t: "🎟️ Tarifa y Horarios", d: "$1.00 por trayecto (50¢ con tarjeta TAP de Metro). Abierto los 365 días del año de 6:45 AM a 10:00 PM." },
          { cls: "box-lore", t: "🎬 En el Cine", d: "Además del beso en La La Land, protagonizó clásicos del cine negro como Kiss Me Deadly (1955) y la serie Bosch." }
        ]
      }
    },

    // 6. Grand Central Market
    {
      id: 6,
      mapUrl: "https://maps.google.com/?q=Grand+Central+Market+Los+Angeles",
      en: {
        title: "Grand Central Market",
        address: "📍 317 S Broadway",
        short: "6. Grand Central Market",
        timeline: [
          { y: "1897", t: "Homer Laughlin Building built as LA's first fireproof, steel-reinforced structure." },
          { y: "Oct 27, 1917", t: "Grand Central Market opens as the largest food depot on the Pacific Coast." },
          { y: "1952", t: "Roast To Go opens, slow-cooking carnitas in copper pots for over 70 years." },
          { y: "1959", t: "China Cafe opens its neon-lit wonton soup lunch counter." },
          { y: "2012–2014", t: "Adele Yellin leads a modern culinary revitalization with 30+ international stalls." }
        ],
        stories: [
          { h: "🥖 The 1917 'Wonder Market'", p: "Opened in 1917 inside the Homer Laughlin Building. It operated as a direct grocery market where Bunker Hill residents rode Angels Flight down with wicker baskets to buy poultry, fresh meats from German butchers, eggs, dairy, and farm produce." },
          { h: "🌮 A Century of Immigrant Evolution", p: "Through the mid-20th century, the market adapted into an immigrant retail hub. In 2012, developer Adele Yellin modernized the space by pairing historic legacy stalls with artisanal food creators (Eggslut, Wexler’s Deli, Sticky Rice), creating a 30+ vendor global culinary destination." }
        ],
        callouts: [
          { cls: "box-food", t: "🍽️ Historic Stalls to Try", d: "• Roast To Go (1952): Carnitas tacos stewed in copper pots.<br>• Sarita’s Pupusería: Salvadoran handmade pupusas (featured in La La Land).<br>• China Cafe (1959): Wonton soup under neon counters." }
        ]
      },
      es: {
        title: "Mercado Grand Central (Descanso)",
        address: "📍 317 S Broadway",
        short: "6. Grand Central Market",
        timeline: [
          { y: "1897", t: "Construcción del edificio Homer Laughlin, primer inmueble ignífugo de LA." },
          { y: "27 oct 1917", t: "Abre como el mercado de abastos más grande de la Costa del Pacífico." },
          { y: "1952", t: "Abre Roast To Go, cocinando carnitas en cazos de cobre por más de 70 años." },
          { y: "1959", t: "China Cafe inaugura su barra de sopa wonton bajo luces de neón." },
          { y: "2012", t: "Revitalización gastronómica con más de 30 puestos internacionales." }
        ],
        stories: [
          { h: "🥖 Más de un Siglo de Historia", p: "Abrió en 1917 como centro de compras para vecinos de Bunker Hill que bajaban en Angels Flight con canastas. Con las décadas se convirtió en el gran corazón migrante con carnicerías mexicanas, delis judías y puestos asiáticos." },
          { h: "🌮 El Renacimiento Gastronómico de 2012", p: "Bajo la visión de Adele Yellin, se combinaron puestos tradicionales de comida con nuevas propuestas gourmet (Eggslut, Wexler's Deli), convirtiéndolo en un referente culinario mundial." }
        ],
        callouts: [
          { cls: "box-food", t: "🍽️ Qué Probar en el Descanso", d: "• Roast To Go (1952): Tacos de carnitas en cazo de cobre.<br>• Sarita's Pupusería: Pupusas salvadoreñas (en La La Land).<br>• China Cafe (1959): Sopa wonton tradicional en la barra." }
        ]
      }
    },

    // 7. The Bradbury Building
    {
      id: 7,
      mapUrl: "https://maps.google.com/?q=Bradbury+Building+Los+Angeles",
      en: {
        title: "The Bradbury Building",
        address: "📍 304 S Broadway (Across from Grand Central Market)",
        short: "7. Bradbury Building",
        timeline: [
          { y: "1892", t: "Lewis Bradbury hires George Wyman after a Ouija séance; Bradbury dies 14 months before opening." },
          { y: "1893", t: "Opens at a cost of $500,000; ironwork exhibited at the Chicago World's Fair." },
          { y: "1971", t: "Designated a National Historic Landmark." },
          { y: "1982", t: "Immortalized in Ridley Scott's sci-fi film Blade Runner." }
        ],
        stories: [
          { h: "👻 The Ouija Board Commission", p: "Mining millionaire Lewis Bradbury made a fortune in Sinaloa, Mexico. Suffering from asthma, he moved to LA to build a commercial monument. He hired architect Sumner Hunt, but rejected his designs as conventional. Bradbury approached Hunt's 32-year-old draftsman George Wyman, who had no architectural degree. Hesitant to accept, Wyman and his wife consulted a planchette (Ouija board). A message spelled out from his deceased brother Mark: 'Take Bradbury Building. It will make you famous.' Wyman accepted the contract the next day." },
          { h: "🚀 Victorian Sci-Fi Architecture", p: "Wyman drew inspiration from Edward Bellamy’s 1888 utopian novel Looking Backward, designing a 50-foot skylit atrium flooded with natural light and cross-breezes. Features French wrought-iron railings (exhibited at the 1893 Chicago World's Fair), Italian marble stairs, Mexican terracotta tile, hydraulic birdcage elevators, and brass Cutler gravity mail chutes." }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 The Ultimate Cinema Set", d: "• Blade Runner (1982): J.F. Sebastian's apartment where Deckard battles Roy Batty.<br>• (500) Days of Summer (2009): The architecture firm interview lobby.<br>• The Artist (2011): The silent staircase crossing scene." }
        ]
      },
      es: {
        title: "Edificio Bradbury",
        address: "📍 304 S Broadway (Frente a Grand Central Market)",
        short: "7. Edificio Bradbury",
        timeline: [
          { y: "1892", t: "Lewis Bradbury contrata a George Wyman tras una sesión de Ouija; Bradbury fallece antes de abrir." },
          { y: "1893", t: "Abre con costo de $500,000; su herrería fue premiada en la Feria Mundial de Chicago." },
          { y: "1971", t: "Nombrado Monumento Histórico Nacional." },
          { y: "1982", t: "Inmortalizado en la película de culto Blade Runner." }
        ],
        stories: [
          { h: "👻 El Mensaje de la Tabla Ouija", p: "El magnate minero Lewis Bradbury buscaba una obra irrepetible. El joven dibujante George Wyman dudaba aceptar por lealtad a su jefe hasta consultar la Ouija con su esposa; un mensaje de su difunto hermano dictó: 'Acepta el Edificio Bradbury. Te hará famoso'. Wyman aceptó el encargo a la mañana siguiente." },
          { h: "🚀 Arquitectura Futurista Victoriana", p: "Inspirado en la novela de ciencia ficción de 1888 'Mirando Atrás'. Cuenta con un atrio acristalado de 50 pies, hierro forjado francés exhibido en la Feria de Chicago de 1893, mármol italiano, pisos de losa mexicana y elevadores de jaula abierta." }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 Escenario Cinematográfico", d: "• Blade Runner (1982): Departamento de Sebastian y duelo final.<br>• (500) Días con Ella (2009): Sala de espera de arquitectura.<br>• El Artista (2011): Cruce en las escaleras." }
        ]
      }
    },

    // 8. The Million Dollar Theater
    {
      id: 8,
      mapUrl: "https://maps.google.com/?q=Million+Dollar+Theater+Los+Angeles",
      en: {
        title: "The Million Dollar Theater",
        address: "📍 307 S Broadway",
        short: "8. Million Dollar Theater",
        timeline: [
          { y: "Feb 1, 1918", t: "Showman Sid Grauman opens the palace at a reported cost of $1 million." },
          { y: "1922–1927", t: "Grauman shifts operations west, building the Egyptian and Chinese Theatres in Hollywood." },
          { y: "1949", t: "Impresario Frank Fouce takes over the lease, launching its Spanish-language Golden Age." },
          { y: "1962", t: "Frank L. Fouce co-founds KMEX-TV Channel 34, laying the foundation for Univision." }
        ],
        stories: [
          { h: "🎭 Sid Grauman’s Debut & Churrigueresque Facade", p: "Opened in 1918 as showman Sid Grauman’s first major entertainment palace in LA. Designed by Albert C. Martin Sr. with a massive Spanish Churrigueresque facade sculpted by Joseph Mora. Look closely at the stonework to spot carved bison heads, Texas longhorn steer skulls, allegorical figures of comedy/tragedy, and early movie cameras." },
          { h: "📺 Latin Music Royalty & The Birth of Univision", p: "In 1949, theater magnate Frank Fouce took over the venue (Empresa Fouce), making it the premier Spanish-language performance palace in the US, hosting Cantinflas, María Félix, Pedro Infante, Celia Cruz, and Vicente Fernández. Fouce's son co-founded KMEX-TV Channel 34 in 1962, laying the corporate foundations for the Spanish International Network (SIN), which later rebranded into Univision." }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 Pop Culture Cameo", d: "Its neon marquee glows across from the Bradbury Building in Blade Runner (1982) and appears as the 'Ten Cent Theater' in Grand Theft Auto V." }
        ]
      },
      es: {
        title: "Teatro Million Dollar",
        address: "📍 307 S Broadway",
        short: "8. Teatro Million Dollar",
        timeline: [
          { y: "1 feb 1918", t: "Sid Grauman abre su primer gran cinepalacio por $1 millón." },
          { y: "1922–1927", t: "Grauman se traslada a Hollywood, creando los Teatros Egipcio y Chino." },
          { y: "1949", t: "Frank Fouce asume el teatro, iniciando la época de oro en español." },
          { y: "1962", t: "Frank L. Fouce cofunda KMEX Canal 34, cuna de Univision." }
        ],
        stories: [
          { h: "🎭 El Debut de Grauman y Fachada Churrigueresca", p: "Fue el primer gran teatro de Sid Grauman antes de fundar sus palacios en Hollywood. Su fachada Churrigueresca de terracota esculpida por Joseph Mora exhibe cabezas de bisonte talladas, cuernos texanos y cámaras de cine primitivas." },
          { h: "📺 Estrellas Latinas y el Origen de Univision", p: "Frank Fouce presentó a Cantinflas, María Félix, Pedro Infante, Celia Cruz y Vicente Fernández. Antonio Aguilar incluso montó su espectáculo ecuestre en el escenario. El éxito dio paso a la televisora KMEX y a la cadena Univision." }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 En Blade Runner y GTA", d: "Su letrero de neón ilumina la calle frente al Bradbury en Blade Runner (1982) y figura en GTA V como el 'Ten Cent Theater'." }
        ]
      }
    },

    // 9. El Nuevo Fuego
    {
      id: 9,
      mapUrl: "https://maps.google.com/?q=240+S+Broadway+Los+Angeles",
      en: {
        title: "El Nuevo Fuego & Broadway Murals",
        address: "📍 240 S Broadway (Victor Clothing Co. Building)",
        short: "9. El Nuevo Fuego",
        timeline: [
          { y: "1932", t: "Los Angeles hosts the Games of the X Olympiad." },
          { y: "1984", t: "LA hosts the Games of the XXIII Olympiad (exactly 52 years later)." },
          { y: "1984", t: "Eloy Torrez paints The Pope of Broadway depicting Anthony Quinn." },
          { y: "1985", t: "East Los Streetscapers paint the 80x85-foot mural El Nuevo Fuego." }
        ],
        stories: [
          { h: "🔥 The 52-Year Aztec Cycle & The Olympic Flame", p: "Painted in 1985 by the East Los Streetscapers (Wayne Alaniz Healy, David Botello, George Yepes). In ancient Mesoamerican culture, every 52 years, all fires across the empire were extinguished, and priests lit a single 'New Fire' (Xiuhmolpilli) to symbolize cosmic rebirth. Los Angeles hosted the Summer Olympics in 1932 and again in 1984—a gap of exactly 52 years. The mural connects Aztec mythology with the Olympic flame." },
          { h: "🥊 Local Champions Depicted", p: "Features East LA boxer Paul Gonzales (1984 Gold Medalist & Val Barker Trophy winner) and South LA sprinter Valerie Briscoe-Hooks (first athlete in Olympic history to win gold in both the 200m and 400m in the same games)." }
        ],
        callouts: [
          { cls: "box-tip", t: "🎨 Anthony Quinn Mural", d: "Look adjacent to see The Pope of Broadway (1984) by Eloy Torrez, portraying Mexican-American actor Anthony Quinn dancing in his Zorba the Greek pose." }
        ]
      },
      es: {
        title: "Mural El Nuevo Fuego y Arte Urbano",
        address: "📍 240 S Broadway (Edificio Victor Clothing Co.)",
        short: "9. El Nuevo Fuego",
        timeline: [
          { y: "1932", t: "Los Ángeles es sede de los X Juegos Olímpicos." },
          { y: "1984", t: "LA recibe los XXIII Juegos Olímpicos (exactamente 52 años después)." },
          { y: "1984", t: "Eloy Torrez pinta 'The Pope of Broadway' en homenaje a Anthony Quinn." },
          { y: "1985", t: "East Los Streetscapers crean el mural de 80x85 pies 'El Nuevo Fuego'." }
        ],
        stories: [
          { h: "🔥 El Fuego Nuevo Azteca y la Llama Olímpica", p: "Pintado por East Los Streetscapers en 1985. Cada 52 años, los pueblos mesoamericanos apagaban todos los fuegos del imperio para encender el 'Fuego Nuevo' (Xiuhmolpilli). Los Ángeles fue sede olímpica en 1932 y 1984: exactamente 52 años de diferencia." },
          { h: "🥊 Campeones Angelinos Retratados", p: "Retrata al boxeador del Este de LA Paul Gonzales (Oro 1984) y a la velocista Valerie Briscoe-Hooks (Triple Oro en 200m y 400m)." }
        ],
        callouts: [
          { cls: "box-tip", t: "🎨 Mural de Anthony Quinn", d: "Al lado se ubica 'The Pope of Broadway' con el actor mexicano Anthony Quinn en su baile de Zorba el Griego." }
        ]
      }
    },

    // 10. Evolution Sculpture
    {
      id: 10,
      mapUrl: "https://maps.google.com/?q=200+S+Broadway+Los+Angeles",
      en: {
        title: "The Evolution of Los Angeles Sculpture",
        address: "📍 200 block of S Broadway (Broadway-Spring Center Facade)",
        short: "10. Evolution Sculpture",
        timeline: [
          { y: "1771", t: "Mission San Gabriel founded along El Camino Real." },
          { y: "1887", t: "Railroad $1 fare war brings 100,000 settlers and sparks citrus boom." },
          { y: "1892", t: "Doheny strikes oil; by 1923 LA produces 25% of world petroleum." },
          { y: "1908", t: "Filmmakers flee Edison patent trusts in NY for LA sunlight." },
          { y: "1913", t: "Mulholland completes the 233-mile gravity-powered LA Aqueduct." }
        ],
        stories: [
          { h: "🌊 The 5 Growth Waves That Built Modern LA", p: "Created in 1988–1989 by artist Tony Sheets, this 66 ft × 35 ft cast-concrete bas-relief sculpture chronicles the five historical forces that built the metropolis:<br><br>1. <strong>Spanish Missions & Saints (1771):</strong> Cities named after Catholic calendar feast days (San Francisco, Santa Monica, San Diego). Mission San Gabriel led to 44 settlers founding the Pueblo in 1781.<br>2. <strong>Citrus & The $1 Rail War (1887):</strong> Competing railroads slashed tickets from Chicago to LA to $1 for a day, bringing 100,000 newcomers. Orange groves covered the valleys (Orange County broke off in 1889).<br>3. <strong>1892 Black Gold:</strong> Edward Doheny struck petroleum; by 1923, the LA basin produced nearly 25% of the world’s oil.<br>4. <strong>Cinema Flight (1908):</strong> Filmmakers fled Thomas Edison’s patent monopoly in New York for 300+ days of sunlight and a 2-hour drive to the Mexican border.<br>5. <strong>1913 LA Aqueduct:</strong> William Mulholland engineered a 233-mile gravity pipeline from Owens Valley ('There it is. Take it.')." }
        ],
        callouts: []
      },
      es: {
        title: "Escultura Evolución de Los Ángeles",
        address: "📍 Cuadra 200 de S Broadway (Fachada Broadway-Spring Center)",
        short: "10. Escultura Evolución",
        timeline: [
          { y: "1771", t: "Fundación de la Misión San Gabriel en el camino virreinal." },
          { y: "1887", t: "Guerra de trenes a $1 atrae a 100,000 colonos e inicia el auge de los cítricos." },
          { y: "1892", t: "Descubrimiento de petróleo; para 1923 LA produce el 25% mundial." },
          { y: "1908", t: "Cineastas huyen del monopolio de Edison en Nueva York buscando sol." },
          { y: "1913", t: "Mulholland inaugura el acueducto de 233 millas que abastece a la ciudad." }
        ],
        stories: [
          { h: "🌊 Las 5 Grandes Olas que Forjaron LA", p: "Relieve monumental de concreto de 66x35 pies por Tony Sheets. Resume las 5 fuerzas históricas:<br><br>1. <strong>Misiones y Santos (1771):</strong> Nombres según el santoral católico y fundación del Pueblo en 1781.<br>2. <strong>Cítricos y Trenes a $1 (1887):</strong> Guerra de tarifas entre ferrocarriles que trajo a 100,000 personas y pobló los valles de naranjales.<br>3. <strong>Petróleo de 1892:</strong> Para 1923, la cuenca de LA producía la cuarta parte del crudo mundial.<br>4. <strong>Huida a Hollywood (1908):</strong> Directores escaparon del monopolio de patentes de Thomas Edison.<br>5. <strong>Acueducto de 1913:</strong> Mulholland construyó el canal por gravedad desde Owens Valley ('Ahí está. Tómenla')." }
        ],
        callouts: []
      }
    },

    // 11. Los Angeles City Hall
    {
      id: 11,
      mapUrl: "https://maps.google.com/?q=Los+Angeles+City+Hall",
      en: {
        title: "Los Angeles City Hall",
        address: "📍 200 N Spring St",
        short: "11. City Hall",
        timeline: [
          { y: "1904", t: "LA institutes a strict 150-foot building height limit across the city." },
          { y: "1928", t: "City Hall opens at 454 feet with a special city charter height exemption." },
          { y: "1973–1993", t: "Mayor Tom Bradley serves a record 5 terms (20 years) as LA's first Black mayor." },
          { y: "1984", t: "The LA Olympics generate an unprecedented $223 million operating surplus." },
          { y: "1990", t: "The Metro Blue Line (A Line) opens, marking the modern return of rail transit." }
        ],
        stories: [
          { h: "🏛️ The 40-Year Height Cap & Foundation Symbolism", p: "Dedicated in 1928 (454 feet, 28 stories). For over 50 years, LA banned buildings over 150 feet (~13 stories) to protect against earthquakes and preserve open skies. Voters passed a special charter exemption for City Hall so it would stand as the sole dominant tower on the skyline for 40 years. To symbolize statewide unity, the foundation mortar was mixed with soil from all 58 California counties and water from all 21 historic Spanish missions." },
          { h: "🏅 Mayor Tom Bradley’s 20-Year Legacy", p: "LA’s first Black mayor, serving a record 5 terms. Bradley orchestrated the 1984 Summer Olympics—the first privately financed Games in history—resulting in a $223 million surplus that still funds youth sports today. He built the Tom Bradley International Terminal (TBIT) at LAX and passed Proposition A in 1980 to launch the modern Metro rail system." }
        ],
        callouts: [
          { cls: "box-tip", t: "🏙️ Free 27th-Floor Observation Deck", d: "The 27th-Floor Tom Bradley Room is open to the public for free on weekdays, offering 360° panoramic views across the entire Los Angeles basin." },
          { cls: "box-lore", t: "🎬 Media Cameos", d: "Appeared as the Daily Planet in the 1950s TV series Adventures of Superman, War of the Worlds (1953), and Dragnet." }
        ]
      },
      es: {
        title: "Ayuntamiento de Los Ángeles (City Hall)",
        address: "📍 200 N Spring St",
        short: "11. City Hall",
        timeline: [
          { y: "1904", t: "La ciudad prohíbe edificios de más de 150 pies de altura." },
          { y: "1928", t: "Abre City Hall con 454 pies gracias a un permiso especial electoral." },
          { y: "1973–1993", t: "Tom Bradley gobierna 5 mandatos como primer alcalde afroamericano." },
          { y: "1984", t: "Los Juegos Olímpicos de LA generan un superávit récord de $223 millones." },
          { y: "1990", t: "Inauguración de la Línea Azul (Línea A) del Metro." }
        ],
        stories: [
          { h: "🏛️ 40 Años Reinando en el Horizonte", p: "Durante 50 años estuvo prohibido construir a más de 150 pies por seguridad sísmica. City Hall tuvo un permiso especial para ser el único rascacielos en el cielo angelino durante 40 años. Su mezcla usó tierra de los 58 condados y agua de las 21 misiones virreinales para simbolizar la unidad de California." },
          { h: "🏅 El Legado de Tom Bradley", p: "Bradley lideró el superávit olímpico de 1984, impulsó la terminal internacional de LAX y creó la red moderna de Metro con la Línea A en 1990." }
        ],
        callouts: [
          { cls: "box-tip", t: "🏙️ Mirador Gratuito Piso 27", d: "El piso 27 abre gratis entre semana ofreciendo vistas panorámicas de 360° de toda la metrópoli." },
          { cls: "box-lore", t: "🎬 En la Televisión", d: "Fue la sede del diario Daily Planet en Superman de los años 50, Dragnet y La Guerra de los Mundos (1953)." }
        ]
      }
    },

    // 12. Courthouses
    {
      id: 12,
      mapUrl: "https://maps.google.com/?q=Hall+of+Justice+Los+Angeles",
      en: {
        title: "Civic Center & Historic Courthouses Row",
        address: "📍 Temple & Spring Street Intersection",
        short: "12. Courthouses Row",
        timeline: [
          { y: "1925", t: "Hall of Justice opens consolidating morgue, courts, and top-floor jail." },
          { y: "1946–1947", t: "Mendez v. Westminster argued at Spring St Courthouse, ending school segregation." },
          { y: "1962 & 1968", t: "Marilyn Monroe and Robert F. Kennedy autopsies conducted in basement morgue." },
          { y: "1970–1971", t: "Charles Manson held on 13th-floor jail tier during his 9.5-month murder trial." },
          { y: "1993–1996", t: "Menendez Brothers trials held across the street at Criminal Courts Building." }
        ],
        stories: [
          { h: "⚖️ Hall of Justice: The Vertical Justice System", p: "The first facility in the US to combine morgue, courts, sheriff offices, and a 750-cell maximum-security jail under one roof. Charles Manson was jailed on the 13th floor during his trial. Chief Medical Examiner Dr. Thomas Noguchi conducted the autopsies for both Marilyn Monroe (1962) and Robert F. Kennedy (1968) in basement Room 100." },
          { h: "📜 Civil Rights Precedent: Mendez v. Westminster", p: "The adjacent 1940 Spring Street Courthouse hosted Mendez v. Westminster (1946–1947), where five Mexican-American families successfully challenged school segregation in Orange County. Federal Judge Paul J. McCormick ruled that separating children was unconstitutional—creating the legal precedent used 8 years later in Brown v. Board of Education." }
        ],
        callouts: [
          { cls: "box-lore", t: "📺 Famous Trials Across the Street", d: "The Clara Shortridge Foltz Criminal Justice Center (named after California’s first female lawyer and public defender pioneer) hosted the Menendez Brothers and O.J. Simpson trials." }
        ]
      },
      es: {
        title: "Centro Cívico y Tribunales Históricos",
        address: "📍 Calles Temple y Spring",
        short: "12. Tribunales",
        timeline: [
          { y: "1925", t: "Abre el Hall of Justice unificando morgue, cortes y cárcel superior." },
          { y: "1946–1947", t: "Juicio Méndez contra Westminster que acabó con la segregación escolar." },
          { y: "1962 y 1968", t: "Autopsias de Marilyn Monroe y Robert F. Kennedy en la morgue del sótano." },
          { y: "1970–1971", t: "Charles Manson encarcelado en el piso 13 durante su juicio de 9 meses." },
          { y: "1993–1996", t: "Juicios de los hermanos Menéndez en el edificio de enfrente." }
        ],
        stories: [
          { h: "⚖️ Hall of Justice: El Sistema Vertical", p: "Primer edificio en EE. UU. en integrar morgue, juzgados, oficinas policiales y 750 celdas carcelarias. Aquí estuvo preso Charles Manson y el forense Thomas Noguchi practicó las autopsias de Marilyn Monroe y Robert F. Kennedy." },
          { h: "📜 Hito en Derechos Civiles: Caso Méndez", p: "El tribunal vecino de Spring St albergó Méndez v. Westminster (1946), que declaró inconstitucional segregar a niños mexicanos en escuelas de California, sentando las bases de Brown v. Board." }
        ],
        callouts: [
          { cls: "box-lore", t: "📺 Juicios Televisados", d: "El centro judicial vecino Clara Shortridge Foltz fue sede de los sonados juicios de los hermanos Menéndez y O.J. Simpson." }
        ]
      }
    },

    // 13. Placita Olvera
    {
      id: 13,
      mapUrl: "https://maps.google.com/?q=Olvera+Street+Los+Angeles",
      en: {
        title: "Placita Olvera & El Pueblo Monument (Tour Finale)",
        address: "📍 845 N Alameda St",
        short: "13. Placita Olvera",
        timeline: [
          { y: "1781", t: "44 original settlers (Los Pobladores) establish the Pueblo of Los Angeles." },
          { y: "1818", t: "Avila Adobe is constructed (now the oldest standing residence in LA)." },
          { y: "1870", t: "Don Pío Pico builds Pico House, LA's first 3-story luxury hotel." },
          { y: "1930", t: "Preservationist Christine Sterling reopens Olvera Street as a Mexican marketplace." },
          { y: "1932", t: "David Alfaro Siqueiros paints the controversial masterpiece América Tropical." }
        ],
        stories: [
          { h: "🌵 The Birthplace of Los Angeles", p: "44 settlers (Los Pobladores) founded the Pueblo of Los Angeles here in 1781. In 1870, Don Pío Pico (the last Mexican Governor of Alta California) sold his ranchos to invest $82,000 into constructing Pico House, LA's first luxury hotel with gas chandeliers, French cuisine, and courtyard fountains." },
          { h: "🎨 Christine Sterling’s Rescue & Siqueiros' Censored Mural", p: "In the late 1920s, Olvera Street was a run-down alley marked for demolition. Preservationist Christine Sterling led a civic campaign, partnered with the LA Times, and used county inmate labor to lay the red bricks, reopening the alley on Easter Sunday 1930 as a romanticized Mexican marketplace.<br><br>Above the plaza stands David Alfaro Siqueiros’ famous 1932 mural América Tropical. Commissioned to paint a decorative scene, Siqueiros instead painted an indigenous peasant crucified beneath an American eagle with revolutionary snipers on the roof. Deemed too radical, it was whitewashed within two years and was recently restored under a protective glass canopy." }
        ],
        callouts: [
          { cls: "box-food", t: "🥑 Post-Tour Taquitos", d: "Grab crispy taquitos smothered in green avocado sauce from Cielito Lindo (operating at the top of Olvera Street since 1934)." },
          { cls: "box-tip", t: "🚉 Transit Connection", d: "Walk across Alameda Street to explore the 1939 Mission Revival architecture of Union Station and catch the Metro A, B, or D lines." }
        ]
      },
      es: {
        title: "Placita Olvera y Monumento El Pueblo (Fin del Tour)",
        address: "📍 845 N Alameda St",
        short: "13. Placita Olvera",
        timeline: [
          { y: "1781", t: "44 pobladores fundan el Pueblo de Nuestra Señora la Reina de los Ángeles." },
          { y: "1818", t: "Construcción del Ávila Adobe (residencia más antigua en pie de LA)." },
          { y: "1870", t: "Don Pío Pico levanta Casa Pico, primer hotel de lujo de 3 plantas." },
          { y: "1930", t: "Christine Sterling reinaugura la calle como mercado mexicano tradicional." },
          { y: "1932", t: "David Alfaro Siqueiros pinta el mural censurado América Tropical." }
        ],
        stories: [
          { h: "🌵 El Nacimiento de Los Ángeles", p: "44 pobladores fundaron la ciudad en 1781. En 1870, Don Pío Pico (último gobernador mexicano de Alta California) invirtió $82,000 en Casa Pico, con iluminación a gas, comida francesa y fuentes de patio." },
          { h: "🎨 El Rescate de Olvera y el Mural de Siqueiros", p: "Christine Sterling rescató el callejón en 1930 pavimentando con ladrillos rojos. El mural 'América Tropical' de Siqueiros fue blanqueado por denunciar el imperialismo al pintar a un indígena crucificado bajo un águila estadounidense; hoy está restaurado bajo cubierta de cristal." }
        ],
        callouts: [
          { cls: "box-food", t: "🥑 Taquitos con Aguacate", d: "Prueba los famosos taquitos dorados de Cielito Lindo (abierto desde 1934 al final del callejón)." },
          { cls: "box-tip", t: "🚉 Estación Unión", d: "Cruza Alameda para maravillarte con la arquitectura de Union Station (1939) y conectar con el Metro." }
        ]
      }
    }
  ]
};

function renderView(shouldScroll = true) {
  const s = tourData.stops[currentStop - 1];
  const d = s[currentLang];
  const u = tourData.ui[currentLang];

  // Top titles & UI Text
  const uiTitle = document.getElementById('ui-title');
  const uiDesc = document.getElementById('ui-desc');
  const stopBadge = document.getElementById('stop-badge');
  const stopTitle = document.getElementById('stop-title');
  const stopAddress = document.getElementById('stop-address');
  const stopMapLink = document.getElementById('stop-map-link');
  const timelineHeading = document.getElementById('timeline-heading');

  if (uiTitle) uiTitle.textContent = u.title;
  if (uiDesc) uiDesc.textContent = u.desc;
  if (stopBadge) stopBadge.textContent = `${u.stopWord} ${currentStop} ${u.ofWord} ${totalStops}`;
  if (stopTitle) stopTitle.textContent = d.title;
  if (stopAddress) stopAddress.textContent = d.address;
  if (stopMapLink) {
    stopMapLink.href = s.mapUrl;
    stopMapLink.textContent = u.mapBtn;
  }
  if (timelineHeading) timelineHeading.textContent = u.timelineHead;

  // Progress Bar
  const pct = Math.round((currentStop / totalStops) * 100);
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressPercent = document.getElementById('progress-percent');

  if (progressFill) progressFill.style.width = pct + '%';
  if (progressText) progressText.textContent = `${u.stopWord} ${currentStop} ${u.ofWord} ${totalStops} • ${d.title}`;
  if (progressPercent) progressPercent.textContent = `${pct}% ${u.completeWord}`;

  // Timeline Rendering
  const tlContainer = document.getElementById('timeline-list');
  if (tlContainer) {
    tlContainer.innerHTML = d.timeline.map(item => `
      <li><span class="t-yr">${item.y}:</span> ${item.t}</li>
    `).join('');
  }

  // Story Deep Dives
  const storyContainer = document.getElementById('story-content');
  if (storyContainer) {
    storyContainer.innerHTML = d.stories.map(story => `
      <h3 class="story-heading">${story.h}</h3>
      <p>${story.p}</p>
    `).join('');
  }

  // Callouts Box Grid
  const calloutContainer = document.getElementById('callouts-container');
  if (calloutContainer) {
    calloutContainer.innerHTML = d.callouts.map(c => `
      <div class="callout-box ${c.cls}">
        <strong>${c.t}</strong>
        ${c.d}
      </div>
    `).join('');
  }

  // Prev / Next Stepper Buttons
  const btnPrev = document.getElementById('nav-prev');
  const btnNext = document.getElementById('nav-next');
  if (btnPrev) {
    btnPrev.textContent = u.prevBtn;
    btnPrev.disabled = (currentStop === 1);
  }

  if (btnNext) {
    if (currentStop === totalStops) {
      btnNext.textContent = u.finishBtn;
    } else {
      const nextShort = tourData.stops[currentStop][currentLang].short;
      btnNext.textContent = `${u.nextBtn} ${nextShort} →`;
    }
  }

  // Pills Selector Bar
  const pillNav = document.getElementById('pill-nav');
  if (pillNav) {
    pillNav.innerHTML = tourData.stops.map((st, idx) => `
      <button class="pill-btn ${idx + 1 === currentStop ? 'active' : ''}" onclick="goToStop(${idx + 1})">
        ${st[currentLang].short}
      </button>
    `).join('');

    const activePill = pillNav.querySelector('.pill-btn.active');
    if (activePill) {
      activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  // Bottom Booking Banner Promo
  const promoTitle = document.getElementById('promo-title');
  const promoDesc = document.getElementById('promo-desc');
  const promoBtn = document.getElementById('promo-btn');

  if (promoTitle) promoTitle.textContent = u.promoHead;
  if (promoDesc) promoDesc.textContent = u.promoText;
  if (promoBtn) {
    promoBtn.href = u.promoLink;
    promoBtn.textContent = u.promoBtnText;
  }

  // Smooth scroll back to progress bar
  if (shouldScroll) {
    const tracker = document.getElementById('tracker');
    if (tracker) {
      const y = tracker.getBoundingClientRect().top + window.pageYOffset - 30;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}

function changeStop(dir) {
  if (dir === 1 && currentStop === totalStops) {
    const livePromo = document.querySelector('.live-promo');
    if (livePromo) livePromo.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const target = currentStop + dir;
  if (target >= 1 && target <= totalStops) {
    currentStop = target;
    renderView(true);
  }
}

function goToStop(num) {
  currentStop = num;
  renderView(true);
}

function setLanguage(lang) {
  currentLang = lang;
  const btnEn = document.getElementById('btn-en');
  const btnEs = document.getElementById('btn-es');
  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
  if (btnEs) btnEs.classList.toggle('active', lang === 'es');
  renderView(false);
}

// Global Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && currentStop < totalStops) {
    changeStop(1);
  } else if (e.key === 'ArrowLeft' && currentStop > 1) {
    changeStop(-1);
  }
});

// Auto-run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => renderView(false));
} else {
  renderView(false);
}
