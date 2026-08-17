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
      selectorLabel: "📍 Jump to Any Stop:",
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
      selectorLabel: "📍 Ir a Cualquier Parada:",
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
          { y: "1997", t: "Frank Gehry's Guggenheim Bilbao opens, accelerating global excitement for his DTLA design." },
          { y: "2003", t: "Walt Disney Concert Hall officially opens to international acoustical acclaim." },
          { y: "2009", t: "Maestro Gustavo Dudamel becomes Music & Artistic Director of the Los Angeles Philharmonic." }
        ],
        stories: [
          { 
            h: "🏛️ The Bunker Hill Levelling & The Blue Ribbon Committee", 
            p: "Look around Grand Avenue today—it is one of the densest corridors of performing arts institutions in the world. But 70 years ago, this hill was an entirely different universe: packed with Victorian mansions and boarding houses. In the 1960s, the city flattened the terrain in a massive urban renewal project. The cultural transformation of this ridge was spearheaded by the <strong>Blue Ribbon Committee</strong>, founded by civic titan Dorothy Buffum Chandler, who raised private capital to build the Music Center across the street." 
          },
          { 
            h: "🎨 Lillian Disney's Gift & Frank Gehry's Vision", 
            p: "In 1987, <strong>Lillian Disney</strong> (Walt Disney’s widow) donated $50 million to create a permanent, acoustically pure home for the Los Angeles Philharmonic in honor of Walt’s passion for music. The committee selected <strong>Frank Gehry</strong>. Gehry had grown up in Los Angeles, served in the US Army, and drove a delivery truck while taking night classes in architecture at USC. After his revolutionary design of the Guggenheim Museum in Bilbao, Spain, Gehry applied his signature deconstructivist style here." 
          },
          { 
            h: "📐 Architecture of Movement & Acoustic Purity", 
            p: "The exterior is clad in over <strong>12,500 custom-curved stainless steel panels</strong>, designed to emulate billowing sails caught in the wind—visually mirroring the tempo and flow of music. The 2,265-seat interior is lined entirely with warm Douglas fir wood shaped like the curved hull of an ancient sailing ship. Master acoustician Yasuhisa Toyota designed vineyard-style seating, placing the audience directly around the orchestra for acoustic clarity without electronic amplification." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "📸 Hidden Rooftop Garden", d: "Climb the outdoor stairs on the Hope Street side to find the elevated Blue Ribbon Garden, featuring a mosaic rose fountain built from broken blue-and-white Delft china in honor of Lillian Disney." },
          { cls: "box-lore", t: "🎵 The 'French Fries' Pipe Organ", d: "Inside sits the famous 6,134-pipe organ nicknamed 'the French fries' for its curved wooden exterior pipes, played under the direction of Venezuelan maestro Gustavo Dudamel." }
        ]
      },
      es: {
        title: "Sala de Conciertos Walt Disney (Disney Hall)",
        address: "📍 111 S Grand Ave, Los Angeles, CA 90012",
        short: "1. Disney Hall",
        timeline: [
          { y: "Años 60", t: "Dorothy Buffum Chandler funda el Comité Blue Ribbon para convertir Bunker Hill en el eje cultural de LA." },
          { y: "1987", t: "Lillian Disney dona $50 millones iniciales en homenaje a su esposo Walt Disney." },
          { y: "1997", t: "Abre el Guggenheim de Bilbao de Frank Gehry, acelerando el proyecto de LA." },
          { y: "2003", t: "Inauguración oficial de la sala con aclamación acústica mundial." },
          { y: "2009", t: "Gustavo Dudamel asume como Director Musical de la Filarmónica de Los Ángeles." }
        ],
        stories: [
          { 
            h: "🏛️ La Transformación de Bunker Hill y el Comité Blue Ribbon", 
            p: "Miren a su alrededor en Grand Avenue: hoy es uno de los corredores de artes escénicas más densos del planeta. Pero hace décadas, esta colina estaba repleta de mansiones victorianas antes de ser completamente aplanada en los años 60 durante un polémico proyecto de renovación urbana. La transformación cultural fue impulsada por el <strong>Comité Blue Ribbon</strong> y la filántropa Dorothy Buffum Chandler." 
          },
          { 
            h: "🎨 El Tributo de Lillian Disney y Frank Gehry", 
            p: "En 1987, <strong>Lillian Disney</strong> donó $50 millones para construir una sede acústica perfecta para la Filarmónica de Los Ángeles. Contrataron a <strong>Frank Gehry</strong>, quien creció en Los Ángeles, sirvió en el ejército estadounidense y manejó camiones de reparto mientras estudiaba arquitectura en cursos nocturnos de USC." 
          },
          { 
            h: "📐 Arquitectura de Movimiento y Acústica Pura", 
            p: "El exterior cuenta con más de <strong>12,500 paneles curvos de acero inoxidable</strong> que simulan velas de barco infladas por el viento, reflejando el movimiento de la música. Por dentro, el auditorio de abeto Douglas evoca el casco de un barco, con asientos estilo viñedo diseñados por el acústico Yasuhisa Toyota que rodean a los músicos para brindar una acústica perfecta sin amplificadores." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "📸 Jardín Secreto en la Azotea", d: "Sube las escaleras de Hope St hacia el jardín elevado para ver la fuente de rosas hecha con porcelana azul rota de Delft en honor a Lillian Disney." },
          { cls: "box-lore", t: "🎵 El Órgano de 'Papas Fritas'", d: "Alberga un monumental órgano de 6,134 tubos apodado 'las papas fritas' por sus tubos curvos de madera, dirigido por el maestro venezolano Gustavo Dudamel." }
        ]
      }
    },

    // 2. The Broad Museum
    {
      id: 2,
      mapUrl: "https://maps.google.com/?q=The+Broad+Los+Angeles",
      en: {
        title: "The Broad Museum",
        address: "📍 221 S Grand Ave (Next door to Disney Hall)",
        short: "2. The Broad",
        timeline: [
          { y: "1957", t: "Eli Broad co-founds Kaufman & Broad (KB Home), pioneering affordable suburban tract housing." },
          { y: "1971", t: "Broad acquires Sun Life Insurance (SunAmerica), forming his second Fortune 500 company." },
          { y: "1984", t: "The Broad Art Foundation is created to lend contemporary masterworks to global museums." },
          { y: "2015", t: "The $140 million museum opens with permanent free admission for the public." }
        ],
        stories: [
          { 
            h: "💼 The Fortune Behind the Art: Eli & Edythe Broad", 
            p: "Eli Broad achieved the rare feat of building two separate Fortune 500 enterprises from scratch: <strong>KB Home</strong> (which constructed hundreds of thousands of post-war suburban homes) and <strong>SunAmerica</strong> (financial retirement annuities). Having amassed billions, Eli and Edythe Broad dedicated their lives and fortune to assembling one of the most prominent private postwar and contemporary art collections in existence, deciding that public access should be permanently free." 
          },
          { 
            h: "🏛️ 'The Veil and the Vault' Architectural Concept", 
            p: "Designed by renowned architecture firm <strong>Diller Scofidio + Renfro</strong> for $140 million. The building concept is built around two contrasting structural ideas:<br><br>• <strong>The Vault:</strong> The heavy, opaque concrete core in the center of the building that securely stores thousands of artworks not currently hung in galleries.<br>• <strong>The Veil:</strong> The porous, honeycomb-like exterior skeleton made of 2,000 fiberglass-reinforced concrete panels that wrap around the vault, filtering soft natural daylight into the top-floor exhibition deck without harming sensitive pigments." 
          },
          { 
            h: "🥫 Pop Art Revolution: Andy Warhol", 
            p: "The Broad holds one of the world's most significant archives of <strong>Pop Art</strong>. In the 1960s, <strong>Andy Warhol</strong> transformed commercial mass-production into high art. By screen-printing everyday consumer items like <em>Campbell’s Soup Cans</em> and celebrities like <em>Single Elvis</em>, Warhol held up a mirror to American consumerism. But Warhol went deeper: works like <em>1964 Alabama Race Riot</em> and his <em>American Nightmare / Death and Disaster</em> series confronted the grim realities of civil rights violence, electric chairs, and drug epidemics hidden behind shiny mid-century consumer culture." 
          },
          { 
            h: "🎈 Neo-Pop & Consumer Desire: Jeff Koons", 
            p: "Moving into the 1980s and 90s, <strong>Jeff Koons</strong> pioneered Neo-Pop. His famous mirror-polished stainless steel sculpture <strong>Balloon Dog (Blue)</strong> and hyper-chromatic <strong>Tulips</strong> take cheap, temporary party decorations and cast them into heavy, indestructible monuments of high gloss. Koons forces viewers to look directly into their own reflections on the gleaming surface, questioning consumer desire, kitsch, and how everyday objects are elevated into multi-million-dollar art." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "✨ Yayoi Kusama & Contemporary Masters", d: "Home to Yayoi Kusama’s famous Infinity Mirror Rooms, Jean-Michel Basquiat’s raw street canvases, and Takashi Murakami’s Superflat pop murals." },
          { cls: "box-tip", t: "🎟️ Free Admission Secret", d: "General admission is 100% free. Reserving a free timed-entry ticket online in advance lets you bypass the outdoor general standby line." }
        ]
      },
      es: {
        title: "Museo The Broad",
        address: "📍 221 S Grand Ave (Junto al Disney Hall)",
        short: "2. The Broad",
        timeline: [
          { y: "1957", t: "Eli Broad cofunda KB Home, pionera en viviendas suburbanas accesibles." },
          { y: "1971", t: "Broad adquiere SunAmerica, forjando su segunda empresa en Fortune 500." },
          { y: "1984", t: "Nace la Fundación Broad para prestar obras maestras a museos del mundo." },
          { y: "2015", t: "Abre el museo de $140 millones con entrada 100% gratuita." }
        ],
        stories: [
          { 
            h: "💼 La Fortuna de Eli y Edythe Broad", 
            p: "Eli Broad logró la hazaña de construir dos imperios Fortune 500 desde cero: <strong>KB Home</strong> (que construyó miles de urbanizaciones tras la guerra) y <strong>SunAmerica</strong> (fondos de inversión y pensiones). Con miles de millones acumulados, la pareja decidió crear una de las colecciones privadas de arte contemporáneo más influyentes del planeta y garantizar que el acceso fuera 100% gratuito." 
          },
          { 
            h: "🏛️ El Concepto: 'El Velo y la Bóveda'", 
            p: "Diseñado por Diller Scofidio + Renfro con un costo de $140 millones. Su estructura combina dos elementos:<br><br>• <strong>La Bóveda:</strong> El núcleo central de concreto macizo que resguarda miles de obras en archivo técnico.<br>• <strong>El Velo:</strong> La estructura exterior de panal compuesta por 2,000 paneles de fibra de vidrio que envuelve la bóveda y filtra luz natural suave hacia las galerías superiores sin dañar los lienzos." 
          },
          { 
            h: "🥫 La Revolución del Pop Art: Andy Warhol", 
            p: "The Broad posee una de las mayores colecciones de <strong>Pop Art</strong>. En los años 60, <strong>Andy Warhol</strong> convirtió el consumo masivo en arte supremo. Con sus serigrafías de las <em>Latas de Sopa Campbell</em> y <em>Single Elvis</em>, reflejó la sociedad estadounidense. Pero también abordó la tensión social: obras como <em>1964 Alabama Race Riot</em> y su serie <em>American Nightmare</em> expusieron la represión racial, accidentes mortales y la adicción a las drogas detrás del sueño americano." 
          },
          { 
            h: "🎈 Neo-Pop y la Obsesión del Consumo: Jeff Koons", 
            p: "En los años 80 y 90, <strong>Jeff Koons</strong> llevó el pop a la monumentalidad. Su icónica escultura de acero inoxidable <strong>Balloon Dog (Blue)</strong> y sus gigantescos <strong>Tulipanes</strong> convierten figuras inflables de fiesta en monumentos cromados de millones de dólares. Koons hace que el espectador se vea reflejado en el brillo de la pieza, reflexionando sobre la vanidad y la cultura del consumo." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "✨ Yayoi Kusama y Basquiat", d: "Alberga las legendarias salas de espejos infinitos de Yayoi Kusama, los lienzos expresionistas de Jean-Michel Basquiat y murales de Takashi Murakami." },
          { cls: "box-tip", t: "🎟️ Entrada Gratuita", d: "La entrada es gratis. Reservar turno con anticipación en su sitio web permite saltarse la fila general en la banqueta." }
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
          { 
            h: "🚋 Henry Huntington & The Red Car Real Estate Scheme", 
            p: "When Collis Huntington died, his nephew <strong>Henry Huntington</strong> was passed over for leadership of the Southern Pacific Railroad in San Francisco. Huntington took his inheritance south, partnered with banker Isaias W. Hellman, and built the <strong>Pacific Electric Railway (the famous 'Red Cars')</strong> into the largest electric interurban transit network on earth (over 1,100 miles of track).<br><br>Here is the genius secret: <strong>the streetcars were intentionally operated as a loss leader</strong>. Huntington lost money on passenger fares because the tracks were laid straight into empty orange groves and ranchlands owned by his private land syndicates. The trains existed purely to sell suburban real estate, causing LA's population to explode from <strong>102,000 in 1900 to 1.2 million by 1930</strong>." 
          },
          { 
            h: "🚗 The GM Antitrust Monopoly & The Automotive Shift", 
            p: "As Angelenos bought private cars, rail lines lost revenue. In the landmark federal antitrust case <em>United States v. National City Lines</em>, it was proven that General Motors, Firestone Tire, Standard Oil of California, and Mack Trucks secretly funded a front company that bought up electric streetcar networks across 45+ US cities, tore up the tracks, and motorized the lines with diesel buses to cement car dominance." 
          },
          { 
            h: "🍔 The Birth of Car Culture & In-N-Out Burger", 
            p: "By 1925, Los Angeles was the car capital of the world (1 car for every 3 residents, compared to 1 in 7 nationally). In 1940, the region opened America's first freeway: the <strong>Arroyo Seco Parkway (CA-110)</strong>. With car culture reigning supreme, in 1948 Harry and Esther Snyder opened California's first drive-thru in Baldwin Park featuring a revolutionary two-way speaker box: <strong>In-N-Out Burger</strong>." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "🍔 In-N-Out Secret Menu Guide", d: "• Animal Style: Mustard-seared beef, pickles, caramelized grilled onions, extra spread.<br>• Protein Style: Burger wrapped in fresh lettuce leaves (no bun).<br>• Flying Dutchman: Two slices of cheese melted between two beef patties (no bun, no veggies)." }
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
          { 
            h: "🚋 Henry Huntington y el Gran Negocio Inmobiliario", 
            p: "Al fallecer su tío Collis Huntington, <strong>Henry Huntington</strong> no obtuvo la presidencia del ferrocarril en San Francisco. Se mudó al sur con su capital, se asoció con el banquero Isaias W. Hellman y fundó los tranvías <strong>Pacific Electric ('Red Cars')</strong>, alcanzando más de 1,100 millas de vías electrificadas.<br><br>El secreto fue brillante: <strong>los tranvías operaban con pérdidas a propósito</strong>. A Huntington no le importaba el costo del pasaje porque tendía las vías directamente hacia enormes campos de naranjos y terrenos agrícolas que sus sindicatos habían comprado a bajo precio. Los tranvías servían para vender casas suburbanas, disparando la población de <strong>102,000 en 1900 a 1.2 millones en 1930</strong>." 
          },
          { 
            h: "🚗 El Juicio Antimonopolio de General Motors", 
            p: "A medida que la gente compraba autos, los tranvías perdieron pasaje. En el juicio antimonopolio <em>EE. UU. contra National City Lines</em>, se demostró que General Motors, Firestone Tire y Standard Oil financiaron una empresa fantasma para comprar y desmantelar los tranvías en más de 45 ciudades, reemplazándolos por autobuses a diésel." 
          },
          { 
            h: "🍔 La Cultura del Auto e In-N-Out Burger", 
            p: "Para 1925, Los Ángeles era la capital mundial del automóvil (1 auto por cada 3 habitantes). En 1940 abrió la primera autopista de acceso controlado del país: el <strong>Arroyo Seco Parkway (CA-110)</strong>. En pleno auge automotriz, en 1948 Harry y Esther Snyder abrieron el primer autoservicio con intercomunicador en Baldwin Park: <strong>In-N-Out Burger</strong>." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "🍔 Menú Secreto de In-N-Out", d: "• Animal Style: Carne sellada en mostaza, cebolla caramelizada, salsa extra.<br>• Protein Style: Envuelto en hojas de lechuga fresca.<br>• Flying Dutchman: Dos carnes y dos quesos derretidos (sin pan ni verduras)." }
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
          { y: "1996", t: "Incinerated by the alien mothership beam in Independence Day." },
          { y: "2013", t: "Immortalized as the 'Maze Bank Tower' in Grand Theft Auto V." },
          { y: "2017", t: "Wilshire Grand Center claims tallest title at 1,100 ft using its decorative spire." },
          { y: "2020s", t: "Remote and hybrid work causes a 40%+ shift in downtown corporate foot traffic." }
        ],
        stories: [
          { 
            h: "🏢 The Post-Pandemic Shift in the Financial District", 
            p: "California Plaza (One & Two Cal Plaza) used to be the pulsating corporate heart of DTLA, packed with thousands of lawyers, bankers, crowded food trucks, and busy lunch restaurants. The permanent rise of remote and hybrid work reduced corporate weekday foot traffic by over 40–50%, forcing legacy lunch spots to limit hours and creating an unusually open urban space during traditional business hours." 
          },
          { 
            h: "🏙️ The Great Skyscraper Spire Rivalry", 
            p: "The 73-story <strong>U.S. Bank Tower (1,018 ft)</strong> stood as the tallest skyscraper west of the Mississippi River for nearly 30 years. In 2017, the Wilshire Grand Center claimed the official tallest title at 1,100 feet. However, it only wins because of its 294-foot decorative open-air architectural spire. The U.S. Bank Tower’s actual highest occupied roofline and top observation floor remain higher than the Wilshire Grand’s roof." 
          },
          { 
            h: "⚡ Earthquake Engineering & Logarithmic Physics", 
            p: "The tower was engineered to withstand an <strong>8.3-magnitude earthquake</strong> on the nearby San Andreas Fault using a central core braced with high-ductility steel outriggers. Earthquake magnitude is <strong>logarithmic</strong>:<br><br>• Every 1.0 increase on the scale represents a <strong>10x increase in ground shaking amplitude</strong> and approximately <strong>32x more energy released</strong>.<br>• Moving from a local 5.1 shaker to an 8.1 monster is a jump of 3 whole points ($10 \\times 10 \\times 10$), making the ground shaking <strong>1,000 times stronger</strong> and releasing roughly <strong>32,000 times more destructive seismic energy</strong>.<br>• <em>Earthquake Safety:</em> Angelenos are trained to <em>Drop, Cover, and Hold On</em> beneath sturdy desks to protect against falling lighting fixtures, ceilings, and broken glass." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 Cinema & Pop Culture Lore", d: "Blown up in <em>Independence Day</em> (1996), shaken in <em>San Andreas</em> (2015), and featured as the Maze Bank Tower in <em>GTA V</em>. From 2016–2020, it hosted the 'Skyslide'—a glass slide cantilevered 1,000 feet in the air." }
        ]
      },
      es: {
        title: "Mirador Cal Plaza y Torre U.S. Bank",
        address: "📍 Terraza Superior sobre las Grand Steps y 4th/Hope",
        short: "4. Torre U.S. Bank",
        timeline: [
          { y: "1989", t: "Inauguración de la Torre Library (hoy U.S. Bank) de 73 pisos y 1,018 pies." },
          { y: "1996", t: "Destruida por el rayo extraterrestre en Día de la Independencia." },
          { y: "2013", t: "Inmortalizada como la 'Torre Maze Bank' en Grand Theft Auto V." },
          { y: "2017", t: "Wilshire Grand le arrebata el récord con 1,100 pies gracias a su aguja." },
          { y: "Años 2020", t: "El trabajo híbrido reduce el tráfico de oficinas en más del 40%." }
        ],
        stories: [
          { 
            h: "🏢 El Cambio Post-Pandemia en el Distrito Financiero", 
            p: "California Plaza solía ser el motor corporativo de DTLA, repleto de abogados, banqueros, camiones de comida y restaurantes llenos a la hora del almuerzo. El paso al trabajo remoto e híbrido redujo el tráfico peatonal corporativo entre semana en más del 40–50%, provocando el cierre de negocios tradicionales y dejando una plaza despejada en pleno horario laboral." 
          },
          { 
            h: "🏙️ La Rivalidad de Rascacielos y la Aguja Decorativa", 
            p: "La <strong>Torre U.S. Bank (1,018 pies, 73 pisos)</strong> fue el rascacielos más alto al oeste del Misisipi durante tres décadas. En 2017, el Wilshire Grand la superó con 1,100 pies únicamente gracias a su aguja decorativa de 294 pies. Sin embargo, el piso habitable y el techo de la Torre U.S. Bank siguen estando a mayor altura real." 
          },
          { 
            h: "⚡ Resistencia Sísmica y la Escala Logarítmica", 
            p: "Fue diseñada para resistir un sismo de <strong>magnitud 8.3</strong> en la Falla de San Andrés mediante un núcleo central con refuerzos de acero dúctil. La escala es <strong>logarítmica</strong>:<br><br>• Cada punto entero representa <strong>10 veces más amplitud de movimiento</strong> y unas <strong>32 veces más energía liberada</strong>.<br>• Pasar de un temblor moderado de 5.1 a uno de 8.1 ($10 \\times 10 \\times 10$) significa que el suelo se sacude <strong>1,000 veces más fuerte</strong> y libera <strong>32,000 veces más energía sísmica</strong>.<br>• <em>Regla de Oro Sísmica:</em> La indicación oficial es <em>Agacharse, Cubrirse y Sujetarse</em> bajo un escritorio pesado para protegerse de lámparas, techos falsos y cristales rotos." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 En el Cine y Videojuegos", d: "Destruida en <em>Día de la Independencia</em> (1996), sacudida en <em>San Andrés</em> (2015) y sede en <em>GTA V</em>. De 2016 a 2020 tuvo el 'Skyslide', un tobogán de cristal a 1,000 pies de altura." }
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
          { 
            h: "🚋 The World's Shortest Railway", 
            p: "Angels Flight runs along a track length of <strong>298 feet (91 meters)</strong> on a steep 33% incline. The twin wooden funicular cars are named <strong>Sinai</strong> and <strong>Olivet</strong>. They operate on a counterbalanced continuous cable system: as one car rolls down the hill, its gravitational weight pulls the other car up the track." 
          },
          { 
            h: "👒 Victorian Bunker Hill & The 200 Steps", 
            p: "In 1901, Bunker Hill was LA’s wealthiest residential enclave, crowded with Queen Anne and Victorian mansions. Wealthy residents rode Angels Flight down to shop the dry-goods emporiums on Broadway and took it back up to avoid climbing the 200+ steep wooden stairs. In its first 50 years of operation, it carried over <strong>100 million passengers</strong>, becoming the most heavily utilized short railway in the world per mile." 
          },
          { 
            h: "📦 27 Years in Warehouse Crates", 
            p: "During the massive 1960s Bunker Hill Urban Renewal Project, the Victorian mansions were leveled and the hill was physically graded down. Angels Flight was dismantled and packed into wooden storage boxes in 1969. It sat in storage for 27 years until citizen preservationists forced the city to reassemble and reopen it in <strong>1996</strong>." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "🎟️ Fare & Operating Hours", d: "$1.00 each way (only 50¢ if you tap a Metro TAP card). Open 365 days a year from 6:45 AM to 10:00 PM." },
          { cls: "box-lore", t: "🎬 La La Land & Film Noir", d: "Ryan Gosling and Emma Stone shared their famous kiss here in <em>La La Land</em> (2016). It also starred in classic 1950s noirs like <em>Kiss Me Deadly</em> (1955) and <em>Cry Danger</em> (1951)." }
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
          { 
            h: "🚋 El Ferrocarril Más Corto del Mundo", 
            p: "Angels Flight recorre <strong>91 metros (298 pies)</strong> sobre una inclinación del 33%. Sus dos vagones de madera se llaman <strong>Sinai</strong> y <strong>Olivet</strong>, y funcionan mediante un cable contrapesado: el peso del vagón que baja ayuda a subir al que asciende." 
          },
          { 
            h: "👒 El Bunker Hill Victoriano y los 200 Escalones", 
            p: "En 1901, Bunker Hill era el barrio más exclusivo y adinerado de LA, lleno de mansiones victorianas. Las familias adineradas usaban Angels Flight para bajar a hacer compras a Broadway y regresar a casa sin tener que subir más de 200 escalones de madera. En sus primeros 50 años transportó a más de <strong>100 millones de pasajeros</strong>." 
          },
          { 
            h: "📦 27 Años Guardado en Cajas de Madera", 
            p: "Durante la remodelación de los años 60, las mansiones fueron demolidas y el cerro fue rebajado. Angels Flight fue desmantelado y empacado en cajas en 1969. Permaneció almacenado durante 27 años hasta que los comités de preservación histórica lograron su reconstrucción en <strong>1996</strong>." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "🎟️ Tarifa y Horarios", d: "$1.00 por trayecto (50¢ con tarjeta TAP de Metro). Abierto los 365 días del año de 6:45 AM a 10:00 PM." },
          { cls: "box-lore", t: "🎬 Cine Negro y La La Land", d: "Escenario del beso entre Ryan Gosling y Emma Stone en <em>La La Land</em> (2016), además de clásicos del cine negro como <em>Kiss Me Deadly</em> (1955) y la serie <em>Bosch</em>." }
        ]
      }
    },

    // 6. Grand Central Market
    {
      id: 6,
      mapUrl: "https://maps.google.com/?q=Grand+Central+Market+Los+Angeles",
      en: {
        title: "Grand Central Market (Mid-Tour Break)",
        address: "📍 317 S Broadway",
        short: "6. Grand Central Market",
        timeline: [
          { y: "1897", t: "Homer Laughlin Building built as LA's first fireproof, steel-reinforced structure." },
          { y: "Oct 27, 1917", t: "Grand Central Market opens as the largest food depot on the Pacific Coast." },
          { y: "1952", t: "Legacy vendor Roast To Go begins slow-cooking carnitas in copper pots." },
          { y: "1959", t: "Legacy stall China Cafe opens its neon-lit wonton soup lunch counter." },
          { y: "2012–2014", t: "Adele Yellin leads a curated modern culinary revitalization with 30+ international stalls." }
        ],
        stories: [
          { 
            h: "🥖 The 1917 'Wonder Market' & The Angels Flight Link", 
            p: "Opened on <strong>October 27, 1917</strong> inside the Homer Laughlin Building—Los Angeles’s very first fireproof, steel-reinforced building (built 1897). The market operated in direct harmony with Angels Flight: Victorian shoppers rode the funicular down with wicker baskets to buy poultry, cuts from German butchers, dairy, and farm-fresh produce from Italian and Japanese vendors." 
          },
          { 
            h: "🌮 An Immigrant Hub & Legacy Stalls", 
            p: "Through the mid-20th century, the market adapted to serve incoming immigrant communities, becoming a bustling hub of Mexican carnicerías, Jewish delis, and Asian produce stalls. Several historic vendors have operated for over half a century:<br><br>• <strong>Roast To Go (1952):</strong> Simmering authentic carnitas and chicharrón in traditional copper kettles.<br>• <strong>China Cafe (1959):</strong> Famous for counter-side wonton soup and chow mein under classic neon." 
          },
          { 
            h: "🍳 The 2012 Gourmet Renaissance", 
            p: "Under developer Adele Yellin, the market underwent a thoughtful revival around 2012–2014. By blending beloved historic vendors with cutting-edge chef concepts (such as <strong>Eggslut</strong>, <strong>Wexler's Deli</strong>, and <strong>Sticky Rice</strong>), Grand Central Market transformed into one of the country’s most celebrated food halls with over 30 international stalls." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "🍽️ What to Eat on Your Break", d: "• <em>Roast To Go (1952):</em> Carnitas tacos in copper pots.<br>• <em>Sarita’s Pupusería:</em> Salvadoran handmade pupusas (featured in <em>La La Land</em>).<br>• <em>China Cafe (1959):</em> Classic wonton soup under neon counters." },
          { cls: "box-tip", t: "🥤 Quick Refreshment Tip", d: "Grab a fresh agua fresca from <em>La Huerta</em> or an iced cold brew from <em>G&B Coffee</em> near the Hill Street entrance." }
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
          { 
            h: "🥖 El 'Mercado Maravilla' de 1917 y Angels Flight", 
            p: "Inaugurado el <strong>27 de octubre de 1917</strong> en el edificio Homer Laughlin, el primer edificio resistente al fuego de LA. Funcionaba en sincronía con Angels Flight: las amas de casa de Bunker Hill bajaban en el funicular con canastas de mimbre para comprar carne con carniceros alemanes, lácteos y verduras frescas con agricultores japoneses e italianos." 
          },
          { 
            h: "🌮 El Gran Corazón Inmigrante de LA", 
            p: "Durante el siglo XX se convirtió en el gran mercado multicultural de la ciudad, albergando carnicerías mexicanas, delis judías y puestos asiáticos. Puestos legendarios siguen cocinando hoy en día:<br><br>• <strong>Roast To Go (1952):</strong> Cocinando carnitas tradicionales en cazos de cobre por más de 70 años.<br>• <strong>China Cafe (1959):</strong> Sirviendo sopa wonton en su barra clásica bajo luces de neón." 
          },
          { 
            h: "🍳 El Renacimiento Gastronómico de 2012", 
            p: "Bajo la curaduría de Adele Yellin, el mercado revitalizó sus pasillos combinando puestos históricos con nuevas propuestas artesanales (como <strong>Eggslut</strong>, <strong>Wexler's Deli</strong> y <strong>Sticky Rice</strong>), convirtiéndose en un referente gastronómico internacional con más de 30 opciones de comida." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "🍽️ Qué Probar en el Descanso", d: "• <em>Roast To Go (1952):</em> Tacos de carnitas en cazo de cobre.<br>• <em>Sarita's Pupusería:</em> Pupusas salvadoreñas hechas a mano (vistas en <em>La La Land</em>).<br>• <em>China Cafe (1959):</em> Sopa wonton tradicional en la barra." },
          { cls: "box-tip", t: "🥤 Bebida Rápida", d: "Pide una fresca agua de frutas en <em>La Huerta</em> o un café frío en <em>G&B Coffee</em> junto a la salida de Hill Street." }
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
          { y: "1892", t: "Lewis Bradbury hires 32-year-old George Wyman after a Ouija séance; Bradbury dies 14 months before opening." },
          { y: "1893", t: "Opens at a cost of $500,000; ironwork exhibited at the Chicago World's Fair." },
          { y: "1971", t: "Designated a National Historic Landmark." },
          { y: "1982", t: "Immortalized in Ridley Scott's sci-fi masterpiece Blade Runner." }
        ],
        stories: [
          { 
            h: "⛏️ Lewis Bradbury's Fortune & The Asthma Move", 
            p: "Mining tycoon <strong>Lewis Bradbury</strong> made a massive fortune in gold and silver from the Minas del Tajo in Sinaloa, Mexico. Suffering from chronic asthma in Oakland, he moved to Southern California for its dry climate and built a grand mansion on Court Hill. Determined to leave an architectural monument bearing his family name, he purchased the corner of 3rd and Broadway." 
          },
          { 
            h: "👻 The Ouija Board Commission & The $5/Week Draftsman", 
            p: "Bradbury initially hired Sumner Hunt, a respected architect, but rejected his designs as conventional. Bradbury then approached Hunt’s 32-year-old junior draftsman, <strong>George Wyman</strong>, who had no formal architectural degree. Hesitant to betray his boss, Wyman and his wife Jennie consulted a planchette (Ouija board). A message supposedly spelled out from his deceased brother Mark: <em>'Take Bradbury Building. It will make you famous.'</em> Wyman accepted the commission the next morning." 
          },
          { 
            h: "🚀 Victorian Sci-Fi Architecture & Edward Bellamy", 
            p: "Estimated at $175,000, the cost surged past <strong>$500,000</strong> (~$18M today) when excavators struck an underground sulfur spring water table. Bradbury tragically died in 1892, 14 months before opening.<br><br>Wyman drew inspiration from Edward Bellamy’s 1888 utopian novel <em>Looking Backward</em>, which described future buildings with vast, skylit central halls. He designed a <strong>50-foot glass atrium</strong> that floods the interior with natural light and cool cross-breezes, complemented by French wrought-iron railings (exhibited at the <strong>1893 Chicago World's Fair</strong>), Italian marble stairs, Mexican terracotta tile, open-cage hydraulic elevators, and brass Cutler gravity mail chutes." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 The Ultimate Cinema Set", d: "• <em>Blade Runner (1982):</em> J.F. Sebastian's apartment where Deckard battles Roy Batty.<br>• <em>(500) Days of Summer (2009):</em> The architecture interview lobby.<br>• <em>The Artist (2011):</em> The famous staircase crossing scene." }
        ]
      },
      es: {
        title: "Edificio Bradbury",
        address: "📍 304 S Broadway (Frente a Grand Central Market)",
        short: "7. Edificio Bradbury",
        timeline: [
          { y: "1892", t: "Lewis Bradbury contrata a George Wyman tras una sesión de Ouija; Bradbury fallece antes de abrir." },
          { y: "1893", t: "Abre con un costo de $500,000; su herrería fue premiada en la Feria de Chicago." },
          { y: "1971", t: "Nombrado Monumento Histórico Nacional." },
          { y: "1982", t: "Inmortalizado en la película de culto Blade Runner." }
        ],
        stories: [
          { 
            h: "⛏️ La Fortuna Minera de Lewis Bradbury en Sinaloa", 
            p: "El magnate minero <strong>Lewis Bradbury</strong> acumuló una inmensa fortuna en las minas de oro y plata de Minas del Tajo en Sinaloa, México. Afectado por asma grave en Oakland, se mudó a Los Ángeles buscando aire cálido. Queriendo dejar un monumento con su apellido, compró la esquina de 3rd y Broadway para levantar el edificio más lujoso de la ciudad." 
          },
          { 
            h: "👻 El Mensaje de la Ouija y el Dibujante Novato", 
            p: "Bradbury rechazó los planos del arquitecto Sumner Hunt por considerarlos aburridos y le ofreció el proyecto a su joven dibujante de 32 años, <strong>George Wyman</strong>, quien ganaba $5 a la semana y no tenía título. Temiendo traicionar a su jefe, Wyman y su esposa consultaron la Ouija; un mensaje de su difunto hermano Mark dictó: <em>'Acepta el Edificio Bradbury. Te hará famoso'</em>. Wyman aceptó al día siguiente." 
          },
          { 
            h: "🚀 Arquitectura Futurista Victoriana", 
            p: "El presupuesto de $175,000 se disparó a <strong>$500,000</strong> (unos $18 millones actuales) al encontrar un manto freático subterráneo. Bradbury murió en 1892, 14 meses antes de ver su obra terminada.<br><br>Inspirado en la novela de ciencia ficción de 1888 <em>Mirando Atrás</em> de Edward Bellamy, Wyman diseñó un <strong>atrio acristalado de 50 pies</strong> que inunda el interior de luz natural. Incorporó hierro forjado francés exhibido en la <strong>Feria Mundial de Chicago de 1893</strong>, mármol italiano, piso de loseta mexicana, elevadores de jaula de pájaro y buzones de gravedad de bronce." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 Escenario Cinematográfico", d: "• <em>Blade Runner (1982):</em> Departamento de Sebastian y clímax de la película.<br>• <em>(500) Días con Ella (2009):</em> La sala de espera de arquitectura.<br>• <em>El Artista (2011):</em> Encuentro en las escaleras." }
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
          { 
            h: "🎭 Sid Grauman’s First Palace & The Churrigueresque Facade", 
            p: "Opened on <strong>February 1, 1918</strong> as showman <strong>Sid Grauman’s</strong> very first entertainment palace in Los Angeles, costing a reported $1 million. Designed by architect Albert C. Martin Sr. with a hyper-ornate <strong>Spanish Churrigueresque</strong> facade sculpted by Joseph Mora. Look closely at the exterior to spot carved American bison heads, Texas longhorn steer skulls, allegorical maidens of comedy and tragedy, and early movie cameras embedded in the plasterwork." 
          },
          { 
            h: "🎬 The Shift to Hollywood & The Fouce Golden Era", 
            p: "The wild success of this theater gave Grauman the capital to expand west, building the Egyptian (1922) and Chinese (1927) Theatres on Hollywood Boulevard and triggering the migration of cinema from Broadway to Hollywood.<br><br>In 1949, impresario <strong>Frank Fouce</strong> took over the theater (<em>Empresa Fouce</em>), transforming it into the premier Spanish-language performance palace in the United States. It headlined Latin cinema and music icons including <strong>Cantinflas, María Félix, Pedro Infante, Dolores del Río, Celia Cruz, Juan Gabriel, and Vicente Fernández</strong>. Mexican cinema idol Antonio Aguilar even brought his live equestrian rodeo onto the indoor stage." 
          },
          { 
            h: "📺 The Birth of Univision", 
            p: "Frank Fouce’s son, <strong>Frank L. Fouce</strong>, recognized the growing shift from variety stages to broadcast television. In 1962, he co-founded <strong>KMEX-TV Channel 34</strong> in Los Angeles, laying the foundation for the Spanish International Network (SIN), which later rebranded into <strong>Univision</strong>—now the largest Spanish-language network in the US." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 Media Lore", d: "Its neon marquee glows across from the Bradbury Building in <em>Blade Runner</em> (1982) and appears as the 'Ten Cent Theater' in <em>Grand Theft Auto V</em>." }
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
          { 
            h: "🎭 El Debut de Sid Grauman y la Fachada Churrigueresca", 
            p: "Inaugurado el <strong>1 de febrero de 1918</strong> como el primer gran teatro de <strong>Sid Grauman</strong> en LA con un costo de $1 millón. Diseñado por Albert C. Martin Sr. con una fachada de estilo <strong>Churrigueresco español</strong> esculpida por Joseph Mora. Si observan con atención, verán cabezas de bisonte talladas, cuernos texanos, figuras alegóricas de comedia/tragedia y cámaras de cine primitivas." 
          },
          { 
            h: "🎬 La Mudanza a Hollywood y la Era Dorada en Español", 
            p: "El éxito de este teatro le dio a Grauman el capital para construir los Teatros Egipcio y Chino en Hollywood, trasladando la industria del entretenimiento hacia el oeste.<br><br>En 1949, el empresario <strong>Frank Fouce</strong> tomó el teatro (<em>Empresa Fouce</em>), convirtiéndolo en el escenario hispano más prestigioso de EE. UU. Aquí se presentaron leyendas como <strong>Cantinflas, María Félix, Pedro Infante, Celia Cruz, Juan Gabriel y Vicente Fernández</strong>. Antonio Aguilar incluso presentó su espectáculo ecuestre dentro del teatro." 
          },
          { 
            h: "📺 El Nacimiento de la Cadena Univision", 
            p: "Su hijo, <strong>Frank L. Fouce</strong>, vio el futuro en la televisión y en 1962 cofundó <strong>KMEX Canal 34</strong> en Los Ángeles. Esta televisora fue el pilar de la Spanish International Network (SIN), que más tarde se transformó en <strong>Univision</strong>, la cadena en español más grande de Estados Unidos." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "🎬 En Blade Runner y GTA", d: "Su letrero de neón ilumina la calle frente al Bradbury en <em>Blade Runner</em> (1982) y figura en <em>GTA V</em> como el 'Ten Cent Theater'." }
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
          { 
            h: "🔥 The 52-Year Aztec Cycle & The Olympic Flame", 
            p: "Painted in <strong>1985</strong> by the <strong>East Los Streetscapers</strong> (Wayne Alaniz Healy, David Botello, George Yepes). In ancient Mesoamerican culture, every 52 years, all fires across the empire were extinguished, and priests lit a single 'New Fire' (<em>Xiuhmolpilli</em>) from a sacred mountaintop to symbolize cosmic rebirth.<br><br>Los Angeles hosted the Summer Olympic Games in <strong>1932</strong> and again in <strong>1984</strong>—a gap of <strong>exactly 52 years</strong>. The mural connects ancient Aztec ceremony with the return of the Olympic flame to Los Angeles." 
          },
          { 
            h: "🥊 Local Champions Featured", 
            p: "The mural honors homegrown champions who grew up in local neighborhoods: East LA boxer <strong>Paul Gonzales</strong> (who won Gold in 1984 and took home the Val Barker Trophy for best boxer) and South LA sprinter <strong>Valerie Briscoe-Hooks</strong> (the first athlete in Olympic history to win gold in both the 200m and 400m at the same Olympic Games)." 
          },
          { 
            h: "🎨 The Victor Clothing Art Corridor", 
            p: "The Victor Clothing Company was an iconic retailer on Broadway that supported the community by commissioning Chicano masterworks on its walls. Look directly next door at <strong>The Pope of Broadway (1984)</strong> by Eloy Torrez, portraying Mexican-American Oscar-winner <strong>Anthony Quinn</strong> dancing with open arms in his famous <em>Zorba the Greek</em> pose." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "📸 Photo Spot", d: "Stand across the street on Broadway to capture both <em>El Nuevo Fuego</em> and <em>The Pope of Broadway</em> murals side-by-side in one frame." }
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
          { 
            h: "🔥 El Fuego Nuevo Azteca y la Llama Olímpica", 
            p: "Pintado en <strong>1985</strong> por los artistas de <strong>East Los Streetscapers</strong> (Healy, Botello y Yepes). En el México prehispánico, cada 52 años se apagaban todos los fuegos del imperio y los sacerdotes encendían un único 'Fuego Nuevo' (<em>Xiuhmolpilli</em>) en la cima sagrada para simbolizar la renovación cósmica.<br><br>Los Ángeles fue sede olímpica en <strong>1932</strong> y en <strong>1984</strong>: un intervalo de <strong>exactamente 52 años</strong>. El mural fusiona la mitología azteca con el regreso de la antorcha olímpica a la ciudad." 
          },
          { 
            h: "🥊 Campeones Locales Retratados", 
            p: "Rinde homenaje a atletas locales: el boxeador del Este de LA <strong>Paul Gonzales</strong> (Oro en 1984 y Trofeo Val Barker) y la velocista del Sur de LA <strong>Valerie Briscoe-Hooks</strong> (primera mujer en ganar oro en 200m y 400m en los mismos Juegos Olímpicos)." 
          },
          { 
            h: "🎨 El Corredor de Arte de Victor Clothing Co.", 
            p: "La tienda Victor Clothing financió grandes murales chicanos. Justo al lado pueden ver <strong>The Pope of Broadway (1984)</strong> de Eloy Torrez, que retrata al gran actor mexicano <strong>Anthony Quinn</strong> bailando con los brazos abiertos en su papel de <em>Zorba el Griego</em>." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "📸 Foto Panorámica", d: "Párate en la acera de enfrente de Broadway para capturar tanto <em>El Nuevo Fuego</em> como el mural de Anthony Quinn en una sola foto." }
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
          { y: "1887", t: "Railroad $1 fare war brings 100,000 settlers and sparks the citrus boom." },
          { y: "1892", t: "Doheny strikes oil; by 1923 LA produces 25% of the world's petroleum." },
          { y: "1908", t: "Filmmakers flee Thomas Edison patent trusts in NY for LA sunlight." },
          { y: "1913", t: "Mulholland completes the 233-mile gravity-powered Los Angeles Aqueduct." }
        ],
        stories: [
          { 
            h: "🌊 The 5 Growth Waves That Built Modern LA", 
            p: "Created in 1988–1989 by California artist <strong>Tony Sheets</strong>, this massive 66 ft × 35 ft cast-concrete relief chronicles the five historical forces that transformed Los Angeles from an isolated desert pueblo into a global metropolis:<br><br><strong>1. Spanish Missions & Saints (1771):</strong> Spanish friars named California coastal sites after the Catholic feast calendar of the day they made landfall (San Diego, San Francisco, Santa Monica). Mission San Gabriel (1771) paved the way for 44 settlers (*Los Pobladores*) to establish the original Pueblo in 1781.<br><br><strong>2. Citrus & The $1 Train Fare War (1887):</strong> The Santa Fe and Southern Pacific railroads fought a cutthroat 1887 price war, slashing tickets from Chicago to LA from $125 to <strong>$1 for a single day</strong>. 100,000 settlers arrived, blanketing the valleys in orange groves (Orange County broke off in 1889). Today, California produces over 70% of US fruits/nuts and 1/3 of all US vegetables.<br><br><strong>3. 1892 Black Gold Strike:</strong> Edward Doheny and Charles Canfield struck petroleum near downtown LA. By 1923, the Los Angeles basin produced nearly <strong>25% of the entire world’s petroleum</strong> (connected directly to the natural asphalt seeps at the La Brea Tar Pits).<br><br><strong>4. Cinema Flight & The Edison Trust (1908):</strong> Independent filmmakers fled Thomas Edison’s patent monopoly in New York, seeking 300+ days of natural sunlight, diverse film terrains, and a 2-hour escape drive across the Mexican border.<br><br><strong>5. The 1913 LA Aqueduct:</strong> William Mulholland engineered a 233-mile aqueduct from Owens Valley that transported water relying 100% on gravity without a single motorized pump (<em>'There it is. Take it.'</em>)." 
          }
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
          { 
            h: "🌊 Las 5 Grandes Olas que Forjaron LA", 
            p: "Relieve monumental de concreto de 66x35 pies por el artista californiano <strong>Tony Sheets</strong>. Resume las 5 fuerzas históricas de la ciudad:<br><br><strong>1. Misiones y el Santoral Católico (1771):</strong> Nombres según el santo del día de desembarco español (San Diego, San Francisco, Santa Mónica). La Misión San Gabriel dio paso a la fundación del Pueblo en 1781.<br><br><strong>2. Cítricos y Guerra de Trenes a $1 (1887):</strong> Ferrocarriles compitieron bajando el boleto de Chicago a LA a <strong>$1 por un día</strong>, trayendo a 100,000 colonos. Los valles se cubrieron de naranjales (Orange County se independizó en 1889). Hoy California produce más del 70% de frutas/nueces de EE. UU.<br><br><strong>3. El Oro Negro de 1892:</strong> Edward Doheny descubrió petróleo cerca de DTLA; para 1923, la cuenca de LA producía el <strong>25% del petróleo mundial</strong> (ligado a los pozos de asfalto de La Brea Tar Pits).<br><br><strong>4. Huida a Hollywood (1908):</strong> Cineastas escaparon del monopolio de patentes de Thomas Edison en Nueva York buscando 300 días de sol y la frontera mexicana a 2 horas.<br><br><strong>5. El Acueducto de 1913:</strong> William Mulholland construyó un canal de 233 millas que transportaba agua 100% por gravedad desde Owens Valley (<em>'Ahí está. Tómenla'</em>)." 
          }
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
          { 
            h: "🏛️ The 40-Year Height Exemption & Mission Foundation", 
            p: "Dedicated in <strong>1928</strong> (454 feet, 28 stories). From 1904 to 1957, Los Angeles banned any building taller than 150 feet (~13 stories) to protect against earthquakes and prevent dark street canyons. Voters passed a special charter exemption specifically for City Hall so it would stand as the sole dominant tower on the skyline for 40 years.<br><br>To symbolize statewide unity, the foundation concrete was mixed with <strong>soil from all 58 California counties</strong> and <strong>water from all 21 historic Spanish missions</strong>." 
          },
          { 
            h: "🏅 Mayor Tom Bradley's 20-Year Legacy", 
            p: "LA’s first Black mayor and longest-serving leader in city history (5 terms, 20 years). Bradley orchestrated the <strong>1984 Summer Olympics</strong>—the first privately financed Games in history—resulting in a historic <strong>$223 million surplus</strong> that still funds youth sports today via the LA84 Foundation. He built the <strong>Tom Bradley International Terminal (TBIT)</strong> at LAX and passed Proposition A to build the modern Metro rail network (opening the Blue/A Line in 1990)." 
          },
          { 
            h: "🖤 The Black POW/MIA Flag & Civic Memory", 
            p: "Beneath the California flag flies the black POW/MIA flag commemorating military personnel imprisoned or missing in action. Flying it serves three purposes: remembering returning soldiers who faced stigma, acknowledging the human cost of the Vietnam War (1955–1975 across 5 presidencies), and maintaining a civic commitment to account for all unrecovered personnel." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "🏙️ Free 27th-Floor Observation Deck", d: "The 27th-floor Tom Bradley Room is open free to the public on weekdays, offering 360° views across the entire Los Angeles basin." },
          { cls: "box-lore", t: "🎬 Superman & Dragnet", d: "Appeared as the Daily Planet headquarters in the 1950s <em>Adventures of Superman</em>, in <em>War of the Worlds</em> (1953), and in the opening of <em>Dragnet</em>." }
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
          { 
            h: "🏛️ 40 Años Reinando en el Horizonte y Simbolismo Estatal", 
            p: "Inaugurado en <strong>1928</strong> (454 pies, 28 pisos). Durante más de 50 años estuvo prohibido construir a más de 150 pies (~13 pisos) por seguridad sísmica y para preservar la luz del sol. City Hall tuvo un permiso especial aprobado por votación para ser el único rascacielos en el cielo angelino durante 40 años.<br><br>Su mezcla de concreto utilizó <strong>tierra recolectada de los 58 condados de California</strong> y <strong>agua de las 21 misiones virreinales</strong> para simbolizar la unión del estado." 
          },
          { 
            h: "🏅 El Legado de 20 Años del Alcalde Tom Bradley", 
            p: "Primer alcalde afroamericano de LA y el que más tiempo ha servido (5 mandatos). Lideró los <strong>Juegos Olímpicos de 1984</strong> (los primeros financiados con fondos privados), generando un superávit de <strong>$223 millones</strong> que aún apoya el deporte juvenil. Construyó la Terminal Internacional en LAX y financió la red moderna de Metro con la Línea A en 1990." 
          },
          { 
            h: "🖤 La Bandera Negra POW/MIA", 
            p: "Bajo la bandera estatal ondea la bandera negra en memoria de los prisioneros y desaparecidos de guerra. Recuerda el costo humano de la Guerra de Vietnam (1955–1975) a lo largo de 5 presidencias y el compromiso de no olvidar a quienes sirvieron." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "🏙️ Mirador Gratuito Piso 27", d: "El piso 27 (Sala Tom Bradley) abre gratis entre semana ofreciendo vistas panorámicas de 360° de toda la metrópoli." },
          { cls: "box-lore", t: "🎬 En la Televisión", d: "Fue la sede del diario Daily Planet en la serie <em>Superman</em> de los años 50, en <em>Dragnet</em> y en <em>La Guerra de los Mundos</em> (1953)." }
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
          { y: "1925", t: "Hall of Justice opens, consolidating morgue, courts, and top-floor jail." },
          { y: "1946–1947", t: "Mendez v. Westminster argued at Spring St Courthouse, ending school segregation." },
          { y: "1962 & 1968", t: "Marilyn Monroe and Robert F. Kennedy autopsies conducted in basement morgue." },
          { y: "1970–1971", t: "Charles Manson held on 13th-floor jail tier during his 9.5-month murder trial." },
          { y: "1993–1996", t: "Menendez Brothers trials held across the street at Criminal Courts Building." }
        ],
        stories: [
          { 
            h: "⚖️ Hall of Justice: The Vertical All-in-One Justice Tower", 
            p: "Opened in 1925, it was the first building in America to consolidate an entire justice system under one roof: basement morgue and coroner, lower-floor criminal courts, middle sheriff headquarters, and a 750-cell maximum-security jail on the top floors.<br><br><strong>Charles Manson</strong> was incarcerated in the 13th-floor jail during his 1970–1971 trial while his followers held vigil outside on the sidewalk. Chief Medical Examiner Dr. Thomas Noguchi conducted the autopsies for both <strong>Marilyn Monroe</strong> (1962) and <strong>Robert F. Kennedy</strong> (1968) in basement Room 100. Mobster Bugsy Siegel and daredevil Evel Knievel also served time here." 
          },
          { 
            h: "📜 Landmark Civil Rights: Mendez v. Westminster", 
            p: "The adjacent 1940 Spring Street Courthouse hosted <em>Mendez v. Westminster</em> (1946–1947), where five Mexican-American families successfully challenged public school segregation in Orange County. Federal Judge Paul J. McCormick ruled that separating children was unconstitutional—creating the direct legal precedent used 8 years later in <em>Brown v. Board of Education</em>.<br><br>The courthouse also hosted the 1973 federal prosecution of Daniel Ellsberg for leaking the <strong>Pentagon Papers</strong>." 
          },
          { 
            h: "📺 High-Profile Trials at Clara Shortridge Foltz Center", 
            p: "Across the street stands the criminal justice center named after <strong>Clara Shortridge Foltz</strong>—California’s first female lawyer, who pioneered the concept of the public defender. This building hosted the sensational televised trials of the <strong>Menendez Brothers</strong> (1993–1996), the <strong>O.J. Simpson</strong> murder trial (1995), and serial killer <strong>Richard Ramirez</strong> (The Night Stalker)." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "🏢 The 1994 Retrofit", d: "The heavy jail cells on top caused the Hall of Justice to twist in the 1994 Northridge quake; it sat red-tagged for 20 years before a $231M retrofit reopened it as sheriff/DA headquarters." }
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
          { y: "1993–1996", t: "Juicios de los hermanos Menéndez en el tribunal de enfrente." }
        ],
        stories: [
          { 
            h: "⚖️ Hall of Justice: El Sistema Judicial Vertical", 
            p: "Inaugurado en 1925, fue el primer edificio en EE. UU. en integrar morgue, juzgados, oficinas policiales y 750 celdas carcelarias bajo un solo techo.<br><br>Aquí estuvo preso <strong>Charles Manson</strong> en el piso 13 durante su juicio de 1970 mientras sus seguidoras acampaban en la acera. El médico forense Thomas Noguchi practicó las autopsias de <strong>Marilyn Monroe</strong> (1962) y <strong>Robert F. Kennedy</strong> (1968) en el sótano. El mafioso Bugsy Siegel y el acróbata Evel Knievel también cumplieron condena aquí." 
          },
          { 
            h: "📜 Hito en Derechos Civiles: Caso Méndez v. Westminster", 
            p: "El tribunal de Spring Street albergó el histórico caso <em>Méndez v. Westminster</em> (1946–1947), donde cinco familias mexicoamericanas lograron que se declarara inconstitucional segregar a niños hispanos en escuelas públicas de California, sentando las bases legales para <em>Brown v. Board of Education</em>.<br><br>También albergó el juicio de los <strong>Papeles del Pentágono</strong> en 1973." 
          },
          { 
            h: "📺 Juicios Televisados en el Centro Clara Shortridge Foltz", 
            p: "El tribunal de enfrente lleva el nombre de la primera abogada mujer de California y creadora del concepto del defensor público. Fue sede de los sonados juicios de los <strong>Hermanos Menéndez</strong> (1993–1996), <strong>O.J. Simpson</strong> (1995) y el asesino serial <strong>Richard Ramirez (The Night Stalker)</strong>." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "🏢 El Terremoto de 1994", d: "El peso de las celdas superiores hizo torcer el edificio en el sismo de 1994; estuvo abandonado 20 años hasta una restauración antisísmica de $231 millones." }
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
          { 
            h: "🌵 The Birthplace of Los Angeles & 1st/Spring Hub", 
            p: "In 1781, 44 settlers (*Los Pobladores*) founded <em>El Pueblo de la Reina de los Ángeles</em>. Three blocks south at 1st and Spring sat the crowded commercial center of early 1900s Los Angeles before retail and skyscrapers migrated south and west." 
          },
          { 
            h: "🏨 Don Pío Pico & Pico House (1870)", 
            p: "<strong>Don Pío Pico</strong>, the last Mexican Governor of Alta California, sold off his extensive ranchos to invest $82,000 into constructing <strong>Pico House</strong>—LA's very first 3-story luxury Italianate hotel. It featured gas chandeliers, bathtubs, French dining, and a courtyard fountain. Pico built it to anchor the city's future around the Plaza, but commercial investment shifted south to 1st and Spring, bankrupting him in his final years." 
          },
          { 
            h: "🎨 Christine Sterling's Rescue & Siqueiros' Censored Mural", 
            p: "By the late 1920s, Olvera Street was a dilapidated alley marked for demolition. Preservationist <strong>Christine Sterling</strong> led a public campaign, partnered with the <em>LA Times</em>, and used county inmate labor to lay red paving stones, reopening the alley on Easter Sunday 1930 as a vibrant Mexican marketplace.<br><br>Above the plaza on the Italian Hall stands David Alfaro Siqueiros’ famous 1932 mural <strong><em>América Tropical</em></strong>. Commissioned to paint a picturesque scene, Siqueiros instead painted an indigenous peasant crucified beneath an American eagle with revolutionary snipers on the roof. Deemed too radical, it was whitewashed with lead paint within two years and was recently restored under a protective glass canopy." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "🥑 Legendary Avocado Taquitos", d: "Grab crispy fried beef taquitos drenched in green avocado sauce at <em>Cielito Lindo</em> (operating at the top of Olvera Street since 1934)." },
          { cls: "box-tip", t: "🚉 Historic Union Station", d: "Walk across Alameda Street to explore the 1939 Mission Revival architecture of <strong>Union Station</strong> and catch the Metro A, B, or D lines." }
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
          { 
            h: "🌵 El Nacimiento de Los Ángeles y el Centro de 1st y Spring", 
            p: "En 1781, 44 pobladores fundaron el <em>Pueblo de la Reina de los Ángeles</em>. Tres cuadras al sur, en 1st y Spring, se concentraba el corazón comercial más denso de la ciudad en 1900 antes de que los comercios y oficinas se desplazaran hacia el sur y el oeste." 
          },
          { 
            h: "🏨 Don Pío Pico y la Histórica Casa Pico (1870)", 
            p: "<strong>Don Pío Pico</strong>, el último gobernador mexicano de Alta California, vendió sus ranchos e invirtió $82,000 en construir <strong>Casa Pico</strong>, el primer hotel de lujo de tres plantas de Los Ángeles. Tenía iluminación a gas, tinas de baño, comida francesa y fuentes de patio. Pico intentó retener el centro de la ciudad en la Plaza, pero el crecimiento comercial se movió hacia el sur, dejándolo en la ruina en sus últimos años." 
          },
          { 
            h: "🎨 El Rescate de Olvera y el Mural Censurado de Siqueiros", 
            p: "En los años 20, la calle Olvera era un callejón en ruinas a punto de ser demolido. <strong>Christine Sterling</strong> lideró una campaña cívica, utilizó presos del condado para colocar los ladrillos rojos y reinauguró el callejón el Domingo de Resurrección de 1930 como mercado mexicano tradicional.<br><br>En el Italian Hall se ubica <strong><em>América Tropical (1932)</em></strong> de David Alfaro Siqueiros. Al pedirle una escena tropical decorativa, Siqueiros pintó a un indígena crucificado bajo un águila estadounidense con guerrilleros armados en el tejado. El mural fue blanqueado con cal por su fuerte crítica al imperialismo; hoy está restaurado bajo una cubierta de vidrio del Instituto Getty." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "🥑 Taquitos con Aguacate de Cielito Lindo", d: "Prueba los famosos taquitos dorados con salsa verde de aguacate en <em>Cielito Lindo</em> (abierto desde 1934 al final del callejón)." },
          { cls: "box-tip", t: "🚉 Estación Unión (Union Station)", d: "Cruza Alameda Street para admirar la hermosa arquitectura de 1939 de Union Station y conectar con el Metro." }
        ]
      }
    }
  ]
};

function renderView(shouldScroll = true) {
  const s = tourData.stops[currentStop - 1];
  const d = s[currentLang];
  const u = tourData.ui[currentLang];

  // UI Titles & Labels
  const uiTitle = document.getElementById('ui-title');
  const uiDesc = document.getElementById('ui-desc');
  const selectorLabel = document.getElementById('selector-label');
  const stopBadge = document.getElementById('stop-badge');
  const stopTitle = document.getElementById('stop-title');
  const stopAddress = document.getElementById('stop-address');
  const stopMapLink = document.getElementById('stop-map-link');
  const timelineHeading = document.getElementById('timeline-heading');

  if (uiTitle) uiTitle.textContent = u.title;
  if (uiDesc) uiDesc.textContent = u.desc;
  if (selectorLabel) selectorLabel.textContent = u.selectorLabel;
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

  // Timeline List
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

  // Stepper Buttons
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

  // Render Jump Pills
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

  // Bottom Promo
  const promoTitle = document.getElementById('promo-title');
  const promoDesc = document.getElementById('promo-desc');
  const promoBtn = document.getElementById('promo-btn');

  if (promoTitle) promoTitle.textContent = u.promoHead;
  if (promoDesc) promoDesc.textContent = u.promoText;
  if (promoBtn) {
    promoBtn.href = u.promoLink;
    promoBtn.textContent = u.promoBtnText;
  }

  // Scroll to tracker
  if (shouldScroll) {
    const tracker = document.getElementById('tracker');
    if (tracker) {
      const y = tracker.getBoundingClientRect().top + window.pageYOffset - 30;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}

function scrollPills(direction) {
  const pillNav = document.getElementById('pill-nav');
  if (pillNav) {
    pillNav.scrollBy({ left: direction * 240, behavior: 'smooth' });
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
