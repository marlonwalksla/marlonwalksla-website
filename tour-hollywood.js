/* ==========================================================================
   tour-hollywood.js - MarlonWalksLA Hollywood Interactive Walking Tour
   Repository: marlonwalksla/marlonwalksla-website
   ========================================================================== */

let currentLang = 'en';
let currentStop = 1;
const totalStops = 12;

const tourData = {
  ui: {
    en: {
      title: "Hollywood Stars & Scandals Self-Guided Tour",
      desc: "Explore 100+ years of cinema history, iconic movie palaces, studio rebellions, and forgotten true crime lore.",
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
      completeWord: "Completado",
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
    // STOP 1: Dolby Theatre
    {
      id: 1,
      mapUrl: "https://maps.google.com/?q=Dolby+Theatre+Hollywood",
      en: {
        title: "Dolby Theatre & Ovation Hollywood",
        address: "6801 Hollywood Blvd, Los Angeles, CA 90028",
        short: "1. Dolby Theatre",
        timeline: [
          { y: "2001", t: "The complex opens as the Kodak Theatre, designed specifically for the Academy Awards." },
          { y: "2002", t: "The Oscars are hosted here for the first time, establishing a permanent home for the ceremony." },
          { y: "2012", t: "Kodak files for bankruptcy; Dolby Laboratories acquires the naming rights." }
        ],
        people: [
          { name: "David Rockwell", role: "Lead Architect", bio: "Theatrical architect who designed the venue to look beautiful on television broadcasts while ensuring optimal camera angles and acoustics." },
          { name: "Sid Ganis", role: "Former Academy President", bio: "Instrumental in cementing the theater as the permanent home of the Oscars, ending decades of the ceremony bouncing between different venues." }
        ],
        stories: [
          { 
            h: "The Permanent Home of the Oscars", 
            p: "Welcome to Hollywood Boulevard. Stand beneath the towering multi-story Babylon archway inside the central courtyard of Ovation Hollywood. Since 2002, this 3,400-seat theater has served as the permanent, custom-engineered home of the Academy Awards. Before this, the Oscars bounced between hotels and various theaters across Los Angeles." 
          },
          { 
            h: "Engineering for the Broadcast", 
            p: "Unlike traditional theaters, the Dolby Theatre was designed specifically for live television. Architect David Rockwell ensured that the orchestra seating has an unusually steep rake so cameras can clearly see the faces of the nominees without obstruction. The theater also features a massive hidden cable network built directly into the walls to support hundreds of international broadcasting crews." 
          },
          { 
            h: "The Walk of Winners", 
            p: "As you walk into the main entrance lobby leading to the theater doors, look at the illuminated art-glass columns lining the grand staircase. Each column is etched with the name of every single film that has won Best Picture, from <em>Wings</em> in 1927 to the present day. If you look closely, you will see blank spaces left intentionally open for future winners decades down the road." 
          },
          { 
            h: "The Red Carpet Transformation", 
            p: "When the Oscars take place each spring, this entire boulevard is shut down. The mundane concrete sidewalk is draped in hundreds of feet of red carpet, a massive protective tent is erected over the street to prevent rain from ruining designer gowns, and international media networks take over the adjacent storefronts." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "📸 The Hollywood Sign View", d: "Take the outdoor escalator up to the 3rd-floor pedestrian bridge. Look straight through the open archway to capture a framed postcard shot of the Hollywood Sign up on Mount Lee." }
        ]
      },
      es: {
        title: "Teatro Dolby y Ovation Hollywood",
        address: "6801 Hollywood Blvd, Los Angeles, CA 90028",
        short: "1. Teatro Dolby",
        timeline: [
          { y: "2001", t: "El complejo se inaugura como el Teatro Kodak, diseñado para los Premios de la Academia." },
          { y: "2002", t: "Los Óscar se celebran aquí por primera vez, estableciendo su sede permanente." },
          { y: "2012", t: "Kodak se declara en bancarrota; Dolby Laboratories adquiere los derechos del nombre." }
        ],
        people: [
          { name: "David Rockwell", role: "Arquitecto Principal", bio: "Arquitecto teatral que diseñó el recinto para lucir espectacular en televisión y garantizar ángulos de cámara perfectos." },
          { name: "Sid Ganis", role: "Expresidente de la Academia", bio: "Figura clave para establecer este teatro como la sede definitiva de los Óscar, terminando con décadas de mudanzas." }
        ],
        stories: [
          { 
            h: "El Hogar Definitivo de los Óscar", 
            p: "Bienvenidos a Hollywood Boulevard. Párate bajo el imponente arco de estilo babilónico en el patio central de Ovation Hollywood. Desde 2002, este teatro de 3,400 butacas ha sido la sede permanente de los Premios de la Academia. Antes de su construcción, la ceremonia rebotaba entre hoteles y auditorios por toda la ciudad." 
          },
          { 
            h: "Diseñado para la Televisión", 
            p: "A diferencia de un teatro tradicional, el Teatro Dolby fue construido específicamente para transmisiones en vivo. El arquitecto David Rockwell le dio a la platea una inclinación inusual para que las cámaras puedan captar las reacciones de los nominados sin obstrucciones. Además, cuenta con una red subterránea de cables para conectar a las televisoras globales." 
          },
          { 
            h: "El Paseo de los Ganadores", 
            p: "Al caminar hacia las puertas del teatro, observa las columnas de vidrio iluminadas en la gran escalera. Cada columna lleva grabado el título de la película ganadora a Mejor Película desde <em>Wings</em> en 1927 hasta la actualidad. Si miras con atención, verás espacios en blanco reservados para los futuros ganadores de las próximas décadas." 
          },
          { 
            h: "La Transformación de la Alfombra Roja", 
            p: "Cada primavera, durante los Óscar, este bulevar se cierra por completo. La acera de concreto se cubre con cientos de metros de alfombra roja, se levanta una enorme carpa protectora para evitar que la lluvia arruine los vestidos de diseñador, y la prensa internacional toma el control de la zona." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "📸 El Mirador del Hollywood Sign", d: "Sube por las escaleras mecánicas hasta el puente peatonal del tercer piso. Desde allí tendrás una vista enmarcada perfecta del famoso letrero de Hollywood en la montaña." }
        ]
      }
    },

    // STOP 2: TCL Chinese Theatre
    {
      id: 2,
      mapUrl: "https://maps.google.com/?q=TCL+Chinese+Theatre",
      en: {
        title: "TCL Chinese Theatre & Forecourt",
        address: "6925 Hollywood Blvd",
        short: "2. Chinese Theatre",
        timeline: [
          { y: "1927", t: "Showman Sid Grauman opens the theater with the premiere of Cecil B. DeMille's The King of Kings." },
          { y: "1944", t: "Hosts the Academy Awards for the first time, continuing until 1946." },
          { y: "1968", t: "Designated a historic-cultural monument." },
          { y: "2013", t: "Undergoes a massive renovation to install one of the largest IMAX screens in the world." }
        ],
        people: [
          { name: "Sid Grauman", role: "Master Showman", bio: "Legendary theater impresario who moved from DTLA to Hollywood to build exotic, immersive movie palaces." },
          { name: "Norma Talmadge", role: "Silent Film Star", bio: "Hollywood legend whose accidental step into wet cement during construction allegedly inspired the famous footprint tradition." },
          { name: "Raymond M. Kennedy", role: "Lead Architect", bio: "Designed the dramatic 90-foot pagoda roof and the exotic imported stone masonry of the forecourt." }
        ],
        stories: [
          { 
            h: "The Golden Age Vault", 
            p: "Step down into the concrete forecourt of the most famous cinema palace in history. Following his massive success with the Million Dollar Theater in DTLA, showman Sid Grauman moved west to Hollywood. In 1927, he opened this spectacular venue to transport moviegoers into an exotic fantasy before the film even began." 
          },
          { 
            h: "Pagodas & Heaven Dogs", 
            p: "Look up at the dramatic 90-foot bronze pagoda roof. The architecture was designed by Raymond M. Kennedy, who secured permission from the US government to import authentic temple bells, pagodas, and stone artifacts directly from China. Flanking the main entrance are two authentic 15th-century stone Heaven Dogs, brought over to ward off evil spirits." 
          },
          { 
            h: "The Accidental Footprint Tradition", 
            p: "Look down at the concrete under your feet. The tradition of celebrity handprints didn't start in a boardroom—it started by accident. During construction in 1927, silent screen star Norma Talmadge accidentally stepped into a patch of wet cement. Grauman saw the crowd's fascinated reaction and immediately realized he could turn the mishap into cinema's permanent autograph book." 
          },
          { 
            h: "Rules of the Forecourt", 
            p: "Unlike the Walk of Fame stars on the sidewalk, getting your hands in the cement here is strictly by invitation only. There are fewer than 300 imprints in the entire forecourt. When space runs out, the theater occasionally removes older, less famous blocks and places them in storage to make room for modern blockbusters." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Forecourt Scavenger Hunt", d: "• <strong>Marilyn Monroe:</strong> Look closely at the dot over the letter 'i'—she pressed a real rhinestone into the concrete.<br>• <strong>Groucho Marx:</strong> Find where he pressed his iconic cigar into the cement.<br>• <strong>Harry Potter:</strong> Find the footprints and wand imprints of the trio (Radcliffe, Watson, Grint)." }
        ]
      },
      es: {
        title: "TCL Chinese Theatre",
        address: "6925 Hollywood Blvd",
        short: "2. Teatro Chino",
        timeline: [
          { y: "1927", t: "Sid Grauman inaugura el teatro con el estreno de El Rey de Reyes de Cecil B. DeMille." },
          { y: "1944", t: "Sede de los Premios Óscar por primera vez, albergándolos hasta 1946." },
          { y: "1968", t: "Declarado monumento histórico-cultural." },
          { y: "2013", t: "Remodelación masiva para instalar una de las pantallas IMAX más grandes del mundo." }
        ],
        people: [
          { name: "Sid Grauman", role: "Empresario Teatral", bio: "Legendario productor que se mudó del centro de LA a Hollywood para construir palacios de cine exóticos e inmersivos." },
          { name: "Norma Talmadge", role: "Estrella del Cine Mudo", bio: "Actriz cuya pisada accidental en cemento fresco inspiró la famosa tradición de las huellas de Hollywood." },
          { name: "Raymond M. Kennedy", role: "Arquitecto", bio: "Diseñó el espectacular techo de pagoda de 90 pies y gestionó la importación de piezas históricas chinas." }
        ],
        stories: [
          { 
            h: "La Bóveda de la Edad de Oro", 
            p: "Entra al patio de concreto del palacio de cine más famoso de la historia. Tras su éxito con el Teatro Million Dollar en DTLA, el empresario Sid Grauman se trasladó a Hollywood. En 1927, inauguró este espectacular recinto diseñado para transportar a los espectadores a una fantasía exótica antes de que la película comenzara." 
          },
          { 
            h: "Pagodas y Perros del Cielo", 
            p: "Mira hacia arriba al dramático techo de pagoda de bronce de 90 pies. El arquitecto Raymond M. Kennedy obtuvo permisos del gobierno para importar campanas de templos y artefactos de piedra directamente de China. En la entrada principal montan guardia dos Perros del Cielo (Leones de Fu) auténticos del siglo XV, traídos para alejar a los malos espíritus." 
          },
          { 
            h: "La Tradición Accidental de las Huellas", 
            p: "Mira el suelo bajo tus pies. La tradición de imprimir las manos no fue planeada. Durante la construcción en 1927, la estrella del cine mudo Norma Talmadge pisó accidentalmente cemento fresco. Grauman notó la fascinación del público y decidió convertir ese error en el álbum de autógrafos más duradero del cine." 
          },
          { 
            h: "Las Reglas del Patio", 
            p: "A diferencia de las estrellas en las aceras, poner tus manos en este cemento es estrictamente por invitación. Hay menos de 300 bloques en todo el patio. Cuando el espacio se agota, el teatro retira los bloques más antiguos y los guarda en bodegas para hacer espacio a las nuevas estrellas." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Búsqueda del Tesoro", d: "• <strong>Marilyn Monroe:</strong> Mira el punto sobre la letra 'i', allí incrustó un diamante de imitación.<br>• <strong>Groucho Marx:</strong> Busca la marca donde hundió su famoso puro.<br>• <strong>Harry Potter:</strong> Encuentra las huellas y varitas mágicas del trío protagonista." }
        ]
      }
    },

    // STOP 3: Hollywood Roosevelt
    {
      id: 3,
      mapUrl: "https://maps.google.com/?q=Hollywood+Roosevelt+Hotel",
      en: {
        title: "The Hollywood Roosevelt Hotel",
        address: "7000 Hollywood Blvd (Cross the street)",
        short: "3. The Roosevelt",
        timeline: [
          { y: "1927", t: "Opens its doors, financed by a syndicate of Hollywood royalty." },
          { y: "1929", t: "Hosts the very first Academy Awards in the Blossom Room." },
          { y: "1988", t: "David Hockney paints his million-dollar mural on the bottom of the Tropicana Pool." }
        ],
        people: [
          { name: "Douglas Fairbanks & Mary Pickford", role: "Founders & Investors", bio: "Silent film royalty who pooled their massive wealth with Louis B. Mayer to build a luxury hotel fit for their celebrity peers." },
          { name: "Marilyn Monroe", role: "Iconic Resident", bio: "Lived in a 2nd-floor cabana room for two years at the start of her modeling career, shooting her very first commercial print ads on the pool diving board." },
          { name: "David Hockney", role: "Contemporary Artist", bio: "Legendary British painter who spent an afternoon painting a sweeping blue mural directly onto the bottom of the hotel's empty swimming pool." }
        ],
        stories: [
          { 
            h: "The Celebrity Syndicate", 
            p: "Step inside the grand Spanish Colonial lobby of the Hollywood Roosevelt Hotel. Opened in 1927, this luxury hotel wasn't built by a traditional real estate firm. It was financed by a syndicate of Hollywood royalty: Douglas Fairbanks, Mary Pickford, and studio boss Louis B. Mayer. They wanted a glamorous playground exclusively for the film industry." 
          },
          { 
            h: "The 15-Minute Oscars", 
            p: "Walk up the mezzanine stairs toward the Blossom Room. On May 16, 1929, the very first Academy Awards ceremony was held right here as a private industry banquet. The atmosphere was radically different from today: there were only 270 guests, tickets cost just $5, and the winners had already been announced in the newspapers three months earlier. The entire awards presentation lasted a mere 15 minutes." 
          },
          { 
            h: "Marilyn Monroe's Launchpad", 
            p: "The Roosevelt is deeply tied to Marilyn Monroe's legacy. Before she was a global icon, Norma Jeane Mortenson lived here in a second-floor cabana room for two years. She shot her very first commercial magazine ad—an ad for suntan lotion—posing on the diving board of the hotel's Tropicana Pool." 
          },
          { 
            h: "The Haunted Corridors", 
            p: "With so much history, the Roosevelt is famous for its paranormal lore. Guests and staff have reported seeing the ghost of Montgomery Clift pacing the 9th floor, and many claim to have seen Marilyn Monroe's reflection in a full-length vintage mirror that once stood in her suite." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "The Million-Dollar Pool", d: "Walk out back to the Tropicana Pool courtyard. Look down into the water to see the sweeping blue crescent mural painted directly on the pool floor by legendary artist David Hockney in 1988." }
        ]
      },
      es: {
        title: "Hotel Hollywood Roosevelt",
        address: "7000 Hollywood Blvd (Cruza la calle)",
        short: "3. The Roosevelt",
        timeline: [
          { y: "1927", t: "Abre sus puertas, financiado por un grupo de superestrellas de Hollywood." },
          { y: "1929", t: "Sede de la primera entrega de los Premios Óscar en el Blossom Room." },
          { y: "1988", t: "David Hockney pinta su mural de un millón de dólares en el fondo de la piscina." }
        ],
        people: [
          { name: "Douglas Fairbanks y Mary Pickford", role: "Fundadores e Inversores", bio: "Realeza del cine mudo que unió su fortuna con Louis B. Mayer para construir un hotel de lujo digno de la élite de Hollywood." },
          { name: "Marilyn Monroe", role: "Residente Histórica", bio: "Vivió en una cabaña del segundo piso durante dos años al inicio de su carrera, realizando su primera sesión de fotos en el trampolín de la piscina." },
          { name: "David Hockney", role: "Artista Contemporáneo", bio: "Pintor británico que decoró el fondo de la piscina vacía con un icónico diseño de medialunas azules valuado en millones." }
        ],
        stories: [
          { 
            h: "El Sindicato de las Estrellas", 
            p: "Entra al majestuoso vestíbulo de estilo colonial español. Inaugurado en 1927, este hotel no fue construido por una inmobiliaria tradicional, sino financiado por la realeza de Hollywood: Douglas Fairbanks, Mary Pickford y el jefe de estudio Louis B. Mayer. Querían un patio de juegos glamuroso exclusivamente para la élite del cine." 
          },
          { 
            h: "Los Óscar de 15 Minutos", 
            p: "Sube las escaleras hacia el Blossom Room. El 16 de mayo de 1929, la primera ceremonia de los Premios de la Academia se celebró aquí como un banquete privado. El ambiente era muy distinto al actual: solo asistieron 270 invitados, el boleto costaba $5 dólares, y los ganadores ya habían sido publicados en los periódicos meses antes. La entrega de premios duró apenas 15 minutos." 
          },
          { 
            h: "El Despegue de Marilyn Monroe", 
            p: "El Roosevelt está ligado al legado de Marilyn. Antes de ser un ícono global, Norma Jeane Mortenson vivió aquí en una cabaña junto a la piscina durante dos años. Su primera sesión de fotos comercial (para un anuncio de bronceador) se realizó posando en el trampolín del hotel." 
          },
          { 
            h: "Pasillos Embrujados", 
            p: "Con tanta historia, el Roosevelt es famoso por sus leyendas paranormales. Huéspedes y empleados afirman haber visto el fantasma del actor Montgomery Clift en el noveno piso, y muchos aseguran haber visto el reflejo de Marilyn Monroe en un espejo antiguo que pertenecía a su suite." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "La Piscina del Millón de Dólares", d: "Camina hacia el patio trasero de la piscina Tropicana. Mira el fondo del agua para ver el mural de medialunas pintado directamente sobre el concreto por el famoso artista David Hockney en 1988." }
        ]
      }
    },

    // STOP 4: Egyptian Theatre
    {
      id: 4,
      mapUrl: "https://maps.google.com/?q=Egyptian+Theatre+Hollywood",
      en: {
        title: "The Egyptian Theatre",
        address: "6712 Hollywood Blvd",
        short: "4. Egyptian Theatre",
        timeline: [
          { y: "1922", t: "Opens its doors, capitalizing on global Egyptomania." },
          { y: "1922", t: "Hosts the premiere of Robin Hood, inventing the Hollywood red carpet." },
          { y: "1998", t: "Purchased and restored by the American Cinematheque." },
          { y: "2023", t: "Netflix completes a multi-million dollar architectural restoration." }
        ],
        people: [
          { name: "Sid Grauman", role: "Master Showman", bio: "The pioneer who conceptualized the theater's exotic design and invented the modern movie premiere." },
          { name: "Douglas Fairbanks", role: "Actor & Producer", bio: "Swashbuckling star of Robin Hood (1922), whose massive premiere here set the template for Hollywood arrivals." },
          { name: "Howard Carter", role: "Archaeologist", bio: "His historic 1922 discovery of King Tutankhamun's tomb in Egypt perfectly coincided with the theater's opening, driving massive ticket sales." }
        ],
        stories: [
          { 
            h: "The Birth of Egyptomania", 
            p: "Five years before he built the Chinese Theatre, Sid Grauman opened the Egyptian Theatre in 1922. The timing was a stroke of marketing genius. That same year, archaeologist Howard Carter discovered the intact tomb of King Tutankhamun in the Valley of the Kings. The world was gripped by 'Egyptomania,' and Grauman capitalized on it by designing a massive open-air forecourt styled like a Pharaoh's temple." 
          },
          { 
            h: "Inventing the Red Carpet", 
            p: "On October 18, 1922, Grauman staged the world’s very first Hollywood movie premiere here for Douglas Fairbanks’ blockbuster <em>Robin Hood</em>. This single event invented the modern cinematic premiere: Grauman utilized sweeping searchlights in the night sky, velvet ropes, screaming fans, and rolled out a massive red carpet for stars to walk down as they exited their luxury roadsters." 
          },
          { 
            h: "The Forecourt Experience", 
            p: "The theater's long, grand courtyard was designed not just for aesthetics, but for crowd control and spectacle. Grauman hired actors dressed as Egyptian guards to pace the roof parapets with spears, and real monkeys and peacocks were kept in the courtyard to entertain guests waiting for the show." 
          },
          { 
            h: "The Netflix Restoration", 
            p: "After decades of neglect, the theater was recently purchased by Netflix in partnership with the American Cinematheque. They completed a staggering multi-million-dollar historical restoration, stripping away 1960s alterations to return the theater to its exact 1922 silent-era glory, complete with intricate hieroglyphic murals and a blazing sunburst ceiling." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "A Real Hollywood Time Machine", d: "Walk all the way down the courtyard to the glass doors. The lobby and auditorium have been perfectly restored to how they looked 100 years ago, operating today as one of the finest classic film revival houses in America." }
        ]
      },
      es: {
        title: "Teatro Egipcio (Egyptian Theatre)",
        address: "6712 Hollywood Blvd",
        short: "4. Teatro Egipcio",
        timeline: [
          { y: "1922", t: "Abre sus puertas aprovechando la 'Egiptomanía' mundial." },
          { y: "1922", t: "Estreno de Robin Hood, donde se inventa la alfombra roja." },
          { y: "1998", t: "Comprado y salvado por la American Cinematheque." },
          { y: "2023", t: "Netflix finaliza una restauración arquitectónica de millones de dólares." }
        ],
        people: [
          { name: "Sid Grauman", role: "Productor", bio: "El genio publicitario que diseñó el teatro y creó el formato moderno de las premieres de Hollywood." },
          { name: "Douglas Fairbanks", role: "Actor", bio: "Estrella de Robin Hood (1922), cuyo espectacular estreno aquí marcó un antes y un después en la industria." },
          { name: "Howard Carter", role: "Arqueólogo", bio: "Su descubrimiento de la tumba de Tutankamón coincidió con la apertura del teatro, disparando la fiebre por la cultura egipcia." }
        ],
        stories: [
          { 
            h: "La Fiebre por Egipto", 
            p: "Cinco años antes de construir el Teatro Chino, Sid Grauman inauguró el Teatro Egipcio en 1922. Fue una jugada de marketing maestra: ese mismo año se descubrió la tumba de Tutankamón. El mundo entero sufría de 'Egiptomanía', y Grauman lo aprovechó diseñando un enorme patio al aire libre con el aspecto del templo de un faraón." 
          },
          { 
            h: "La Invención de la Alfombra Roja", 
            p: "El 18 de octubre de 1922, Grauman organizó aquí la primera gran premiere de Hollywood para la película <em>Robin Hood</em> de Douglas Fairbanks. Este evento inventó el formato moderno de los estrenos: Grauman usó reflectores antiaéreos en el cielo, cuerdas de terciopelo y desplegó una enorme alfombra roja para que las estrellas caminaran al bajar de sus autos." 
          },
          { 
            h: "El Espectáculo del Patio", 
            p: "El largo patio no solo era estético, era un escenario en sí mismo. Grauman contrató actores vestidos como guardias egipcios para patrullar los techos con lanzas, y colocó monos y pavorreales reales para entretener al público mientras esperaba su función." 
          },
          { 
            h: "La Restauración de Netflix", 
            p: "Tras décadas de abandono, el teatro fue comprado por Netflix y la American Cinematheque. Realizaron una restauración histórica impecable, eliminando las modificaciones de los años 60 para devolverle su gloria exacta de 1922, restaurando los jeroglíficos y el impresionante techo solar del auditorio." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Una Máquina del Tiempo", d: "Camina hasta las puertas de cristal del fondo. El vestíbulo ha sido restaurado para verse exactamente igual que hace un siglo, funcionando hoy como uno de los mejores cines de clásicos del país." }
        ]
      }
    },

    // STOP 5: Musso & Frank
    {
      id: 5,
      mapUrl: "https://maps.google.com/?q=Musso+and+Frank+Grill",
      en: {
        title: "The Musso & Frank Grill",
        address: "6667 Hollywood Blvd",
        short: "5. Musso & Frank",
        timeline: [
          { y: "1919", t: "Restaurant opens its doors, predating the Hollywood sign." },
          { y: "1930s", t: "Becomes the literary clubhouse for famous American novelists." },
          { y: "2019", t: "Featured heavily in Quentin Tarantino's Once Upon a Time in Hollywood." }
        ],
        people: [
          { name: "Charlie Chaplin", role: "Cinema Legend", bio: "A daily regular who challenged Douglas Fairbanks to horse races down Hollywood Boulevard and always requested window Booth #1." },
          { name: "F. Scott Fitzgerald & Ernest Hemingway", role: "Literary Giants", bio: "American novelists who were lured to Hollywood to write screenplays and spent their afternoons drinking and editing scripts in the back booths." },
          { name: "Raymond Chandler", role: "Noir Author", bio: "Legendary detective novelist who famously drank gimlets at the mahogany bar while outlining his hardboiled LA crime stories." }
        ],
        stories: [
          { 
            h: "Hollywood's Oldest Living Room", 
            p: "Look across at the red awnings of Musso & Frank Grill. Opened in 1919, this is the oldest restaurant on Hollywood Boulevard. It opened four years before the Hollywood Sign was even built. Walking inside is like stepping onto a 1930s film set, complete with dark mahogany wood, red leather booths, and dim lighting." 
          },
          { 
            h: "The Literary Clubhouse", 
            p: "During the Golden Age of cinema, the major movie studios brought America's greatest novelists to Hollywood to write screenplays. Musso & Frank became their unofficial clubhouse. Legends like F. Scott Fitzgerald, Ernest Hemingway, William Faulkner, and Raymond Chandler drank, ate, and edited manuscripts in the back booths." 
          },
          { 
            h: "Chaplin’s Window Booth", 
            p: "Charlie Chaplin was a daily fixture here. He had his own permanent reserved table by the window (Booth #1). Hollywood Boulevard was still a dirt road at the time, and Chaplin demanded the window booth so he could keep an eye on his horse tied to the hitching post outside." 
          },
          { 
            h: "The Classic Uniforms", 
            p: "The restaurant refuses to modernize its aesthetic. The servers and bartenders still wear traditional red tuxedo coats and bowties. Several waiters have worked here for over 40 years, serving generations of Hollywood royalty from Humphrey Bogart to Brad Pitt." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "The Perfect Martini", d: "They are world-famous for their classic dry gin martinis. The drink is stirred, not shaken, and is always served with a chilled miniature sidecar decanter resting on crushed ice so your refill stays freezing cold." }
        ]
      },
      es: {
        title: "The Musso & Frank Grill",
        address: "6667 Hollywood Blvd",
        short: "5. Musso & Frank",
        timeline: [
          { y: "1919", t: "Abre sus puertas, cuatro años antes de que se instalara el letrero de Hollywood." },
          { y: "Años 30", t: "Se convierte en el punto de reunión de los grandes novelistas americanos." },
          { y: "2019", t: "Es un escenario principal en Había una vez en Hollywood de Tarantino." }
        ],
        people: [
          { name: "Charlie Chaplin", role: "Leyenda del Cine", bio: "Cliente diario que exigía la mesa número 1 junto a la ventana para vigilar a su caballo amarrado afuera." },
          { name: "F. Scott Fitzgerald y Ernest Hemingway", role: "Gigantes Literarios", bio: "Escritores contratados por los estudios que pasaban sus tardes bebiendo y editando guiones en las mesas del fondo." },
          { name: "Raymond Chandler", role: "Autor de Novela Negra", bio: "Novelista que escribía sus famosas historias de detectives mientras bebía en la barra de caoba." }
        ],
        stories: [
          { 
            h: "La Sala de Estar de Hollywood", 
            p: "Observa los toldos rojos del Musso & Frank Grill. Inaugurado en 1919, es el restaurante más antiguo del bulevar. Entrar allí es como pisar un set de los años 30: madera de caoba oscura, asientos de cuero rojo y luz tenue." 
          },
          { 
            h: "El Club de los Escritores", 
            p: "En la Edad de Oro, los estudios trajeron a los mejores novelistas del país para escribir guiones. Musso & Frank se volvió su club privado. Leyendas como F. Scott Fitzgerald, Ernest Hemingway y William Faulkner bebían y editaban sus manuscritos en las mesas del fondo." 
          },
          { 
            h: "La Mesa de Chaplin", 
            p: "Charlie Chaplin comía aquí a diario. Tenía reservada permanentemente la mesa junto a la ventana (Mesa #1). En ese entonces, el bulevar era un camino de tierra y Chaplin quería la ventana para vigilar a su caballo amarrado en la calle." 
          },
          { 
            h: "Uniformes Clásicos", 
            p: "El restaurante se niega a modernizarse. Los meseros siguen vistiendo sus icónicas chaquetas rojas de esmoquin. Varios empleados llevan más de 40 años trabajando ahí, sirviendo desde Humphrey Bogart hasta Brad Pitt." 
          }
        ],
        callouts: [
          { cls: "box-food", t: "El Martini Perfecto", d: "Son mundialmente famosos por su clásico Martini seco. Se sirve revuelto, no agitado, y acompañado de una jarrita de cristal sobre hielo triturado para mantener tu bebida helada." }
        ]
      }
    },

    // STOP 6: You Are the Star Mural
    {
      id: 6,
      mapUrl: "https://maps.google.com/?q=You+Are+The+Star+Mural",
      en: {
        title: "You Are the Star Mural",
        address: "1648 Wilcox Ave (Corner of Hollywood & Wilcox)",
        short: "6. You Are the Star",
        timeline: [
          { y: "1992", t: "Artist Thomas Suriya completes the massive street-level mural." },
          { y: "2016", t: "Featured prominently in the opening sequences of La La Land." }
        ],
        people: [
          { name: "Thomas Suriya", role: "Muralist", bio: "Local artist who conceived the brilliant visual inversion of putting the pedestrian on the silver screen." },
          { name: "James Dean & Marilyn Monroe", role: "Depicted Icons", bio: "Tragic legends of 1950s cinema seated in the front row of the painted audience." },
          { name: "Richard Pryor", role: "Depicted Comedian", bio: "Groundbreaking stand-up comic seated casually among classic Golden Age stars in the mural." }
        ],
        stories: [
          { 
            h: "The Visual Inversion", 
            p: "Turn the corner onto Wilcox Avenue and stand on the sidewalk facing this massive 1992 mural painted by artist Thomas Suriya. The concept here is an ingenious visual inversion: instead of you sitting in a dark theater looking up at a movie screen, the roles are reversed. <strong>You are standing on the stage</strong>, and the greatest legends of cinema are sitting in the theater seats looking back at you." 
          },
          { 
            h: "The Audience of Legends", 
            p: "Look closely at who has come to watch you perform. In the center row, you will find Marilyn Monroe, James Dean, Humphrey Bogart, Charlie Chaplin, and Shirley Temple. Sitting nearby in the audience are comedy legends Richard Pryor and Laurel and Hardy, alongside fictional characters like Frankenstein's monster and R2-D2." 
          },
          { 
            h: "Pop Culture Cameo", 
            p: "Film fans will instantly recognize this mural from the movie <em>La La Land</em> (2016). In the opening act, Sebastian (Ryan Gosling) walks past this illuminated wall on his way into the jazz club where he plays piano." 
          },
          { 
            h: "The Street Art Culture of LA", 
            p: "Los Angeles is the mural capital of the world, a tradition heavily influenced by Mexican muralism and Chicano street art. While Hollywood Boulevard is highly commercialized, side streets like Wilcox preserve this raw, public artistic tradition." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "The Best Photo Angle", d: "Stand right in the middle of the sidewalk and frame the shot so the painted curtains perfectly border your photo, placing you directly in the cinematic spotlight." }
        ]
      },
      es: {
        title: "Mural 'You Are the Star'",
        address: "1648 Wilcox Ave (Esquina de Hollywood y Wilcox)",
        short: "6. You Are the Star",
        timeline: [
          { y: "1992", t: "El artista Thomas Suriya completa este enorme mural a pie de calle." },
          { y: "2016", t: "Aparece de forma destacada en la película La La Land." }
        ],
        people: [
          { name: "Thomas Suriya", role: "Muralista", bio: "Artista que ideó la brillante inversión visual de poner al peatón en la pantalla grande." },
          { name: "James Dean y Marilyn Monroe", role: "Íconos Retratados", bio: "Leyendas trágicas del cine de los 50 sentadas en primera fila de la audiencia pintada." },
          { name: "Richard Pryor", role: "Comediante Retratado", bio: "Revolucionario del stand-up ubicado casualmente junto a monstruos clásicos en el mural." }
        ],
        stories: [
          { 
            h: "La Inversión Visual", 
            p: "Dobla la esquina hacia Wilcox Ave y párate frente a este enorme mural de 1992 pintado por Thomas Suriya. El concepto es una genial inversión de roles: en lugar de estar tú sentado a oscuras mirando una pantalla, <strong>tú estás en el escenario</strong>, y las mayores leyendas del cine están sentadas en las butacas mirándote a ti." 
          },
          { 
            h: "Una Audiencia de Leyenda", 
            p: "Observa bien quién ha venido a verte. En el centro verás a Marilyn Monroe, James Dean, Humphrey Bogart, Charlie Chaplin y Shirley Temple. A su alrededor están Richard Pryor, El Gordo y el Flaco, y personajes de ficción como el monstruo de Frankenstein y R2-D2." 
          },
          { 
            h: "En la Cultura Pop", 
            p: "Si viste <em>La La Land</em> (2016), reconocerás este muro al instante. Sebastian (Ryan Gosling) camina de noche frente a este mural iluminado justo antes de entrar al club de jazz donde toca el piano." 
          },
          { 
            h: "La Capital del Muralismo", 
            p: "Los Ángeles es la capital mundial de los murales, una tradición fuertemente influenciada por el muralismo mexicano. Mientras el bulevar es muy comercial, las calles laterales como Wilcox conservan esta vibrante tradición de arte público." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "El Mejor Ángulo para tu Foto", d: "Párate en medio de la acera y encuadra la toma para que las cortinas rojas pintadas rodeen tu foto, poniéndote a ti en el centro del escenario." }
        ]
      }
    },

    // STOP 7: El Capitan Theatre
    {
      id: 7,
      mapUrl: "https://maps.google.com/?q=El+Capitan+Theatre",
      en: {
        title: "The El Capitan Theatre",
        address: "6838 Hollywood Blvd",
        short: "7. El Capitan",
        timeline: [
          { y: "1926", t: "Opens as a live stage venue, dubbed 'Hollywood's First Home of the Spoken Drama'." },
          { y: "1941", t: "Hosts the defiant world premiere of Orson Welles' masterpiece Citizen Kane." },
          { y: "1989", t: "Disney purchases the theater and begins a massive historical restoration." }
        ],
        people: [
          { name: "Orson Welles", role: "Director & Actor", bio: "Boy genius who directed, co-wrote, and starred in Citizen Kane at age 25, taking on the most powerful media tycoon in America." },
          { name: "William Randolph Hearst", role: "Media Tycoon", bio: "Billionaire newspaper publisher who realized Citizen Kane was an unflattering parody of his life and tried to destroy the film." },
          { name: "Charles Toberman", role: "Real Estate Developer", bio: "Known as the 'Father of Hollywood', he developed El Capitan alongside the Chinese and Egyptian theaters." }
        ],
        stories: [
          { 
            h: "Home of the Spoken Drama", 
            p: "Opened in 1926, El Capitan features an ornate Spanish Colonial exterior designed by G. Albert Lansburgh. Unlike the Egyptian or Chinese theaters down the street, El Capitan was built exclusively for live theater and stage plays, dubbed 'Hollywood’s First Home of the Spoken Drama.'" 
          },
          { 
            h: "The Citizen Kane Rebellion", 
            p: "In 1941, a 25-year-old director named <strong>Orson Welles</strong> made a movie called <em>Citizen Kane</em>. The film was a thinly veiled, highly unflattering parody of the life of billionaire newspaper titan <strong>William Randolph Hearst</strong>. When Hearst found out, he was furious." 
          },
          { 
            h: "Hearst's Blackmail & The Defiant Premiere", 
            p: "Hearst used his massive media empire to threaten major theater chains: if they showed <em>Citizen Kane</em>, he would ban advertisements for all their other movies in his newspapers. Terrified, the major chains refused to screen the film. Defying the ban, the independent El Capitan stepped up and hosted the world premiere on May 1, 1941, securing its place in cinematic rebellion history." 
          },
          { 
            h: "The Disney Era & The Wurlitzer Organ", 
            p: "Today, El Capitan is owned and operated by Disney, which restored the theater to its 1920s glory. Before film screenings, an organist rises from beneath the stage to play a massive, fully restored 2,500-pipe Wurlitzer theater organ." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "The Secret Entrance", d: "Jimmy Kimmel Live! films directly next door in the Masonic Temple building; Kimmel frequently uses the alley between the two buildings for comedy sketches." }
        ]
      },
      es: {
        title: "Teatro El Capitán",
        address: "6838 Hollywood Blvd",
        short: "7. El Capitán",
        timeline: [
          { y: "1926", t: "Abre como teatro en vivo, llamado 'El Primer Hogar del Drama Hablado'." },
          { y: "1941", t: "Sede del desafiante estreno mundial de El Ciudadano Kane de Orson Welles." },
          { y: "1989", t: "Disney adquiere el teatro e inicia su meticulosa restauración." }
        ],
        people: [
          { name: "Orson Welles", role: "Director y Actor", bio: "Genio que a los 25 años dirigió, escribió y protagonizó El Ciudadano Kane, desafiando al magnate más poderoso de EE. UU." },
          { name: "William Randolph Hearst", role: "Magnate de los Medios", bio: "Multimillonario dueño de periódicos que intentó destruir la película al ver que era una dura burla a su propia vida." },
          { name: "Charles Toberman", role: "Desarrollador Urbano", bio: "Conocido como el 'Padre de Hollywood', construyó este teatro junto al Chino y al Egipcio." }
        ],
        stories: [
          { 
            h: "El Hogar del Teatro en Vivo", 
            p: "Inaugurado en 1926, El Capitán destaca por su exterior colonial español. A diferencia de sus teatros hermanos en la misma calle, este recinto no fue hecho para proyectar películas, sino para obras de teatro y espectáculos en vivo, ganando el apodo del 'Primer Hogar del Drama Hablado' en Hollywood." 
          },
          { 
            h: "La Rebelión del Ciudadano Kane", 
            p: "En 1941, un joven director de 25 años llamado <strong>Orson Welles</strong> hizo <em>El Ciudadano Kane</em>. La película era una dura y apenas disimulada burla a la vida del magnate de los periódicos <strong>William Randolph Hearst</strong>. Cuando Hearst se enteró, enfureció." 
          },
          { 
            h: "El Boicot y la Resistencia", 
            p: "Hearst amenazó a las grandes cadenas de cines: si proyectaban la película, prohibiría los anuncios de todos sus otros estrenos en sus periódicos. Aterrorizados, los cines se negaron a pasarla. Desafiando el boicot, El Capitán dio un paso al frente y celebró aquí el estreno mundial el 1 de mayo de 1941." 
          },
          { 
            h: "La Era Disney y el Órgano Wurlitzer", 
            p: "Hoy en día, el teatro es propiedad de Disney. Antes de cada película, un músico emerge desde debajo del escenario tocando un majestuoso órgano Wurlitzer de 2,500 tubos, rescatado y restaurado a su perfección de los años 20." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Grabaciones al Lado", d: "El famoso programa nocturno <em>Jimmy Kimmel Live!</em> se graba en el edificio masónico justo al lado, utilizando frecuentemente este cruce para sus bromas." }
        ]
      }
    },

    // STOP 8: The Pantages Theatre
    {
      id: 8,
      mapUrl: "https://maps.google.com/?q=Pantages+Theatre+Hollywood",
      en: {
        title: "The Pantages Theatre",
        address: "6233 Hollywood Blvd (Near Hollywood & Vine)",
        short: "8. The Pantages",
        timeline: [
          { y: "1930", t: "Opens as the last great movie palace built in Hollywood." },
          { y: "1949", t: "Eccentric billionaire Howard Hughes purchases the theater." },
          { y: "1953", t: "Hosts the first-ever televised Academy Awards broadcast." }
        ],
        people: [
          { name: "Alexander Pantages", role: "Vaudeville Mogul", bio: "Greek immigrant who built a massive theater empire across America, opening this flagship venue at the height of his power." },
          { name: "Howard Hughes", role: "Aviation & Film Billionaire", bio: "Eccentric tycoon who bought the theater, set up his personal apartment and offices on the second floor, and managed his movie empire from here." },
          { name: "B. Marcus Priteca", role: "Master Architect", bio: "Designed the stunning Zigzag Art Deco interior, utilizing geometric frosted glass, gold leaf, and dramatic sunburst chandeliers." }
        ],
        stories: [
          { 
            h: "The Last Grand Movie Palace", 
            p: "As you approach the famous intersection of Hollywood and Vine, you'll find the Pantages Theatre. Built in 1930 by vaudeville magnate Alexander Pantages, it holds the distinction of being the absolute last grand movie palace erected in Hollywood during the Golden Age." 
          },
          { 
            h: "Art Deco Perfection", 
            p: "The interior is a breathtaking Zigzag Art Deco masterpiece designed by architect B. Marcus Priteca. The lobby features vaulted ceilings, geometric frosted glass, and dramatic gold-leaf sunburst chandeliers that define the excess of 1930s architectural design." 
          },
          { 
            h: "Howard Hughes' Secret Headquarters", 
            p: "In 1949, the eccentric aviation billionaire and film producer <strong>Howard Hughes</strong> purchased the theater. He was notoriously reclusive, moving his personal executive offices and a private apartment into the second floor of the building so he could control his film empire away from the public eye." 
          },
          { 
            h: "The First Televised Oscars", 
            p: "The Pantages hosted the Academy Awards ceremonies from 1950 to 1960. On March 19, 1953, the theater made broadcast history as the venue for the <strong>very first televised Oscar ceremony</strong>. An estimated 40 million Americans tuned in on their black-and-white television sets to watch the glamour of Hollywood beamed live into their living rooms." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Broadway in LA", d: "Today, the Pantages is Los Angeles's premier venue for live Broadway musicals, hosting the massive touring productions of <em>Hamilton</em>, <em>Wicked</em>, and <em>The Lion King</em>." }
        ]
      },
      es: {
        title: "Teatro Pantages",
        address: "6233 Hollywood Blvd (Cerca de Hollywood y Vine)",
        short: "8. El Pantages",
        timeline: [
          { y: "1930", t: "Se inaugura como el último gran palacio de cine de Hollywood." },
          { y: "1949", t: "El excéntrico multimillonario Howard Hughes compra el teatro." },
          { y: "1953", t: "Alberga la primera transmisión televisada de los Premios Óscar." }
        ],
        people: [
          { name: "Alexander Pantages", role: "Magnate del Vodevil", bio: "Inmigrante griego que construyó un imperio de teatros por todo EE. UU., siendo este su corona." },
          { name: "Howard Hughes", role: "Multimillonario y Aviador", bio: "Excéntrico productor que compró el edificio e instaló su departamento privado y oficinas en el segundo piso." },
          { name: "B. Marcus Priteca", role: "Arquitecto Principal", bio: "Diseñó el impresionante interior Art Déco, lleno de geometría, pan de oro y espectaculares candelabros." }
        ],
        stories: [
          { 
            h: "El Último Palacio del Cine", 
            p: "Cerca de la intersección de Hollywood y Vine se alza el Pantages. Construido en 1930, tiene el honor de ser el último gran palacio de cine levantado en Hollywood durante la Edad de Oro." 
          },
          { 
            h: "Perfección Art Déco", 
            p: "Su interior es una joya absoluta del estilo Art Déco Zigzag. El vestíbulo cuenta con techos abovedados, vidrio esmerilado geométrico y deslumbrantes candelabros dorados que capturan la extravagancia visual de los años 30." 
          },
          { 
            h: "La Guarida de Howard Hughes", 
            p: "En 1949, el excéntrico multimillonario <strong>Howard Hughes</strong> compró el teatro. Buscando privacidad, instaló sus oficinas ejecutivas y un departamento secreto en el segundo piso, manejando sus negocios cinematográficos lejos de los reflectores." 
          },
          { 
            h: "Los Primeros Óscar por Televisión", 
            p: "El Pantages fue sede de los Óscar de 1950 a 1960. El 19 de marzo de 1953, hizo historia al albergar la <strong>primera transmisión televisada</strong> de los premios. Cuarenta millones de estadounidenses encendieron sus televisores en blanco y negro para ver el glamour de Hollywood en vivo." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "El Broadway de Los Ángeles", d: "Hoy en día, el Pantages es la casa de los grandes musicales de Broadway en gira, como <em>El Rey León</em>, <em>Wicked</em> y <em>Hamilton</em>." }
        ]
      }
    },

    // STOP 9: Capitol Records
    {
      id: 9,
      mapUrl: "https://maps.google.com/?q=Capitol+Records+Building",
      en: {
        title: "The Capitol Records Tower",
        address: "1750 Vine St (Walk one block north of Hollywood Blvd)",
        short: "9. Capitol Records",
        timeline: [
          { y: "1956", t: "Completed as the world's first circular office building." },
          { y: "1990s", t: "The subterranean echo chambers are restored by Les Paul." },
          { y: "2006", t: "Declared a Los Angeles Historic-Cultural Monument." }
        ],
        people: [
          { name: "Welton Becket", role: "Architect", bio: "Master of mid-century Googie architecture who designed the building to resemble a stack of vinyl records." },
          { name: "Frank Sinatra & Nat King Cole", role: "Music Icons", bio: "Legendary crooners who recorded their greatest hits in the subterranean studios beneath the tower." },
          { name: "Les Paul", role: "Guitarist & Audio Engineer", bio: "Audio pioneer who helped design the acoustic echo chambers buried 30 feet underground to create natural reverb." }
        ],
        stories: [
          { 
            h: "The Turntable Architecture", 
            p: "Look north up Vine Street at the world’s first circular office building. Designed in 1956 by architect Welton Becket, the 13-story tower is a masterpiece of mid-century 'Googie' architecture. It was deliberately designed to look like a stack of 45-RPM vinyl records resting on a turntable, topped with a 90-foot aluminum stylus." 
          },
          { 
            h: "The Blinking Beacon", 
            p: "Look closely at the red beacon light blinking at the very top of the spire. Since opening day in 1956, that light has continuously blinked out the word <strong>H-O-L-L-Y-W-O-O-D</strong> in Morse code, day and night." 
          },
          { 
            h: "Subterranean Echo Chambers", 
            p: "The true magic happens 30 feet below the parking lot. Guitar pioneer Les Paul designed eight trapezoidal acoustic echo chambers buried underground. Sound engineers pump music down into these concrete bunkers, record the natural reverberation, and mix it back into the track to create Capitol's signature rich sound." 
          },
          { 
            h: "The Hit Factory", 
            p: "The studios inside this building are legendary. Frank Sinatra, Nat King Cole, Dean Martin, The Beach Boys, and Paul McCartney all recorded monumental tracks here. The Beatles famously utilized the studios during their American tours." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "The John Lennon Star", d: "Right outside the building on the sidewalk, you'll find the Hollywood Walk of Fame stars for all four members of The Beatles." }
        ]
      },
      es: {
        title: "Torre de Capitol Records",
        address: "1750 Vine St (Camina una cuadra al norte)",
        short: "9. Capitol Records",
        timeline: [
          { y: "1956", t: "Se inaugura como el primer edificio de oficinas circular del mundo." },
          { y: "Años 90", t: "Se restauran las cámaras de eco subterráneas diseñadas por Les Paul." },
          { y: "2006", t: "Declarado Monumento Histórico-Cultural de Los Ángeles." }
        ],
        people: [
          { name: "Welton Becket", role: "Arquitecto", bio: "Maestro de la arquitectura 'Googie' que diseñó la torre para parecer una pila de discos de vinilo." },
          { name: "Frank Sinatra y Nat King Cole", role: "Íconos de la Música", bio: "Leyendas que grabaron sus mayores éxitos en los estudios subterráneos de esta torre." },
          { name: "Les Paul", role: "Ingeniero y Guitarrista", bio: "Pionero del audio que diseñó las cámaras de eco a 9 metros bajo tierra para crear reverberación natural." }
        ],
        stories: [
          { 
            h: "Arquitectura de Tocadiscos", 
            p: "Mira hacia el norte por Vine Street hacia el primer edificio de oficinas circular del mundo. Diseñada en 1956, esta torre de 13 pisos es una joya de la arquitectura retro-futurista. Fue diseñada para parecer una pila de discos de vinilo de 45 RPM en un tocadiscos, coronada por una aguja de aluminio de 90 pies." 
          },
          { 
            h: "El Faro de Código Morse", 
            p: "Fíjate en la luz roja parpadeando en la punta de la aguja. Desde su inauguración en 1956, esa luz parpadea la palabra <strong>H-O-L-L-Y-W-O-O-D</strong> en código Morse de manera ininterrumpida." 
          },
          { 
            h: "Las Cámaras de Eco Subterráneas", 
            p: "La verdadera magia ocurre a 9 metros bajo el estacionamiento. El pionero de la guitarra Les Paul diseñó ocho cámaras de eco de concreto bajo tierra. Los ingenieros envían la música a estos búnkeres para capturar el eco natural y mezclarlo en las canciones, creando el sonido característico de Capitol." 
          },
          { 
            h: "La Fábrica de Éxitos", 
            p: "Los estudios de este edificio son legendarios. Frank Sinatra, Nat King Cole, Dean Martin y los Beach Boys grabaron aquí. Incluso The Beatles utilizaron estas instalaciones durante sus giras estadounidenses." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Las Estrellas de The Beatles", d: "Justo en la acera frente al edificio encontrarás las estrellas del Paseo de la Fama de los cuatro miembros de The Beatles." }
        ]
      }
    },

    // STOP 10: Knickerbocker Hotel
    {
      id: 10,
      mapUrl: "https://maps.google.com/?q=Hollywood+Knickerbocker+Apartments",
      en: {
        title: "The Hollywood Knickerbocker Hotel",
        address: "1714 Ivar Ave",
        short: "10. Knickerbocker Hotel",
        timeline: [
          { y: "1926", t: "Opens as a luxury apartment hotel for the silent film elite." },
          { y: "1936", t: "Bess Houdini holds the final séance to contact Harry Houdini on the roof." },
          { y: "1966", t: "Beloved 'I Love Lucy' actor William Frawley collapses and dies outside." }
        ],
        people: [
          { name: "Bess Houdini", role: "Magician's Widow", bio: "Held 10 annual séances on Halloween night to contact her late husband Harry, culminating in the famous final attempt on this roof." },
          { name: "William Frawley", role: "Actor (Fred Mertz)", bio: "Iconic television star of 'I Love Lucy' who tragically collapsed from a heart attack on the sidewalk outside the hotel." },
          { name: "D.W. Griffith", role: "Silent Film Director", bio: "Pioneering (and controversial) director who lived his final years here and died of a hemorrhage in the lobby." }
        ],
        stories: [
          { 
            h: "A Silent Film Sanctuary", 
            p: "Opened in 1926 as a luxury apartment hotel, the Knickerbocker was the residential hideaway for Hollywood’s earliest elite. Silent-screen icons like Rudolph Valentino, Gloria Swanson, and Mae Murray treated the Renaissance Revival building as a glamorous escape from studio pressures." 
          },
          { 
            h: "The 10th Houdini Séance", 
            p: "This building holds Hollywood's most famous paranormal legend. Escape artist Harry Houdini promised his wife Bess that if there was life after death, he would contact her. For 9 years after his death, Bess held a séance on Halloween night without success." 
          },
          { 
            h: "The Final Attempt", 
            p: "On Halloween night in 1936, Bess held the 10th and final séance on the roof of the Knickerbocker Hotel, accompanied by a heavy storm. When the clock struck midnight and Houdini failed to appear, Bess turned off the spotlight and famously announced: <em>'Houdini did not come through. My last hope is gone. The play is over.'</em>" 
          },
          { 
            h: "Hollywood Tragedies", 
            p: "The hotel is steeped in dark Hollywood history. D.W. Griffith, the pioneering silent film director, dropped dead of a cerebral hemorrhage in the lobby in 1948. In 1966, beloved actor William Frawley (who played Fred Mertz on <em>I Love Lucy</em>) suffered a fatal heart attack and collapsed on the sidewalk right outside the front doors." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Elvis's Secret Stay", d: "Elvis Presley stayed in Room 1016 during the filming of 'Love Me Tender' in 1956, turning the hotel into a mob scene of screaming teenage fans." }
        ]
      },
      es: {
        title: "Hotel Hollywood Knickerbocker",
        address: "1714 Ivar Ave",
        short: "10. Knickerbocker Hotel",
        timeline: [
          { y: "1926", t: "Abre como hotel de apartamentos de lujo para la élite del cine." },
          { y: "1936", t: "Bess Houdini realiza su última sesión espiritista en la azotea." },
          { y: "1966", t: "El actor William Frawley (I Love Lucy) muere en la acera frontal." }
        ],
        people: [
          { name: "Bess Houdini", role: "Viuda del Ilusionista", bio: "Realizó sesiones espiritistas en Halloween durante 10 años para contactar a su esposo Harry, concluyendo en esta azotea." },
          { name: "William Frawley", role: "Actor de TV", bio: "Famoso por su papel de Fred Mertz en 'I Love Lucy', sufrió un infarto fulminante frente a las puertas del hotel." },
          { name: "D.W. Griffith", role: "Director de Cine Mudo", bio: "Pionero director que vivió sus últimos años aquí y falleció por una hemorragia en el vestíbulo." }
        ],
        stories: [
          { 
            h: "El Refugio del Cine Mudo", 
            p: "Inaugurado en 1926, el Knickerbocker fue el escondite residencial de las primeras estrellas de Hollywood. Íconos del cine mudo como Rudolph Valentino y Gloria Swanson utilizaban este lujoso hotel como escape de la presión de los estudios." 
          },
          { 
            h: "La Promesa de Houdini", 
            p: "Este edificio alberga la leyenda paranormal más famosa de Hollywood. El escapista Harry Houdini prometió a su esposa Bess que, si había vida después de la muerte, la contactaría. Durante 9 años tras su muerte, Bess realizó sesiones espiritistas en Halloween sin éxito." 
          },
          { 
            h: "La Sesión Final en la Azotea", 
            p: "En Halloween de 1936, Bess organizó la décima y última sesión en la azotea del Knickerbocker. A la medianoche, al no recibir señal de Houdini, Bess apagó la luz y declaró: <em>'Houdini no apareció. Mi última esperanza se ha ido. La obra ha terminado.'</em>" 
          },
          { 
            h: "Tragedias de Hollywood", 
            p: "El hotel tiene un historial oscuro. El pionero del cine D.W. Griffith murió de una hemorragia en el vestíbulo en 1948. En 1966, el querido actor William Frawley (Fred Mertz en <em>I Love Lucy</em>) sufrió un ataque cardíaco y colapsó en la banqueta frente a la entrada." 
          }
        ],
        callouts: [
          { cls: "box-lore", t: "El Escape de Elvis", d: "Elvis Presley se hospedó en la Habitación 1016 en 1956, atrayendo a cientos de fanáticas que bloquearon las calles aledañas." }
        ]
      }
    },

    // STOP 11: Charlie Chaplin Studios
    {
      id: 11,
      mapUrl: "https://maps.google.com/?q=Jim+Henson+Company+Lot",
      en: {
        title: "Charlie Chaplin Studios / Jim Henson Co.",
        address: "1416 N La Brea Ave",
        short: "11. Chaplin Studios",
        timeline: [
          { y: "1917", t: "Chaplin builds his mock-English Tudor studio in an orange grove." },
          { y: "1919", t: "Chaplin co-founds United Artists to combat studio monopolies." },
          { y: "1985", t: "The historic charity single 'We Are the World' is recorded here." },
          { y: "2000", t: "The Jim Henson Company purchases the lot as its headquarters." }
        ],
        people: [
          { name: "Charlie Chaplin", role: "Actor, Director & Studio Head", bio: "Cinematic genius who built this studio to gain total creative control, shooting masterpieces like The Kid and Modern Times here." },
          { name: "Jim Henson", role: "Creator of the Muppets", bio: "His company bought the historic lot in 2000, honoring Chaplin by placing a statue of Kermit the Frog in Chaplin's Tramp outfit." },
          { name: "Michael Jackson & Quincy Jones", role: "Music Icons", bio: "Gathered 45 of America's biggest music stars in this studio in 1985 to record the charity anthem 'We Are the World'." }
        ],
        stories: [
          { 
            h: "The Tudor Village in the Orange Groves", 
            p: "In 1917, Charlie Chaplin bought five acres of open orange groves on La Brea Avenue to build his own personal film studio. He designed the lot to look like a quaint English Tudor village so it would blend into the residential neighborhood." 
          },
          { 
            h: "The United Artists Rebellion", 
            p: "Tired of meddling studio executives and salary caps, Chaplin co-founded <strong>United Artists in 1919</strong> alongside Mary Pickford, Douglas Fairbanks, and D.W. Griffith. This gave the artists complete financial and creative ownership of their films for the first time in history." 
          },
          { 
            h: "We Are the World", 
            p: "In 1985, the studio (then A&M Studios) made music history. Following the American Music Awards, icons including Michael Jackson, Bruce Springsteen, Bob Dylan, Ray Charles, and Stevie Wonder gathered secretly inside these soundstages to record the historic charity single <em>'We Are the World'</em>." 
          },
          { 
            h: "The Muppet Era", 
            p: "Today, it serves as the headquarters of The Jim Henson Company. To honor the lot's founder, Henson placed an 8-foot statue of <strong>Kermit the Frog</strong> dressed in Chaplin’s iconic 'Little Tramp' suit standing guard atop the main gate." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "The Giant Footprints", d: "Chaplin allegedly poured the concrete for the studio's pathways himself, supposedly leaving his own footprints scattered across the lot." }
        ]
      },
      es: {
        title: "Estudios Charlie Chaplin / Jim Henson Co.",
        address: "1416 N La Brea Ave",
        short: "11. Chaplin Studios",
        timeline: [
          { y: "1917", t: "Chaplin construye su estudio estilo inglés sobre un campo de naranjos." },
          { y: "1919", t: "Cofunda United Artists para combatir el monopolio de los estudios." },
          { y: "1985", t: "Se graba aquí la histórica canción 'We Are the World'." },
          { y: "2000", t: "La Jim Henson Company compra el terreno como su sede principal." }
        ],
        people: [
          { name: "Charlie Chaplin", role: "Actor y Director", bio: "Genio cinematográfico que construyó este estudio para tener control creativo total, filmando joyas como El Chico y Tiempos Modernos." },
          { name: "Jim Henson", role: "Creador de los Muppets", bio: "Su empresa compró el terreno en 2000, honrando a Chaplin al colocar una estatua de la Rana René (Kermit) vestida como el Vagabundo." },
          { name: "Michael Jackson y Lionel Richie", role: "Íconos de la Música", bio: "Reunieron a 45 superestrellas en este estudio en 1985 para grabar el himno benéfico 'We Are the World'." }
        ],
        stories: [
          { 
            h: "La Villa Inglesa entre Naranjos", 
            p: "En 1917, Charlie Chaplin compró cinco acres de campos de naranjos para construir su propio estudio de cine. Lo diseñó para que pareciera una pintoresca villa inglesa estilo Tudor, mezclándose con las casas del vecindario residencial." 
          },
          { 
            h: "La Rebelión de United Artists", 
            p: "Cansado de que los ejecutivos dictaran su trabajo, Chaplin cofundó <strong>United Artists en 1919</strong> junto a Mary Pickford y Douglas Fairbanks. Esto les dio a los artistas control financiero y creativo total sobre sus películas por primera vez." 
          },
          { 
            h: "La Noche de 'We Are the World'", 
            p: "En 1985, el estudio hizo historia en la música. Tras una entrega de premios, íconos como Michael Jackson, Bruce Springsteen, Ray Charles y Bob Dylan se reunieron en secreto en estos foros para grabar el himno benéfico <em>'We Are the World'</em>." 
          },
          { 
            h: "La Era de los Muppets", 
            p: "Hoy en día, es la sede de The Jim Henson Company (creadores de los Muppets). Para honrar a Chaplin, colocaron una estatua de la <strong>Rana René (Kermit)</strong> vistiendo el traje del 'Vagabundo' en lo alto de la puerta principal." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Un Vistazo por la Puerta", d: "Aunque está cerrado al público, desde la acera de La Brea puedes ver perfectamente la cabina de vigilancia original y los estudios de madera." }
        ]
      }
    },

    // STOP 12: Crossroads of the World
    {
      id: 12,
      mapUrl: "https://maps.google.com/?q=Crossroads+of+the+World+Los+Angeles",
      en: {
        title: "Crossroads of the World (Tour Finale)",
        address: "6671 Sunset Blvd",
        short: "12. Crossroads",
        timeline: [
          { y: "1931", t: "Mobster Charles Crawford is murdered in his office on this site." },
          { y: "1936", t: "Crawford's widow builds America's first modern outdoor shopping mall." },
          { y: "1997", t: "Featured as a key backdrop in the neo-noir film L.A. Confidential." }
        ],
        people: [
          { name: "Robert V. Derrah", role: "Architect", bio: "Designed the complex with a central Streamline Moderne ship surrounded by a village of diverse European architectural styles." },
          { name: "Charles Crawford", role: "Crime Boss & Politician", bio: "The 'Wolf of Spring Street' who ran LA's underground vice syndicate before being shot dead in his office right where the mall now stands." },
          { name: "Alfred Hitchcock", role: "Film Director", bio: "Maintained private production offices inside the ship-shaped building during the 1940s and 50s." }
        ],
        stories: [
          { 
            h: "America's First Outdoor Mall", 
            p: "You have reached the final stop of our tour. Built in 1936 by architect Robert V. Derrah, Crossroads of the World is recognized as America’s very first modern open-air shopping mall, designed to let pedestrians wander safely away from traffic." 
          },
          { 
            h: "The Art Deco Ocean Liner", 
            p: "The centerpiece building is designed like a 58-foot Streamline Moderne ocean liner sailing toward Sunset Boulevard, topped with an 8-foot revolving blue neon globe. It is surrounded by European-style cottage boutiques styled after Spanish, French, and English villages." 
          },
          { 
            h: "Mob Lore & Murder", 
            p: "The real estate has a dark past. It was built by the widow of <strong>Charles Crawford</strong>, a notorious speakeasy kingpin and corrupt political boss known as the 'Wolf of Spring Street.' Crawford was shot dead in his office in 1931 during a massive political scandal right on this exact plot of land." 
          },
          { 
            h: "Hitchcock & L.A. Confidential", 
            p: "The mall later transitioned into private creative offices. Master of suspense <strong>Alfred Hitchcock</strong> maintained his production offices here. Its perfectly preserved vintage aesthetic made it the ideal backdrop for modern film noir classics, appearing prominently in <em>L.A. Confidential</em> (1997)." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Sunset Boulevard Wrap-Up", d: "Tour concludes! You are on Sunset Boulevard surrounded by cafes and record shops. Use your map to explore or walk up to Hollywood & Vine for the Metro." }
        ]
      },
      es: {
        title: "Crossroads of the World (Fin del Tour)",
        address: "6671 Sunset Blvd",
        short: "12. Crossroads",
        timeline: [
          { y: "1931", t: "El mafioso Charles Crawford es asesinado en su oficina en este terreno." },
          { y: "1936", t: "Su viuda construye el primer centro comercial al aire libre de EE. UU." },
          { y: "1997", t: "Aparece como escenario clave en la película L.A. Confidential." }
        ],
        people: [
          { name: "Robert V. Derrah", role: "Arquitecto", bio: "Diseñó el complejo con un barco central rodeado de una pintoresca villa de diversos estilos arquitectónicos europeos." },
          { name: "Charles Crawford", role: "Jefe Criminal y Político", bio: "Conocido como 'El Lobo de Spring Street', controló el bajo mundo de LA hasta ser asesinado a tiros en este mismo lugar." },
          { name: "Alfred Hitchcock", role: "Director de Cine", bio: "Mantuvo sus oficinas de producción privadas dentro del edificio con forma de barco durante los años 40." }
        ],
        stories: [
          { 
            h: "El Primer Centro Comercial al Aire Libre", 
            p: "Has llegado a la última parada del tour. Construido en 1936, Crossroads of the World es reconocido como el primer centro comercial moderno al aire libre de Estados Unidos, diseñado para que los peatones pasearan lejos del tráfico." 
          },
          { 
            h: "Un Transatlántico en Sunset Boulevard", 
            p: "El edificio central tiene forma de un transatlántico de estilo Streamline Moderne navegando hacia Sunset Boulevard, coronado por un globo giratorio de neón azul. Está rodeado por tiendas estilo cabaña que imitan villas españolas, francesas e inglesas." 
          },
          { 
            h: "Mafia y Asesinato", 
            p: "El terreno tiene un pasado oscuro. Fue construido por la viuda de <strong>Charles Crawford</strong>, un poderoso jefe de la mafia y líder político corrupto. Crawford fue asesinado a tiros en su oficina en 1931 durante un escándalo político justo en este mismo lote." 
          },
          { 
            h: "Hitchcock y el Cine Negro", 
            p: "Con el tiempo se convirtió en oficinas creativas. El maestro del suspenso <strong>Alfred Hitchcock</strong> tuvo aquí sus oficinas de producción. Su estética vintage perfectamente conservada lo hizo el escenario ideal para clásicos modernos del cine negro como <em>L.A. Confidential</em> (1997)." 
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Fin del Recorrido", d: "¡Felicidades! Estás en Sunset Blvd rodeado de cafés y tiendas. Usa tu mapa para seguir explorando o camina hacia Hollywood y Vine para tomar el Metro." }
        ]
      }
    }
  ]
};

function renderView(shouldScroll = true) {
  const s = tourData.stops[currentStop - 1];
  const d = s[currentLang];
  const u = tourData.ui[currentLang];

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

  const pct = Math.round((currentStop / totalStops) * 100);
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressPercent = document.getElementById('progress-percent');

  if (progressFill) progressFill.style.width = pct + '%';
  if (progressText) progressText.textContent = `${u.stopWord} ${currentStop} ${u.ofWord} ${totalStops} • ${d.title}`;
  if (progressPercent) progressPercent.textContent = `${pct}% ${u.completeWord}`;

  const tlContainer = document.getElementById('timeline-list');
  if (tlContainer) {
    tlContainer.innerHTML = d.timeline.map(item => `
      <li><span class="t-yr">${item.y}:</span> ${item.t}</li>
    `).join('');
  }

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

  const storyContainer = document.getElementById('story-content');
  if (storyContainer) {
    storyContainer.innerHTML = d.stories.map(story => `
      <h3 class="story-heading">${story.h}</h3>
      <p>${story.p}</p>
    `).join('');
  }

  const calloutContainer = document.getElementById('callouts-container');
  if (calloutContainer) {
    calloutContainer.innerHTML = d.callouts.map(c => `
      <div class="callout-box ${c.cls}">
        <strong>${c.t}</strong>
        ${c.d}
      </div>
    `).join('');
  }

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

  const promoTitle = document.getElementById('promo-title');
  const promoDesc = document.getElementById('promo-desc');
  const promoBtn = document.getElementById('promo-btn');

  if (promoTitle) promoTitle.textContent = u.promoHead;
  if (promoDesc) promoDesc.textContent = u.promoText;
  if (promoBtn) {
    promoBtn.href = u.promoLink;
    promoBtn.textContent = u.promoBtnText;
  }

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
  document.addEventListener('DOMContentLoaded', () => renderView(false));
} else {
  renderView(false);
}
