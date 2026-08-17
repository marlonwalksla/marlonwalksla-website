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
      selectorLabel: "Jump to Any Stop:",
      stopWord: "STOP",
      ofWord: "OF",
      completeWord: "Complete",
      timelineHead: "Chronological Milestones",
      peopleHead: "Notable Figures & Connections",
      prevBtn: "← Previous Stop",
      nextBtn: "Next Stop: ",
      finishBtn: "Complete Tour & Book Live Walk",
      mapBtn: "Google Maps",
      promoHead: "Want to Experience This With a Local Guide?",
      promoText: "Join Marlon on the top-rated 5-star live walking tour of Downtown Los Angeles! Enjoy interactive trivia, hidden stories, and our local community in person.",
      promoLink: "https://www.freetour.com/los-angeles/free-tour-of-downtown-los-angeles",
      promoBtnText: "Book the Live Free DTLA Tour →"
    },
    es: {
      title: "Tour Autoguiado por el Centro de Los Ángeles",
      desc: "Explora 240 años de historia de Los Ángeles paso a paso—desde las alturas de Bunker Hill hasta el nacimiento de la ciudad en 1781 en Placita Olvera.",
      selectorLabel: "Ir a Cualquier Parada:",
      stopWord: "PARADA",
      ofWord: "DE",
      completeWord: "Completado",
      timelineHead: "Hitos Cronológicos",
      peopleHead: "Personajes Destacados y Conexiones",
      prevBtn: "← Parada Anterior",
      nextBtn: "Siguiente: ",
      finishBtn: "Terminar Tour y Reservar",
      mapBtn: "Ver en Google Maps",
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
        address: "111 S Grand Ave, Los Angeles, CA 90012",
        short: "1. Disney Hall",
        timeline: [
          { y: "1960s", t: "Dorothy Buffum Chandler founds the Blue Ribbon Committee to turn Bunker Hill into LA's cultural spine." },
          { y: "1987", t: "Lillian Disney donates an initial $50 million in tribute to Walt Disney." },
          { y: "1997", t: "Frank Gehry's Guggenheim Bilbao opens, accelerating global excitement for his DTLA design." },
          { y: "2003", t: "Walt Disney Concert Hall officially opens to international acoustical acclaim." },
          { y: "2009", t: "Maestro Gustavo Dudamel becomes Music & Artistic Director of the Los Angeles Philharmonic." }
        ],
        people: [
          { name: "Lillian Disney", role: "Philanthropist & Benefactor", bio: "Widow of Walt Disney whose $50 million seed donation in 1987 honored Walt’s devotion to music and funded the creation of this iconic auditorium." },
          { name: "Frank Gehry", role: "Master Architect", bio: "Pritzker Prize winner who grew up in LA, served in the US Army, and drove a delivery truck while taking architecture courses at USC before transforming global architecture." },
          { name: "Dorothy Buffum Chandler", role: "Civic Leader & Cultural Patron", bio: "Spearheaded the Blue Ribbon Committee and mobilized private capital to transform Bunker Hill from leveled terrain into the city's performing arts acropolis." },
          { name: "Yasuhisa Toyota", role: "Chief Acoustician", bio: "Renowned acoustical master who designed the vineyard seating and hardwood interior curvature to deliver flawless sound reflection without electronic amplification." },
          { name: "Gustavo Dudamel", role: "Music & Artistic Director", bio: "World-renowned Venezuelan conductor who transformed the LA Phil into one of the most innovative and celebrated modern orchestras on earth." }
        ],
        stories: [
          { 
            h: "The Bunker Hill Levelling & The Blue Ribbon Committee", 
            p: "Look around Grand Avenue today—it is one of the densest corridors of performing arts institutions in the world. But 70 years ago, this hill was an entirely different universe: packed with Victorian mansions and boarding houses. In the 1960s, the city flattened the terrain in a massive urban renewal project. The cultural transformation of this ridge was spearheaded by the <strong>Blue Ribbon Committee</strong>, founded by civic titan Dorothy Buffum Chandler, who raised private capital to build the Music Center across the street." 
          },
          { 
            h: "Lillian Disney's Vision & The Philanthropic Tribute", 
            p: "In 1987, <strong>Lillian Disney</strong> (Walt Disney’s widow) donated $50 million to create a permanent, acoustically pure home for the Los Angeles Philharmonic in honor of Walt’s lifelong passion for the performing arts. Rather than designing a traditional civic monument, Lillian insisted on an open, democratic concert hall that belonged to all citizens of Los Angeles." 
          },
          { 
            h: "Frank Gehry's Deconstructivist Masterwork", 
            p: "The committee selected <strong>Frank Gehry</strong>. Gehry had grown up in Los Angeles, served in the US Army, and drove a delivery truck while taking night classes in architecture at USC. After his revolutionary design of the Guggenheim Museum in Bilbao, Spain, Gehry applied his signature deconstructivist style here. The exterior is wrapped in over <strong>12,500 custom-curved stainless steel panels</strong> designed to emulate billowing sails caught in the wind—visually mirroring the movement, rhythm, and tempo of orchestral music." 
          },
          { 
            h: "Acoustic Physics & The Douglas Fir Hull", 
            p: "Inside, the 2,265-seat auditorium is lined entirely with warm Douglas fir wood shaped like the curved hull of an ancient sailing vessel. Master acoustician <strong>Yasuhisa Toyota</strong> configured vineyard-style seating, placing the audience directly around the orchestra. The walls and convex ceiling panels reflect acoustic soundwaves evenly across every seat, producing pristine clarity without electronic microphones or speakers." 
          },
          { 
            h: "A Living Instrument: The Pipe Organ & The LA Phil", 
            p: "Dominating the rear of the stage is the massive 6,134-pipe organ nicknamed 'the French fries' for its curved, forward-leaning wooden exterior pipes. Under the baton of Venezuelan maestro <strong>Gustavo Dudamel</strong>, the hall has served as an international testing ground for modern orchestral premieres, Latin symphonic masterworks, and world-class broadcasts." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Hidden Rooftop Garden", d: "Climb the outdoor stairs on the Hope Street side to find the elevated Blue Ribbon Garden, featuring a mosaic rose fountain built from broken blue-and-white Delft china in honor of Lillian Disney." },
          { cls: "box-lore", t: "The Glare Modification", d: "Shortly after opening, select exterior panels were so reflective that they heated nearby sidewalks and condos; Gehry had the high-gloss panels lightly sanded down to a soft matte finish." }
        ]
      },
      es: {
        title: "Sala de Conciertos Walt Disney (Disney Hall)",
        address: "111 S Grand Ave, Los Angeles, CA 90012",
        short: "1. Disney Hall",
        timeline: [
          { y: "Años 60", t: "Dorothy Buffum Chandler funda el Comité Blue Ribbon para convertir Bunker Hill en el eje cultural de LA." },
          { y: "1987", t: "Lillian Disney dona $50 millones iniciales en homenaje a su esposo Walt Disney." },
          { y: "1997", t: "Abre el Guggenheim de Bilbao de Frank Gehry, acelerando el proyecto de LA." },
          { y: "2003", t: "Inauguración oficial de la sala con aclamación acústica mundial." },
          { y: "2009", t: "Gustavo Dudamel asume como Director Musical de la Filarmónica de Los Ángeles." }
        ],
        people: [
          { name: "Lillian Disney", role: "Filántropa y Benefactora", bio: "Viuda de Walt Disney cuya donación de $50 millones en 1987 honró el amor de Walt por la música y creó la sede definitiva de la Filarmónica." },
          { name: "Frank Gehry", role: "Arquitecto Principal", bio: "Ganador del Premio Pritzker que creció en LA, sirvió en el ejército y manejó camiones mientras estudiaba arquitectura de noche en USC." },
          { name: "Dorothy Buffum Chandler", role: "Líder Cívica y Promotora", bio: "Lideró el Comité Blue Ribbon y recaudó millones para transformar Bunker Hill de un cerro aplanado al corazón cultural de la metrópoli." },
          { name: "Yasuhisa Toyota", role: "Maestro de Acústica", bio: "Ingeniero japonés que diseñó el interior curvado y los asientos estilo viñedo para lograr un sonido perfecto sin amplificación electrónica." },
          { name: "Gustavo Dudamel", role: "Director Musical", bio: "Famoso director venezolano que convirtió a la Filarmónica de Los Ángeles en una de las orquestas más aclamadas e innovadoras del mundo." }
        ],
        stories: [
          { 
            h: "La Transformación de Bunker Hill y el Comité Blue Ribbon", 
            p: "Miren a su alrededor en Grand Avenue: hoy es uno de los corredores de artes escénicas más densos del planeta. Pero hace décadas, esta colina estaba repleta de mansiones victorianas antes de ser completamente aplanada en los años 60 durante un polémico proyecto de renovación urbana. La transformación cultural fue impulsada por el <strong>Comité Blue Ribbon</strong> y la filántropa Dorothy Buffum Chandler." 
          },
          { 
            h: "El Tributo de Lillian Disney a Walt Disney", 
            p: "En 1987, <strong>Lillian Disney</strong> donó $50 millones para construir una sede acústica perfecta para la Filarmónica de Los Ángeles. Quería un espacio democrático y abierto que honrara la pasión de Walt por la música orquestal y perteneciera a todos los habitantes de la ciudad." 
          },
          { 
            h: "La Arquitectura Desconstructivista de Frank Gehry", 
            p: "Contrataron a <strong>Frank Gehry</strong>, quien creció en Los Ángeles, sirvió en el ejército estadounidense y manejó camiones de reparto mientras estudiaba arquitectura en cursos nocturnos de USC. El exterior cuenta con más de <strong>12,500 paneles curvos de acero inoxidable</strong> que simulan velas de barco infladas por el viento, reflejando visualmente el movimiento y la energía de la música." 
          },
          { 
            h: "Física Acústica y el Casco de Abeto Douglas", 
            p: "Por dentro, el auditorio para 2,265 espectadores evoca el casco de un navío de madera de abeto Douglas. Diseñado por el acústico <strong>Yasuhisa Toyota</strong> con asientos estilo viñedo, el público rodea el escenario central, permitiendo que las ondas sonoras reboten con total pureza sin micrófonos." 
          },
          { 
            h: "Un Instrumento Vivo: El Órgano y la Filarmónica", 
            p: "Presidiendo el escenario se encuentra el colosal órgano de 6,134 tubos apodado 'las papas fritas' por sus tubos curvados hacia el frente. Bajo la batuta del maestro venezolano <strong>Gustavo Dudamel</strong>, la sala es el epicentro de la música contemporánea en América." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Jardín Secreto en la Azotea", d: "Sube las escaleras de Hope St hacia el jardín elevado para ver la fuente de rosas hecha con porcelana azul rota de Delft en honor a Lillian Disney." },
          { cls: "box-lore", t: "El Ajuste del Brillo Exterior", d: "Al inaugurarse, algunos paneles reflejaban tanta luz solar que calentaban la banqueta; Gehry mandó lijar suavemente el acero para darle un acabado mate." }
        ]
      }
    },

    // 2. The Broad Museum
    {
      id: 2,
      mapUrl: "https://maps.google.com/?q=The+Broad+Los+Angeles",
      en: {
        title: "The Broad Museum",
        address: "221 S Grand Ave (Next door to Disney Hall)",
        short: "2. The Broad",
        timeline: [
          { y: "1957", t: "Eli Broad co-founds Kaufman & Broad (KB Home), pioneering affordable suburban tract housing." },
          { y: "1971", t: "Broad acquires Sun Life Insurance (SunAmerica), forming his second Fortune 500 company." },
          { y: "1984", t: "The Broad Art Foundation is created to lend contemporary masterworks to global museums." },
          { y: "2015", t: "The $140 million museum opens with permanent free admission for the public." }
        ],
        people: [
          { name: "Eli & Edythe Broad", role: "Founders & Billionaire Patrons", bio: "Self-made business leader who built two Fortune 500 empires (KB Home & SunAmerica) and dedicated his billions to funding contemporary art and civic institutions in LA." },
          { name: "Andy Warhol", role: "Pop Art Pioneer", bio: "Leading figure of the visual art movement who screenprinted consumer products and celebrities while exposing the underlying social tensions of mid-century America." },
          { name: "Jeff Koons", role: "Neo-Pop Sculptor", bio: "Contemporary artist renowned for casting everyday celebratory items into monumental, high-gloss stainless steel sculptures that challenge consumer culture." },
          { name: "Elizabeth Diller", role: "Lead Architect (DS+R)", bio: "Visionary designer who conceptualized 'The Veil and the Vault' to solve the dual challenge of public gallery display and secure archival art storage." },
          { name: "Yayoi Kusama", role: "Contemporary Master", bio: "Celebrated Japanese artist whose iconic Infinity Mirror Rooms create kaleidoscopic, boundless light installations that draw worldwide crowds." }
        ],
        stories: [
          { 
            h: "The Fortune Behind the Art: Eli & Edythe Broad", 
            p: "Eli Broad achieved the rare feat of building two separate Fortune 500 enterprises from scratch: <strong>KB Home</strong> (which constructed hundreds of thousands of post-war suburban homes) and <strong>SunAmerica</strong> (financial retirement annuities). Having amassed billions, Eli and Edythe Broad dedicated their lives and fortune to assembling one of the most prominent private postwar and contemporary art collections in existence, deciding that public access should be permanently free." 
          },
          { 
            h: "'The Veil and the Vault' Architectural Concept", 
            p: "Designed by renowned architecture firm <strong>Diller Scofidio + Renfro</strong> for $140 million. The building concept is built around two contrasting structural ideas:<br><br>• <strong>The Vault:</strong> The heavy, opaque concrete core in the center of the building that securely stores thousands of artworks not currently hung in galleries.<br>• <strong>The Veil:</strong> The porous, honeycomb-like exterior skeleton made of 2,000 fiberglass-reinforced concrete panels that wrap around the vault, filtering soft natural daylight into the top-floor exhibition deck without harming sensitive pigments." 
          },
          { 
            h: "Pop Art Revolution: Andy Warhol's Double Vision", 
            p: "The Broad holds one of the world's most significant archives of <strong>Pop Art</strong>. In the 1960s, <strong>Andy Warhol</strong> transformed commercial mass-production into high art. By screen-printing everyday consumer items like <em>Campbell’s Soup Cans</em> and celebrities like <em>Single Elvis</em>, Warhol held up a mirror to American consumerism. But Warhol went deeper: works like <em>1964 Alabama Race Riot</em> and his <em>American Nightmare / Death and Disaster</em> series confronted the grim realities of civil rights violence, electric chairs, and drug epidemics hidden behind shiny mid-century consumer culture." 
          },
          { 
            h: "Neo-Pop & Monumental Kitsch: Jeff Koons", 
            p: "Moving into the 1980s and 90s, <strong>Jeff Koons</strong> pioneered Neo-Pop. His famous mirror-polished stainless steel sculpture <strong>Balloon Dog (Blue)</strong> and hyper-chromatic <strong>Tulips</strong> take cheap, temporary party decorations and cast them into heavy, indestructible monuments of high gloss. Koons forces viewers to look directly into their own reflections on the gleaming surface, questioning consumer desire, kitsch, and how everyday objects are elevated into multi-million-dollar art." 
          },
          { 
            h: "Contemporary Giants: Basquiat & Kusama", 
            p: "The museum’s upper floors showcase raw, expressive masterpieces from <strong>Jean-Michel Basquiat</strong>, addressing race, police brutality, and urban poetry. Alongside Basquiat sit the mesmerizing <em>Infinity Mirror Rooms</em> by <strong>Yayoi Kusama</strong>, where mirrored chambers lit with hundreds of flickering LEDs create the sensation of floating through an infinite galaxy." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Yayoi Kusama Infinity Rooms", d: "Requires a separate free timed reservation at the kiosk inside the lobby due to high international visitor demand." },
          { cls: "box-tip", t: "Free Admission Secret", d: "General admission is 100% free. Reserving a free timed-entry ticket online in advance lets you bypass the outdoor general standby line." }
        ]
      },
      es: {
        title: "Museo The Broad",
        address: "221 S Grand Ave (Junto al Disney Hall)",
        short: "2. The Broad",
        timeline: [
          { y: "1957", t: "Eli Broad cofunda KB Home, pionera en urbanizaciones suburbanas accesibles." },
          { y: "1971", t: "Broad adquiere SunAmerica, forjando su segunda empresa en Fortune 500." },
          { y: "1984", t: "Nace la Fundación Broad para prestar obras maestras a museos del mundo." },
          { y: "2015", t: "Abre el museo de $140 millones con entrada 100% gratuita." }
        ],
        people: [
          { name: "Eli y Edythe Broad", role: "Fundadores y Filántropos", bio: "Empresario que construyó dos imperios Fortune 500 (KB Home y SunAmerica) y destinó sus miles de millones a financiar el arte y la vida cívica de Los Ángeles." },
          { name: "Andy Warhol", role: "Pionero del Pop Art", bio: "Figura cumbre del arte pop que serigrafió productos de consumo y celebridades mientras denunciaba las grietas y tensiones sociales de la época." },
          { name: "Jeff Koons", role: "Escultor Neo-Pop", bio: "Artista célebre por convertir objetos festivos cotidianos en esculturas gigantescas de acero inoxidable pulido que retan la cultura del consumo." },
          { name: "Elizabeth Diller", role: "Arquitecta Principal (DS+R)", bio: "Diseñadora vanguardista que concibió 'El Velo y la Bóveda' para unificar el resguardo de obras con galerías públicas inundadas de luz." },
          { name: "Yayoi Kusama", role: "Maestra Contemporánea", bio: "Aclamada artista japonesa cuyas salas de espejos infinitos crean experiencias inmersivas de luz cósmica admiradas en todo el mundo." }
        ],
        stories: [
          { 
            h: "La Fortuna de Eli y Edythe Broad", 
            p: "Eli Broad logró la hazaña de construir dos imperios Fortune 500 desde cero: <strong>KB Home</strong> (que construyó miles de urbanizaciones tras la guerra) y <strong>SunAmerica</strong> (fondos de inversión y pensiones). Con miles de millones acumulados, la pareja decidió crear una de las colecciones privadas de arte contemporáneo más influyentes del planeta y garantizar que el acceso fuera 100% gratuito." 
          },
          { 
            h: "El Concepto: 'El Velo y la Bóveda'", 
            p: "Diseñado por Diller Scofidio + Renfro con un costo de $140 millones. Su estructura combina dos elementos:<br><br>• <strong>La Bóveda:</strong> El núcleo central de concreto macizo que resguarda miles de piezas en archivo técnico.<br>• <strong>El Velo:</strong> La estructura exterior de panal compuesta por 2,000 paneles de fibra de vidrio que envuelve la bóveda y filtra luz natural suave hacia las galerías superiores sin dañar los lienzos." 
          },
          { 
            h: "La Revolución del Pop Art: Andy Warhol", 
            p: "The Broad posee una de las mayores colecciones de <strong>Pop Art</strong>. En los años 60, <strong>Andy Warhol</strong> convirtió el consumo masivo en arte supremo. Con sus serigrafías de las <em>Latas de Sopa Campbell</em> y <em>Single Elvis</em>, reflejó la sociedad estadounidense. Pero también abordó la tensión social: obras como <em>1964 Alabama Race Riot</em> y su serie <em>American Nightmare</em> expusieron la represión racial, accidentes mortales y la adicción a las drogas detrás del sueño americano." 
          },
          { 
            h: "Neo-Pop y la Obsesión del Consumo: Jeff Koons", 
            p: "En los años 80 y 90, <strong>Jeff Koons</strong> llevó el pop a la monumentalidad. Su icónica escultura de acero inoxidable <strong>Balloon Dog (Blue)</strong> y sus gigantescos <strong>Tulipanes</strong> convierten figuras inflables de fiesta en monumentos cromados de millones de dólares. Koons hace que el espectador se vea reflejado en el brillo de la pieza, reflexionando sobre la vanidad y la cultura del consumo." 
          },
          { 
            h: "Gigantes Contemporáneos: Basquiat y Kusama", 
            p: "El museo alberga además lienzos desgarradores de <strong>Jean-Michel Basquiat</strong> sobre identidad y poesía callejera, junto a las famosas <em>Infinity Mirror Rooms</em> de <strong>Yayoi Kusama</strong>, donde espejos y luces LED crean una ilusión óptica de espacio infinito." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Salas de Espejos de Kusama", d: "Requiere un registro gratuito adicional en las pantallas táctiles del vestíbulo debido a su alta demanda." },
          { cls: "box-tip", t: "Entrada Gratuita", d: "La entrada es gratis. Reservar turno con anticipación en su sitio web permite saltarse la fila general en la banqueta." }
        ]
      }
    },

    // 3. Financial District Rest Plaza
    {
      id: 3,
      mapUrl: "https://maps.google.com/?q=California+Plaza+Watercourt+Los+Angeles",
      en: {
        title: "Financial District Rest Plaza",
        address: "California Plaza Watercourt (Between One & Two Cal Plaza)",
        short: "3. Cal Plaza",
        timeline: [
          { y: "1901", t: "Henry Huntington incorporates the Pacific Electric Railway ('Red Cars')." },
          { y: "1925", t: "LA becomes the global per-capita car capital (1 car per 3 residents)." },
          { y: "1940", t: "America's first freeway (Arroyo Seco Parkway / CA-110) connects Pasadena to DTLA." },
          { y: "1948", t: "In-N-Out Burger opens California's first drive-thru with intercoms in Baldwin Park." },
          { y: "1949", t: "Federal antitrust conviction of GM, Firestone, and Standard Oil in US v. National City Lines." }
        ],
        people: [
          { name: "Henry E. Huntington", role: "Rail & Real Estate Baron", bio: "Mastermind behind the 1,100-mile Pacific Electric 'Red Car' transit empire, which he operated as a loss leader to sell vast suburban real estate developments." },
          { name: "Isaias W. Hellman", role: "Pioneer Financier & Banker", bio: "President of Farmers and Merchants Bank and partner of Huntington who provided the crucial banking capital that built modern Southern California." },
          { name: "Harry & Esther Snyder", role: "In-N-Out Founders", bio: "Opened California's first drive-thru burger stand in Baldwin Park in 1948, pioneering the two-way speaker box and fresh-to-order car culture dining." },
          { name: "Dorothy Buffum Chandler", role: "Civic Matriarch", bio: "Championed the corporate redevelopment of California Plaza as a modern financial and urban arts district." }
        ],
        stories: [
          { 
            h: "Henry Huntington & The Red Car Real Estate Scheme", 
            p: "When Collis Huntington died, his nephew <strong>Henry Huntington</strong> was passed over for leadership of the Southern Pacific Railroad in San Francisco. Huntington took his inheritance south, partnered with banker Isaias W. Hellman, and built the <strong>Pacific Electric Railway (the famous 'Red Cars')</strong> into the largest electric interurban transit network on earth (over 1,100 miles of track)." 
          },
          { 
            h: "The Train as a Loss Leader", 
            p: "Here is the genius secret: <strong>the streetcars were intentionally operated as a loss leader</strong>. Huntington lost money on passenger fares because the tracks were laid straight into empty orange groves and ranchlands owned by his private land syndicates. The trains existed purely to sell suburban real estate, causing LA's population to explode from <strong>102,000 in 1900 to 1.2 million by 1930</strong>." 
          },
          { 
            h: "The GM Antitrust Monopoly & The Automotive Shift", 
            p: "As Angelenos bought private cars, rail lines lost revenue. In the landmark federal antitrust case <em>United States v. National City Lines</em>, it was proven that General Motors, Firestone Tire, Standard Oil of California, and Mack Trucks secretly funded a front company that bought up electric streetcar networks across 45+ US cities, tore up the tracks, and motorized the lines with diesel buses to cement car dominance." 
          },
          { 
            h: "The Birth of Car Culture & In-N-Out Burger", 
            p: "By 1925, Los Angeles was the car capital of the world (1 car for every 3 residents, compared to 1 in 7 nationally). In 1940, the region opened America's first freeway: the <strong>Arroyo Seco Parkway (CA-110)</strong>. With car culture reigning supreme, in 1948 Harry and Esther Snyder opened California's first drive-thru in Baldwin Park featuring a revolutionary two-way speaker box: <strong>In-N-Out Burger</strong>." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "In-N-Out Secret Menu Guide", d: "• Animal Style: Mustard-seared beef, pickles, caramelized grilled onions, extra spread.<br>• Protein Style: Burger wrapped in fresh lettuce leaves (no bun).<br>• Flying Dutchman: Two slices of cheese melted between two beef patties (no bun, no veggies)." }
        ]
      },
      es: {
        title: "Plaza del Distrito Financiero (Descanso)",
        address: "California Plaza Watercourt (Entre One y Two Cal Plaza)",
        short: "3. Cal Plaza",
        timeline: [
          { y: "1901", t: "Henry Huntington funda los tranvías 'Red Cars' de Pacific Electric." },
          { y: "1925", t: "LA se convierte en la capital mundial del automóvil (1 auto por cada 3 habitantes)." },
          { y: "1940", t: "Abre la primera autopista de EE. UU. (Arroyo Seco Parkway / CA-110) hacia DTLA." },
          { y: "1948", t: "In-N-Out Burger abre el primer autoservicio con intercomunicador en Baldwin Park." },
          { y: "1949", t: "Condena federal antimonopolio a GM, Firestone y Standard Oil por desmantelar tranvías." }
        ],
        people: [
          { name: "Henry E. Huntington", role: "Magnate de Tranvías y Bienes Raíces", bio: "Creador del imperio de tranvías 'Red Cars' de más de 1,100 millas, operados a pérdida para vender terrenos agrícolas convertidos en suburbios." },
          { name: "Isaias W. Hellman", role: "Banquero Pionero de California", bio: "Presidente de Farmers and Merchants Bank y socio de Huntington que financió el crecimiento de los servicios públicos e industrias de LA." },
          { name: "Harry y Esther Snyder", role: "Fundadores de In-N-Out", bio: "Abrieron el primer autoservicio de California en Baldwin Park en 1948, inventando el sistema de pedidos por altavoz bidireccional." },
          { name: "Dorothy Buffum Chandler", role: "Matriarca Cívica", bio: "Impulsó la reurbanización corporativa de California Plaza como un centro moderno de finanzas y cultura." }
        ],
        stories: [
          { 
            h: "Henry Huntington y el Gran Negocio Inmobiliario", 
            p: "Al fallecer su tío Collis Huntington, <strong>Henry Huntington</strong> no obtuvo la presidencia del ferrocarril en San Francisco. Se mudó al sur con su capital, se asoció con el banquero Isaias W. Hellman y fundó los tranvías <strong>Pacific Electric ('Red Cars')</strong>, alcanzando más de 1,100 millas de vías electrificadas." 
          },
          { 
            h: "El Tranvía como Gancho Comercial", 
            p: "El secreto fue brillante: <strong>los tranvías operaban con pérdidas a propósito</strong>. A Huntington no le importaba el costo del pasaje porque tendía las vías directamente hacia enormes campos de naranjos y terrenos agrícolas que sus sindicatos habían comprado a bajo precio. Los tranvías servían para vender casas suburbanas, disparando la población de <strong>102,000 en 1900 a 1.2 millones en 1930</strong>." 
          },
          { 
            h: "El Juicio Antimonopolio de General Motors", 
            p: "A medida que la gente compraba autos, los tranvías perdieron pasaje. En el juicio antimonopolio <em>EE. UU. contra National City Lines</em>, se demostró que General Motors, Firestone Tire y Standard Oil financiaron una empresa fantasma para comprar y desmantelar los tranvías en más de 45 ciudades, reemplazándolos por autobuses a diésel." 
          },
          { 
            h: "La Cultura del Auto e In-N-Out Burger", 
            p: "Para 1925, Los Ángeles era la capital mundial del automóvil (1 auto por cada 3 habitantes). En 1940 abrió la primera autopista de acceso controlado del país: el <strong>Arroyo Seco Parkway (CA-110)</strong>. En pleno auge automotriz, en 1948 Harry y Esther Snyder abrieron el primer autoservicio con intercomunicador en Baldwin Park: <strong>In-N-Out Burger</strong>." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "Menú Secreto de In-N-Out", d: "• Animal Style: Carne sellada en mostaza, cebolla caramelizada, salsa extra.<br>• Protein Style: Envuelto en hojas de lechuga fresca.<br>• Flying Dutchman: Dos carnes y dos quesos derretidos (sin pan ni verduras)." }
        ]
      }
    },

    // 4. California Plaza Overlook & U.S. Bank Tower
    {
      id: 4,
      mapUrl: "https://maps.google.com/?q=US+Bank+Tower+Los+Angeles",
      en: {
        title: "California Plaza Overlook & U.S. Bank Tower",
        address: "Upper Terrace overlooking Grand Steps & 4th/Hope",
        short: "4. U.S. Bank Tower",
        timeline: [
          { y: "1989", t: "The 73-story Library Tower (now U.S. Bank Tower) is completed at 1,018 feet." },
          { y: "1996", t: "Incinerated by the alien mothership beam in Independence Day." },
          { y: "2013", t: "Immortalized as the 'Maze Bank Tower' in Grand Theft Auto V." },
          { y: "2017", t: "Wilshire Grand Center claims tallest title at 1,100 ft using its decorative spire." },
          { y: "2020s", t: "Remote and hybrid work causes a 40%+ shift in downtown corporate foot traffic." }
        ],
        people: [
          { name: "Henry N. Cobb (Pei Cobb Freed)", role: "Lead Architect", bio: "Master designer behind the tower's cylindrical stepped granite profile and crown, engineered to maximize light on narrow downtown street angles." },
          { name: "Charles Richter & Beno Gutenberg", role: "Caltech Seismologists", bio: "Pasadena scientists who formulated the logarithmic Richter scale in 1935, defining how modern earthquake engineering protects skyscrapers like this one." },
          { name: "Roland Emmerich", role: "Film Director", bio: "Director of Independence Day (1996) who chose the tower's glowing circular crown as the primary target for the iconic alien destruction sequence." }
        ],
        stories: [
          { 
            h: "The Post-Pandemic Shift in the Financial District", 
            p: "California Plaza (One & Two Cal Plaza) used to be the pulsating corporate heart of DTLA, packed with thousands of lawyers, bankers, crowded food trucks, and busy lunch restaurants. The permanent rise of remote and hybrid work reduced corporate weekday foot traffic by over 40–50%, forcing legacy lunch spots to limit hours and creating an unusually open urban space during traditional business hours." 
          },
          { 
            h: "The Great Skyscraper Spire Controversy", 
            p: "The 73-story <strong>U.S. Bank Tower (1,018 ft)</strong> stood as the tallest skyscraper west of the Mississippi River for nearly 30 years. In 2017, the Wilshire Grand Center claimed the official tallest title at 1,100 feet. However, it only wins because of its 294-foot decorative open-air architectural spire. The U.S. Bank Tower’s actual highest occupied roofline and top observation floor remain higher than the Wilshire Grand’s roof." 
          },
          { 
            h: "Advanced Seismic Engineering & Ductile Steel", 
            p: "The tower was engineered to withstand an <strong>8.3-magnitude earthquake</strong> on the nearby San Andreas Fault using a central core braced with high-ductility steel outriggers. These massive diagonal braces flex and dissipate kinetic energy during severe ground motion, allowing the structure to sway safely without fracturing the structural columns." 
          },
          { 
            h: "The Physics of the Logarithmic Earthquake Scale", 
            p: "Earthquake magnitude is <strong>logarithmic</strong>:<br><br>• Every 1.0 increase on the scale represents a <strong>10x increase in ground shaking amplitude</strong> and approximately <strong>32x more energy released</strong>.<br>• Moving from a local 5.1 shaker to an 8.1 monster is a jump of 3 whole points (10 × 10 × 10), making the ground shaking <strong>1,000 times stronger</strong> and releasing roughly <strong>32,000 times more destructive seismic energy</strong>.<br>• <em>Earthquake Safety:</em> Angelenos are trained to <em>Drop, Cover, and Hold On</em> beneath sturdy desks to protect against falling lighting fixtures, ceilings, and broken glass." 
          },
          { 
            h: "Hollywood Blockbusters, Video Games & Pop Lore", 
            p: "The tower is cemented in global pop culture: it was the primary target incinerated in <em>Independence Day</em> (1996), shook violently during the 9.0 quake in <em>San Andreas</em> (2015), and is universally recognized by millions of gamers as the <strong>'Maze Bank Tower'</strong> in <em>Grand Theft Auto V</em>." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "The OUE Skyslide (2016–2020)", d: "The building previously featured a 45-foot outdoor glass slide cantilevered 1,000 feet in the air off the 70th floor exterior before closing in 2020." }
        ]
      },
      es: {
        title: "Mirador Cal Plaza y Torre U.S. Bank",
        address: "Terraza Superior sobre las Grand Steps y 4th/Hope",
        short: "4. Torre U.S. Bank",
        timeline: [
          { y: "1989", t: "Inauguración de la Torre Library (hoy U.S. Bank) de 73 pisos y 1,018 pies." },
          { y: "1996", t: "Destruida por el rayo extraterrestre en Día de la Independencia." },
          { y: "2013", t: "Inmortalizada como la 'Torre Maze Bank' en Grand Theft Auto V." },
          { y: "2017", t: "Wilshire Grand le arrebata el récord con 1,100 pies gracias a su aguja." },
          { y: "Años 2020", t: "El trabajo híbrido reduce el tráfico de oficinas en más del 40%." }
        ],
        people: [
          { name: "Henry N. Cobb", role: "Arquitecto Principal", bio: "Arquitecto de Pei Cobb Freed que diseñó el perfil cilíndrico escalonado y la corona iluminada del rascacielos." },
          { name: "Charles Richter y Beno Gutenberg", role: "Sismólogos de Caltech", bio: "Científicos de Pasadena que crearon la escala Richter logarítmica en 1935, sentando las bases del diseño antisísmico moderno." },
          { name: "Roland Emmerich", role: "Director de Cine", bio: "Director de Día de la Independencia (1996) que eligió la corona de la torre como blanco principal del rayo extraterrestre." }
        ],
        stories: [
          { 
            h: "El Cambio Post-Pandemia en el Distrito Financiero", 
            p: "California Plaza solía ser el motor corporativo de DTLA, repleto de abogados, banqueros, camiones de comida y restaurantes llenos a la hora del almuerzo. El paso al trabajo remoto e híbrido redujo el tráfico peatonal corporativo entre semana en más del 40–50%, provocando el cierre de negocios tradicionales y dejando una plaza despejada en pleno horario laboral." 
          },
          { 
            h: "La Rivalidad de Rascacielos y la Aguja Decorativa", 
            p: "La <strong>Torre U.S. Bank (1,018 pies, 73 pisos)</strong> fue el rascacielos más alto al oeste del Misisipi durante tres décadas. En 2017, el Wilshire Grand la superó con 1,100 pies únicamente gracias a su aguja decorativa de 294 pies. Sin embargo, el piso habitable y el techo de la Torre U.S. Bank siguen estando a mayor altura real." 
          },
          { 
            h: "Ingeniería Antisísmica y Acero Dúctil", 
            p: "Fue construida para resistir un sismo de <strong>magnitud 8.3</strong> en la Falla de San Andrés mediante un núcleo central con refuerzos de acero dúctil que absorben y disipan la energía sísmica, permitiendo que la torre oscile con seguridad sin fracturarse." 
          },
          { 
            h: "Física de la Escala Logarítmica de Terremotos", 
            p: "La escala sísmica es <strong>logarítmica</strong>:<br><br>• Cada punto entero representa <strong>10 veces más amplitud de movimiento</strong> y unas <strong>32 veces más energía liberada</strong>.<br>• Pasar de un temblor moderado de 5.1 a uno de 8.1 (10 × 10 × 10) significa que el suelo se sacude <strong>1,000 veces más fuerte</strong> y libera <strong>32,000 veces más energía sísmica</strong>.<br>• <em>Regla de Oro Sísmica:</em> La indicación oficial es <em>Agacharse, Cubrirse y Sujetarse</em> bajo un escritorio pesado para protegerse de lámparas, techos falsos y cristales rotos." 
          },
          { 
            h: "En el Cine, Videojuegos y Cultura Pop", 
            p: "La torre forma parte de la memoria colectiva: fue destruida en <em>Día de la Independencia</em> (1996), resistió el terremoto en <em>San Andrés</em> (2015) y es la sede más famosa en <em>Grand Theft Auto V</em> como la 'Torre Maze Bank'." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "El Tobogán Skyslide (2016–2020)", d: "Durante años tuvo un tobogán de cristal suspendido a 1,000 pies de altura en la fachada del piso 70 antes de su cierre definitivo." }
        ]
      }
    },

    // 5. Angels Flight Railway
    {
      id: 5,
      mapUrl: "https://maps.google.com/?q=Angels+Flight+Railway+Los+Angeles",
      en: {
        title: "Angels Flight Railway",
        address: "351 S Hill St (Top Station at California Plaza)",
        short: "5. Angels Flight",
        timeline: [
          { y: "Dec 31, 1901", t: "Colonel J.W. Eddy opens the funicular on Bunker Hill." },
          { y: "1950s", t: "Surpasses 100 million passengers carried in its first 50 years." },
          { y: "1969", t: "Dismantled and stored in warehouse crates for Bunker Hill redevelopment." },
          { y: "1996", t: "Reassembled and reopened half a block away after 27 years in storage." },
          { y: "2016–2017", t: "Featured in La La Land, accelerating city safety investments to reopen." }
        ],
        people: [
          { name: "Colonel J.W. Eddy", role: "Engineer & Founder", bio: "Civil War veteran and lawyer who engineered and built the funicular railway in 1901 to solve the steep climb up Bunker Hill." },
          { name: "Prudent Beaudry", role: "13th Mayor of Los Angeles", bio: "French-Canadian developer who originally purchased and graded Bunker Hill in the 1870s, turning it into LA's most prestigious Victorian mansion district." },
          { name: "Emma Stone & Ryan Gosling", role: "Actors (La La Land)", bio: "Stars of the 2016 musical whose on-screen kiss inside the closed funicular created viral public demand that prompted city safety upgrades and a full reopening in 2017." },
          { name: "Raymond Chandler", role: "Film Noir Novelist", bio: "Legendary author whose gritty detective novels (including The High Window) immortalized Angels Flight as a central fixture of old Los Angeles crime fiction." }
        ],
        stories: [
          { 
            h: "The World's Shortest Railway", 
            p: "Angels Flight runs along a track length of <strong>298 feet (91 meters)</strong> on a steep 33% incline. The twin wooden funicular cars are named <strong>Sinai</strong> and <strong>Olivet</strong>. They operate on a counterbalanced continuous cable system: as one car rolls down the hill, its gravitational weight pulls the other car up the track." 
          },
          { 
            h: "Victorian Bunker Hill & The 200 Steps", 
            p: "In 1901, Bunker Hill was LA’s wealthiest residential enclave, crowded with Queen Anne and Victorian mansions. Wealthy residents rode Angels Flight down to shop the dry-goods emporiums on Broadway and took it back up to avoid climbing the 200+ steep wooden stairs. In its first 50 years of operation, it carried over <strong>100 million passengers</strong>, becoming the most heavily utilized short railway in the world per mile." 
          },
          { 
            h: "27 Years in Warehouse Crates", 
            p: "During the massive 1960s Bunker Hill Urban Renewal Project, the Victorian mansions were leveled and the hill was physically graded down. Angels Flight was dismantled and packed into wooden storage boxes in 1969. It sat in storage for 27 years until citizen preservationists forced the city to reassemble and reopen it in <strong>1996</strong>." 
          },
          { 
            h: "Film Noir to Hollywood Romance", 
            p: "Angels Flight is the quintessential cinematic icon of Los Angeles: it appeared in classic 1950s film noirs like <em>Kiss Me Deadly</em> (1955) and <em>Cry Danger</em> (1951), as well as Amazon's <em>Bosch</em>. In 2016, director Damien Chazelle filmed Sebastian and Mia sharing an iconic romantic kiss inside the car in <em>La La Land</em>." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Fare & Operating Hours", d: "$1.00 each way (only 50¢ if you tap a Metro TAP card). Open 365 days a year from 6:45 AM to 10:00 PM." },
          { cls: "box-lore", t: "The La La Land Permit", d: "When La La Land was filmed, the railway had been shut down for years; the movie's international success created the political momentum to fund safety upgrades and reopen the ride in 2017." }
        ]
      },
      es: {
        title: "Funicular Angels Flight",
        address: "351 S Hill St (Estación Superior en Cal Plaza)",
        short: "5. Angels Flight",
        timeline: [
          { y: "31 dic 1901", t: "El Coronel J.W. Eddy inaugura el funicular en Bunker Hill." },
          { y: "Años 50", t: "Supera los 100 millones de pasajeros transportados en sus primeros 50 años." },
          { y: "1969", t: "Desmantelado y guardado en cajas durante la remodelación urbana." },
          { y: "1996", t: "Reconstruido y reabierto tras 27 años en almacenes." },
          { y: "2016", t: "Aparece en la película ganadora del Óscar La La Land." }
        ],
        people: [
          { name: "Coronel J.W. Eddy", role: "Ingeniero y Fundador", bio: "Veterano de la Guerra Civil que construyó el funicular en 1901 para conectar la colina residencial con el centro comercial." },
          { name: "Prudent Beaudry", role: "13.º Alcalde de Los Ángeles", bio: "Inversionista francocanadiense que fraccionó Bunker Hill en la década de 1870 para convertirlo en el barrio más aristocrático de la ciudad." },
          { name: "Ryan Gosling y Emma Stone", role: "Actores (La La Land)", bio: "Protagonistas de la película cuyo beso viral dentro del vagón impulsó al Ayuntamiento a reparar las vías y reabrir el servicio al público en 2017." },
          { name: "Raymond Chandler", role: "Escritor de Novela Negra", bio: "Célebre autor angelino cuyas novelas policíacas inmortalizaron el funicular en la literatura noir del siglo XX." }
        ],
        stories: [
          { 
            h: "El Ferrocarril Más Corto del Mundo", 
            p: "Angels Flight recorre <strong>91 metros (298 pies)</strong> sobre una inclinación del 33%. Sus dos vagones de madera se llaman <strong>Sinai</strong> y <strong>Olivet</strong>, y funcionan mediante un cable contrapesado: el peso del vagón que baja ayuda a subir al que asciende." 
          },
          { 
            h: "El Bunker Hill Victoriano y los 200 Escalones", 
            p: "En 1901, Bunker Hill era el barrio más exclusivo y adinerado de LA, lleno de mansiones victorianas. Las familias adineradas usaban Angels Flight para bajar a hacer compras a Broadway y regresar a casa sin tener que subir más de 200 escalones de madera. En sus primeros 50 años transportó a más de <strong>100 millones de pasajeros</strong>." 
          },
          { 
            h: "27 Años Guardado en Cajas de Madera", 
            p: "Durante la remodelación de los años 60, las mansiones fueron demolidas y el cerro fue rebajado. Angels Flight fue desmantelado y empacado en cajas en 1969. Permaneció almacenado durante 27 años hasta que los comités de preservación histórica lograron su reconstrucción en <strong>1996</strong>." 
          },
          { 
            h: "Del Cine Negro al Romance de Hollywood", 
            p: "Angels Flight es un ícono cinematográfico fundamental: apareció en joyas del cine negro como <em>Kiss Me Deadly</em> (1955) y la serie <em>Bosch</em>. En 2016, el director Damien Chazelle filmó el romántico beso entre Mia y Sebastian en <em>La La Land</em>." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Tarifa y Horarios", d: "$1.00 por trayecto (50¢ con tarjeta TAP de Metro). Abierto los 365 días del año de 6:45 AM a 10:00 PM." },
          { cls: "box-lore", t: "El Permiso de La La Land", d: "Cuando se filmó la película el funicular estaba cerrado; la atención mundial motivó a la ciudad a financiar las obras de seguridad para reabrirlo en 2017." }
        ]
      }
    },

    // 6. Grand Central Market
    {
      id: 6,
      mapUrl: "https://maps.google.com/?q=Grand+Central+Market+Los+Angeles",
      en: {
        title: "Grand Central Market (Mid-Tour Break)",
        address: "317 S Broadway",
        short: "6. Grand Central Market",
        timeline: [
          { y: "1897", t: "Homer Laughlin Building built as LA's first fireproof, steel-reinforced structure." },
          { y: "Oct 27, 1917", t: "Grand Central Market opens as the largest food depot on the Pacific Coast." },
          { y: "1952", t: "Legacy vendor Roast To Go begins slow-cooking carnitas in copper pots." },
          { y: "1959", t: "Legacy stall China Cafe opens its neon-lit wonton soup lunch counter." },
          { y: "2012–2014", t: "Adele Yellin leads a curated modern culinary revitalization with 30+ international stalls." }
        ],
        people: [
          { name: "Homer Laughlin", role: "Pottery Tycoon & Builder", bio: "Ohio chinaware magnate who constructed Los Angeles's first fireproof, steel-reinforced building in 1897, which later became the home of the market." },
          { name: "Ira & Adele Yellin", role: "Preservationists & Visionaries", bio: "Developer couple who championed the preservation of historic Broadway landmarks and curated the 2012 artisanal revival of Grand Central Market." },
          { name: "Fernando Lopez", role: "Founder of Roast To Go", bio: "Opened his historic carnitas counter in 1952, establishing a 70+ year culinary legacy that anchors the market's immigrant Mexican roots." },
          { name: "Alvin Cailan", role: "Founder of Eggslut", bio: "Chef who started a gourmet brioche egg sandwich food truck that became the anchor modern tenant of the 2012 market renaissance." }
        ],
        stories: [
          { 
            h: "The 1897 Fireproof Structure & The 1917 Wonder Market", 
            p: "Opened on <strong>October 27, 1917</strong> inside the Homer Laughlin Building—Los Angeles’s very first fireproof, steel-reinforced building (built 1897). Established as the largest and most modern public food market on the Pacific Coast, it served as the bustling culinary pantry of downtown." 
          },
          { 
            h: "The Symbiotic Link with Angels Flight", 
            p: "The market operated in direct harmony with Angels Flight: Victorian shoppers rode the funicular down with wicker baskets to buy poultry, cuts from German butchers, dairy, and farm-fresh produce from Italian and Japanese vendors, riding back up to avoid hauling groceries up the steep hill." 
          },
          { 
            h: "An Immigrant Hub & Legacy Stalls", 
            p: "Through the mid-20th century, the market adapted to serve incoming immigrant communities, becoming a bustling hub of Mexican carnicerías, Jewish delis, and Asian produce stalls. Several historic vendors have operated for over half a century:<br><br>• <strong>Roast To Go (1952):</strong> Simmering authentic carnitas and chicharrón in traditional copper kettles.<br>• <strong>China Cafe (1959):</strong> Famous for counter-side wonton soup and chow mein under classic neon." 
          },
          { 
            h: "The 2012 Gourmet Renaissance", 
            p: "Under developer Adele Yellin, the market underwent a thoughtful revival around 2012–2014. By blending beloved historic vendors with cutting-edge chef concepts (such as <strong>Eggslut</strong>, <strong>Wexler's Deli</strong>, and <strong>Sticky Rice</strong>), Grand Central Market transformed into one of the country’s most celebrated food halls with over 30 international stalls." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "What to Eat on Your Break", d: "• <em>Roast To Go (1952):</em> Carnitas tacos in copper pots.<br>• <em>Sarita’s Pupusería:</em> Salvadoran handmade pupusas (featured in <em>La La Land</em>).<br>• <em>China Cafe (1959):</em> Classic wonton soup under neon counters." },
          { cls: "box-tip", t: "Quick Refreshment Tip", d: "Grab a fresh agua fresca from <em>La Huerta</em> or an iced cold brew from <em>G&B Coffee</em> near the Hill Street entrance." }
        ]
      },
      es: {
        title: "Mercado Grand Central (Descanso)",
        address: "317 S Broadway",
        short: "6. Grand Central Market",
        timeline: [
          { y: "1897", t: "Construcción del edificio Homer Laughlin, primer inmueble ignífugo de LA." },
          { y: "27 oct 1917", t: "Abre como el mercado de abastos más grande de la Costa del Pacífico." },
          { y: "1952", t: "Abre Roast To Go, cocinando carnitas en cazos de cobre por más de 70 años." },
          { y: "1959", t: "China Cafe inaugura su barra de sopa wonton bajo luces de neón." },
          { y: "2012", t: "Revitalización gastronómica con más de 30 puestos internacionales." }
        ],
        people: [
          { name: "Homer Laughlin", role: "Industrial y Constructor", bio: "Magnate de la cerámica de Ohio que levantó el primer edificio resistente al fuego de LA en 1897, sede actual del mercado." },
          { name: "Ira y Adele Yellin", role: "Preservacionistas y Promotores", bio: "Pareja que rescató el patrimonio histórico de Broadway e impulsó el renacimiento gastronómico artesanal del mercado en 2012." },
          { name: "Fernando López", role: "Fundador de Roast To Go", bio: "Abrió su puesto de carnitas en 1952, cimentando más de 70 años de herencia mexicana en el mercado." },
          { name: "Alvin Cailan", role: "Chef Fundador de Eggslut", bio: "Pionero gastronómico que convirtió su concepto de sándwiches gourmet en el catalizador moderno del mercado en 2012." }
        ],
        stories: [
          { 
            h: "El 'Mercado Maravilla' de 1917 y Angels Flight", 
            p: "Inaugurado el <strong>27 de octubre de 1917</strong> en el edificio Homer Laughlin, el primer edificio resistente al fuego de LA. Funcionaba en sincronía con Angels Flight: las amas de casa de Bunker Hill bajaban en el funicular con canastas de mimbre para comprar carne con carniceros alemanes, lácteos y verduras frescas con agricultores japoneses e italianos." 
          },
          { 
            h: "El Gran Corazón Inmigrante de LA", 
            p: "Durante el siglo XX se convirtió en el gran mercado multicultural de la ciudad, albergando carnicerías mexicanas, delis judías y puestos asiáticos. Puestos legendarios siguen cocinando hoy en día:<br><br>• <strong>Roast To Go (1952):</strong> Cocinando carnitas tradicionales en cazos de cobre por más de 70 años.<br>• <strong>China Cafe (1959):</strong> Sirviendo sopa wonton en su barra clásica bajo luces de neón." 
          },
          { 
            h: "El Renacimiento Gastronómico de 2012", 
            p: "Bajo la curaduría de Adele Yellin, el mercado revitalizó sus pasillos combinando puestos históricos con nuevas propuestas artesanales (como <strong>Eggslut</strong>, <strong>Wexler's Deli</strong> y <strong>Sticky Rice</strong>), convirtiéndolo en un referente gastronómico internacional con más de 30 opciones de comida." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "Qué Probar en el Descanso", d: "• <em>Roast To Go (1952):</em> Tacos de carnitas en cazo de cobre.<br>• <em>Sarita's Pupusería:</em> Pupusas salvadoreñas hechas a mano (vistas en <em>La La Land</em>).<br>• <em>China Cafe (1959):</em> Sopa wonton tradicional en la barra." },
          { cls: "box-tip", t: "Bebida Rápida", d: "Pide una fresca agua de frutas en <em>La Huerta</em> o un café frío en <em>G&B Coffee</em> junto a la salida de Hill Street." }
        ]
      }
    },

    // 7. The Bradbury Building
    {
      id: 7,
      mapUrl: "https://maps.google.com/?q=Bradbury+Building+Los+Angeles",
      en: {
        title: "The Bradbury Building",
        address: "304 S Broadway (Across from Grand Central Market)",
        short: "7. Bradbury Building",
        timeline: [
          { y: "1892", t: "Lewis Bradbury hires 32-year-old George Wyman after a Ouija séance; Bradbury dies 14 months before opening." },
          { y: "1893", t: "Opens at a cost of $500,000; ironwork exhibited at the Chicago World's Fair." },
          { y: "1971", t: "Designated a National Historic Landmark." },
          { y: "1982", t: "Immortalized in Ridley Scott's sci-fi masterpiece Blade Runner." }
        ],
        people: [
          { name: "Lewis L. Bradbury", role: "Mining Magnate & Visionary", bio: "Millionaire who made his fortune in the Minas del Tajo gold mines in Sinaloa, Mexico, and financed this architectural landmark to immortalize his family name." },
          { name: "George H. Wyman", role: "Architectural Draftsman", bio: "32-year-old junior draftsman who took the commission after consulting a Ouija board with his wife, designing one of the world's most famous Victorian atriums." },
          { name: "Edward Bellamy", role: "Utopian Sci-Fi Author", bio: "Author of the 1888 novel Looking Backward, whose descriptions of 21st-century buildings illuminated by vast glass domes directly inspired Wyman's atrium." },
          { name: "Ridley Scott", role: "Film Director", bio: "Visionary filmmaker who chose the building as J.F. Sebastian's apartment in Blade Runner (1982), cementing its place in science-fiction cinema history." },
          { name: "Sumner Hunt", role: "Original Commissioned Architect", bio: "Prominent LA architect whose conventional initial blueprints were rejected by Bradbury in favor of Wyman's radical glass skylit concept." }
        ],
        stories: [
          { 
            h: "Lewis Bradbury's Mexican Mining Fortune & Asthma Move", 
            p: "Mining tycoon <strong>Lewis Bradbury</strong> made a massive fortune in gold and silver from the Minas del Tajo in Sinaloa, Mexico. Suffering from chronic asthma in Oakland, he moved to Southern California for its dry climate and built a grand mansion on Court Hill. Determined to leave an architectural monument bearing his family name, he purchased the corner of 3rd and Broadway." 
          },
          { 
            h: "The Ouija Board Commission & The $5/Week Draftsman", 
            p: "Bradbury initially hired Sumner Hunt, a respected architect, but rejected his designs as conventional. Bradbury then approached Hunt’s 32-year-old junior draftsman, <strong>George Wyman</strong>, who had no formal architectural degree. Hesitant to betray his boss, Wyman and his wife Jennie consulted a planchette (Ouija board). A message supposedly spelled out from his deceased brother Mark: <em>'Take Bradbury Building. It will make you famous.'</em> Wyman accepted the commission the next morning." 
          },
          { 
            h: "Underground Springs & Ballooning Budget", 
            p: "Estimated at $175,000, the cost surged past <strong>$500,000</strong> (~$18M today) when excavators struck an underground sulfur spring water table, requiring heavy pumping systems and iron foundation piles. Lewis Bradbury tragically died in July 1892, roughly 14 months before the building opened in 1893." 
          },
          { 
            h: "Victorian Sci-Fi Architecture & Edward Bellamy", 
            p: "Wyman drew inspiration from Edward Bellamy’s 1888 utopian novel <em>Looking Backward</em>, which described future 2000 AD buildings with vast, skylit central halls. He designed a <strong>50-foot glass atrium</strong> that floods the interior with natural light and cool cross-breezes, complemented by French wrought-iron railings (exhibited at the <strong>1893 Chicago World's Fair</strong>), Italian marble stairs, Mexican terracotta tile, open-cage hydraulic elevators, and brass Cutler gravity mail chutes." 
          },
          { 
            h: "Blade Runner & The Cinema Hall of Fame", 
            p: "The building’s crowning cinematic moment came in Ridley Scott’s <em>Blade Runner</em> (1982) as J.F. Sebastian’s dystopian home where Deckard battles Roy Batty. It also served as the lobby meeting place in <em>(500) Days of Summer</em> (2009) and the silent crossing sequence in <em>The Artist</em> (2011)." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "The French Ironwork", d: "The intricate wrought-iron elevator cages and railings were fabricated in France and displayed at the 1893 Chicago World's Fair before being shipped to LA." }
        ]
      },
      es: {
        title: "Edificio Bradbury",
        address: "304 S Broadway (Frente a Grand Central Market)",
        short: "7. Edificio Bradbury",
        timeline: [
          { y: "1892", t: "Lewis Bradbury contrata a George Wyman tras una sesión de Ouija; Bradbury fallece antes de abrir." },
          { y: "1893", t: "Abre con un costo de $500,000; su herrería fue premiada en la Feria de Chicago." },
          { y: "1971", t: "Nombrado Monumento Histórico Nacional." },
          { y: "1982", t: "Inmortalizado en la película de culto Blade Runner." }
        ],
        people: [
          { name: "Lewis L. Bradbury", role: "Magnate Minero", bio: "Millonario de las minas de plata y oro de Minas del Tajo en Sinaloa, México, que mandó construir este edificio para inmortalizar su apellido." },
          { name: "George H. Wyman", role: "Dibujante y Diseñador", bio: "Joven dibujante de 32 años que aceptó el proyecto tras consultar la tabla Ouija con su esposa, creando uno de los atrios más icónicos de la arquitectura." },
          { name: "Edward Bellamy", role: "Escritor de Ciencia Ficción", bio: "Autor de la novela utópica de 1888 'Mirando Atrás', cuyas descripciones de edificios futuristas con domos de luz inspiraron el atrio de cristal." },
          { name: "Ridley Scott", role: "Director de Cine", bio: "Director de Blade Runner (1982) que eligió el interior del Bradbury como el departamento de Sebastian, consagrándolo en la historia del cine." },
          { name: "Sumner Hunt", role: "Arquitecto Original", bio: "Prestigioso arquitecto cuyos planos tradicionales fueron rechazados por Bradbury para dar paso a la visión vanguardista de Wyman." }
        ],
        stories: [
          { 
            h: "La Fortuna Minera de Lewis Bradbury en Sinaloa", 
            p: "El magnate minero <strong>Lewis Bradbury</strong> acumuló una inmensa fortuna en las minas de oro y plata de Minas del Tajo en Sinaloa, México. Afectado por asma grave en Oakland, se mudó a Los Ángeles buscando aire cálido. Queriendo dejar un monumento con su apellido, compró la esquina de 3rd y Broadway para levantar el edificio más lujoso de la ciudad." 
          },
          { 
            h: "El Mensaje de la Ouija y el Dibujante Novato", 
            p: "Bradbury rechazó los planos del arquitecto Sumner Hunt por considerarlos aburridos y le ofreció el proyecto a su joven dibujante de 32 años, <strong>George Wyman</strong>, quien ganaba $5 a la semana y no tenía título. Temiendo traicionar a su jefe, Wyman y su esposa consultaron la Ouija; un mensaje de su difunto hermano Mark dictó: <em>'Acepta el Edificio Bradbury. Te hará famoso'</em>. Wyman aceptó el encargo a la mañana siguiente." 
          },
          { 
            h: "Mantos Freáticos y Presupuesto Disparado", 
            p: "El costo inicial de $175,000 superó los <strong>$500,000</strong> (unos $18 millones actuales) al topar con un manantial subterráneo de azufre durante las excavaciones. Bradbury falleció en julio de 1892, 14 meses antes de ver abierta su gran obra." 
          },
          { 
            h: "Arquitectura Futurista Victoriana", 
            p: "Inspirado en la novela de ciencia ficción de 1888 <em>Mirando Atrás</em> de Edward Bellamy, Wyman diseñó un <strong>atrio acristalado de 50 pies</strong> que inunda el interior de luz natural. Incorporó hierro forjado francés exhibido en la <strong>Feria Mundial de Chicago de 1893</strong>, mármol italiano, piso de loseta mexicana, elevadores de jaula de pájaro y buzones de gravedad de bronce." 
          },
          { 
            h: "Blade Runner y el Olimpo del Cine", 
            p: "El edificio alcanzó la fama mundial en <em>Blade Runner</em> (1982) de Ridley Scott como el refugio de Sebastian. También protagonizó el desenlace de <em>(500) Días con Ella</em> (2009) y el cruce en las escaleras de la oscarizada <em>El Artista</em> (2011)." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Herrería de la Feria de Chicago", d: "Las rejas de hierro forjado y las jaulas de los elevadores fueron forjadas en Francia y exhibidas en la Feria Mundial de Chicago de 1893." }
        ]
      }
    },

    // 8. The Million Dollar Theater
    {
      id: 8,
      mapUrl: "https://maps.google.com/?q=Million+Dollar+Theater+Los+Angeles",
      en: {
        title: "The Million Dollar Theater",
        address: "307 S Broadway",
        short: "8. Million Dollar Theater",
        timeline: [
          { y: "Feb 1, 1918", t: "Showman Sid Grauman opens the palace at a reported cost of $1 million." },
          { y: "1922–1927", t: "Grauman shifts operations west, building the Egyptian and Chinese Theatres in Hollywood." },
          { y: "1949", t: "Impresario Frank Fouce takes over the lease, launching its Spanish-language Golden Age." },
          { y: "1962", t: "Frank L. Fouce co-founds KMEX-TV Channel 34, laying the foundation for Univision." }
        ],
        people: [
          { name: "Sid Grauman", role: "Master Showman & Impresario", bio: "Theatrical pioneer who opened his very first opulent palace here in DTLA before migrating west to Hollywood to build the Egyptian and Chinese Theatres." },
          { name: "Joseph Mora", role: "Sculptor & Artist", bio: "Sculpted the dramatic Spanish Churrigueresque facade, embedding Western longhorn skulls, bison heads, and early movie cameras into the terra-cotta." },
          { name: "Frank Fouce & Frank L. Fouce", role: "Entertainment Moguls & Univision Co-Founders", bio: "Father and son who transformed the theater into the premier US stage for Latin legends (Cantinflas, Pedro Infante) and co-founded KMEX Channel 34." },
          { name: "Antonio Aguilar", role: "Mexican Cinema & Rodeo Legend", bio: "Iconic charro actor who pioneered staging live equestrian rodeo shows on the indoor theater stage, creating the arena tours that filled stadiums across the continent." }
        ],
        stories: [
          { 
            h: "Sid Grauman’s First Palace & The Churrigueresque Facade", 
            p: "Opened on <strong>February 1, 1918</strong> as showman <strong>Sid Grauman’s</strong> very first entertainment palace in Los Angeles, costing a reported $1 million. Designed by architect Albert C. Martin Sr. with a hyper-ornate <strong>Spanish Churrigueresque</strong> facade sculpted by Joseph Mora. Look closely at the exterior to spot carved American bison heads, Texas longhorn steer skulls, allegorical maidens of comedy and tragedy, and early movie cameras embedded in the plasterwork." 
          },
          { 
            h: "The Shift to Hollywood Boulevard", 
            p: "The wild success of this theater gave Grauman the capital and prestige to expand west, building the Egyptian (1922) and Chinese (1927) Theatres on Hollywood Boulevard. This shift triggered the gradual migration of major movie premieres and entertainment money away from Broadway toward Hollywood." 
          },
          { 
            h: "The Empresa Fouce Era & Spanish-Language Golden Age", 
            p: "In 1949, impresario <strong>Frank Fouce</strong> took over the theater (<em>Empresa Fouce</em>), transforming it into the premier Spanish-language performance palace in the United States. It headlined Latin cinema and music icons including <strong>Cantinflas, María Félix, Pedro Infante, Dolores del Río, Celia Cruz, Juan Gabriel, and Vicente Fernández</strong>. Mexican cinema idol Antonio Aguilar even brought his live equestrian rodeo onto the indoor stage." 
          },
          { 
            h: "The Birth of Univision", 
            p: "Frank Fouce’s son, <strong>Frank L. Fouce</strong>, recognized the growing shift from variety stages to broadcast television. In 1962, he co-founded <strong>KMEX-TV Channel 34</strong> in Los Angeles, laying the foundation for the Spanish International Network (SIN), which later rebranded into <strong>Univision</strong>—now the largest Spanish-language network in the US." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Media Lore", d: "Its neon marquee glows across from the Bradbury Building in <em>Blade Runner</em> (1982) and appears as the 'Ten Cent Theater' in <em>Grand Theft Auto V</em>." }
        ]
      },
      es: {
        title: "Teatro Million Dollar",
        address: "307 S Broadway",
        short: "8. Teatro Million Dollar",
        timeline: [
          { y: "1 feb 1918", t: "Sid Grauman abre su primer gran cinepalacio por $1 millón." },
          { y: "1922–1927", t: "Grauman se traslada a Hollywood, creando los Teatros Egipcio y Chino." },
          { y: "1949", t: "Frank Fouce asume el teatro, iniciando la época de oro en español." },
          { y: "1962", t: "Frank L. Fouce cofunda KMEX Canal 34, cuna de Univision." }
        ],
        people: [
          { name: "Sid Grauman", role: "Empresario y Productor Teatral", bio: "Pionero del entretenimiento que inauguró aquí su primer palacio en LA antes de trasladarse a Hollywood para construir el Teatro Chino." },
          { name: "Joseph Mora", role: "Escultor Principal", bio: "Escultor que diseñó la recargada fachada churrigueresca de terracota, integrando cuernos texanos, bisontes y cámaras de cine antiguas." },
          { name: "Frank Fouce y Frank L. Fouce", role: "Pioneros de los Medios en Español", bio: "Padre e hijo que convirtieron el teatro en el templo hispano de EE. UU. (Cantinflas, Vicente Fernández) y fundaron KMEX Canal 34 (Univision)." },
          { name: "Antonio Aguilar", role: "Ídolo de la Charrería y Cine Mexicano", bio: "Actor y cantante que montó espectáculos ecuestres en el escenario interior del teatro, inspirando las grandes giras de jaripeo en Norteamérica." }
        ],
        stories: [
          { 
            h: "El Debut de Sid Grauman y la Fachada Churrigueresca", 
            p: "Inaugurado el <strong>1 de febrero de 1918</strong> como el primer gran teatro de <strong>Sid Grauman</strong> en LA con un costo de $1 millón. Diseñado por Albert C. Martin Sr. con una fachada de estilo <strong>Churrigueresco español</strong> esculpida por Joseph Mora. Si observan con atención, verán cabezas de bisonte talladas, cuernos texanos, figuras alegóricas de comedia/tragedia y cámaras de cine primitivas." 
          },
          { 
            h: "La Gran Migración hacia Hollywood", 
            p: "El éxito de este teatro le dio a Grauman el capital para construir los Teatros Egipcio y Chino en Hollywood Boulevard, iniciando el traslado de los grandes estrenos cinematográficos desde Broadway hacia el oeste de la ciudad." 
          },
          { 
            h: "La Era Dorada en Español con la Empresa Fouce", 
            p: "En 1949, el empresario <strong>Frank Fouce</strong> tomó el teatro (<em>Empresa Fouce</em>), convirtiéndolo en el escenario hispano más prestigioso de EE. UU. Aquí se presentaron leyendas como <strong>Cantinflas, María Félix, Pedro Infante, Celia Cruz, Juan Gabriel y Vicente Fernández</strong>. Antonio Aguilar incluso presentó su espectáculo ecuestre dentro del teatro." 
          },
          { 
            h: "El Nacimiento de la Cadena Univision", 
            p: "Su hijo, <strong>Frank L. Fouce</strong>, vio el futuro en la televisión y en 1962 cofundó <strong>KMEX Canal 34</strong> en Los Ángeles. Esta televisora fue el pilar de la Spanish International Network (SIN), que más tarde se transformó en <strong>Univision</strong>, la cadena en español más grande de Estados Unidos." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "En Blade Runner y GTA", d: "Su letrero de neón ilumina la calle frente al Bradbury en <em>Blade Runner</em> (1982) y figura en <em>GTA V</em> como el 'Ten Cent Theater'." }
        ]
      }
    },

    // 9. El Nuevo Fuego
    {
      id: 9,
      mapUrl: "https://maps.google.com/?q=240+S+Broadway+Los+Angeles",
      en: {
        title: "El Nuevo Fuego & Broadway Murals",
        address: "240 S Broadway (Victor Clothing Co. Building)",
        short: "9. El Nuevo Fuego",
        timeline: [
          { y: "1932", t: "Los Angeles hosts the Games of the X Olympiad." },
          { y: "1984", t: "LA hosts the Games of the XXIII Olympiad (exactly 52 years later)." },
          { y: "1984", t: "Eloy Torrez paints The Pope of Broadway depicting Anthony Quinn." },
          { y: "1985", t: "East Los Streetscapers paint the 80x85-foot mural El Nuevo Fuego." }
        ],
        people: [
          { name: "East Los Streetscapers (Healy & Botello)", role: "Chicano Mural Pioneers", bio: "Influential artist collective that bridged Mesoamerican history, public Chicano street art, and Olympic milestones across East Los Angeles and Downtown." },
          { name: "Paul Gonzales", role: "Olympic Boxing Gold Medalist", bio: "East LA native who fought out of local youth gyms, won Gold in the 1984 Olympic Games, and was awarded the Val Barker Trophy for best pound-for-pound fighter." },
          { name: "Valerie Briscoe-Hooks", role: "Triple Olympic Gold Medalist", bio: "South LA sprinter who made history at the 1984 Games as the first Olympian to win gold in both the 200m and 400m races at the same Olympics." },
          { name: "Anthony Quinn", role: "Chihuahua-Born Oscar Winner", bio: "Legendary Mexican-American actor celebrated next door in Eloy Torrez's mural The Pope of Broadway in his famous Zorba the Greek dance pose." }
        ],
        stories: [
          { 
            h: "The 52-Year Aztec Cycle & The Olympic Flame", 
            p: "Painted in <strong>1985</strong> by the <strong>East Los Streetscapers</strong> (Wayne Alaniz Healy, David Botello, George Yepes). In ancient Mesoamerican culture, every 52 years, all fires across the empire were extinguished, and priests lit a single 'New Fire' (<em>Xiuhmolpilli</em>) from a sacred mountaintop to symbolize cosmic rebirth.<br><br>Los Angeles hosted the Summer Olympic Games in <strong>1932</strong> and again in <strong>1984</strong>—a gap of <strong>exactly 52 years</strong>. The mural connects ancient Aztec ceremony with the return of the Olympic flame to Los Angeles." 
          },
          { 
            h: "Local Champions from East LA & South LA", 
            p: "The mural honors homegrown champions who grew up in local neighborhoods: East LA boxer <strong>Paul Gonzales</strong> (who won Gold in 1984 and took home the Val Barker Trophy for best boxer) and South LA sprinter <strong>Valerie Briscoe-Hooks</strong> (the first athlete in Olympic history to win gold in both the 200m and 400m at the same Olympic Games)." 
          },
          { 
            h: "The Victor Clothing Chicano Art Corridor", 
            p: "The Victor Clothing Company was an iconic retailer on Broadway that supported the community by commissioning Chicano masterworks on its walls. Look directly next door at <strong>The Pope of Broadway (1984)</strong> by Eloy Torrez, portraying Mexican-American Oscar-winner <strong>Anthony Quinn</strong> dancing with open arms in his famous <em>Zorba the Greek</em> pose." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Photo Spot", d: "Stand across the street on Broadway to capture both <em>El Nuevo Fuego</em> and <em>The Pope of Broadway</em> murals side-by-side in one frame." }
        ]
      },
      es: {
        title: "Mural El Nuevo Fuego y Arte Urbano",
        address: "240 S Broadway (Edificio Victor Clothing Co.)",
        short: "9. El Nuevo Fuego",
        timeline: [
          { y: "1932", t: "Los Ángeles es sede de los X Juegos Olímpicos." },
          { y: "1984", t: "LA recibe los XXIII Juegos Olímpicos (exactamente 52 años después)." },
          { y: "1984", t: "Eloy Torrez pinta 'The Pope of Broadway' en homenaje a Anthony Quinn." },
          { y: "1985", t: "East Los Streetscapers crean el mural de 80x85 pies 'El Nuevo Fuego'." }
        ],
        people: [
          { name: "East Los Streetscapers", role: "Pioneros del Muralismo Chicano", bio: "Colectivo artístico fundado por Wayne Healy y David Botello que unió la cosmología azteca con la identidad urbana angelina." },
          { name: "Paul Gonzales", role: "Boxeador Medallista de Oro", bio: "Pugilista originario del Este de LA que conquistó el Oro olímpico en 1984 y el Trofeo Val Barker al mejor boxeador del torneo." },
          { name: "Valerie Briscoe-Hooks", role: "Triple Campeona Olímpica", bio: "Atleta del Sur de LA que hizo historia en 1984 al ser la primera mujer en ganar el oro en 200m y 400m en los mismos Juegos." },
          { name: "Anthony Quinn", role: "Actor Ganador del Óscar", bio: "Leyenda chihuahuense del cine retratado en el mural vecino de Eloy Torrez en su icónico baile de Zorba el Griego." }
        ],
        stories: [
          { 
            h: "El Fuego Nuevo Azteca y la Llama Olímpica", 
            p: "Pintado en <strong>1985</strong> por los artistas de <strong>East Los Streetscapers</strong> (Healy, Botello y Yepes). En el México prehispánico, cada 52 años se apagaban todos los fuegos del imperio y los sacerdotes encendían un único 'Fuego Nuevo' (<em>Xiuhmolpilli</em>) en la cima sagrada para simbolizar la renovación cósmica.<br><br>Los Ángeles fue sede olímpica en <strong>1932</strong> y en <strong>1984</strong>: un intervalo de <strong>exactamente 52 años</strong>. El mural fusiona la mitología azteca con el regreso de la antorcha olímpica a la ciudad." 
          },
          { 
            h: "Campeones Locales del Este y Sur de LA", 
            p: "Rinde homenaje a atletas locales: el boxeador del Este de LA <strong>Paul Gonzales</strong> (Oro en 1984 y Trofeo Val Barker) y la velocista del Sur de LA <strong>Valerie Briscoe-Hooks</strong> (primera mujer en ganar oro en 200m y 400m en los mismos Juegos Olímpicos)." 
          },
          { 
            h: "El Corredor de Arte de Victor Clothing Co.", 
            p: "La tienda Victor Clothing financió grandes murales chicanos. Justo al lado pueden ver <strong>The Pope of Broadway (1984)</strong> de Eloy Torrez, que retrata al gran actor mexicano <strong>Anthony Quinn</strong> bailando con los brazos abiertos en su papel de <em>Zorba el Griego</em>." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Foto Panorámica", d: "Párate en la acera de enfrente de Broadway para capturar tanto <em>El Nuevo Fuego</em> como el mural de Anthony Quinn en una sola foto." }
        ]
      }
    },

    // 10. Evolution Sculpture
    {
      id: 10,
      mapUrl: "https://maps.google.com/?q=200+S+Broadway+Los+Angeles",
      en: {
        title: "The Evolution of Los Angeles Sculpture",
        address: "200 block of S Broadway (Broadway-Spring Center Facade)",
        short: "10. Evolution Sculpture",
        timeline: [
          { y: "1771", t: "Mission San Gabriel founded along El Camino Real." },
          { y: "1887", t: "Railroad $1 fare war brings 100,000 settlers and sparks the citrus boom." },
          { y: "1892", t: "Doheny strikes oil; by 1923 LA produces 25% of the world's petroleum." },
          { y: "1908", t: "Filmmakers flee Thomas Edison patent trusts in NY for LA sunlight." },
          { y: "1913", t: "Mulholland completes the 233-mile gravity-powered Los Angeles Aqueduct." }
        ],
        people: [
          { name: "Tony Sheets", role: "Master Sculptor & Artist", bio: "Renowned California artist who created this 66x35-foot cast concrete relief, capturing 200+ years of growth across five cultural eras." },
          { name: "Edward L. Doheny", role: "Oil Wildcatter & Tycoon", bio: "Struck oil near downtown LA in 1892 with a sharpened tree trunk, launching an energy boom that made LA the world's oil capital by 1923." },
          { name: "Thomas Edison", role: "Inventor & Monopoly Head", bio: "Created the Motion Picture Patents Company in NY, inadvertently driving independent directors to flee across the country to sunny Hollywood." },
          { name: "William Mulholland", role: "Chief Water Engineer", bio: "Self-taught engineer who built the 233-mile gravity-fed Los Angeles Aqueduct from Owens Valley, enabling the desert town to become a metropolis." },
          { name: "Eliza Tibbets", role: "Citrus Pioneer", bio: "Planted the first Bahia navel orange trees in Riverside in 1873, sparking the agricultural explosion that created Southern California's citrus empire." }
        ],
        stories: [
          { 
            h: "Wave 1: Spanish Missions, El Camino Real & Saints", 
            p: "Spanish friars named California coastal sites after the Catholic feast calendar of the day they made landfall (San Diego, San Francisco, Santa Monica). Mission San Gabriel (1771) paved the way for 44 settlers (*Los Pobladores*) to march west and establish the original Pueblo in 1781." 
          },
          { 
            h: "Wave 2: The Citrus Boom & The $1 Railroad Fare War", 
            p: "The Santa Fe and Southern Pacific railroads fought a cutthroat 1887 price war, slashing tickets from Chicago to LA from $125 down to <strong>$1 for a single day</strong>. Over 100,000 settlers arrived in months, blanketing the valleys in orange groves. Orange County broke off in 1889, naming itself after the fruit. Today, California produces over 70% of US fruits/nuts and 1/3 of all US vegetables." 
          },
          { 
            h: "Wave 3: The 1892 Black Gold Strike & World Oil Capital", 
            p: "Edward Doheny and Charles Canfield struck petroleum near downtown LA. By 1923, the Los Angeles basin produced nearly <strong>25% of the entire world’s petroleum</strong>. The natural surface asphalt seeps at the La Brea Tar Pits were thousands of years of geological proof of the vast oil reserves resting under the city." 
          },
          { 
            h: "Wave 4: Cinema Flight & The Edison Trust Monopoly", 
            p: "In 1908, Thomas Edison created the Motion Picture Patents Company (Edison Trust) in New York, suing independent filmmakers and sending enforcers to seize cameras. Directors fled to Southern California for 300+ days of sunlight, diverse landscapes, and a 2-hour escape drive across the Mexican border." 
          },
          { 
            h: "Wave 5: The 1913 LA Aqueduct & California Water Wars", 
            p: "Realizing a semi-arid basin could never grow without water, Chief Engineer <strong>William Mulholland</strong> and former Mayor Fred Eaton secured water rights in the Owens Valley 233 miles away. Mulholland engineered an aqueduct that transported water relying <strong>100% on gravity—without a single pump</strong> (*'There it is. Take it.'*)." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "The Sister Sculpture", d: "On the opposite side of this parking structure facing Spring Street, Tony Sheets sculpted a companion relief titled <em>The Evolution of Printing</em>." }
        ]
      },
      es: {
        title: "Escultura Evolución de Los Ángeles",
        address: "Cuadra 200 de S Broadway (Fachada Broadway-Spring Center)",
        short: "10. Escultura Evolución",
        timeline: [
          { y: "1771", t: "Fundación de la Misión San Gabriel en el camino virreinal." },
          { y: "1887", t: "Guerra de trenes a $1 atrae a 100,000 colonos e inicia el auge de los cítricos." },
          { y: "1892", t: "Descubrimiento de petróleo; para 1923 LA produce el 25% mundial." },
          { y: "1908", t: "Cineastas huyen del monopolio de Edison en Nueva York buscando sol." },
          { y: "1913", t: "Mulholland inaugura el acueducto de 233 millas que abastece a la ciudad." }
        ],
        people: [
          { name: "Tony Sheets", role: "Escultor y Artista", bio: "Artista californiano que esculpió este relieve monumental de concreto de 66x35 pies resumiendo más de dos siglos de historia." },
          { name: "Edward L. Doheny", role: "Pionero Petrolero", bio: "Descubrió petróleo en 1892 usando un tronco afilado de eucalipto, detonando el auge que convirtió a LA en la capital del crudo." },
          { name: "Thomas Edison", role: "Inventor y Monopolista", bio: "Creó el 'Trust' de patentes de cámaras en Nueva York, provocando involuntariamente que los directores huyeran a fundar Hollywood." },
          { name: "William Mulholland", role: "Ingeniero del Agua", bio: "Ingeniero autodidacta que construyó el acueducto de 233 millas desde Owens Valley abasteciendo a la ciudad por gravedad." },
          { name: "Eliza Tibbets", role: "Pionera de los Cítricos", bio: "Sembró los primeros naranjos navel en Riverside en 1873, iniciando el imperio agrícola del sur de California." }
        ],
        stories: [
          { 
            h: "Ola 1: Misiones Españolas y el Santoral Católico", 
            p: "Los exploradores españoles nombraron costas y valles según el santo del día de desembarco (San Diego, San Francisco, Santa Mónica). La Misión San Gabriel (1771) permitió que 44 pobladores marcharan hacia el oeste para fundar el Pueblo de Los Ángeles en 1781." 
          },
          { 
            h: "Ola 2: El Auge de los Cítricos y la Guerra de Trenes a $1", 
            p: "Las compañías de tren libraron una guerra de precios en 1887, bajando el boleto de Chicago a LA a <strong>$1 por un día</strong>. Llegaron 100,000 colonos que cubrieron los valles de naranjales (Orange County se independizó en 1889). Hoy California produce más del 70% de frutas y nueces del país." 
          },
          { 
            h: "Ola 3: El Descubrimiento de Petróleo de 1892", 
            p: "Edward Doheny descubrió petróleo cerca de DTLA con un tronco de árbol afilado. Para 1923, la cuenca de Los Ángeles producía el <strong>25% del petróleo mundial</strong>, un potencial geológico anunciado durante siglos por el asfalto natural de La Brea Tar Pits." 
          },
          { 
            h: "Ola 4: La Huida a Hollywood contra Thomas Edison", 
            p: "En 1908, Thomas Edison creó un monopolio de patentes en Nueva York que decomisaba cámaras a cineastas independientes. Los directores huyeron a California buscando 300 días de sol, paisajes diversos y la frontera mexicana a dos horas para escapar de citatorios judiciales." 
          },
          { 
            h: "Ola 5: El Acueducto de 1913 y las Guerras del Agua", 
            p: "El ingeniero <strong>William Mulholland</strong> y el exalcalde Fred Eaton compraron derechos de agua en Owens Valley a 233 millas de distancia. Mulholland construyó un acueducto monumental que transportaba agua <strong>100% por gravedad sin usar una sola bomba</strong> (*'Ahí está. Tómenla'*)." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "La Escultura Gemela", d: "Del otro lado de este estacionamiento sobre Spring Street, Tony Sheets esculpió el relieve complementario <em>La Evolución de la Imprenta</em>." }
        ]
      }
    },

    // 11. Los Angeles City Hall
    {
      id: 11,
      mapUrl: "https://maps.google.com/?q=Los+Angeles+City+Hall",
      en: {
        title: "Los Angeles City Hall",
        address: "200 N Spring St",
        short: "11. City Hall",
        timeline: [
          { y: "1904", t: "LA institutes a strict 150-foot building height limit across the city." },
          { y: "1928", t: "City Hall opens at 454 feet with a special city charter height exemption." },
          { y: "1973–1993", t: "Mayor Tom Bradley serves a record 5 terms (20 years) as LA's first Black mayor." },
          { y: "1984", t: "The LA Olympics generate an unprecedented $223 million operating surplus." },
          { y: "1990", t: "The Metro Blue Line (A Line) opens, marking the modern return of rail transit." }
        ],
        people: [
          { name: "Tom Bradley", role: "Mayor of Los Angeles (1973–1993)", bio: "First African-American mayor and longest-serving leader in city history who orchestrated the profitable 1984 Olympics, expanded LAX, and launched the modern Metro rail system." },
          { name: "Albert C. Martin Sr., John Austin & John Parkinson", role: "Lead Architects", bio: "The architectural triumvirate that designed City Hall, blending Art Deco, Classic Greek Mausoleum, and Byzantine architectural motifs into a single civic landmark." },
          { name: "Charles Lindbergh", role: "Aviation Pioneer", bio: "Dedicated the Lindbergh Beacon atop the tower in 1928 to guide early commercial aviators navigating into the Los Angeles basin." }
        ],
        stories: [
          { 
            h: "The 150-Foot Charter Limit & The 40-Year Exemption", 
            p: "Dedicated in <strong>1928</strong> (454 feet, 28 stories). From 1904 to 1957, Los Angeles banned any building taller than 150 feet (~13 stories) to protect against earthquakes and prevent dark street canyons. Voters passed a special charter exemption specifically for City Hall so it would stand as the sole dominant tower on the skyline for 40 years." 
          },
          { 
            h: "Uniting California: Soils from 58 Counties & 21 Missions", 
            p: "To symbolize statewide unity, the foundation concrete was mixed with <strong>soil from all 58 California counties</strong> and <strong>water from all 21 historic Spanish missions</strong>, embedding the entire geographic and cultural identity of the state into the tower base." 
          },
          { 
            h: "Mayor Tom Bradley's 20-Year Legacy", 
            p: "LA’s first Black mayor and longest-serving leader in city history (5 terms, 20 years). Bradley orchestrated the <strong>1984 Summer Olympics</strong>—the first privately financed Games in history—resulting in a historic <strong>$223 million surplus</strong> that still funds youth sports today via the LA84 Foundation. He built the <strong>Tom Bradley International Terminal (TBIT)</strong> at LAX and passed Proposition A to build the modern Metro rail network (opening the Blue/A Line in 1990)." 
          },
          { 
            h: "The Black POW/MIA Flag & Civic Memory", 
            p: "Beneath the California flag flies the black POW/MIA flag commemorating military personnel imprisoned or missing in action. Flying it serves three purposes: remembering returning soldiers who faced stigma, acknowledging the human cost of the Vietnam War (1955–1975 across 5 presidencies), and maintaining a civic commitment to account for all unrecovered personnel." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Free 27th-Floor Observation Deck", d: "The 27th-floor Tom Bradley Room is open free to the public on weekdays, offering 360° views across the entire Los Angeles basin." },
          { cls: "box-lore", t: "Superman & Dragnet", d: "Appeared as the Daily Planet headquarters in the 1950s <em>Adventures of Superman</em>, in <em>War of the Worlds</em> (1953), and in the opening of <em>Dragnet</em>." }
        ]
      },
      es: {
        title: "Ayuntamiento de Los Ángeles (City Hall)",
        address: "200 N Spring St",
        short: "11. City Hall",
        timeline: [
          { y: "1904", t: "La ciudad prohíbe edificios de más de 150 pies de altura." },
          { y: "1928", t: "Abre City Hall con 454 pies gracias a un permiso especial electoral." },
          { y: "1973–1993", t: "Tom Bradley gobierna 5 mandatos como primer alcalde afroamericano." },
          { y: "1984", t: "Los Juegos Olímpicos de LA generan un superávit récord de $223 millones." },
          { y: "1990", t: "Inauguración de la Línea Azul (Línea A) del Metro." }
        ],
        people: [
          { name: "Tom Bradley", role: "Alcalde de LA (1973–1993)", bio: "Primer alcalde afroamericano que gobernó 20 años, lideró las Olimpiadas de 1984 con superávit histórico, creó el Metro y la terminal internacional de LAX." },
          { name: "Parkinson, Austin y Martin", role: "Equipo de Arquitectos", bio: "Los tres destacados arquitectos que fusionaron estilo Art Déco, neoclásico y bizantino en el monumento cívico más emblemático de la ciudad." },
          { name: "Charles Lindbergh", role: "Aviador Histórico", bio: "Inauguró el faro aéreo Lindbergh Beacon en la cúspide de la torre en 1928 para orientar a los primeros aviones comerciales hacia LA." }
        ],
        stories: [
          { 
            h: "El Límite de 150 Pies y los 40 Años de Soledad en el Cielo", 
            p: "Inaugurado en <strong>1928</strong> (454 pies, 28 pisos). Durante más de 50 años estuvo prohibido construir a más de 150 pies (~13 pisos) por seguridad sísmica y para preservar la luz del sol. City Hall tuvo un permiso especial aprobado por votación para ser el único rascacielos en el cielo angelino durante 40 años." 
          },
          { 
            h: "Tierra de 58 Condados y Agua de 21 Misiones", 
            p: "Para representar la unidad de California, la mezcla de concreto de los cimientos incorporó <strong>tierra recolectada de los 58 condados</strong> y <strong>agua de las 21 misiones virreinales</strong>, sellando el simbolismo del estado en la base del edificio." 
          },
          { 
            h: "El Legado de 20 Años del Alcalde Tom Bradley", 
            p: "Primer alcalde afroamericano de LA y el que más tiempo ha servido (5 mandatos). Lideró los <strong>Juegos Olímpicos de 1984</strong> (los primeros financiados con fondos privados), generando un superávit de <strong>$223 millones</strong> que aún apoya el deporte juvenil. Construyó la Terminal Internacional en LAX y financió la red moderna de Metro con la Línea A en 1990." 
          },
          { 
            h: "La Bandera Negra POW/MIA y Memoria Cívica", 
            p: "Bajo la bandera estatal ondea la bandera negra en memoria de los prisioneros y desaparecidos de guerra. Recuerda el costo humano de la Guerra de Vietnam (1955–1975) a lo largo de 5 presidencias y el compromiso de no olvidar a quienes sirvieron." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Mirador Gratuito Piso 27", d: "El piso 27 (Sala Tom Bradley) abre gratis entre semana ofreciendo vistas panorámicas de 360° de toda la metrópoli." },
          { cls: "box-lore", t: "En la Televisión", d: "Fue la sede del diario Daily Planet en la serie <em>Superman</em> de los años 50, en <em>Dragnet</em> y en <em>La Guerra de los Mundos</em> (1953)." }
        ]
      }
    },

    // 12. Courthouses
    {
      id: 12,
      mapUrl: "https://maps.google.com/?q=Hall+of+Justice+Los+Angeles",
      en: {
        title: "Civic Center & Historic Courthouses Row",
        address: "Temple & Spring Street Intersection",
        short: "12. Courthouses Row",
        timeline: [
          { y: "1925", t: "Hall of Justice opens, consolidating morgue, courts, and top-floor jail." },
          { y: "1946–1947", t: "Mendez v. Westminster argued at Spring St Courthouse, ending school segregation." },
          { y: "1962 & 1968", t: "Marilyn Monroe and Robert F. Kennedy autopsies conducted in basement morgue." },
          { y: "1970–1971", t: "Charles Manson held on 13th-floor jail tier during his 9.5-month murder trial." },
          { y: "1993–1996", t: "Menendez Brothers trials held across the street at Criminal Courts Building." }
        ],
        people: [
          { name: "Clara Shortridge Foltz", role: "Legal Pioneer & Public Defender Originator", bio: "California's first female attorney who created the concept of the public defender to guarantee free legal defense for indigent individuals in American courts." },
          { name: "Dr. Thomas Noguchi", role: "Chief Medical Examiner ('Coroner to the Stars')", bio: "Renowned forensic coroner who performed high-profile autopsies in the basement morgue, including Marilyn Monroe (1962) and Senator Robert F. Kennedy (1968)." },
          { name: "Sylvia Mendez & Judge Paul McCormick", role: "Civil Rights Champions", bio: "Key figures in Mendez v. Westminster (1946), where Judge McCormick ruled that Mexican-American school segregation violated the 14th Amendment, setting the precedent for Brown v. Board." },
          { name: "Charles Manson", role: "Infamous Inmate", bio: "Cult leader held on the top-floor jail tier during his 1970–71 trial; his preserved jail cell remains inside the restored Hall of Justice today." },
          { name: "Bugsy Siegel", role: "Mobster & Vegas Casino Pioneer", bio: "Famous gangster detained in the Hall of Justice cells who arranged private limousines to take him to dinners during his stay." }
        ],
        stories: [
          { 
            h: "Hall of Justice: America's First Vertical Justice Complex", 
            p: "Opened in 1925, it was the first building in America to consolidate an entire justice system under one roof: basement morgue and coroner, lower-floor criminal courts, middle sheriff headquarters, and a 750-cell maximum-security jail on the top floors." 
          },
          { 
            h: "The 13th-Floor Jail & Charles Manson's Trial", 
            p: "<strong>Charles Manson</strong> was incarcerated in the 13th-floor jail during his 1970–1971 trial while his followers held vigil outside on the sidewalk, carving X's into their foreheads. Mobster Bugsy Siegel and daredevil Evel Knievel also served time in these upper cell blocks." 
          },
          { 
            h: "Room 100: Marilyn Monroe & Robert F. Kennedy Autopsies", 
            p: "In the basement morgue (Room 100), Chief Medical Examiner <strong>Dr. Thomas Noguchi</strong> performed the autopsy on <strong>Marilyn Monroe</strong> on August 5, 1962. Six years later in 1968, Dr. Noguchi performed the autopsy on assassinated Senator <strong>Robert F. Kennedy</strong> in the exact same room." 
          },
          { 
            h: "Landmark Civil Rights: Mendez v. Westminster", 
            p: "The adjacent 1940 Spring Street Courthouse hosted <em>Mendez v. Westminster</em> (1946–1947), where five Mexican-American families successfully challenged public school segregation in Orange County. Federal Judge Paul J. McCormick ruled that separating children was unconstitutional—creating the direct legal precedent used 8 years later in <em>Brown v. Board of Education</em>.<br><br>The courthouse also hosted the 1973 federal prosecution of Daniel Ellsberg for leaking the <strong>Pentagon Papers</strong>." 
          },
          { 
            h: "Clara Shortridge Foltz & High-Profile Trials of the 1990s", 
            p: "Across the street stands the criminal justice center named after <strong>Clara Shortridge Foltz</strong>—California’s first female lawyer, who pioneered the concept of the public defender. This building hosted the sensational televised trials of the <strong>Menendez Brothers</strong> (1993–1996), the <strong>O.J. Simpson</strong> murder trial (1995), and serial killer <strong>Richard Ramirez</strong> (The Night Stalker)." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "The 1994 Earthquake Retrofit", d: "The heavy top-floor jail cells made the building twist during the 1994 Northridge quake; it was red-tagged for 20 years before a $231M seismic retrofit reopened it as sheriff/DA headquarters." }
        ]
      },
      es: {
        title: "Centro Cívico y Tribunales Históricos",
        address: "Calles Temple y Spring",
        short: "12. Tribunales",
        timeline: [
          { y: "1925", t: "Abre el Hall of Justice unificando morgue, cortes y cárcel superior." },
          { y: "1946–1947", t: "Juicio Méndez contra Westminster que acabó con la segregación escolar." },
          { y: "1962 y 1968", t: "Autopsias de Marilyn Monroe y Robert F. Kennedy en la morgue del sótano." },
          { y: "1970–1971", t: "Charles Manson encarcelado en el piso 13 durante su juicio de 9 meses." },
          { y: "1993–1996", t: "Juicios de los hermanos Menéndez en el tribunal de enfrente." }
        ],
        people: [
          { name: "Clara Shortridge Foltz", role: "Pionera del Derecho y Defensor Público", bio: "Primera abogada mujer de California e inventora del sistema de defensoría pública para asegurar representación legal gratuita a personas sin recursos." },
          { name: "Dr. Thomas Noguchi", role: "Forense en Jefe ('Forense de las Estrellas')", bio: "Médico forense que practicó las célebres autopsias de Marilyn Monroe (1962) y del senador Robert F. Kennedy (1968) en el sótano del edificio." },
          { name: "Sylvia Méndez y Juez Paul McCormick", role: "Héroes de los Derechos Civiles", bio: "Protagonistas del caso Méndez v. Westminster (1946), donde el juez McCormick dictaminó que segregar a niños hispanos violaba la Constitución de EE. UU." },
          { name: "Charles Manson", role: "Recluso Célebre", bio: "Líder de la secta homicida recluido en las celdas del piso 13 durante su juicio de 1970; su celda original sigue preservada hoy en día." },
          { name: "Bugsy Siegel", role: "Mafioso y Pionero de Las Vegas", bio: "Famoso gánster encarcelado aquí que contrataba limusinas para salir a cenar durante su custodia." }
        ],
        stories: [
          { 
            h: "Hall of Justice: El Sistema Judicial Vertical", 
            p: "Inaugurado en 1925, fue el primer edificio en EE. UU. en integrar morgue, juzgados, oficinas policiales y 750 celdas carcelarias bajo un solo techo." 
          },
          { 
            h: "La Cárcel del Piso 13 y el Juicio de Charles Manson", 
            p: "Aquí estuvo preso <strong>Charles Manson</strong> en el piso 13 durante su juicio de 1970 mientras sus seguidoras acampaban en la banqueta con cruces en la frente. El mafioso Bugsy Siegel y el acróbata Evel Knievel también cumplieron condena en estas celdas." 
          },
          { 
            h: "Habitación 100: Las Autopsias de Marilyn Monroe y RFK", 
            p: "En la morgue del sótano, el forense en jefe <strong>Dr. Thomas Noguchi</strong> practicó la autopsia a <strong>Marilyn Monroe</strong> el 5 de agosto de 1962. Seis años más tarde, en 1968, examinó en esa misma mesa el cuerpo del senador asesinado <strong>Robert F. Kennedy</strong>." 
          },
          { 
            h: "Hito en Derechos Civiles: Caso Méndez v. Westminster", 
            p: "El tribunal de Spring Street albergó el histórico caso <em>Méndez v. Westminster</em> (1946–1947), donde cinco familias mexicoamericanas lograron que se declarara inconstitucional segregar a niños hispanos en escuelas públicas de California, sentando las bases legales para <em>Brown v. Board of Education</em>.<br><br>También albergó el juicio de los <strong>Papeles del Pentágono</strong> en 1973." 
          },
          { 
            h: "Clara Shortridge Foltz y los Juicios de los Años 90", 
            p: "El tribunal de enfrente lleva el nombre de la primera abogada mujer de California y creadora del concepto del defensor público. Fue sede de los sonados juicios de los <strong>Hermanos Menéndez</strong> (1993–1996), <strong>O.J. Simpson</strong> (1995) y el asesino serial <strong>Richard Ramirez (The Night Stalker)</strong>." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "El Terremoto de 1994", d: "El peso de las celdas superiores hizo torcer el edificio en el sismo de 1994; estuvo abandonado 20 años hasta una restauración antisísmica de $231 millones." }
        ]
      }
    },

    // 13. Placita Olvera
    {
      id: 13,
      mapUrl: "https://maps.google.com/?q=Olvera+Street+Los+Angeles",
      en: {
        title: "Placita Olvera & El Pueblo Monument (Tour Finale)",
        address: "845 N Alameda St",
        short: "13. Placita Olvera",
        timeline: [
          { y: "1781", t: "44 original settlers (Los Pobladores) establish the Pueblo of Los Angeles." },
          { y: "1818", t: "Avila Adobe is constructed (now the oldest standing residence in LA)." },
          { y: "1870", t: "Don Pío Pico builds Pico House, LA's first 3-story luxury hotel." },
          { y: "1930", t: "Preservationist Christine Sterling reopens Olvera Street as a Mexican marketplace." },
          { y: "1932", t: "David Alfaro Siqueiros paints the controversial masterpiece América Tropical." }
        ],
        people: [
          { name: "Don Pío Pico", role: "Last Mexican Governor of Alta California", bio: "Afro-Mexican ranchero and political leader who sold off his estates to build the luxury Pico House in 1870 to keep the civic and commercial center around the historic Plaza." },
          { name: "Christine Sterling", role: "Preservationist & 'Mother of Olvera Street'", bio: "Civic crusader who campaigned to rescue the dilapidated alley from demolition in 1930, partnering with the LA Times and using inmate labor to pave the street with red brick." },
          { name: "David Alfaro Siqueiros", role: "Mexican Muralist & Revolutionary", bio: "One of Mexico's 'Big Three' muralists who painted the anti-imperialist masterpiece América Tropical in 1932, which was whitewashed for its political controversy." },
          { name: "Francisco Ávila", role: "Rancher & Mayor of Los Angeles", bio: "Wealthy Californio cattle rancher who constructed the Avila Adobe in 1818, which served as US military headquarters during the Mexican-American War." }
        ],
        stories: [
          { 
            h: "The 1781 Founding of El Pueblo & The 1st/Spring Hub", 
            p: "In 1781, 44 settlers (*Los Pobladores*) founded <em>El Pueblo de la Reina de los Ángeles</em>. Three blocks south at 1st and Spring sat the crowded commercial center of early 1900s Los Angeles before retail and skyscrapers migrated south and west." 
          },
          { 
            h: "Don Pío Pico & Pico House (1870)", 
            p: "<strong>Don Pío Pico</strong>, the last Mexican Governor of Alta California, sold off his extensive ranchos to invest $82,000 into constructing <strong>Pico House</strong>—LA's very first 3-story luxury Italianate hotel. It featured gas chandeliers, bathtubs, French dining, and a courtyard fountain. Pico built it to anchor the city's future around the Plaza, but commercial investment shifted south to 1st and Spring, bankrupting him in his final years." 
          },
          { 
            h: "Avila Adobe & The Core Plaza Landmarks", 
            p: "Around the plaza stand LA’s oldest surviving structures: the <strong>Old Plaza Church (1822)</strong> and the <strong>Avila Adobe (1818)</strong>, built by rancher Francisco Ávila with 3-foot-thick adobe walls and packed dirt floors, serving briefly as military headquarters for Commodore Stockton during the Mexican-American War." 
          },
          { 
            h: "Christine Sterling's 1930 Rescue of Olvera Street", 
            p: "By the late 1920s, Olvera Street was a dilapidated alley marked for demolition. Preservationist <strong>Christine Sterling</strong> led a public campaign, partnered with the <em>LA Times</em>, and used county inmate labor to lay red paving stones, reopening the alley on Easter Sunday 1930 as a vibrant Mexican marketplace." 
          },
          { 
            h: "David Alfaro Siqueiros & América Tropical", 
            p: "Above the plaza on the Italian Hall stands David Alfaro Siqueiros’ famous 1932 mural <strong><em>América Tropical</em></strong>. Commissioned to paint a picturesque scene, Siqueiros instead painted an indigenous peasant crucified beneath an American eagle with revolutionary snipers on the roof. Deemed too radical, it was whitewashed with lead paint within two years and was recently restored under a protective glass canopy." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "Legendary Avocado Taquitos", d: "Grab crispy fried beef taquitos drenched in green avocado sauce at <em>Cielito Lindo</em> (operating at the top of Olvera Street since 1934)." },
          { cls: "box-tip", t: "Historic Union Station", d: "Walk across Alameda Street to explore the 1939 Mission Revival architecture of <strong>Union Station</strong> and catch the Metro A, B, or D lines." }
        ]
      },
      es: {
        title: "Placita Olvera y Monumento El Pueblo (Fin del Tour)",
        address: "845 N Alameda St",
        short: "13. Placita Olvera",
        timeline: [
          { y: "1781", t: "44 pobladores fundan el Pueblo de Nuestra Señora la Reina de los Ángeles." },
          { y: "1818", t: "Construcción del Ávila Adobe (residencia más antigua en pie de LA)." },
          { y: "1870", t: "Don Pío Pico levanta Casa Pico, primer hotel de lujo de 3 plantas." },
          { y: "1930", t: "Christine Sterling reinaugura la calle como mercado mexicano tradicional." },
          { y: "1932", t: "David Alfaro Siqueiros pinta el mural censurado América Tropical." }
        ],
        people: [
          { name: "Don Pío Pico", role: "Último Gobernador Mexicano de Alta California", bio: "Líder afromexicano y gran ranchero que vendió sus tierras para construir Casa Pico en 1870 buscando retener el centro de la ciudad en la Plaza." },
          { name: "Christine Sterling", role: "Preservacionista y 'Madre de la Calle Olvera'", bio: "Defensora cívica que rescató el callejón de la demolición en 1930, utilizando mano de obra comunitaria para colocar los adoquines rojos." },
          { name: "David Alfaro Siqueiros", role: "Gran Muralista Mexicano", bio: "Uno de los 'Tres Grandes' del muralismo mexicano que pintó América Tropical en 1932 denunciando el imperialismo, obra que fue censurada y blanqueada." },
          { name: "Francisco Ávila", role: "Ranchero y Alcalde de LA", bio: "Propietario de tierras que construyó el Ávila Adobe en 1818, residencia que sirvió de cuartel militar durante la guerra con EE. UU." }
        ],
        stories: [
          { 
            h: "El Nacimiento de Los Ángeles y el Centro de 1st y Spring", 
            p: "En 1781, 44 pobladores fundaron el <em>Pueblo de la Reina de los Ángeles</em>. Tres cuadras al sur, en 1st y Spring, se concentraba el corazón comercial más denso de la ciudad en 1900 antes de que los comercios y oficinas se desplazaran hacia el sur y el oeste." 
          },
          { 
            h: "Don Pío Pico y la Histórica Casa Pico (1870)", 
            p: "<strong>Don Pío Pico</strong>, el último gobernador mexicano de Alta California, vendió sus ranchos e invirtió $82,000 en construir <strong>Casa Pico</strong>, el primer hotel de lujo de tres plantas de Los Ángeles. Tenía iluminación a gas, tinas de baño, comida francesa y fuentes de patio. Pico intentó retener el centro de la ciudad en la Plaza, pero el crecimiento comercial se movió hacia el sur, dejándolo en la ruina en sus últimos años." 
          },
          { 
            h: "El Ávila Adobe y los Monumentos de la Plaza", 
            p: "Alrededor de la plaza se encuentran la <strong>Iglesia de Nuestra Señora Reina de los Ángeles (1822)</strong> y el <strong>Ávila Adobe (1818)</strong>, la casa más antigua en pie de la ciudad, con muros de adobe de tres pies de espesor y pisos de tierra apisonada." 
          },
          { 
            h: "El Rescate de la Calle Olvera en 1930", 
            p: "En los años 20, la calle Olvera era un callejón en ruinas a punto de ser demolido. <strong>Christine Sterling</strong> lideró una campaña cívica, utilizó presos del condado para colocar los ladrillos rojos y reinauguró el callejón el Domingo de Resurrección de 1930 como mercado tradicional." 
          },
          { 
            h: "David Alfaro Siqueiros y América Tropical", 
            p: "En el Italian Hall se ubica <strong><em>América Tropical (1932)</em></strong> de David Alfaro Siqueiros. Al pedirle una escena tropical decorativa, Siqueiros pintó a un indígena crucificado bajo un águila estadounidense con guerrilleros armados en el tejado. El mural fue blanqueado con cal por su fuerte crítica al imperialismo; hoy está restaurado bajo una cubierta de vidrio del Instituto Getty." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "Taquitos con Aguacate de Cielito Lindo", d: "Prueba los famosos taquitos dorados con salsa verde de aguacate en <em>Cielito Lindo</em> (abierto desde 1934 al final del callejón)." },
          { cls: "box-tip", t: "Estación Unión (Union Station)", d: "Cruza Alameda Street para admirar la hermosa arquitectura de 1939 de Union Station y conectar con el Metro." }
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
  const peopleHeading = document.getElementById('people-heading');

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
  if (peopleHeading) peopleHeading.textContent = u.peopleHead;

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

  // Notable Figures Section
  const peopleSection = document.getElementById('people-section');
  const peopleGrid = document.getElementById('people-grid');
  if (peopleSection && peopleGrid) {
    if (d.people && d.people.length > 0) {
      peopleSection.style.display = 'block';
      peopleGrid.innerHTML = d.people.map(p => `
        <div class="person-card">
          <div class="person-name">${p.name}</div>
          <div class="person-role">${p.role}</div>
          <div class="person-bio">${p.bio}</div>
        </div>
      `).join('');
    } else {
      peopleSection.style.display = 'none';
    }
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
