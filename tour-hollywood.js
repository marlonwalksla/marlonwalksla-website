/* ==========================================================================
   tour-hollywood.js - MarlonWalksLA Hollywood Interactive Walking Tour
   Repository: marlonwalksla/marlonwalksla-website
   ========================================================================== */

let currentLang = 'en';
let currentStop = 1;
const totalStops = 12;
let map = null;
let mapMarkers = [];

const tourData = {
  ui: {
    en: {
      title: "Hollywood Stars & Scandals Self-Guided Tour",
      desc: "Explore 100+ years of cinema history, iconic movie palaces, studio rebellions, and forgotten true crime lore.",
      selectorLabel: "Jump to Any Stop:",
      stopWord: "STOP",
      ofWord: "OF",
      timelineHead: "Chronological Milestones",
      peopleHead: "Notable Figures & Connections",
      prevBtn: "← Previous Stop",
      nextBtn: "Next Stop: ",
      finishBtn: "Complete Tour & Book Live Walk",
      mapBtn: "Google Maps",
      promoHead: "Want to Experience Downtown LA With a Local Guide?",
      promoText: "Join Marlon on the top-rated 5-star live walking tour of Downtown Los Angeles! Enjoy interactive trivia, hidden stories, and our local community in person.",
      promoLink: "https://www.freetour.com/los-angeles/free-tour-of-downtown-los-angeles",
      promoBtnText: "Book the Live Free DTLA Tour →"
    },
    es: {
      title: "Tour Autoguiado: Estrellas y Escándalos de Hollywood",
      desc: "Explora más de 100 años de historia del cine, palacios históricos, rebeliones de estudios y crímenes olvidados.",
      selectorLabel: "Ir a Cualquier Parada:",
      stopWord: "PARADA",
      ofWord: "DE",
      timelineHead: "Hitos Cronológicos",
      peopleHead: "Personajes Destacados y Conexiones",
      prevBtn: "← Parada Anterior",
      nextBtn: "Siguiente: ",
      finishBtn: "Terminar Tour y Reservar",
      mapBtn: "Ver en Google Maps",
      promoHead: "¿Quieres conocer el Centro de LA con un guía local?",
      promoText: "¡Únete a Marlon en el tour a pie calificado con 5 estrellas! Disfruta de historia viva, trivias interactivas y secretos locales en español.",
      promoLink: "https://www.civitatis.com/es/los-angeles/free-tour-los-angeles",
      promoBtnText: "Reservar el Free Tour en Español →"
    }
  },
  stops: [
    // STOP 1: Hollywood Sign
    {
      id: 1,
      coords: [-118.3268, 34.1265],
      mapUrl: "https://maps.google.com/?q=Lake+Hollywood+Park",
      en: {
        title: "The Hollywood Sign & Lake Hollywood Park",
        address: "3160 Canyon Lake Dr (Look up toward Mount Lee)",
        short: "1. Hollywood Sign",
        timeline: [
          { y: "1923", t: "Erected as a temporary 18-month billboard reading 'HOLLYWOODLAND'." },
          { y: "1932", t: "Broadway actress Peg Entwistle tragically leaps from the letter 'H'." },
          { y: "1949", t: "The Hollywood Chamber of Commerce strips 'LAND' to represent the district." },
          { y: "1978", t: "Hugh Hefner and rock star Alice Cooper lead a fundraiser to rebuild the sign in steel." }
        ],
        people: [
          { name: "Harry Chandler", role: "Real Estate Developer & Publisher", bio: "Los Angeles Times publisher who spent $21,000 to construct the original sign to promote his upscale suburban housing tract in Beachwood Canyon." },
          { name: "Peg Entwistle", role: "Broadway Actress", bio: "Talented 24-year-old stage performer whose tragic suicide from the 50-foot letter 'H' in 1932 cemented the landmark's dark cinematic lore." },
          { name: "Hugh Hefner", role: "Playboy Founder & Benefactor", bio: "Hosted a legendary 1978 gala at the Playboy Mansion where celebrities sponsored replacement letters for $27,700 each to prevent demolition." }
        ],
        stories: [
          { 
            h: "A Temporary Real Estate Billboard", 
            p: "Welcome to Hollywood. Before heading down to the boulevard, look up at Mount Lee to take in the most recognized monument in the entertainment world. In 1923, real estate syndicate partners led by <em>Los Angeles Times</em> publisher Harry Chandler erected a massive outdoor advertisement reading 'HOLLYWOODLAND'. Built from rough sheet metal panels, telephone poles, and scaffolding, the sign was never meant to be permanent. It was originally wired with 4,000 light bulbs and scheduled to be torn down after an 18-month housing sales campaign in Beachwood Canyon." 
          },
          { 
            h: "The Tragedy of Peg Entwistle", 
            p: "The sign carries a haunting history that reflects the harsh realities of the early studio system. In September 1932, a 24-year-old British stage actress named Peg Entwistle found herself struggling to break into motion pictures after RKO Pictures declined to renew her contract. Devastated and out of work, she hiked up the rugged trail of Mount Lee in the dark. She climbed an electrician's maintenance ladder behind the 50-foot letter 'H' and leaped into the ravine below, becoming known to history as 'The Hollywood Sign Girl'." 
          },
          { 
            h: "The 1978 Playboy Mansion Rescue", 
            p: "By the late 1970s, the neglected wooden and sheet-metal billboard had deteriorated into a collapsing, termite-ridden safety hazard. The top of the letter 'D' had completely crumbled, arsonists had torched the bottom of the second 'L', and the third 'O' had tumbled down the hillside. The city considered tearing the monument down entirely until Hugh Hefner hosted a celebrity gala at the Playboy Mansion. Nine donors—including shock-rocker Alice Cooper, country legend Gene Autry, and Warner Bros. Records—each contributed $27,700 to sponsor individual letters, rebuilding the sign in durable corrugated steel." 
          },
          { 
            h: "Preservation & Cultural Iconography", 
            p: "In 1949, the Hollywood Chamber of Commerce took over maintenance of the sign and removed the final four letters ('LAND') so it would represent the entire creative district rather than a private real estate tract. Today, the sign is protected within Griffith Park and monitored 24/7 by motion sensors, high-definition cameras, and park rangers. It stands 45 feet tall and 350 feet across, acting as the universal beacon of cinematic ambition and reinvention." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Best Photo Angle", d: "Lake Hollywood Park offers one of the best, unobstructed, and legal grassy areas to photograph the sign before driving down to Hollywood Boulevard." }
        ]
      },
      es: {
        title: "El Letrero de Hollywood y Parque Lake Hollywood",
        address: "3160 Canyon Lake Dr (Mira hacia el Monte Lee)",
        short: "1. Letrero de Hollywood",
        timeline: [
          { y: "1923", t: "Instalado como un anuncio temporal de 18 meses que leía 'HOLLYWOODLAND'." },
          { y: "1932", t: "La actriz de Broadway Peg Entwistle salta trágicamente desde la letra 'H'." },
          { y: "1949", t: "La Cámara de Comercio retira 'LAND' para representar a todo el distrito." },
          { y: "1978", t: "Hugh Hefner y Alice Cooper recaudan fondos para reconstruir el letrero en acero." }
        ],
        people: [
          { name: "Harry Chandler", role: "Desarrollador Inmobiliario y Editor", bio: "Editor del LA Times que invirtió $21,000 en el letrero original para promocionar su lujosa urbanización en Beachwood Canyon." },
          { name: "Peg Entwistle", role: "Actriz de Broadway", bio: "Talentosa actriz de 24 años cuyo trágico suicidio desde la letra 'H' en 1932 selló la leyenda oscura de la industria cinematográfica." },
          { name: "Hugh Hefner", role: "Fundador de Playboy y Benefactor", bio: "Organizó una histórica gala en 1978 donde celebridades apadrinaron cada letra por $27,700 dólares para evitar la demolición." }
        ],
        stories: [
          { 
            h: "Un Anuncio de Bienes Raíces Temporal", 
            p: "Bienvenidos a Hollywood. Antes de bajar al bulevar, miren hacia el Monte Lee para admirar el monumento más famoso del entretenimiento mundial. En 1923, un grupo de inversionistas liderado por el editor del <em>Los Angeles Times</em>, Harry Chandler, levantó este anuncio que leía 'HOLLYWOODLAND'. Construido con láminas de metal, postes telefónicos y andamios, nunca fue pensado como una estructura permanente. Contaba con 4,000 focos incandescentes y estaba programado para ser demolido tras 18 meses de ventas de casas en Beachwood Canyon." 
          },
          { 
            h: "La Tragedia de Peg Entwistle", 
            p: "El letrero resguarda una historia dolorosa que refleja la crudeza del sistema de estudios de la época dorada. En septiembre de 1932, una actriz británica de 24 años llamada Peg Entwistle cayó en una profunda depresión tras perder su contrato con el estudio RKO Pictures. Sin empleo y desilusionada, subió por los senderos oscuros del Monte Lee durante la noche. Trepó por la escalera de mantenimiento detrás de la letra 'H' de 15 metros de altura y saltó al vacío, siendo recordada por la prensa como 'La Chica del Letrero de Hollywood'." 
          },
          { 
            h: "El Rescate de 1978 en la Mansión Playboy", 
            p: "Para finales de los años 70, la falta de mantenimiento convirtió el letrero en una ruina peligrosa carcomida por las termitas. La parte superior de la letra 'D' se había derrumbado, vándalos incendiaron la segunda 'L' y la tercera 'O' rodó colina abajo. La ciudad planeaba demolerlo por completo hasta que Hugh Hefner organizó una gala benéfica en la Mansión Playboy. Nueve donantes (entre ellos el rockero Alice Cooper, la leyenda Gene Autry y Warner Bros. Records) pagaron $27,700 cada uno para apadrinar una letra, reconstruyéndolo con vigas y acero galvanizado." 
          },
          { 
            h: "Preservación e Ícono Cultural", 
            p: "En 1949, la Cámara de Comercio de Hollywood asumió el cuidado del letrero y retiró las últimas cuatro letras ('LAND') para que representara a todo el distrito cultural en lugar de un fraccionamiento privado. Hoy en día, la estructura está protegida dentro del Parque Griffith y vigilada las 24 horas por sensores térmicos, cámaras de alta definición y guardaparques. Con sus 14 metros de altura y 106 metros de largo, sigue siendo el faro universal de la ambición artística y el cine." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "El Mejor Ángulo para Fotos", d: "El Parque Lake Hollywood ofrece una de las mejores áreas verdes, legales y sin obstáculos para fotografiar el letrero antes de bajar a Hollywood Boulevard." }
        ]
      }
    },

    // STOP 2: Dolby Theatre
    {
      id: 2,
      coords: [-118.3404, 34.1021],
      mapUrl: "https://maps.google.com/?q=Dolby+Theatre+Hollywood",
      en: {
        title: "Dolby Theatre & Ovation Hollywood",
        address: "6801 Hollywood Blvd",
        short: "2. Dolby Theatre",
        timeline: [
          { y: "2001", t: "Opens as the Kodak Theatre, custom-built for the Academy Awards." },
          { y: "2002", t: "Hosts the Oscars for the first time, ending decades of nomadic ceremonies." },
          { y: "2012", t: "Dolby Laboratories acquires naming rights following Kodak's bankruptcy." },
          { y: "Present", t: "Broadcasts live to an international audience exceeding several hundred million viewers." }
        ],
        people: [
          { name: "David Rockwell", role: "Lead Theatrical Architect", bio: "Acclaimed designer who engineered the auditorium with specialized raking, lighting fixtures, and camera pathways specifically for live international television." },
          { name: "Sid Ganis", role: "Former Academy President", bio: "Key film executive who championed building a permanent, technologically advanced auditorium in Hollywood for the Oscars." }
        ],
        stories: [
          { 
            h: "The Permanent Home of the Oscars", 
            p: "Stand beneath the towering Babylon archway inside the grand open-air courtyard of Ovation Hollywood. Since March 2002, this 3,400-seat theater has served as the permanent, custom-engineered home of the Academy Awards. Prior to its construction, the Oscars were nomadic, bouncing for over seven decades between hotel ballrooms, the Dorothy Chandler Pavilion in DTLA, and the Shrine Auditorium. Civic leaders realized Hollywood Boulevard needed an anchor institution to pull the film industry's biggest night back to its birthplace." 
          },
          { 
            h: "Engineering for the Live Broadcast", 
            p: "Unlike historic venues built strictly for theatrical acoustics, the Dolby Theatre was designed from the ground up for live television broadcasting. Architect David Rockwell designed the orchestra seating with a steep rake so cameras can capture clean reaction shots of nominees without heads blocking the view. The venue features an extensive subterranean cable network built directly into the floor and walls, allowing dozens of international television networks to plug directly into broadcast feeds. The private greenroom suites are soundproofed and strategically connected to backstage tunnels to manage celebrity traffic." 
          },
          { 
            h: "The Walk of Winners", 
            p: "As you walk through the multi-tiered grand lobby leading toward the theater doors, look at the illuminated art-glass columns flanking the central staircase. Each column is etched with the name of every single film that has won Best Picture, from <em>Wings</em> in 1927 to the present day. If you inspect the higher tiers of the glass pillars, you will notice large blank spaces intentionally left open. These empty bands are reserved for the future Best Picture winners of the next several decades." 
          },
          { 
            h: "The Multi-Block Red Carpet Transformation", 
            p: "Each spring, the city shuts down Hollywood Boulevard for nearly an entire week to construct the Oscars arrival compound. Workers install heavy steel scaffolding and an extensive transparent weather tent over the street to protect designer gowns from sudden rain. Hundreds of feet of vibrant red carpet are rolled out across the raw asphalt, transforming the public roadway into an exclusive, highly secured corridor lined with dozens of international media stages." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "The Archway Photo", d: "Take the outdoor escalator up to the 3rd-floor pedestrian bridge. Look straight through the open Babylon archway to capture a framed postcard shot of the Hollywood Sign." }
        ]
      },
      es: {
        title: "Teatro Dolby y Ovation Hollywood",
        address: "6801 Hollywood Blvd",
        short: "2. Teatro Dolby",
        timeline: [
          { y: "2001", t: "Abre sus puertas como el Teatro Kodak, diseñado para los Premios de la Academia." },
          { y: "2002", t: "Alberga los Óscar por primera vez, terminando con décadas de sedes provisionales." },
          { y: "2012", t: "Dolby Laboratories adquiere los derechos del nombre tras la quiebra de Kodak." },
          { y: "Presente", t: "Transmite la ceremonia en vivo a cientos de millones de televidentes." }
        ],
        people: [
          { name: "David Rockwell", role: "Arquitecto Teatral Principal", bio: "Diseñador que estructuró el auditorio con una inclinación especial e iluminación técnica para transmisiones televisivas globales." },
          { name: "Sid Ganis", role: "Expresidente de la Academia", bio: "Ejecutivo cinematográfico que impulsó la construcción de una sede tecnológica definitiva para los Premios Óscar en Hollywood." }
        ],
        stories: [
          { 
            h: "El Hogar Definitivo de los Óscar", 
            p: "Párense bajo el imponente arco de estilo babilónico en el patio central de Ovation Hollywood. Desde marzo de 2002, este auditorio de 3,400 butacas ha sido la sede definitiva construida a la medida de los Premios Óscar. Durante más de siete décadas, la gala no tuvo un recinto propio y deambuló entre salones de hoteles, el Dorothy Chandler Pavilion en el centro y el Shrine Auditorium. Los líderes de la ciudad comprendieron que Hollywood necesitaba un templo moderno para regresar su noche más importante al lugar donde todo comenzó." 
          },
          { 
            h: "Ingeniería para la Televisión en Vivo", 
            p: "A diferencia de los teatros convencionales diseñados solo para la voz, el Teatro Dolby fue concebido desde sus cimientos para transmisiones televisivas complejas. El arquitecto David Rockwell diseñó la platea con una inclinación pronunciada para que las cámaras graben las reacciones de los nominados sin que las cabezas de enfrente tapen la toma. Las paredes y suelos contienen una inmensa red oculta de fibra óptica para que las televisoras del mundo se conecten al instante. Además, cuenta con camerinos insonorizados y túneles subterráneos para el flujo seguro de las celebridades." 
          },
          { 
            h: "El Paseo de los Ganadores", 
            p: "Al recorrer el vestíbulo principal hacia las puertas del auditorio, observen las columnas de vidrio translúcido que decoran la gran escalera. Cada columna lleva grabado el título de cada largometraje ganador a Mejor Película desde <em>Wings</em> en 1927 hasta la actualidad. Si miran con atención los niveles superiores de los pilares, verán amplias secciones de vidrio completamente vacías. Esos paneles están reservados para las películas que ganarán el premio en las próximas décadas." 
          },
          { 
            h: "La Transformación de la Alfombra Roja", 
            p: "Cada primavera, el Ayuntamiento cierra el bulevar durante casi una semana completa para montar el impresionante complejo de la alfombra roja. Se instalan cientos de toneladas de estructuras de acero y una carpa protectora transparente para evitar que la lluvia dañe los vestidos de alta costura. Kilómetros de tela roja cubren el asfalto público, convirtiendo la calle en un set de máxima seguridad rodeado de reflectores y estudios de televisión internacionales." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "El Mirador del Arco", d: "Suban por las escaleras mecánicas hasta el puente peatonal del tercer piso para obtener una vista enmarcada perfecta del letrero de Hollywood a través del arco." }
        ]
      }
    },

    // STOP 3: TCL Chinese Theatre
    {
      id: 3,
      coords: [-118.3410, 34.1020],
      mapUrl: "https://maps.google.com/?q=TCL+Chinese+Theatre",
      en: {
        title: "TCL Chinese Theatre & Forecourt",
        address: "6925 Hollywood Blvd",
        short: "3. Chinese Theatre",
        timeline: [
          { y: "1927", t: "Showman Sid Grauman opens the palace with Cecil B. DeMille's The King of Kings." },
          { y: "1944", t: "Hosts the Academy Awards for three consecutive years (1944–1946)." },
          { y: "1977", t: "Hosts the historic opening day lines for the original Star Wars." },
          { y: "2013", t: "Undergoes a multi-million-dollar renovation into a premier custom IMAX auditorium." }
        ],
        people: [
          { name: "Sid Grauman", role: "Master Showman & Impresario", bio: "Theatrical mastermind who moved from Downtown LA to Hollywood to construct extravagant, fantasy-themed motion picture palaces." },
          { name: "Norma Talmadge", role: "Silent Screen Legend", bio: "Top-billed silent star whose accidental stumble into fresh concrete during the 1927 construction sparked the iconic forecourt tradition." },
          { name: "Raymond M. Kennedy", role: "Lead Architect", bio: "Architect of Meyer & Holler who designed the dramatic 90-foot bronze pagoda roof and imported authentic stone artifacts from China." }
        ],
        stories: [
          { 
            h: "The Golden Age Cinema Palace", 
            p: "Step into the concrete forecourt of the most famous movie theater on Earth. Following his success building the Million Dollar Theater in Downtown LA, showman Sid Grauman moved west to Hollywood in the 1920s. On May 18, 1927, he opened this opulent movie palace with the premiere of Cecil B. DeMille’s <em>The King of Kings</em>. Grauman believed that moviegoing should be an all-encompassing theatrical experience, immersing audiences in exotic architectural escapism before the projector even began rolling." 
          },
          { 
            h: "Pagodas, Artifacts & Heaven Dogs", 
            p: "Look up at the dramatic 90-foot bronze pagoda roof resting between two soaring coral-red columns. Architect Raymond M. Kennedy secured special federal clearance to import authentic 15th-century Ming Dynasty stone temple artifacts, temple bells, and pagodas directly from China. Standing guard before the copper front doors are two authentic stone Heaven Dogs (Foo Dogs), positioned to ward off evil spirits from the premises. The facade was hand-carved by expert artisans who incorporated intricate lotus blossoms, dragons, and theatrical motifs into the stone." 
          },
          { 
            h: "The Accidental Footprint Lore", 
            p: "Look down at the slabs of cement under your feet. This world-famous Hollywood ritual was born entirely by accident during construction in the spring of 1927. Silent film star Norma Talmadge was visiting the active job site with Grauman when she inadvertently stepped into a patch of wet, curing concrete. Seeing the fascinated crowd gathered around her boot print, Grauman instantly realized he had stumbled upon the ultimate publicity mechanism: a permanent, concrete autograph book for cinema royalty." 
          },
          { 
            h: "Forecourt Secrets & Slab Rotations", 
            p: "Unlike Walk of Fame sidewalk stars, which can be purchased through nomination campaigns, cement handprints in this courtyard are strictly by invitation from a theater committee. There are fewer than 300 historic stone slabs in the entire courtyard. Marilyn Monroe famously embedded a real glass rhinestone into the dot of the 'i' in her signature, Groucho Marx pressed his burning cigar into the mud, and the <em>Harry Potter</em> trio imprinted their wands in 2007. When ground space fills up, older and lesser-known historical slabs are occasionally removed and placed into secure museum storage." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Forecourt Scavenger Hunt", d: "<ul><li><strong>Marilyn Monroe:</strong> Look closely at the dot over the letter 'i' to spot where she pressed a rhinestone.</li><li><strong>Groucho Marx:</strong> Find where he pressed his iconic cigar into the wet cement.</li><li><strong>Star Wars (1977):</strong> Spot the droid wheel marks of R2-D2 and foot imprints of C-3PO and Darth Vader.</li></ul>" }
        ]
      },
      es: {
        title: "TCL Chinese Theatre",
        address: "6925 Hollywood Blvd",
        short: "3. Teatro Chino",
        timeline: [
          { y: "1927", t: "Sid Grauman inaugura el palacio con El Rey de Reyes de Cecil B. DeMille." },
          { y: "1944", t: "Sede de los Premios Óscar durante tres años consecutivos (1944–1946)." },
          { y: "1977", t: "Filas históricas de estreno para la primera entrega de Star Wars." },
          { y: "2013", t: "Remodelación integral para albergar una de las salas IMAX más modernas del mundo." }
        ],
        people: [
          { name: "Sid Grauman", role: "Empresario y Productor Teatral", bio: "Visionario del entretenimiento que transformó Hollywood construyendo palacios de cine con ambientaciones exóticas e inmersivas." },
          { name: "Norma Talmadge", role: "Estrella del Cine Mudo", bio: "Actriz consagrada cuya pisada accidental en cemento fresco durante las obras de 1927 originó la tradición del patio." },
          { name: "Raymond M. Kennedy", role: "Arquitecto Principal", bio: "Diseñador que concibió el techo de pagoda de 27 metros e importó reliquias de piedra de la Dinastía Ming desde China." }
        ],
        stories: [
          { 
            h: "El Palacio del Cine de la Edad de Oro", 
            p: "Entren al patio de concreto del cine más emblemático del mundo. Tras triunfar en el centro de Los Ángeles con el Teatro Million Dollar, el productor Sid Grauman trasladó sus operaciones a Hollywood en los años 20. El 18 de mayo de 1927 inauguró este fastuoso palacio con el estreno de <em>El Rey de Reyes</em> de Cecil B. DeMille. Grauman defendía que ir al cine debía ser una experiencia artística total, transportando a la audiencia a mundos lejanos antes de que comenzara la película." 
          },
          { 
            h: "Pagodas, Reliquias y Leones Celestiales", 
            p: "Miren hacia arriba al impresionante techo de pagoda de bronce de 27 metros sostenido por dos columnas de color rojo coral. El arquitecto Raymond M. Kennedy obtuvo permisos del gobierno estadounidense para importar campanas de templos y piezas de piedra del siglo XV directamente desde China. Custodiando la entrada de cobre se alzan dos auténticos Perros del Cielo (Leones de Fu), colocados estratégicamente para alejar a los malos espíritus. Cada detalle de la fachada fue tallado a mano con dragones y flores de loto por artesanos especializados." 
          },
          { 
            h: "La Tradición Accidental de las Huellas", 
            p: "Miren las losas de concreto bajo sus pies. Este famoso ritual cinematográfico nació por un tropiezo accidental en la primavera de 1927. La estrella del cine mudo Norma Talmadge visitaba las obras junto a Grauman cuando pisó sin querer una sección de cemento fresco. Al notar la fascinación de los transeúntes que se arremolinaron a ver la marca de su zapato, Grauman comprendió de inmediato el enorme valor comercial de crear un álbum de firmas eterno grabado en piedra." 
          },
          { 
            h: "Secretos del Patio y Rotación de Losas", 
            p: "A diferencia de las estrellas del Paseo de la Fama en la banqueta, poner las manos en este patio es un honor exclusivo otorgado por un comité especial. Hay menos de 300 bloques en todo el suelo. Marilyn Monroe incrustó un diamante de fantasía en el punto de la letra 'i' de su nombre, Groucho Marx hundió su puro encendido y el trío de <em>Harry Potter</em> grabó sus varitas mágicas en 2007. Cuando el espacio se agota, las losas de actores antiguos menos recordados son retiradas y protegidas en bóvedas de archivo." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Búsqueda del Tesoro en el Patio", d: "<ul><li><strong>Marilyn Monroe:</strong> Miren de cerca el punto sobre la letra 'i' para ver el diamante incrustado.</li><li><strong>Groucho Marx:</strong> Busquen la marca redonda donde hundió su famoso puro.</li><li><strong>Star Wars (1977):</strong> Encuentren las huellas de las ruedas de R2-D2 y los pies de C-3PO y Darth Vader.</li></ul>" }
        ]
      }
    },

    // STOP 4: Hollywood Roosevelt
    {
      id: 4,
      coords: [-118.3418, 34.1012],
      mapUrl: "https://maps.google.com/?q=Hollywood+Roosevelt+Hotel",
      en: {
        title: "The Hollywood Roosevelt Hotel",
        address: "7000 Hollywood Blvd (Cross the street)",
        short: "4. The Roosevelt",
        timeline: [
          { y: "1927", t: "Opens its doors, funded by a syndicate of Hollywood's founding royalty." },
          { y: "1929", t: "Hosts the very first Academy Awards banquet in the Blossom Room." },
          { y: "1952", t: "Marilyn Monroe resides in a poolside cabana suite during her early rise." },
          { y: "1988", t: "British artist David Hockney paints his million-dollar mural on the pool floor." }
        ],
        people: [
          { name: "Douglas Fairbanks & Mary Pickford", role: "Founders & Investors", bio: "Silent screen legends who pooled their fortunes with studio boss Louis B. Mayer to create an exclusive luxury hotel for the motion picture elite." },
          { name: "Marilyn Monroe", role: "Iconic Resident", bio: "Lived in cabana suite #229 for two formative years, shooting her very first commercial print ads on the hotel's diving board." },
          { name: "David Hockney", role: "Contemporary Master", bio: "Renowned British painter who spent an afternoon painting a sweeping blue crescent mural on the bottom of the drained Tropicana Pool." }
        ],
        stories: [
          { 
            h: "The Celebrity Investment Syndicate", 
            p: "Step across the street into the grand Spanish Colonial lobby of the Hollywood Roosevelt Hotel. Opened in May 1927, this luxury landmark was not constructed by ordinary commercial developers. It was financed by a private syndicate of Hollywood royalty: Douglas Fairbanks, Mary Pickford, Sid Grauman, and MGM studio boss Louis B. Mayer. They invested $2.5 million to create an opulent retreat where industry executives and movie stars could dine, drink, and conduct business away from prying press cameras." 
          },
          { 
            h: "The 15-Minute Academy Awards (1929)", 
            p: "Walk up the mezzanine staircase to the historic Blossom Room. On May 16, 1929, the very first Academy Awards ceremony was held right here as an intimate industry dinner for just 270 guests. Tickets cost five dollars, and there was zero broadcast suspense because the winners had already been printed in local newspapers three months earlier. The entire awards presentation was hosted by Douglas Fairbanks and lasted a mere 15 minutes, serving as a brief toast before a private late-night party." 
          },
          { 
            h: "Marilyn Monroe's Launchpad", 
            p: "The Roosevelt played a pivotal role in the early life of Norma Jeane Mortenson before she became Marilyn Monroe. In the late 1940s and early 1950s, she lived in a second-floor poolside cabana room for two years while modeling for the Blue Book Agency and signing her first studio contracts. She posed for her very first commercial magazine advertisement—a print feature for suntan lotion—standing directly on the diving board of the hotel's Tropicana Pool. The property became her personal sanctuary throughout her rise to international stardom." 
          },
          { 
            h: "David Hockney's Pool & Ghost Lore", 
            p: "Walk out back into the lush courtyard to view the famous Tropicana Pool. In 1988, celebrated British artist David Hockney drained the water and spent an afternoon painting a series of blue curved brushstrokes directly onto the plaster floor, creating a celebrated work of modern art. The hotel is also famous for its ghost stories. Staff and guests have reported hearing actor Montgomery Clift practicing his brass trumpet on the ninth floor, while others have reported seeing Marilyn Monroe's reflection in a full-length vintage mirror that once furnished her poolside suite." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "The Million-Dollar Pool", d: "Step into the Tropicana courtyard and peer down through the pool water to admire the million-dollar curved blue mural painted by artist David Hockney in 1988." }
        ]
      },
      es: {
        title: "Hotel Hollywood Roosevelt",
        address: "7000 Hollywood Blvd (Cruza la calle)",
        short: "4. The Roosevelt",
        timeline: [
          { y: "1927", t: "Abre sus puertas, financiado por los fundadores de la industria del cine." },
          { y: "1929", t: "Sede de la primera ceremonia de los Premios Óscar en el Blossom Room." },
          { y: "1952", t: "Marilyn Monroe vive en una de las cabañas junto a la piscina del hotel." },
          { y: "1988", t: "El artista David Hockney pinta su famoso mural en el fondo de la piscina." }
        ],
        people: [
          { name: "Douglas Fairbanks y Mary Pickford", role: "Fundadores e Inversores", bio: "Monarcas del cine mudo que unieron sus fortunas con Louis B. Mayer para levantar un hotel de lujo exclusivo para la élite de Hollywood." },
          { name: "Marilyn Monroe", role: "Residente Emblemática", bio: "Vivió en la cabaña #229 durante dos años cruciales, realizando su primera sesión publicitaria en el trampolín del hotel." },
          { name: "David Hockney", role: "Artista Contemporáneo", bio: "Pintor británico que decoró el fondo de la piscina con un mural de trazos azules curvados valuado en millones de dólares." }
        ],
        stories: [
          { 
            h: "El Sindicato de las Superestrellas", 
            p: "Crucen la calle y entren al majestuoso vestíbulo colonial español del Hotel Hollywood Roosevelt. Inaugurado en mayo de 1927, este inmueble histórico no fue levantado por inversionistas inmobiliarios comunes. Fue financiado por las máximas estrellas del cine: Douglas Fairbanks, Mary Pickford, Sid Grauman y el jefe de MGM, Louis B. Mayer. Invirtieron $2.5 millones de dólares para crear un refugio de lujo donde directores y actores pudieran cenar, festejar y cerrar contratos lejos de los periodistas." 
          },
          { 
            h: "Los Premios Óscar de 15 Minutos (1929)", 
            p: "Suban las escaleras hacia el salón Blossom Room en el entrepiso. El 16 de mayo de 1929 se celebró aquí la primera entrega de los Premios de la Academia como un banquete íntimo para solo 270 personas. La entrada costaba cinco dólares y no existía tensión mediática porque los ganadores ya habían sido publicados en los periódicos tres meses antes. Douglas Fairbanks entregó los galardones en apenas 15 minutos, convirtiendo la noche en una cena relajada entre colegas." 
          },
          { 
            h: "El Despegue de Marilyn Monroe", 
            p: "El Roosevelt fue fundamental en los inicios de Norma Jeane Mortenson antes de ser Marilyn Monroe. A finales de los años 40 vivió durante dos años en una cabaña del segundo piso junto a la piscina mientras trabajaba como modelo y firmaba sus primeros contratos con los estudios. Su primera sesión publicitaria comercial—un anuncio de bronceador—se tomó sobre el trampolín de la piscina Tropicana. El hotel fue su hogar seguro en los momentos en que despegaba su carrera mundial." 
          },
          { 
            h: "La Piscina de David Hockney y Leyendas", 
            p: "Salgan al patio trasero para contemplar la emblemática piscina Tropicana. En 1988, el pintor británico David Hockney vació el agua y pasó una tarde entera pintando medialunas azules sobre el concreto, creando una obra de arte moderna de valor incalculable. Además, el hotel es famoso por sus relatos paranormales. Huéspedes y empleados afirman escuchar al actor Montgomery Clift practicando la trompeta en el noveno piso, y muchos aseguran haber visto el reflejo de Marilyn Monroe en un espejo antiguo de su antigua suite." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "La Piscina del Millón de Dólares", d: "Asómense a la piscina del patio Tropicana para ver a través del agua los trazos curvos azules pintados por el famoso artista David Hockney en 1988." }
        ]
      }
    },

    // STOP 5: Egyptian Theatre
    {
      id: 5,
      coords: [-118.3364, 34.1016],
      mapUrl: "https://maps.google.com/?q=Egyptian+Theatre+Hollywood",
      en: {
        title: "The Egyptian Theatre",
        address: "6712 Hollywood Blvd",
        short: "5. Egyptian Theatre",
        timeline: [
          { y: "1922", t: "Opens its doors, capitalizing on global Egyptomania." },
          { y: "1922", t: "Hosts the premiere of Robin Hood, inventing the modern red carpet." },
          { y: "1998", t: "Purchased and stabilized by the American Cinematheque." },
          { y: "2023", t: "Netflix and American Cinematheque complete a historic restoration." }
        ],
        people: [
          { name: "Sid Grauman", role: "Master Showman & Impresario", bio: "The promotional pioneer who conceived the courtyard theater format and created the template for modern movie premieres." },
          { name: "Douglas Fairbanks", role: "Actor & Film Producer", bio: "Silent screen swashbuckler whose blockbuster Robin Hood launched the theater and set the gold standard for celebrity arrivals." },
          { name: "Howard Carter", role: "British Archaeologist", bio: "His historic 1922 discovery of King Tutankhamun's tomb in Egypt fueled worldwide public fascination that Grauman leveraged to sell tickets." }
        ],
        stories: [
          { 
            h: "The Birth of Egyptomania (1922)", 
            p: "Five years before he constructed the Chinese Theatre, Sid Grauman opened the Egyptian Theatre on October 18, 1922. His timing was a masterstroke of marketing intuition. Earlier that same year, British archaeologist Howard Carter discovered the untouched tomb of King Tutankhamun in Egypt's Valley of the Kings. The entire Western world was gripped by 'Egyptomania,' and Grauman capitalized on the craze by styling his new theater as an open-air pharaonic palace adorned with scarabs, sphinxes, and hieroglyphic murals." 
          },
          { 
            h: "Inventing the Hollywood Red Carpet", 
            p: "The Egyptian Theatre holds a monumental place in cinema history as the birthplace of the modern movie premiere. On opening night in 1922, Grauman staged the world premiere of Douglas Fairbanks’ million-dollar epic <em>Robin Hood</em>. This single evening established the promotional formula still used worldwide today: Grauman set up military searchlights sweeping the sky, assembled velvet crowd ropes, and rolled out a long red carpet across the courtyard for Fairbanks and Mary Pickford to walk down as screaming fans looked on." 
          },
          { 
            h: "The Forecourt Experience", 
            p: "The deep, open-air courtyard in front of the theater was engineered for spectacle and crowd management. Before the feature presentation began, Grauman hired costumed actors dressed as Egyptian temple guards to pace the upper roof parapets with bronze spears, announcing showtimes with ceremonial horns. Grauman even kept live monkeys, tropical birds, and exotic desert artifacts in the courtyard to entertain waiting ticket holders as they queued up for the show." 
          },
          { 
            h: "The Netflix Architectural Restoration", 
            p: "After falling into disrepair during the late 20th century, the Egyptian Theatre was purchased through a public-private partnership involving Netflix and the nonprofit American Cinematheque. Over three years, preservation experts stripped away clumsy 1960s drywall additions, seismic-retrofitted the masonry walls, and restored the original 1922 silent-era color palette. Today, the theater operates as one of the finest classic film revival houses in the world, equipped to project vintage nitrate, 35mm, 70mm, and digital cinema." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "A 1922 Time Machine", d: "Walk down the courtyard to the main entrance doors. The lobby and auditorium have been restored to their exact 1922 silent-era appearance, complete with a gilded sunburst ceiling." }
        ]
      },
      es: {
        title: "Teatro Egipcio (Egyptian Theatre)",
        address: "6712 Hollywood Blvd",
        short: "5. Teatro Egipcio",
        timeline: [
          { y: "1922", t: "Abre sus puertas aprovechando la 'Egiptomanía' internacional." },
          { y: "1922", t: "Estreno de Robin Hood, donde se inventa la alfombra roja moderna." },
          { y: "1998", t: "Adquirido y rescatado por la American Cinematheque." },
          { y: "2023", t: "Netflix finaliza una restauración arquitectónica de millones de dólares." }
        ],
        people: [
          { name: "Sid Grauman", role: "Empresario y Productor", bio: "Pionero de la publicidad cinematográfica que ideó los teatros con patio y creó el formato moderno de los estrenos de cine." },
          { name: "Douglas Fairbanks", role: "Actor y Productor", bio: "Aclamado héroe de acción de Robin Hood (1922), cuyo estreno consagró el protocolo de la llegada de estrellas." },
          { name: "Howard Carter", role: "Arqueólogo Británico", bio: "Su hallazgo de la tumba de Tutankamón en 1922 desató una fascinación global que Grauman aprovechó para vender entradas." }
        ],
        stories: [
          { 
            h: "La Fiebre por Egipto (1922)", 
            p: "Cinco años antes de construir el Teatro Chino, Sid Grauman inauguró el Teatro Egipcio el 18 de octubre de 1922. Fue una jugada publicitaria maestra. Ese mismo año, el arqueólogo Howard Carter descubrió la tumba intacta de Tutankamón en el Valle de los Reyes. El mundo entero sucumbió a la 'Egiptomanía', y Grauman aprovechó la euforia diseñando un teatro con la apariencia del templo de un faraón, lleno de escarabajos sagrados, esfinges y murales jeroglíficos." 
          },
          { 
            h: "La Invención de la Alfombra Roja", 
            p: "El Teatro Egipcio es el lugar de nacimiento de las premieres cinematográficas modernas. En la noche inaugural de 1922, Grauman organizó el estreno mundial de la superproducción <em>Robin Hood</em> de Douglas Fairbanks. Esa velada definió la fórmula que se sigue usando en todo el mundo: Grauman colocó reflectores antiaéreos en el cielo, cuerdas de terciopelo y desplegó una enorme alfombra roja para que Fairbanks y Mary Pickford caminaran entre los vítores de miles de fanáticos." 
          },
          { 
            h: "El Espectáculo del Patio al Aire Libre", 
            p: "El profundo patio frontal fue concebido como un escenario de entretenimiento y control de multitudes. Antes de cada función, Grauman contrataba actores vestidos como guardias del faraón para patrullar las terrazas superiores portando lanzas de bronce y tocando trompetas ceremoniales. Además, colocaba monos, aves tropicales y vasijas antiguas en el patio para entretener al público mientras esperaba su turno de entrar." 
          },
          { 
            h: "La Gran Restauración de Netflix", 
            p: "Tras sufrir décadas de abandono a finales del siglo XX, el inmueble fue adquirido en una alianza entre Netflix y la organización American Cinematheque. Durante tres años, restauradores retiraron divisiones añadidas en los años 60, reforzaron la estructura contra terremotos y recuperaron los colores originales de 1922. Hoy en día funciona como una de las salas de cine clásico más avanzadas del mundo, capaz de proyectar películas en nitrato, 35mm, 70mm y digital." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Una Máquina del Tiempo de 1922", d: "Caminen por el patio hasta las puertas de cristal. El vestíbulo y la sala principal fueron restaurados a su estado exacto de 1922, incluyendo su impresionante techo con un sol dorado." }
        ]
      }
    },

    // STOP 6: Musso & Frank
    {
      id: 6,
      coords: [-118.3353, 34.1018],
      mapUrl: "https://maps.google.com/?q=Musso+and+Frank+Grill",
      en: {
        title: "The Musso & Frank Grill",
        address: "6667 Hollywood Blvd",
        short: "6. Musso & Frank",
        timeline: [
          { y: "1919", t: "Opens as 'Frank's Cafe', predating the Hollywood Sign." },
          { y: "1930s", t: "Becomes the literary hub for America's greatest novelists." },
          { y: "1955", t: "Longtime bartender Manny Aguirre perfects the stirred martini." },
          { y: "2019", t: "Celebrates its centennial and appears in Tarantino's Once Upon a Time in Hollywood." }
        ],
        people: [
          { name: "Charlie Chaplin", role: "Cinema Legend & Regular", bio: "Dined here daily during the silent era, famously challenging Douglas Fairbanks to horse races down Hollywood Boulevard outside." },
          { name: "F. Scott Fitzgerald & Ernest Hemingway", role: "Literary Giants", bio: "Acclaimed novelists who drank, argued, and punched up studio screenplays in the restaurant's private back booths." },
          { name: "Raymond Chandler", role: "Detective Noir Author", bio: "Legendary crime writer who drank gimlets at the mahogany counter while drafting his iconic Philip Marlowe detective mysteries." }
        ],
        stories: [
          { 
            h: "Hollywood's Oldest Living Room (1919)", 
            p: "Look across the boulevard at the red awnings of Musso & Frank Grill. Opened in 1919 by Joseph Musso and Frank Toulet, this is the oldest continually operating restaurant in Hollywood, predating the Hollywood Sign by four years. Stepping through the heavy front doors is like stepping onto a 1930s film set, featuring dark mahogany woodwork, red leather booths, and warm amber lighting. For over a century, the restaurant has served as the social living room for the film industry." 
          },
          { 
            h: "The Literary Clubhouse", 
            p: "During the Golden Age, major movie studios recruited America's greatest novelists to Hollywood with lucrative screenplay contracts. Unaccustomed to studio interference, writers made Musso & Frank their unofficial daily headquarters. F. Scott Fitzgerald, Ernest Hemingway, William Faulkner, and John Steinbeck spent their afternoons drinking in the back booths while editing manuscripts. Film noir pioneer Raymond Chandler famously sat at the bar drinking gimlets while crafting dialogue for detective Philip Marlowe." 
          },
          { 
            h: "Chaplin's Window Booth #1", 
            p: "Charlie Chaplin was a daily fixture during the 1920s and had his own permanently reserved table: Booth #1 by the front window. At the time, Hollywood Boulevard was still a dusty unpaved roadway with wooden hitching posts. Chaplin insisted on the window booth so he could keep a watchful eye on his horse tied up outside while dining with fellow screen star Douglas Fairbanks. The table remains one of the most requested dining booths in Los Angeles." 
          },
          { 
            h: "The Martini Ritual & The Red Coats", 
            p: "Musso & Frank is world-famous for preserving classic culinary hospitality. The servers and bartenders wear formal red tuxedo coats and black bowties, with several waiters having worked at the restaurant for over 40 years. The restaurant is renowned for its classic dry gin martini: stirred precisely for thirty seconds, poured into a chilled glass, and served alongside a small sidecar decanter resting in crushed ice so the refill stays ice-cold." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "The Classic Sidecar Martini", d: "Order a classic martini at the bar to experience the historic service: your drink is served with an iced miniature glass sidecar decanter to keep your second pour freezing cold." }
        ]
      },
      es: {
        title: "The Musso & Frank Grill",
        address: "6667 Hollywood Blvd",
        short: "6. Musso & Frank",
        timeline: [
          { y: "1919", t: "Abre como 'Frank's Cafe', cuatro años antes de que existiera el letrero de Hollywood." },
          { y: "Años 1930", t: "Se convierte en el punto de encuentro de los grandes escritores estadounidenses." },
          { y: "1955", t: "El cantinero Manny Aguirre perfecciona la receta clásica del Martini revuelto." },
          { y: "2019", t: "Celebra su centenario y aparece en Había una vez en Hollywood de Tarantino." }
        ],
        people: [
          { name: "Charlie Chaplin", role: "Leyenda del Cine", bio: "Cliente diario durante la época muda que competía en carreras de caballos contra Douglas Fairbanks a lo largo del bulevar." },
          { name: "F. Scott Fitzgerald y Ernest Hemingway", role: "Gigantes de la Literatura", bio: "Novelistas consagrados que bebían, discutían y pulían guiones de cine en las mesas privadas del fondo." },
          { name: "Raymond Chandler", role: "Maestro de Novela Negra", bio: "Escritor policíaco que bebía en la barra de caoba mientras redactaba las aventuras del detective Philip Marlowe." }
        ],
        stories: [
          { 
            h: "La Sala de Estar de Hollywood (1919)", 
            p: "Observen los toldos rojos del restaurante Musso & Frank Grill. Inaugurado en 1919 por Joseph Musso y Frank Toulet, es el restaurante más antiguo en operación continua de Hollywood, abriendo cuatro años antes de que se construyera el letrero de Hollywood. Cruzar sus puertas es entrar a un set cinematográfico de los años 30, con acabados en caoba oscura, asientos de cuero rojo y luz cálida. Durante más de un siglo, ha sido el comedor de confianza para la industria cinematográfica." 
          },
          { 
            h: "El Club de los Grandes Escritores", 
            p: "Durante la época dorada, los grandes estudios contrataron a los novelistas más respetados del país para escribir guiones. Incómodos con la burocracia de las oficinas, los autores convirtieron este restaurante en su oficina de trabajo. Figuras como F. Scott Fitzgerald, Ernest Hemingway, William Faulkner y John Steinbeck pasaban las tardes bebiendo y corrigiendo textos en las mesas traseras. Raymond Chandler escribió parte de sus novelas de detectives mientras disfrutaba de sus cócteles en la barra." 
          },
          { 
            h: "La Mesa #1 de Charlie Chaplin", 
            p: "Charlie Chaplin era un comensal habitual en los años 20 y tenía su propia mesa reservada: la Mesa #1 junto a la ventana. En aquella época, Hollywood Boulevard era un camino de terracería con postes de madera para amarrar animales. Chaplin exigía esa mesa específica para vigilar a su caballo amarrado afuera mientras almorzaba con su amigo Douglas Fairbanks. Hoy en día, esa misma mesa sigue siendo una de las más solicitadas de la ciudad." 
          },
          { 
            h: "El Ritual del Martini y las Chaquetas Rojas", 
            p: "Musso & Frank destaca por mantener intacto el servicio clásico de la vieja escuela. Los meseros y cantineros visten chaquetas rojas de esmoquin y corbatines negros, y muchos de ellos llevan más de cuatro décadas trabajando en el lugar. Su bebida más famosa es el Martini clásico de ginebra: revuelto durante 30 segundos, servido en copa helada y acompañado por una pequeña jarrita de cristal sobre hielo triturado para que el segundo trago permanezca helado." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "El Secreto del Martini Clásico", d: "Si entran a la barra, pidan su clásico Martini: se sirve acompañado de una pequeña jarra sobre hielo para mantener la bebida completamente helada." }
        ]
      }
    },

    // STOP 7: El Capitan Theatre
    {
      id: 7,
      coords: [-118.3392, 34.1015],
      mapUrl: "https://maps.google.com/?q=El+Capitan+Theatre",
      en: {
        title: "The El Capitan Theatre",
        address: "6838 Hollywood Blvd",
        short: "7. El Capitan",
        timeline: [
          { y: "1926", t: "Opens as a live stage venue, dubbed 'Hollywood's First Home of the Spoken Drama'." },
          { y: "1941", t: "Hosts the defiant world premiere of Orson Welles' masterpiece Citizen Kane." },
          { y: "1989", t: "Disney purchases the theater and initiates a museum-grade historical restoration." },
          { y: "Present", t: "Serves as Disney's flagship cinematic premiere palace in Hollywood." }
        ],
        people: [
          { name: "Orson Welles", role: "Director, Actor & Visionary", bio: "Genius filmmaker who co-wrote, directed, and starred in Citizen Kane at age 25, taking on the most powerful media tycoon in the country." },
          { name: "William Randolph Hearst", role: "Billionaire Newspaper Publisher", bio: "Media baron who attempted to suppress Citizen Kane across major theater chains after recognizing it as a parody of his private life." },
          { name: "Charles Toberman", role: "The 'Father of Hollywood'", bio: "Pioneering real estate developer who built El Capitan, the Roosevelt Hotel, and the Chinese Theatre along Hollywood Boulevard." }
        ],
        stories: [
          { 
            h: "Home of the Spoken Drama (1926)", 
            p: "Opened on May 3, 1926, El Capitan features an elaborate Spanish Colonial Revival exterior designed by architect G. Albert Lansburgh. Unlike the Egyptian and Chinese Theatres, El Capitan was not constructed for motion pictures. Real estate developer Charles Toberman built it as a legitimate playhouse for Broadway stage productions, earning it the title 'Hollywood’s First Home of the Spoken Drama'. Legendary actors including Clark Gable, Buster Keaton, and Joan Fontaine performed live theatrical dramas on its stage." 
          },
          { 
            h: "The Citizen Kane Rebellion (1941)", 
            p: "In 1941, a 25-year-old theatrical prodigy named Orson Welles directed, co-wrote, and starred in his debut film, <em>Citizen Kane</em>. The film told the story of an egomaniacal newspaper magnate, serving as a thinly veiled and unflattering parody of billionaire publisher William Randolph Hearst. When Hearst caught wind of the film's contents through private Hollywood preview screenings, he flew into a rage and vowed to destroy the picture before the public could see it." 
          },
          { 
            h: "Hearst's Media Blackout & The Defiant Premiere", 
            p: "Hearst utilized his vast nationwide newspaper syndicate to intimidate Hollywood studio heads and major theater chains. He banned all mentions of <em>Citizen Kane</em> in his papers and threatened major theater executives with permanent advertising blackouts if they screened the film. Terrified of losing press coverage, major theater chains across America dropped the movie. Defying the industry-wide ban, the independent El Capitan stepped up and hosted the world premiere on May 1, 1941, cementing its status as an icon of cinematic freedom." 
          },
          { 
            h: "The Disney Restoration & The Wurlitzer Organ", 
            p: "In 1989, The Walt Disney Company acquired the lease and embarked on a multi-million-dollar restoration to return the theater to its 1920s glory. Preservationists restored the original hand-carved gilded ceiling boxes, rich velvet drapes, and ornate plaster details. Before every movie screening today, an organist rises on an elevator platform from beneath the stage playing a massive, fully restored 1929 Wurlitzer theater pipe organ equipped with 2,500 pipes and authentic percussion sound effects." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Late Night Neighbor", d: "Jimmy Kimmel Live! films directly next door in the Masonic Temple building; Kimmel frequently uses the sidewalk and alleyway between the two buildings for comedy sketches." }
        ]
      },
      es: {
        title: "Teatro El Capitán",
        address: "6838 Hollywood Blvd",
        short: "7. El Capitán",
        timeline: [
          { y: "1926", t: "Abre como foro teatral, apodado 'El Primer Hogar del Drama Hablado'." },
          { y: "1941", t: "Celebra el histórico estreno mundial de El Ciudadano Kane de Orson Welles." },
          { y: "1989", t: "Disney adquiere el teatro y realiza una restauración arquitectónica profunda." },
          { y: "Presente", t: "Funciona como el palacio insignia de estrenos cinematográficos de Disney." }
        ],
        people: [
          { name: "Orson Welles", role: "Director, Actor y Visionario", bio: "Joven cineasta de 25 años que dirigió, escribió y protagonizó El Ciudadano Kane, desafiando al hombre más poderoso del país." },
          { name: "William Randolph Hearst", role: "Magnate de los Periódicos", bio: "Multimillonario de la prensa que intentó destruir El Ciudadano Kane al ver que retrataba de forma cruda su vida privada." },
          { name: "Charles Toberman", role: "El 'Padre de Hollywood'", bio: "Visionario desarrollador inmobiliario que construyó El Capitán, el Hotel Roosevelt y el Teatro Chino en el bulevar." }
        ],
        stories: [
          { 
            h: "El Hogar del Teatro en Vivo (1926)", 
            p: "Inaugurado el 3 de mayo de 1926, El Capitán destaca por su exterior de estilo colonial español diseñado por el arquitecto G. Albert Lansburgh. A diferencia de sus vecinos, este recinto no fue construido para proyectar películas. El promotor Charles Toberman lo concibió como un teatro para obras dramáticas de Broadway, ganando el título del 'Primer Hogar del Drama Hablado de Hollywood'. Grandes estrellas como Clark Gable, Buster Keaton y Joan Fontaine actuaron en su escenario." 
          },
          { 
            h: "La Rebelión del Ciudadano Kane (1941)", 
            p: "En 1941, un joven prodigio de 25 años llamado Orson Welles dirigió, escribió y protagonizó su primera película: <em>El Ciudadano Kane</em>. La historia narraba el ascenso y caída de un magnate de la prensa, siendo una parodia directa de la vida de William Randolph Hearst. Cuando Hearst se enteró del argumento a través de proyecciones privadas, montó en cólera y juró destruir la película antes de que llegara al público." 
          },
          { 
            h: "El Boicot de Prensa y el Estreno Desafiante", 
            p: "Hearst utilizó su enorme cadena de periódicos para presionar a los dueños de los cines. Prohibió cualquier mención a la cinta y amenazó a los circuitos de exhibición con vetar sus anuncios publicitarios si pasaban la película. Aterrorizadas, las grandes cadenas retiraron el filme de sus carteleras. Desafiando el boicot corporativo, el independiente Teatro El Capitán alzó la mano y celebró el estreno mundial el 1 de mayo de 1941, consagrándose en la historia del cine." 
          },
          { 
            h: "La Era Disney y el Órgano Wurlitzer", 
            p: "En 1989, The Walt Disney Company tomó la operación del recinto y comenzó una restauración profunda para devolverle su esplendor de los años 20. Se recuperaron los balcones dorados tallados a mano, las cortinas de terciopelo y los ornamentos de yeso. Antes de cada función, un músico emerge desde el sótano sobre una plataforma tocando un órgano Wurlitzer de 1929 con 2,500 tubos e instrumentos de percusión integrados." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Grabaciones en la Puerta", d: "El programa <em>Jimmy Kimmel Live!</em> se graba en el templo masónico de al lado, utilizando frecuentemente este cruce peatonal para sus entrevistas de comedia." }
        ]
      }
    },

    // STOP 8: The Pantages Theatre
    {
      id: 8,
      coords: [-118.3255, 34.1022],
      mapUrl: "https://maps.google.com/?q=Pantages+Theatre+Hollywood",
      en: {
        title: "The Pantages Theatre",
        address: "6233 Hollywood Blvd (Near Hollywood & Vine)",
        short: "8. The Pantages",
        timeline: [
          { y: "1930", t: "Opens as the last great movie palace erected in Hollywood during the Golden Age." },
          { y: "1949", t: "Billionaire Howard Hughes purchases the building and sets up private offices." },
          { y: "1953", t: "Hosts the very first televised Academy Awards ceremony in broadcast history." },
          { y: "Present", t: "Serves as Los Angeles' premier home for major touring Broadway theatricals." }
        ],
        people: [
          { name: "Alexander Pantages", role: "Vaudeville & Theater Mogul", bio: "Greek immigrant who built an empire of dozens of theaters across North America, building this flagship palace at the height of his career." },
          { name: "Howard Hughes", role: "Aviation & Film Tycoon", bio: "Eccentric billionaire who bought the building in 1949, running his RKO film empire from a private suite on the second floor." },
          { name: "B. Marcus Priteca", role: "Master Theater Architect", bio: "Architect who designed the sensational Zigzag Art Deco interior, utilizing geometric frosted glass, gold leaf, and dramatic sunburst chandeliers." }
        ],
        stories: [
          { 
            h: "The Last Grand Movie Palace (1930)", 
            p: "As you approach the famous intersection of Hollywood and Vine, you will find the Pantages Theatre. Opened on June 4, 1930, by Greek-American theater magnate Alexander Pantages, it cost $1.25 million and held 2,800 seats. It holds the historical distinction of being the absolute last grand movie palace constructed in Hollywood during the Golden Age. Just as it opened, the Great Depression deepened, bringing an end to the era of palatial movie palace construction." 
          },
          { 
            h: "Zigzag Art Deco Masterwork", 
            p: "The auditorium and grand lobby represent the pinnacle of Zigzag Art Deco architectural design. Architect B. Marcus Priteca rejected traditional European classical motifs in favor of geometric, futuristic shapes that captured the technological energy of the 1930s. The lobby features soaring vaulted ceilings, backlit frosted glass pillars, and massive hammered gold-leaf starbursts. The ceiling resembles a celestial galaxy illuminated by custom chandeliers and hidden neon fixtures." 
          },
          { 
            h: "Howard Hughes' Secret Penthouse Headquarters", 
            p: "In 1949, the eccentric aviation billionaire and film producer Howard Hughes purchased the theater to expand his control over the RKO movie studio. Hughes was notoriously reclusive and distrustful of the public eye. He converted the theater's entire second floor into his personal executive headquarters and living quarters, holding late-night movie screenings and directing corporate strategy without having to step outside into the streets." 
          },
          { 
            h: "The First Televised Oscars (1953)", 
            p: "The Pantages hosted the Academy Awards ceremonies from 1950 to 1960. On March 19, 1953, the venue made television history as the site of the first-ever televised Oscar ceremony. Hosted by Bob Hope, over 40 million Americans tuned in on their living room black-and-white sets to watch Hollywood glamour in real time. Today, the theater is the premier destination in Southern California for blockbuster Broadway musicals like <em>Hamilton</em> and <em>The Lion King</em>." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Broadway in LA", d: "Today, the Pantages operates as the city's premier Broadway venue, hosting multi-month runs of massive musical productions like <em>Hamilton</em> and <em>Wicked</em>." }
        ]
      },
      es: {
        title: "Teatro Pantages",
        address: "6233 Hollywood Blvd (Cerca de Hollywood y Vine)",
        short: "8. El Pantages",
        timeline: [
          { y: "1930", t: "Se inaugura como el último gran palacio de cine de la época dorada." },
          { y: "1949", t: "El multimillonario Howard Hughes adquiere el edificio y monta sus oficinas." },
          { y: "1953", t: "Sede de la primera transmisión televisada de los Premios Óscar." },
          { y: "Presente", t: "Es la sede principal de los grandes musicales de Broadway en gira por LA." }
        ],
        people: [
          { name: "Alexander Pantages", role: "Magnate del Vodevil y Teatros", bio: "Inmigrante griego que forjó un imperio de teatros por todo el país, construyendo este palacio en la cumbre de su carrera." },
          { name: "Howard Hughes", role: "Magnate de Aviación y Cine", bio: "Excéntrico multimillonario que compró el teatro en 1949 y dirigió su estudio de cine RKO desde un departamento en el piso superior." },
          { name: "B. Marcus Priteca", role: "Arquitecto Teatral", bio: "Diseñador que concibió el interior Art Déco Zigzag con figuras geométricas, pan de oro y candelabros en forma de sol." }
        ],
        stories: [
          { 
            h: "El Último Palacio del Cine (1930)", 
            p: "Al acercarse a la intersección de Hollywood y Vine se encuentra el Teatro Pantages. Inaugurado el 4 de junio de 1930 por el empresario Alexander Pantages, tuvo un costo de $1.25 millones de dólares y capacidad para 2,800 personas. Ostenta la distinción histórica de ser el último gran palacio de cine construido en Hollywood durante la época dorada. Su apertura coincidió con el inicio de la Gran Depresión, poniendo fin a la construcción de estos recintos monumentales." 
          },
          { 
            h: "Una Obra Maestra del Art Déco Zigzag", 
            p: "El vestíbulo y la sala principal representan la cúspide del estilo Art Déco en su vertiente geométrica o 'Zigzag'. El arquitecto B. Marcus Priteca evitó los estilos clásicos europeos y optó por figuras abstractas que reflejaban la velocidad de la era de las máquinas. El vestíbulo luce techos abovedados de doble altura, columnas de vidrio esmerilado con iluminación trasera y enormes soles bañados en pan de oro. El techo simula una galaxia geométrica iluminada por luces ocultas." 
          },
          { 
            h: "El Refugio Secreto de Howard Hughes", 
            p: "En 1949, el excéntrico multimillonario de la aviación Howard Hughes compró el edificio para fortalecer su control sobre la productora RKO Pictures. Hughes, conocido por su carácter ermitaño, adaptó todo el segundo piso como su residencia particular y centro de operaciones. Desde allí organizaba proyecciones privadas a altas horas de la madrugada y administraba sus empresas sin ser visto por los fanáticos en la calle." 
          },
          { 
            h: "Los Primeros Óscar por Televisión (1953)", 
            p: "El Pantages albergó la ceremonia de los Premios Óscar de 1950 a 1960. El 19 de marzo de 1953 hizo historia al ser el escenario de la primera transmisión televisada de los galardones. Conducida por Bob Hope, más de 40 millones de personas vieron la gala en vivo en sus pantallas en blanco y negro. Hoy en día, el teatro es el principal foro de Los Ángeles para grandes musicales de Broadway como <em>Hamilton</em> y <em>El Rey León</em>." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Broadway en Los Ángeles", d: "Actualmente el Pantages es el epicentro del teatro musical en la costa oeste, presentando giras de producciones como <em>Wicked</em> y <em>Hamilton</em>." }
        ]
      }
    },

    // STOP 9: Capitol Records
    {
      id: 9,
      coords: [-118.3265, 34.1030],
      mapUrl: "https://maps.google.com/?q=Capitol+Records+Building",
      en: {
        title: "The Capitol Records Tower",
        address: "1750 Vine St (Walk one block north of Hollywood Blvd)",
        short: "9. Capitol Records",
        timeline: [
          { y: "1956", t: "Completed as the world's first circular office building." },
          { y: "1956", t: "The rooftop spire begins blinking out 'H-O-L-L-Y-W-O-O-D' in Morse code." },
          { y: "1990s", t: "Guitar pioneer Les Paul assists in preserving the underground echo chambers." },
          { y: "2006", t: "Designated a Los Angeles Historic-Cultural Monument." }
        ],
        people: [
          { name: "Welton Becket", role: "Mid-Century Architect", bio: "Modernist architect who designed the 13-story circular concrete tower, revolutionizing office floorplans and Googie aesthetics." },
          { name: "Frank Sinatra & Nat King Cole", role: "Legendary Recording Artists", bio: "Vocal titans whose hit singles built the financial empire of Capitol Records, recording masterpieces in Studio A." },
          { name: "Les Paul", role: "Guitarist & Audio Innovator", bio: "Multitrack pioneer who engineered the custom trapezoidal acoustic echo chambers buried 30 feet below the building." }
        ],
        stories: [
          { 
            h: "The World's First Circular Office Tower (1956)", 
            p: "Look north up Vine Street at one of the world's most distinct modernist landmarks. Designed in 1956 by architect Welton Becket, the 13-story Capitol Records Tower was the first circular office building ever constructed. Becket realized that a circular floor plan required 18% less perimeter wall area, provided better natural interior light, and lowered cooling costs. Topped with a 90-foot spire, the building resembles a stack of 45-RPM vinyl records resting on a turntable." 
          },
          { 
            h: "The 90-Foot Morse Code Beacon", 
            p: "Look closely at the bright red beacon blinking at the very tip of the rooftop aluminum spire. Since opening day in April 1956, that beacon has continuously blinked out a message in Morse code: <strong>H-O-L-L-Y-W-O-O-D</strong>. The message was first switched on by Leila Morse, the granddaughter of telegraph inventor Samuel Morse. It has blinked uninterrupted for seven decades, with the sole exception of 1992 when it briefly spelled out 'Capitol 50' for the label's golden anniversary." 
          },
          { 
            h: "Les Paul's Subterranean Echo Chambers", 
            p: "The true sonic genius of the building lies 30 feet beneath the asphalt parking lot. Guitar pioneer and audio engineer Les Paul collaborated with sound designers to construct eight trapezoidal concrete echo chambers buried deep underground. Sound engineers pump recorded vocal and instrument tracks through underground speakers, capture the natural concrete reverberation with microphones, and blend it back into recordings to create Capitol's signature rich tone." 
          },
          { 
            h: "The Hit Factory of the 20th Century", 
            p: "The studios inside this tower shaped the sound of modern popular music. Frank Sinatra and Nat King Cole recorded their career-defining albums in Studio A, while The Beach Boys, Dean Martin, Paul McCartney, and Beastie Boys utilized the facility for seminal albums. When The Beatles conquered America in 1964, their records were mastered and distributed across North America directly from this tower." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "The Walk of Fame Stars", d: "Right on the sidewalk directly in front of the building, you will find the Hollywood Walk of Fame stars for all four members of The Beatles." }
        ]
      },
      es: {
        title: "Torre de Capitol Records",
        address: "1750 Vine St (Camina una cuadra al norte)",
        short: "9. Capitol Records",
        timeline: [
          { y: "1956", t: "Se inaugura como el primer edificio de oficinas circular del mundo." },
          { y: "1956", t: "La luz de la aguja comienza a emitir 'H-O-L-L-Y-W-O-O-D' en código Morse." },
          { y: "Años 1990", t: "El músico Les Paul asesora la restauración de las cámaras de eco subterráneas." },
          { y: "2006", t: "Declarado Monumento Histórico-Cultural de la Ciudad de Los Ángeles." }
        ],
        people: [
          { name: "Welton Becket", role: "Arquitecto Modernista", bio: "Diseñador que proyectó la torre cilíndrica de 13 pisos, transformando la arquitectura corporativa de la época espacial." },
          { name: "Frank Sinatra y Nat King Cole", role: "Íconos de la Música", bio: "Vocalistas cumbre cuyos éxitos financiaron el crecimiento de Capitol Records, grabando en el legendario Estudio A." },
          { name: "Les Paul", role: "Guitarrista e Inventor", bio: "Pionero del sonido que diseñó las ocho cámaras de eco de concreto construidas a 9 metros bajo el suelo." }
        ],
        stories: [
          { 
            h: "La Primera Torre Circular del Mundo (1956)", 
            p: "Miren hacia el norte por Vine Street para admirar un monumento clave de la arquitectura de posguerra. Diseñada en 1956 por el arquitecto Welton Becket, la torre de 13 pisos de Capitol Records fue el primer edificio de oficinas cilíndrico del mundo. Becket demostró que una estructura circular reducía en 18% el área de paredes exteriores, mejoraba la iluminación natural y ahorraba aire acondicionado. Coronada por una aguja de 27 metros, evoca una pila de discos de vinilo colocados sobre un tocadiscos." 
          },
          { 
            h: "El Faro en Código Morse", 
            p: "Observen la luz roja parpadeando en la punta de la aguja de aluminio. Desde el día de su apertura en abril de 1956, esa luz emite un mensaje constante en código Morse: <strong>H-O-L-L-Y-W-O-O-D</strong>. El interruptor original fue accionado por Leila Morse, nieta de Samuel Morse (el inventor del telégrafo). La señal ha parpadeado sin parar durante siete décadas, salvo en 1992 cuando deletreó 'Capitol 50' para conmemorar el aniversario de la disquera." 
          },
          { 
            h: "Las Cámaras de Eco Subterráneas de Les Paul", 
            p: "El secreto del sonido de Capitol se encuentra 9 metros bajo el estacionamiento. El virtuoso de la guitarra Les Paul ayudó a diseñar ocho cámaras acústicas trapezoidales de concreto reforzado enterradas en el subsuelo. Los ingenieros envían el sonido de voces e instrumentos por altavoces hacia estas cámaras, recogen el eco natural con micrófonos y lo mezclan con la pista para lograr la inconfundible calidad sonora de la disquera." 
          },
          { 
            h: "La Fábrica de Éxitos del Siglo XX", 
            p: "Los estudios dentro de este edificio transformaron la historia de la música popular. Frank Sinatra y Nat King Cole grabaron sus discos más famosos en el Estudio A, mientras que The Beach Boys, Dean Martin, Paul McCartney y los Beastie Boys produjeron álbumes memorables aquí. Cuando The Beatles llegaron a Estados Unidos en 1964, sus sencillos y discos para el mercado americano salieron de esta torre." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Las Estrellas de The Beatles", d: "En la acera frente al edificio encontrarán las estrellas del Paseo de la Fama dedicadas a los cuatro miembros de The Beatles." }
        ]
      }
    },

    // STOP 10: Knickerbocker Hotel
    {
      id: 10,
      coords: [-118.3283, 34.1032],
      mapUrl: "https://maps.google.com/?q=Hollywood+Knickerbocker+Apartments",
      en: {
        title: "The Hollywood Knickerbocker Hotel",
        address: "1714 Ivar Ave",
        short: "10. Knickerbocker",
        timeline: [
          { y: "1926", t: "Opens as a luxury residential hotel for the silent film community." },
          { y: "1936", t: "Bess Houdini holds the historic 10th and final séance on the rooftop." },
          { y: "1948", t: "Pioneering silent film director D.W. Griffith collapses in the lobby." },
          { y: "1966", t: "Beloved 'I Love Lucy' actor William Frawley collapses outside the entrance." }
        ],
        people: [
          { name: "Bess Houdini", role: "Magician's Widow & Performer", bio: "Conducted ten annual Halloween séances to contact her late husband Harry, ending with her famous rooftop declaration on this building." },
          { name: "William Frawley", role: "Actor (Fred Mertz)", bio: "Beloved television actor on I Love Lucy who resided here for years and suffered a fatal heart attack on the sidewalk out front." },
          { name: "D.W. Griffith", role: "Silent Film Director", bio: "Pioneering director of early cinema who spent his impoverished final years living in isolation here until his death in the lobby." }
        ],
        stories: [
          { 
            h: "A Silent Era Sanctuary (1926)", 
            p: "Turn onto Ivar Avenue to view the Renaissance Revival facade of the Knickerbocker Hotel. Opened in 1926 as a luxury residential apartment hotel, it was designed as a private, elegant retreat for the early royalty of cinema. Silent screen stars like Rudolph Valentino, Gloria Swanson, and Mae Murray lived in its multi-room suites to escape the aggressive studio press. The property featured a lavish ground-floor dining room, private subterranean speakeasy rooms, and high ceilings that offered quiet sanctuary." 
          },
          { 
            h: "The 10th & Final Houdini Séance (1936)", 
            p: "This building is famous for one of the most celebrated paranormal events in American history. Before his death in 1926, legendary escape artist Harry Houdini gave his wife Bess a secret ten-word code phrase, promising that if communication from beyond the grave was possible, he would contact her. For nine consecutive years on Halloween night, Bess held solemn séances across the country without success. On October 31, 1936, she held the tenth and final attempt on the open rooftop of the Knickerbocker amid a sudden rainstorm." 
          },
          { 
            h: "The Séance Conclusion: 'The Play Is Over'", 
            p: "Over 300 journalists, scientists, and spiritualists crowded onto the Knickerbocker roof as Bess pleaded for a sign from Houdini. When the clock struck midnight and no signal occurred, Bess turned off the spotlight illuminating Houdini's portrait. She famously announced to the assembled media: <em>'Houdini did not come through. My last hope is gone. I do not believe that Houdini can come back to me, or to anyone. The play is over. Good night, Harry.'</em>" 
          },
          { 
            h: "Golden Age Tragedies & Elvis Lore", 
            p: "The hotel carries a dark history beneath its glamour. In 1948, pioneering film director D.W. Griffith, living in forgotten isolation, suffered a fatal cerebral hemorrhage in the main lobby. In March 1966, beloved actor William Frawley (famous as landlord Fred Mertz on <em>I Love Lucy</em>) suffered a fatal heart attack and collapsed on the sidewalk directly outside the front doors. In 1956, Elvis Presley stayed in Room 1016 while filming <em>Love Me Tender</em>, resulting in screaming crowds of teenage fans surrounding the block." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Elvis's Secret Stay", d: "Elvis Presley stayed in Room 1016 in 1956 while making 'Love Me Tender'; police had to sneak him through the service alley to escape hundreds of fans." }
        ]
      },
      es: {
        title: "Hotel Hollywood Knickerbocker",
        address: "1714 Ivar Ave",
        short: "10. Knickerbocker",
        timeline: [
          { y: "1926", t: "Abre como hotel residencial de lujo para la comunidad del cine mudo." },
          { y: "1936", t: "Bess Houdini celebra su décima y última sesión espiritista en la azotea." },
          { y: "1948", t: "El pionero del cine D.W. Griffith fallece en el vestíbulo principal." },
          { y: "1966", t: "El actor William Frawley (I Love Lucy) se desploma en la acera exterior." }
        ],
        people: [
          { name: "Bess Houdini", role: "Viuda del Ilusionista", bio: "Realizó sesiones espiritistas en Halloween durante diez años para contactar a Harry, concluyendo en esta azotea." },
          { name: "William Frawley", role: "Actor de TV (Fred Mertz)", bio: "Inolvidable coprotagonista de I Love Lucy que residió aquí y sufrió un infarto fulminante frente al hotel." },
          { name: "D.W. Griffith", role: "Director de Cine Mudo", bio: "Pionero cinematográfico que pasó sus últimos años recluido en este inmueble hasta su fallecimiento en el vestíbulo." }
        ],
        stories: [
          { 
            h: "Un Refugio del Cine Mudo (1926)", 
            p: "Caminen por Ivar Avenue para admirar la fachada neorrenacentista del Hotel Knickerbocker. Inaugurado en 1926 como hotel de apartamentos de lujo, fue diseñado como un retiro exclusivo para las estrellas de la época muda. Figuras como Rudolph Valentino, Gloria Swanson y Mae Murray vivieron en sus suites para alejarse del acoso de la prensa. Contaba con comedores privados, túneles para burlar la ley seca y un ambiente elegante que ofrecía total privacidad a la industria." 
          },
          { 
            h: "La Décima Sesión de Houdini (1936)", 
            p: "Este edificio resguarda el suceso paranormal más célebre de la historia de Los Ángeles. Antes de morir en 1926, el legendario ilusionista Harry Houdini le dio a su esposa Bess un código secreto de diez palabras, prometiendo que si el contacto con el más allá era real, se comunicaría con ella. Durante nueve años consecutivos en la noche de Halloween, Bess realizó sesiones espiritistas sin éxito. El 31 de octubre de 1936 organizó el décimo y último intento en la azotea del Knickerbocker en medio de una tormenta." 
          },
          { 
            h: "El Fin de la Promesa: 'La Obra ha Terminado'", 
            p: "Más de 300 reporteros, científicos e invitados llenaron la azotea mientras Bess esperaba una señal de su esposo. Al sonar las doce campanadas de la medianoche sin ninguna manifestación, Bess apagó la vela que alumbraba el retrato de Houdini. Dirigiéndose a la prensa, pronunció sus recordadas palabras: <em>'Houdini no se comunicó. Mi última esperanza se ha ido. No creo que pueda regresar. La obra ha terminado. Buenas noches, Harry.'</em>" 
          },
          { 
            h: "Tragedias de Hollywood y el Paso de Elvis", 
            p: "El inmueble resguarda memorias dramáticas. En 1948, el influyente cineasta D.W. Griffith, viviendo en el olvido, sufrió una hemorragia cerebral fatal en el vestíbulo. En marzo de 1966, el actor William Frawley (el entrañable Fred Mertz en <em>I Love Lucy</em>) sufrió un paro cardíaco y murió en la acera frente a la entrada. En 1956, Elvis Presley se hospedó en la suite 1016 mientras filmaba <em>Love Me Tender</em>, provocando que la policía cerrara la calle ante miles de admiradoras." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "La Habitación de Elvis", d: "Elvis Presley se hospedó en la suite 1016 en 1956 durante el rodaje de 'Love Me Tender'; la policía tuvo que sacarlo por los callejones de servicio ante las multitudes." }
        ]
      }
    },

    // STOP 11: Charlie Chaplin Studios
    {
      id: 11,
      coords: [-118.3440, 34.0975],
      mapUrl: "https://maps.google.com/?q=Jim+Henson+Company+Lot",
      en: {
        title: "Charlie Chaplin Studios / Jim Henson Co.",
        address: "1416 N La Brea Ave",
        short: "11. Chaplin Studios",
        timeline: [
          { y: "1917", t: "Chaplin builds his English Tudor studio lot amidst rural orange groves." },
          { y: "1919", t: "Chaplin co-founds United Artists with Pickford, Fairbanks, and Griffith." },
          { y: "1985", t: "The historic charity anthem 'We Are the World' is recorded in Soundstage A." },
          { y: "2000", t: "The Jim Henson Company purchases the historic lot as its creative home." }
        ],
        people: [
          { name: "Charlie Chaplin", role: "Actor, Director & Studio Founder", bio: "Cinematic genius who built this lot to secure complete artistic independence, shooting masterpieces like The Kid, Modern Times, and The Great Dictator." },
          { name: "Jim Henson", role: "Puppeteer & Creator of The Muppets", bio: "His family company purchased the lot in 2000, honoring Chaplin's legacy by placing a statue of Kermit the Frog dressed as the Little Tramp over the gate." },
          { name: "Quincy Jones & Michael Jackson", role: "Music Icons & Producers", bio: "Organized 45 of America's biggest recording stars to record 'We Are the World' inside these soundstages in January 1985." }
        ],
        stories: [
          { 
            h: "The Tudor Village in the Orange Groves (1917)", 
            p: "In 1917, Charlie Chaplin purchased five acres of rural orange orchards on La Brea Avenue to construct his own movie studio. Because the property sat in a quiet residential neighborhood, Chaplin designed the studio facade to look like a picturesque English country village with half-timbered Tudor cottages. This allowed his private creative facilities to blend into the surrounding homes. Here, Chaplin wrote, directed, edited, and scored his most celebrated masterpieces, including <em>The Kid</em> (1921), <em>The Gold Rush</em> (1925), and <em>Modern Times</em> (1936)." 
          },
          { 
            h: "The United Artists Rebellion (1919)", 
            p: "Frustrated by the financial constraints and creative meddling of early studio executives, Chaplin took a bold stand for artistic independence. In 1919, he co-founded <strong>United Artists</strong> alongside screen icons Mary Pickford, Douglas Fairbanks, and director D.W. Griffith. This groundbreaking partnership marked the first time in cinematic history that actors and directors maintained total ownership of their films and profits, breaking the monopoly of early studio distributors." 
          },
          { 
            h: "We Are the World (1985)", 
            p: "In the 1960s, the lot was purchased by A&M Records, founded by Herb Alpert and Jerry Moss, turning the soundstages into recording facilities. On the night of January 28, 1985, following the American Music Awards, music history was made inside Soundstage A. Producer Quincy Jones brought together 45 music legends—including Michael Jackson, Bruce Springsteen, Ray Charles, Bob Dylan, and Stevie Wonder—to record the charity single <em>'We Are the World'</em>, raising tens of millions of dollars for African famine relief." 
          },
          { 
            h: "The Muppet Era & Kermit the Tramp", 
            p: "In 2000, the historic lot was acquired by The Jim Henson Company to serve as its world headquarters. To honor the studio's founding visionary, the Henson family erected a custom eight-foot bronze statue of <strong>Kermit the Frog dressed in Chaplin’s iconic Little Tramp costume</strong>, complete with bowler hat and cane, standing atop the main gate. The lot remains an active creative studio where puppetry, visual effects, and films are produced." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Kermit on the Gate", d: "Stand on the sidewalk across La Brea Avenue to look up at the main gate, where an 8-foot statue of Kermit the Frog poses in Charlie Chaplin's bowler hat and cane." }
        ]
      },
      es: {
        title: "Estudios Charlie Chaplin / Jim Henson Co.",
        address: "1416 N La Brea Ave",
        short: "11. Chaplin Studios",
        timeline: [
          { y: "1917", t: "Chaplin construye sus estudios estilo Tudor sobre campos de naranjos." },
          { y: "1919", t: "Cofunda United Artists junto a Pickford, Fairbanks y Griffith." },
          { y: "1985", t: "Se graba el himno 'We Are the World' en el Foro A." },
          { y: "2000", t: "The Jim Henson Company compra las instalaciones como su sede mundial." }
        ],
        people: [
          { name: "Charlie Chaplin", role: "Actor, Director y Productor", bio: "Genio del cine que construyó este estudio para ser dueño de su obra, filmando clásicos como El Chico, Tiempos Modernos y El Gran Dictador." },
          { name: "Jim Henson", role: "Creador de The Muppets", bio: "Su empresa familiar adquirió el predio en 2000, honrando a Chaplin con una estatua de la Rana René vestida como el Vagabundo sobre la reja." },
          { name: "Quincy Jones y Michael Jackson", role: "Íconos de la Música", bio: "Reunieron a 45 superestrellas de la música para grabar 'We Are the World' en estos estudios en enero de 1985." }
        ],
        stories: [
          { 
            h: "La Villa Inglesa entre Naranjos (1917)", 
            p: "En 1917, Charlie Chaplin compró cinco acres de huertos de naranjos en La Brea Avenue para edificar su propio estudio cinematográfico. Como el terreno estaba en una zona residencial campestre, Chaplin diseñó la fachada para que pareciera una pintoresca villa inglesa estilo Tudor con techos de dos aguas. Esto le permitió integrar sus foros de filmación con las residencias vecinas. En estas instalaciones escribió, dirigió y musicalizó joyas como <em>El Chico</em> (1921), <em>La Quimera del Oro</em> (1925) y <em>Tiempos Modernos</em> (1936)." 
          },
          { 
            h: "La Rebelión de United Artists (1919)", 
            p: "Cansado del control financiero y las exigencias de los primeros ejecutivos de la industria, Chaplin decidió luchar por su libertad creativa. En 1919 cofundó <strong>United Artists</strong> junto a Mary Pickford, Douglas Fairbanks y el director D.W. Griffith. Esta alianza fue un hito en la historia de Hollywood, pues por primera vez los creadores fueron dueños absolutos de sus películas y de las ganancias generadas en taquilla." 
          },
          { 
            h: "La Grabación de 'We Are the World' (1985)", 
            p: "En los años 60, la compañía disquera A&M Records adquirió el predio y transformó los foros en modernos estudios de grabación. En la noche del 28 de enero de 1985 se escribió una página dorada en la historia de la música. El productor Quincy Jones reunió en el Foro A a 45 figuras legendarias—incluyendo a Michael Jackson, Bruce Springsteen, Ray Charles, Bob Dylan y Stevie Wonder—para grabar el tema benéfico <em>'We Are the World'</em>, recaudando millones de dólares para combatir el hambre en África." 
          },
          { 
            h: "La Era de los Muppets y la Rana René", 
            p: "En el año 2000, la empresa de Jim Henson adquirió las históricas instalaciones para fijar su sede internacional. Para rendir homenaje al fundador del predio, colocaron sobre la puerta principal una escultura de dos metros y medio de la <strong>Rana René (Kermit) vestida con el traje del 'Vagabundo' de Chaplin</strong>, luciendo su clásico bombín y bastón. El lugar sigue activo hoy como estudio de filmación, títeres y animación." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "La Rana René en la Entrada", d: "Párense en la acera de enfrente de La Brea para ver la estatua de bronce de la Rana René caracterizada con el traje y bastón de Charlie Chaplin sobre el portón." }
        ]
      }
    },

    // STOP 12: Crossroads of the World
    {
      id: 12,
      coords: [-118.3359, 34.0978],
      mapUrl: "https://maps.google.com/?q=Crossroads+of+the+World+Los+Angeles",
      en: {
        title: "Crossroads of the World",
        address: "6671 Sunset Blvd",
        short: "12. Crossroads",
        timeline: [
          { y: "1931", t: "Underworld political boss Charles Crawford is shot dead in his office here." },
          { y: "1936", t: "Crawford's widow opens America's first modern open-air pedestrian shopping mall." },
          { y: "1950s", t: "Alfred Hitchcock establishes his private creative production offices on the property." },
          { y: "1997", t: "Featured prominently as an iconic vintage setting in the film L.A. Confidential." }
        ],
        people: [
          { name: "Robert V. Derrah", role: "Master Architect", bio: "Talented architect who designed the central Streamline Moderne ocean liner building surrounded by European-style cottage villages." },
          { name: "Charles Crawford", role: "Underworld Crime Boss", bio: "Notorious political fixer and speakeasy kingpin known as the 'Wolf of Spring Street', whose assassination on this plot led to the mall's construction." },
          { name: "Alfred Hitchcock", role: "Master of Suspense", bio: "Legendary film director who maintained his independent screenwriting and pre-production offices within the central ship building." }
        ],
        stories: [
          { 
            h: "America's First Outdoor Shopping Mall (1936)", 
            p: "You have arrived at the concluding stop of our tour. Built in 1936 by architect Robert V. Derrah, Crossroads of the World is recognized as America's very first modern open-air shopping pedestrian mall. Derrah designed the property as an architectural fantasy to allow shoppers to stroll safely along garden pathways away from automobile traffic. The complex features a central courtyard flanked by whimsical storefronts designed to resemble French, Spanish, Moorish, and English country cottages." 
          },
          { 
            h: "The Streamline Moderne Ocean Liner", 
            p: "The crowning centerpiece of the complex is a 58-foot building designed to resemble a Streamline Moderne ocean liner sailing directly onto Sunset Boulevard. The building features porthole windows, brass ship railings, life preservers, and an authentic pilot bridge. Towering above the ship's mast is an eight-foot revolving neon globe that glows bright blue at night, serving as a beacon for Hollywood motorists for nearly ninety years." 
          },
          { 
            h: "Mob Lore & The Murder of Charles Crawford", 
            p: "The real estate carries a dark history rooted in the corruption of 1930s Los Angeles. The complex was built by the widow of Charles Crawford, a notorious speakeasy operator and political fixer known as the 'Wolf of Spring Street'. On May 20, 1931, Crawford was shot dead inside his private office on this exact plot of land during a political extortion scandal. To clear her family's name and create a legitimate revenue stream, his widow demolished the crime scene and financed this world-themed shopping village." 
          },
          { 
            h: "Alfred Hitchcock & Film Noir Cinema", 
            p: "As retail shifted to modern department stores, Crossroads transitioned into creative offices for writers, casting agents, and independent producers. Master of suspense Alfred Hitchcock kept his private production offices inside the ship building during the 1940s and 1950s. The property's preserved vintage aesthetic made it the premier backdrop for neo-noir motion pictures, appearing prominently in the Academy Award-winning film <em>L.A. Confidential</em> (1997) as Pierce Patchett's headquarters." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Sunset Boulevard Wrap-Up", d: "The tour is complete! You are located on vibrant Sunset Boulevard surrounded by cafes and record shops, just a short walk from the Hollywood & Vine Metro station." }
        ]
      },
      es: {
        title: "Crossroads of the World",
        address: "6671 Sunset Blvd",
        short: "12. Crossroads",
        timeline: [
          { y: "1931", t: "El jefe de la mafia política Charles Crawford es asesinado a tiros en este lugar." },
          { y: "1936", t: "Su viuda inaugura el primer centro comercial peatonal al aire libre de EE. UU." },
          { y: "Años 1950", t: "Alfred Hitchcock establece sus oficinas de producción dentro del barco central." },
          { y: "1997", t: "Aparece como escenario principal en la película de cine negro L.A. Confidential." }
        ],
        people: [
          { name: "Robert V. Derrah", role: "Arquitecto Principal", bio: "Arquitecto que concibió el transatlántico central de estilo Streamline Moderne rodeado de cabañas europeas." },
          { name: "Charles Crawford", role: "Jefe del Crimen y Político", bio: "Poderoso operador clandestino conocido como el 'Lobo de Spring Street', cuyo asesinato propició la construcción del centro." },
          { name: "Alfred Hitchcock", role: "Maestro del Suspenso", bio: "Célebre director de cine que mantuvo sus oficinas privadas de guion y producción dentro del edificio con forma de barco." }
        ],
        stories: [
          { 
            h: "El Primer Centro Comercial al Aire Libre (1936)", 
            p: "Han llegado a la última parada de nuestro recorrido. Construido en 1936 por el arquitecto Robert V. Derrah, Crossroads of the World es reconocido como el primer centro comercial peatonal al aire libre de Estados Unidos. Derrah diseñó el complejo como una fantasía arquitectónica donde los transeúntes pudieran pasear entre jardines lejos del tráfico vehicular. El patio central está rodeado de tiendas construidas con estilos que imitan villas españolas, francesas, moriscas e inglesas." 
          },
          { 
            h: "Un Transatlántico en Sunset Boulevard", 
            p: "El edificio principal del complejo tiene la forma de un transatlántico de estilo Streamline Moderne que parece navegar hacia Sunset Boulevard. La estructura cuenta con ojos de buey, barandillas náuticas de latón, salvavidas y un puente de mando auténtico. Sobre el mástil del barco se alza un globo terráqueo giratorio de neón de dos metros y medio de diámetro que brilla con luz azul por las noches, siendo un ícono visual para los conductores desde hace casi un siglo." 
          },
          { 
            h: "Historias de Mafia y el Asesinato de Charles Crawford", 
            p: "El terreno tiene un pasado oscuro ligado a la corrupción del bajo mundo angelino. El centro fue construido por la viuda de Charles Crawford, un poderoso operador de bares clandestinos conocido como el 'Lobo de Spring Street'. El 20 de mayo de 1931, Crawford fue asesinado a tiros dentro de su oficina privada en este mismo lote durante un escándalo político. Para limpiar el nombre familiar y generar ingresos legítimos, su viuda demolió el lugar y financió este centro comercial." 
          },
          { 
            h: "Alfred Hitchcock y el Cine Negro", 
            p: "Con el tiempo, el complejo se convirtió en oficinas de producción para escritores, agencias de actores y productores independientes. El maestro del suspenso Alfred Hitchcock mantuvo sus oficinas dentro del edificio del barco durante los años 40 y 50. Su estética clásica intacta lo convirtió en el escenario perfecto para películas de cine negro, destacando en la premiada película <em>L.A. Confidential</em> (1997) como la sede del personaje Pierce Patchett." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Fin del Recorrido", d: "¡El recorrido ha finalizado! Se encuentran sobre Sunset Boulevard rodeados de cafés y restaurantes, a pocos pasos de la estación del Metro en Hollywood y Vine." }
        ]
      }
    }
  ]
};

// Safe Mapbox Map Initialization
function initTourMap() {
  const mapContainer = document.getElementById('tour-map');
  if (!mapContainer || map) return;

  try {
    if (typeof mapboxgl === 'undefined' || !mapboxgl.accessToken) {
      console.warn('Mapbox GL JS or Access Token not ready.');
      return;
    }

    map = new mapboxgl.Map({
      container: 'tour-map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: tourData.stops[0].coords,
      zoom: 14.5,
      pitch: 25,
      attributionControl: false
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      map.resize();

      const routeCoords = tourData.stops.map(st => st.coords);
      map.addSource('tour-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: routeCoords
          }
        }
      });

      map.addLayer({
        id: 'tour-route-line',
        type: 'line',
        source: 'tour-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#2563eb',
          'line-width': 3.5,
          'line-dasharray': [1.5, 1.5]
        }
      });

      tourData.stops.forEach((st, idx) => {
        const el = document.createElement('div');
        el.className = `map-pin ${idx + 1 === currentStop ? 'active' : ''}`;
        el.id = `map-pin-${idx + 1}`;
        el.innerText = idx + 1;
        el.addEventListener('click', () => goToStop(idx + 1));

        const marker = new mapboxgl.Marker(el)
          .setLngLat(st.coords)
          .addTo(map);

        mapMarkers.push(marker);
      });
    });
  } catch (err) {
    console.error('Mapbox initialization failed gracefully:', err);
  }
}

function updateMapPosition() {
  const targetStop = tourData.stops[currentStop - 1];
  if (!targetStop || !map) return;

  try {
    map.flyTo({
      center: targetStop.coords,
      zoom: currentStop === 1 ? 13.5 : 15.5,
      speed: 1.2,
      curve: 1.1,
      essential: true
    });

    tourData.stops.forEach((_, idx) => {
      const pinEl = document.getElementById(`map-pin-${idx + 1}`);
      if (pinEl) {
        pinEl.classList.toggle('active', idx + 1 === currentStop);
      }
    });
  } catch (e) {
    // Graceful catch if map is still rendering
  }
}

function renderView(shouldScroll = true) {
  const s = tourData.stops[currentStop - 1];
  const d = s[currentLang];
  const u = tourData.ui[currentLang];

  const uiTitle = document.getElementById('ui-title');
  const uiDesc = document.getElementById('ui-desc');
  const stopTitle = document.getElementById('stop-title');
  const stopAddress = document.getElementById('stop-address');
  const stopMapLink = document.getElementById('stop-map-link');
  const timelineHeading = document.getElementById('timeline-heading');
  const peopleHeading = document.getElementById('people-heading');

  if (uiTitle) uiTitle.textContent = u.title;
  if (uiDesc) uiDesc.textContent = u.desc;
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

  if (progressFill) progressFill.style.width = pct + '%';
  if (progressText) progressText.textContent = `${u.stopWord} ${currentStop} ${u.ofWord} ${totalStops} • ${d.title}`;

  // Timeline
  const tlContainer = document.getElementById('timeline-list');
  if (tlContainer) {
    tlContainer.innerHTML = d.timeline.map(item => `
      <li><span class="t-yr">${item.y}:</span> ${item.t}</li>
    `).join('');
  }

  // Notable Figures
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

  // Story Content
  const storyContainer = document.getElementById('story-content');
  if (storyContainer) {
    storyContainer.innerHTML = d.stories.map(story => `
      <h3 class="story-heading">${story.h}</h3>
      <p>${story.p}</p>
    `).join('');
  }

  // Callouts
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

  // Pill Scroller
  const pillNav = document.getElementById('pill-nav');
  if (pillNav) {
    pillNav.innerHTML = tourData.stops.map((st, idx) => `
      <button type="button" class="pill-btn ${idx + 1 === currentStop ? 'active' : ''}" onclick="goToStop(${idx + 1})">
        ${st[currentLang].short}
      </button>
    `).join('');

    const activePill = pillNav.querySelector('.pill-btn.active');
    if (activePill) {
      activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  // Promo Banner
  const promoTitle = document.getElementById('promo-title');
  const promoDesc = document.getElementById('promo-desc');
  const promoBtn = document.getElementById('promo-btn');

  if (promoTitle) promoTitle.textContent = u.promoHead;
  if (promoDesc) promoDesc.textContent = u.promoText;
  if (promoBtn) {
    promoBtn.href = u.promoLink;
    promoBtn.textContent = u.promoBtnText;
  }

  updateMapPosition();

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

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && currentStop < totalStops) {
    changeStop(1);
  } else if (e.key === 'ArrowLeft' && currentStop > 1) {
    changeStop(-1);
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTourMap();
    renderView(false);
  });
} else {
  initTourMap();
  renderView(false);
}
