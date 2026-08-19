/* ==========================================================================
   tour-transportation.js - MarlonWalksLA LA Transportation & Mobility Tour
   Repository: marlonwalksla/marlonwalksla-website
   ========================================================================== */

let currentLang = 'en';
let currentStop = 1;
const totalStops = 8;

const tourData = {
  ui: {
    en: {
      title: "From Trails to Freeways: The Story of LA Mobility",
      desc: "Explore 150+ years of transportation history—from Tongva trade paths and transcontinental rail wars to the Red Car conspiracy, the freeway boom, and modern subways.",
      selectorLabel: "Jump to Any Chapter:",
      stopWord: "CHAPTER",
      ofWord: "OF",
      timelineHead: "Chronological Milestones",
      peopleHead: "Notable Figures & Pioneers",
      prevBtn: "← Previous Chapter",
      nextBtn: "Next Chapter: ",
      finishBtn: "Complete History & Book Live Walk",
      mapBtn: "Google Maps",
      promoHead: "Want to Experience Downtown LA With a Local Guide?",
      promoText: "Join Marlon on the top-rated 5-star live walking tour of Downtown Los Angeles! Enjoy interactive trivia, hidden stories, and our local community in person.",
      promoLink: "https://www.freetour.com/los-angeles/free-tour-of-downtown-los-angeles",
      promoBtnText: "Book the Live Free DTLA Tour →"
    },
    es: {
      title: "De Senderos a Autopistas: Historia del Transporte en LA",
      desc: "Explora más de 150 años de movilidad urbana: desde rutas indígenas y guerras ferroviarias hasta la conspiración de los tranvías, el auge de las autopistas y el metro moderno.",
      selectorLabel: "Ir a Cualquier Capítulo:",
      stopWord: "CAPÍTULO",
      ofWord: "DE",
      timelineHead: "Hitos Cronológicos",
      peopleHead: "Personajes Destacados y Pioneros",
      prevBtn: "← Capítulo Anterior",
      nextBtn: "Siguiente: ",
      finishBtn: "Terminar Historia y Reservar",
      mapBtn: "Ver en Google Maps",
      promoHead: "¿Quieres conocer el Centro de LA con un guía local?",
      promoText: "¡Únete a Marlon en el tour a pie calificado con 5 estrellas! Disfruta de historia viva, trivias interactivas y secretos locales en español.",
      promoLink: "https://www.civitatis.com/es/los-angeles/free-tour-los-angeles",
      promoBtnText: "Reservar el Free Tour en Español →"
    }
  },
  stops: [
    // CHAPTER 1: Native Paths to Port San Pedro (Pre-1869)
    {
      id: 1,
      mapUrl: "https://maps.google.com/?q=Port+of+Los+Angeles+San+Pedro",
      en: {
        title: "Native Trails, Hide Ships & Port San Pedro",
        address: "San Pedro Bay & Historic Alameda Trade Corridor",
        short: "1. Ancient Trails to Ports",
        timeline: [
          { y: "Pre-1769", t: "Gabrielino-Tongva establish trade footpaths between inland villages and the Pacific coast." },
          { y: "1830s", t: "San Pedro serves as the rough coastal anchorage for Mexican hide and tallow trading ships." },
          { y: "1869", t: "Phineas Banning opens the Los Angeles & San Pedro Railroad, Southern California's first rail line." },
          { y: "1899", t: "The 'Free Harbor Fight' concludes as San Pedro is selected over Santa Monica as LA's official seaport." }
        ],
        people: [
          { name: "Phineas Banning", role: "Father of the Port of Los Angeles", bio: "Delaware entrepreneur and stagecoach operator who dredged the harbor channels and constructed Southern California's very first commercial railroad in 1869." },
          { name: "Don Manuel Domínguez", role: "Californio Ranchero & Statesman", bio: "Signer of the California Constitution and owner of the vast 75,000-acre Rancho San Pedro, who granted crucial rights-of-way for early stage and rail routes." },
          { name: "Stephen M. White", role: "U.S. Senator ('Harbor Defender')", bio: "Fought Collis Huntington's Southern Pacific Railroad in Congress to ensure San Pedro remained a free, publicly owned deep-water harbor." }
        ],
        stories: [
          {
            h: "Tongva Trade Paths: The Geological Blueprints",
            p: "Long before asphalt or steel rails were laid, the geography of Los Angeles was dictated by nature and its first inhabitants. The Gabrielino-Tongva people developed intricate networks of footpaths that followed riverbeds, natural mountain passes, and flat coastal plains to trade sea salt, abalone shells, and obsidian between inland settlements and coastal villages like <em>Yanga</em> and <em>Suangna</em>. Modern thoroughfares like <strong>Wilshire Boulevard</strong> and the <strong>Arroyo Seco corridor</strong> follow these exact prehistoric foot trails."
          },
          {
            h: "The 'Bay of Smokes' & The Hide-and-Tallow Trade",
            p: "During the Spanish and Mexican eras, the remote outpost of Los Angeles had no natural deep-water harbor. Trading vessels anchored miles offshore in the shallow mudflats of San Pedro, then known as 'The Bay of Smokes' for the brush fires burning along the hills. Heavy wooden <em>carretas</em> (ox carts) made grueling two-day treks through dust and mud, hauling stiff dried cowhides ('California banknotes') and cow tallow down to the shore to trade for manufactured goods with Boston merchant ships."
          },
          {
            h: "Phineas Banning & The First Railroad (1869)",
            p: "Recognizing that Los Angeles would remain an isolated cattle town without rapid ocean access, entrepreneur <strong>Phineas Banning</strong> set out to revolutionize regional shipping. In October 1869, he opened the <strong>Los Angeles & San Pedro Railroad</strong>—a 21-mile line running from Wilmington directly into downtown Los Angeles. The train slashed travel time from an eight-hour bone-jarring stagecoach journey down to just 60 minutes, unleashing downtown's commercial wholesale economy."
          },
          {
            h: "The 'Free Harbor Fight' of the 1890s",
            p: "By the late 19th century, rail baron Collis P. Huntington sought to monopolize all Pacific shipping by building the 'Long Wharf' in Santa Monica. A bitter decade-long political struggle erupted between Huntington’s railroad syndicate and Los Angeles civic leaders led by Senator Stephen M. White. In 1899, the federal government officially selected San Pedro as the site for a taxpayer-funded, breakwater-protected deep-water port, ensuring the waterfront remained open to public commerce."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "America's Busiest Port", d: "Today, the Port of Los Angeles and adjacent Port of Long Beach form the largest port complex in the Western Hemisphere, handling over 30% of all containerized ocean cargo entering the United States." }
        ]
      },
      es: {
        title: "Senderos Indígenas, Pieles y el Puerto de San Pedro",
        address: "Bahía de San Pedro y Corredor Histórico de Alameda",
        short: "1. Senderos y Primer Puerto",
        timeline: [
          { y: "Antes de 1769", t: "Los indígenas Tongva trazan rutas a pie entre aldeas del valle y la costa pacífica." },
          { y: "Años 1830", t: "San Pedro sirve como fondeadero rústico para barcos mercantes de cueros y sebo." },
          { y: "1869", t: "Phineas Banning inaugura el Ferrocarril de LA a San Pedro, el primero del sur de California." },
          { y: "1899", t: "Concluye la 'Guerra del Puerto Libre', designando a San Pedro sobre Santa Mónica como puerto oficial." }
        ],
        people: [
          { name: "Phineas Banning", role: "Padre del Puerto de Los Ángeles", bio: "Empresario que dragó los canales de la bahía y construyó la primera línea de ferrocarril del sur del estado en 1869." },
          { name: "Don Manuel Domínguez", role: "Ranchero y Constituyente", bio: "Firmante de la Constitución estatal y dueño del Rancho San Pedro, quien cedió terrenos para las primeras diligencias y vías." },
          { name: "Stephen M. White", role: "Senador de EE. UU.", bio: "Líder político que venció el monopolio del Southern Pacific en Washington para asegurar un puerto público en San Pedro." }
        ],
        stories: [
          {
            h: "Senderos Tongva: El Trazo Original de la Metrópoli",
            p: "Mucho antes del asfalto y el riel, la movilidad de la cuenca angelina fue marcada por los pueblos originarios. Los Gabrielino-Tongva trazaron una red de veredas sobre lechos de ríos, llanuras y cañones para comerciar sal marina, obsidiana y conchas entre aldeas como <em>Yanga</em> y la costa. Vías fundamentales como <strong>Wilshire Boulevard</strong> y el <strong>corredor del Arroyo Seco</strong> coinciden exactamente con aquellos senderos milenarios."
          },
          {
            h: "La 'Bahía de los Humos' y las Carretas de Sebo",
            p: "En la época virreinal y mexicana, Los Ángeles carecía de un puerto natural de aguas profundas. Los navíos fondeaban a kilómetros de la orilla en los lodazales de San Pedro. Pesadas <em>carretas</em> de bueyes hacían viajes de dos días entre polvo y zanjas transportando cueros secos de res ('billetes de California') y sebo para canjearlos por herramientas y telas con navíos mercantes de Boston."
          },
          {
            h: "Phineas Banning y el Primer Ferrocarril (1869)",
            p: "Comprendiendo que la ciudad moriría aislada sin salida rápida al mar, <strong>Phineas Banning</strong> revolucionó el transporte. En octubre de 1869 inauguró el <strong>Ferrocarril de Los Ángeles y San Pedro</strong>: una línea de 21 millas hasta el centro histórico. El tren redujo un viaje de ocho horas en diligencia a solo 60 minutos, detonando la industria mayorista de la ciudad."
          },
          {
            h: "La 'Guerra del Puerto Libre' de los Años 1890",
            p: "A finales del siglo XIX, el magnate ferroviario Collis Huntington intentó privatizar el comercio marítimo construyendo un muelle en Santa Mónica. Una intensa batalla política enfrentó al monopolio con los líderes cívicos de LA. En 1899, el gobierno federal aprobó fondos para el rompeolas de San Pedro, consagrándolo como un puerto marítimo de acceso público y aguas profundas."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "El Puerto Más Concurrido de América", d: "Hoy en día, el complejo portuario de San Pedro y Long Beach es el más grande del continente americano, recibiendo más del 30% de toda la carga marítima en contenedores que ingresa a Estados Unidos." }
        ]
      }
    },

    // CHAPTER 2: Transcontinental Railroads & The $1 Fare War (1876–1887)
    {
      id: 2,
      mapUrl: "https://maps.google.com/?q=Los+Angeles+State+Historic+Park",
      en: {
        title: "The Iron Horse Invasion & The $1 Fare War",
        address: "Historic River Station Yard (Now LA State Historic Park)",
        short: "2. Transcontinental Boom",
        timeline: [
          { y: "1876", t: "Southern Pacific drives the Golden Spike at Lang Station in Soledad Canyon." },
          { y: "1885", t: "The Santa Fe Railway completes its transcontinental line into Southern California." },
          { y: "1887", t: "Cutthroat rate war slashes train tickets from Chicago to LA to $1 for a single day." },
          { y: "1889", t: "The population explosion forces the split of Orange County from Los Angeles County." }
        ],
        people: [
          { name: "Collis P. Huntington", role: "Southern Pacific Rail Baron", bio: "One of the 'Big Four' industrialists who demanded massive municipal subsidies and land grants under threat of bypassing Los Angeles entirely." },
          { name: "William Barstow Strong", role: "President of the Santa Fe Railway", bio: "Aggressive railroad builder who broke Southern Pacific's regional monopoly by pushing tracks across the Mojave Desert and Cajon Pass into LA." },
          { name: "Harris Newmark", role: "Pioneer Merchant & Civic Leader", bio: "Downtown merchant who rallied local voters to approve rail bond subsidies, preventing Los Angeles from becoming a forgotten agricultural siding." }
        ],
        stories: [
          {
            h: "The Southern Pacific Ultimatum (1876)",
            p: "In the 1870s, the transcontinental railroad transformed the American West, but Los Angeles was initially bypassed by the central overland route through Sacramento. When the <strong>Southern Pacific Railroad</strong> began building south, rail barons demanded a steep ransom: the city had to hand over $600,000 in municipal bonds and surrender ownership of Banning's San Pedro rail line, or the railroad would bypass LA in favor of San Diego. Downtown voters reluctantly approved the measure to secure the city's future."
          },
          {
            h: "The Golden Spike at Lang Station",
            p: "On September 5, 1876, Southern Pacific President Charles Crocker drove a ceremonial golden spike at Lang Station in Soledad Canyon. Over 3,000 Chinese laborers had spent months blasting through solid granite to carve the 6,966-foot San Fernando Tunnel. The completion linked Los Angeles directly to San Francisco and the national railway grid for the first time in history."
          },
          {
            h: "The Santa Fe Breakthrough (1885)",
            p: "For nearly a decade, Southern Pacific exercised a ruthless freight and passenger monopoly, charging exorbitant rates that choked local agriculture. In 1885, the <strong>Atchison, Topeka & Santa Fe Railway</strong> broke through the Cajon Pass, establishing a competing transcontinental terminus at the River Station freight yards north of downtown. The monopoly was shattered, igniting immediate corporate warfare."
          },
          {
            h: "The $1 Fare War & The Great Land Rush",
            p: "In March 1887, both railroads launched a fierce price war to capture prospective settlers. Fares from Kansas City and Chicago to Los Angeles dropped from $125 down to $25, then $5, and briefly to <strong>$1 for a single day</strong>. Train cars overflowed with tens of thousands of homesteaders, health-seekers, and speculators. Over <strong>100,000 settlers arrived in a single year</strong>, triggering the 'Boom of the Eighties' and converting dry scrubland into suburban subdivisions."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Visit the River Station", d: "Walk through modern Los Angeles State Historic Park (just north of Chinatown) to see the footprint of the original 1876 rail depot where thousands of transcontinental passengers first set foot in LA." }
        ]
      },
      es: {
        title: "La Llegada del Tren y la Guerra de Boletos a $1",
        address: "Patio Histórico River Station (Hoy LA State Historic Park)",
        short: "2. Auge Transcontinental",
        timeline: [
          { y: "1876", t: "Southern Pacific clava el clavo de oro en Lang Station conectando a LA con la red nacional." },
          { y: "1885", t: "El Ferrocarril Santa Fe concluye su vía transcontinental hacia el sur de California." },
          { y: "1887", t: "Guerra de tarifas baja el boleto de tren de Chicago a LA a solo $1 por un día." },
          { y: "1889", t: "La explosión demográfica provoca la separación del Condado de Orange." }
        ],
        people: [
          { name: "Collis P. Huntington", role: "Magnate del Southern Pacific", bio: "Uno de los 'Cuatro Grandes' barones del riel que exigió subsidios municipales bajo amenaza de aislar a Los Ángeles." },
          { name: "William Barstow Strong", role: "Presidente de Santa Fe Railway", bio: "Constructor que rompió el monopolio del Southern Pacific tendiendo rieles por el desierto de Mojave y el Cajon Pass." },
          { name: "Harris Newmark", role: "Comerciante y Líder Cívico", bio: "Empresario del centro que convenció a los votantes de financiar el ferrocarril para evitar que LA quedara marginada." }
        ],
        stories: [
          {
            h: "El Ultimátum del Southern Pacific (1876)",
            p: "En la década de 1870, el tren transcontinental transformó el país, pero la ruta original pasó de largo hacia el norte en Sacramento. Cuando el <strong>Southern Pacific</strong> planeó extenderse al sur, sus magnates exigieron un rescate: la ciudad debía entregar $600,000 en bonos y las acciones del tren de San Pedro, o rodearían la ciudad para beneficiar a San Diego. Los votantes angelinos no tuvieron más remedio que aceptar."
          },
          {
            h: "El Clavo de Oro en Soledad Canyon",
            p: "El 5 de septiembre de 1876 se colocó el clavo dorado en Lang Station. Más de 3,000 obreros chinos trabajaron perforando la roca madre para construir el túnel de San Fernando de más de 2 kilómetros. Esta obra conectó por primera vez a Los Ángeles con San Francisco y con todo el sistema ferroviario de la costa este."
          },
          {
            h: "La Ruptura del Monopolio con el Ferrocarril Santa Fe",
            p: "Durante diez años, el Southern Pacific fijó tarifas asfixiantes para las cosechas agrícolas locales. En 1885, el <strong>Ferrocarril Atchison, Topeka & Santa Fe</strong> cruzó las montañas de Cajon Pass y levantó sus talleres en la River Station junto al río. La competencia detonó de inmediato una de las batallas comerciales más feroces de la historia."
          },
          {
            h: "La Guerra de Tarifas a $1 y la Fiebre Inmobiliaria",
            p: "En marzo de 1887, ambas empresas desataron una guerra de precios. Los pasajes desde Chicago a Los Ángeles cayeron de $125 a $25, luego a $5, y por unas horas a <strong>$1 por boleto</strong>. Llegaron más de <strong>100,000 colonos en doce meses</strong>, desatando una fiebre inmobiliaria que multiplicó el valor del suelo y transformó ranchos en nuevos barrios urbanos."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Visita la River Station", d: "Camina por el Parque Histórico Estatal de Los Ángeles (al norte de Chinatown) para pisar el suelo de la antigua estación terminal donde bajaban los primeros viajeros transcontinentales." }
        ]
      }
    },

    // CHAPTER 3: The Electric Streetcar Empire (1901–1930s)
    {
      id: 3,
      mapUrl: "https://maps.google.com/?q=Subway+Terminal+Building+Los+Angeles",
      en: {
        title: "The Electric Streetcar Empire: Red Cars vs. Yellow Cars",
        address: "Subway Terminal Building & 4th/Hill Street",
        short: "3. Streetcar Golden Age",
        timeline: [
          { y: "1901", t: "Henry Huntington incorporates the Pacific Electric Railway ('Red Cars')." },
          { y: "1911", t: "The 'Great Merger' consolidates dozens of independent streetcar lines under Pacific Electric." },
          { y: "1925", t: "The Subway Terminal Building and Belmont Tunnel open to alleviate DTLA traffic jams." },
          { y: "1940s", t: "The combined system operates over 1,100 miles of track carrying 250+ million annual riders." }
        ],
        people: [
          { name: "Henry E. Huntington", role: "Founder of Pacific Electric", bio: "Visionary tycoon who built the world's largest electric interurban railway, using cheap passenger transit to sell suburban real estate subdivisions." },
          { name: "General Moses Sherman", role: "Streetcar Developer", bio: "Pioneered early electric traction lines linking Downtown to Santa Monica and the San Fernando Valley (Sherman Oaks namesake)." },
          { name: "Isaias W. Hellman", role: "Master Financier", bio: "President of Farmers & Merchants Bank who provided the vast syndicated capital required to electrify Southern California's transit network." }
        ],
        stories: [
          {
            h: "The Dual Rail System: Red vs. Yellow",
            p: "By the 1920s, Los Angeles boasted the most advanced, extensive electric mass transit network on earth. The transit network operated on a complementary two-tier model:<br><br>• <strong>The Yellow Cars (Los Angeles Railway):</strong> Narrow-gauge streetcars running down the center of city avenues, handling dense, short-distance trips within Downtown, Boyle Heights, and South LA.<br>• <strong>The Red Cars (Pacific Electric):</strong> Standard-gauge, high-speed interurban trains that connected DTLA to outlying cities across four counties—from San Fernando and Pasadena down to Long Beach and Redlands."
          },
          {
            h: "The Loss-Leader Real Estate Blueprint",
            p: "The genius behind Henry Huntington’s Pacific Electric was an unconventional business model: <strong>the streetcars were built to lose money</strong>. Huntington made his millions not on 5-cent passenger fares, but through the Huntington Land & Improvement Company. His syndicate purchased barren orange groves and desert acreage, extended Red Car electric tracks straight into the dirt, and then sold subdivided suburban house lots at massive profits to new arrivals."
          },
          {
            h: "The 1925 Subway Terminal & Belmont Tunnel",
            p: "As private automobiles crowded Downtown Los Angeles streets in the 1920s, surface streetcars faced paralyzing gridlock. To bypass street-level congestion, Pacific Electric constructed the <strong>Belmont Tunnel</strong> and the monumental 12-story <strong>Subway Terminal Building</strong> at 4th and Hill Streets. Commuters entered underground marble concourses and boarded electric trains that sped through a subterranean tube directly to Glendale and Hollywood."
          },
          {
            h: "Mount Lowe & Transit Tourism",
            p: "The electric railway was also an engine of leisure and tourism. Huntington built scenic mountain routes like the <strong>Mount Lowe Railway</strong> in the San Gabriel Mountains, where vacationers rode electric cars and cable funiculars up sheer granite cliffs to mountaintop resort hotels, dance pavilions, and astronomical observatories overlooking the entire valley."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "The Surviving Subway Terminal", d: "The grand 1925 Subway Terminal Building at 4th & Hill still stands today, beautifully restored as the Metro 417 luxury apartments, resting directly above the historic underground train vaults." }
        ]
      },
      es: {
        title: "El Imperio de los Tranvías: Red Cars y Yellow Cars",
        address: "Edificio Subway Terminal y Calles 4th con Hill",
        short: "3. Era de los Tranvías",
        timeline: [
          { y: "1901", t: "Henry Huntington funda la empresa Pacific Electric Railway ('Red Cars')." },
          { y: "1911", t: "La 'Gran Fusión' unifica decenas de líneas bajo la bandera de Pacific Electric." },
          { y: "1925", t: "Abre el túnel Belmont y la Terminal Subterránea para evitar los trancones del centro." },
          { y: "Años 1940", t: "La red opera más de 1,100 millas de vías moviendo a 250 millones de usuarios al año." }
        ],
        people: [
          { name: "Henry E. Huntington", role: "Fundador de Pacific Electric", bio: "Magnate visionario que construyó la red de tranvías eléctricos más grande del mundo para valorizar sus urbanizaciones." },
          { name: "General Moses Sherman", role: "Pionero de Tranvías", bio: "Tendió las primeras líneas eléctricas hacia Santa Mónica y el Valle de San Fernando (origen de Sherman Oaks)." },
          { name: "Isaias W. Hellman", role: "Banquero y Financiero", bio: "Presidente de Farmers & Merchants Bank que aportó el capital para electrificar el transporte en el sur de California." }
        ],
        stories: [
          {
            h: "Dos Redes en Sintonía: Tranvías Rojos y Amarillos",
            p: "Hacia 1920, Los Ángeles disfrutaba del sistema de transporte eléctrico más moderno y extenso del mundo. Operaba con dos modelos complementarios:<br><br>• <strong>Yellow Cars (Los Angeles Railway):</strong> Tranvías urbanos amarillos que recorrían las calles del centro, Boyle Heights y el sur de la ciudad.<br>• <strong>Red Cars (Pacific Electric):</strong> Trenes interurbanos rojos de alta velocidad que unían el centro con más de 50 ciudades en cuatro condados, desde Pasadena y San Fernando hasta Long Beach."
          },
          {
            h: "El Negocio Inmobiliario de los 'Red Cars'",
            p: "El secreto maestro de Huntington fue que <strong>los tranvías operaban a pérdida intencionalmente</strong>. La verdadera fortuna no venía del pasaje de 5 centavos, sino de su empresa inmobiliaria: compraba campos agrícolas a bajo costo, tendía las vías eléctricas hasta los terrenos y vendía parcelas residenciales con enorme margen de ganancia."
          },
          {
            h: "El Túnel Belmont y la Terminal Subterránea (1925)",
            p: "Al llenarse las calles de automóviles particulares en los años 20, los tranvías comenzaron a quedar atrapados en el tráfico. Para esquivar los atascos, Pacific Electric perforó el <strong>Túnel Belmont</strong> y construyó el imponente <strong>Subway Terminal Building</strong> en 4th y Hill. Los pasajeros descendían a andenes subterráneos de mármol para abordar trenes directos hacia Glendale y Hollywood."
          },
          {
            h: "Turismo en las Vías de Mount Lowe",
            p: "La red también fomentó el turismo recreativo. Crearon excursiones espectaculares como el ferrocarril de <strong>Mount Lowe</strong> en las montañas de San Gabriel, donde los viajeros subían en funiculares y tranvías al borde del abismo hacia hoteles alpinos, miradores y observatorios con vista al océano."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "El Edificio Sigue en Pie", d: "El majestuoso Subway Terminal Building (1925) en 4th y Hill sigue en pie hoy en día, restaurado como edificio residencial sobre las antiguas bóvedas subterráneas." }
        ]
      }
    },

    // CHAPTER 4: The Automobile Capital & Arroyo Seco (1920s–1940s)
    {
      id: 4,
      mapUrl: "https://maps.google.com/?q=Arroyo+Seco+Parkway+Los+Angeles",
      en: {
        title: "The Automobile Takeover & America's First Freeway",
        address: "Arroyo Seco Parkway (CA-110) & Figueroa Corridor",
        short: "4. Car Culture & First Freeway",
        timeline: [
          { y: "1925", t: "LA leads the world in per-capita car ownership (1 car per 3 residents)." },
          { y: "1930s", t: "Drive-in markets, motels, and programmatic architecture sprout across roadside corridors." },
          { y: "1940", t: "The Arroyo Seco Parkway (CA-110) opens between Pasadena and Downtown LA." },
          { y: "1948", t: "Harry and Esther Snyder open California's first drive-thru burger stand with intercoms in Baldwin Park." }
        ],
        people: [
          { name: "Harry & Esther Snyder", role: "In-N-Out Burger Founders", bio: "Pioneered car-culture quick service in 1948 by introducing a revolutionary two-way intercom speaker box, eliminating carhops." },
          { name: "Spencer V. Cortelyou", role: "Chief Highway Engineer", bio: "State highway engineer who designed the Arroyo Seco Parkway, engineering banked curves, grade separations, and paved concrete bypasses." },
          { name: "Wayne McAllister", role: "Googie & Drive-in Architect", bio: "Renowned mid-century architect who designed streamline drive-in restaurants, circular carports, and eye-catching neon roadside diners." }
        ],
        stories: [
          {
            h: "1925: The World’s Car Capital",
            p: "By 1925, Los Angeles owned more automobiles per capita than any place on Earth: <strong>1 car for every 3 residents</strong>, compared to a national average of 1 in 7. Year-round Mediterranean sunshine, flat wide valleys, abundant local petroleum from the 1892 oil strike, and cheap suburban tract housing made the personal motorcar an essential instrument of daily Californian life."
          },
          {
            h: "Arroyo Seco Parkway (1940): America's First Freeway",
            p: "On December 30, 1940, the state opened the six-mile <strong>Arroyo Seco Parkway (now CA-110)</strong> linking Pasadena to DTLA. It was the first fully grade-separated, controlled-access highway in the United States. Engineered with banked asphalt turns, concrete center dividers, and an intended top speed limit of 45 mph, it cut driving time between the two cities from 35 minutes down to just 12."
          },
          {
            h: "Programmatic Architecture & Speed Signage",
            p: "As drivers zipped past storefronts at 40 miles per hour, standard Victorian signs became unreadable. Business owners invented <strong>programmatic (novelty) architecture</strong>: constructing entire buildings shaped like giant hot dogs (<em>Tail o' the Pup</em>), brown derbies (<em>The Brown Derby</em>), tamales, and coffee pots so passing motorists could instantly identify goods from behind the steering wheel."
          },
          {
            h: "The Drive-Thru Revolution & In-N-Out (1948)",
            p: "Car culture changed the culinary landscape. While traditional drive-ins employed carhops on roller skates who delivered food trays to car windows, <strong>Harry and Esther Snyder</strong> opened California’s very first drive-thru in Baldwin Park in 1948: <strong>In-N-Out Burger</strong>. Harry engineered a breakthrough two-way intercom speaker box, allowing drivers to order, pay, and grab food without ever stepping out of their vehicle."
          }
        ],
        callouts: [
          { cls: "box-food", t: "Drive-Thru Innovation", d: "Harry Snyder's 1948 two-way intercom speaker is the direct prototype used by every fast-food drive-thru lane across the globe today." }
        ]
      },
      es: {
        title: "La Capital del Auto y la Primera Autopista",
        address: "Arroyo Seco Parkway (CA-110) y Corredor Figueroa",
        short: "4. Cultura del Auto y Autopistas",
        timeline: [
          { y: "1925", t: "LA lidera el mundo en posesión de autos per cápita (1 auto por cada 3 personas)." },
          { y: "Años 1930", t: "Nacen los mercados para autos, moteles y edificios con formas temáticas." },
          { y: "1940", t: "Inauguración de Arroyo Seco Parkway (CA-110), la primera autopista de EE. UU." },
          { y: "1948", t: "Harry y Esther Snyder abren el primer autoservicio con intercomunicador: In-N-Out Burger." }
        ],
        people: [
          { name: "Harry y Esther Snyder", role: "Fundadores de In-N-Out", bio: "Revolucionaron la comida rápida en 1948 al inventar el altavoz bidireccional para ordenar directamente desde el auto." },
          { name: "Spencer V. Cortelyou", role: "Ingeniero Vial en Jefe", bio: "Ingeniero estatal que diseñó el Arroyo Seco Parkway, implementando curvas peraltadas y pasos a desnivel." },
          { name: "Wayne McAllister", role: "Arquitecto de Restaurantes", bio: "Diseñador que definió la estética de autoservicios y cafeterías con marquesinas curvas y luces de neón." }
        ],
        stories: [
          {
            h: "1925: La Capital Mundial del Automóvil",
            p: "Para 1925, Los Ángeles era la ciudad con mayor densidad de vehículos por habitante del mundo: <strong>1 automóvil por cada 3 residentes</strong> (frente a 1 por cada 7 a nivel nacional). El clima soleado constante, la abundancia de petróleo barato descubierto en 1892 y el crecimiento horizontal hicieron del automóvil un elemento indispensable de la identidad angelina."
          },
          {
            h: "Arroyo Seco Parkway (1940): La Primera Autopista",
            p: "El 30 de diciembre de 1940 se inauguró el <strong>Arroyo Seco Parkway (hoy CA-110)</strong> entre Pasadena y el centro. Fue la primera vía rápida con control total de accesos y sin cruces a nivel en Estados Unidos. Con curvas peraltadas y diseñada para viajar a 45 mph, redujo el trayecto entre ambas ciudades de 35 a solo 12 minutos."
          },
          {
            h: "Arquitectura Temática para Conductores Veloces",
            p: "Al viajar a gran velocidad, los letreros comunes resultaban invisibles. Los comerciantes respondieron creando <strong>arquitectura programática</strong>: edificios con forma de objetos gigantes como sombreros (<em>The Brown Derby</em>), hot dogs (<em>Tail o' the Pup</em>) y cafeteras, para que los conductores identificaran los negocios en una fracción de segundo."
          },
          {
            h: "El Autoservicio Moderno: In-N-Out Burger (1948)",
            p: "La pasión por el auto transformó la gastronomía. Mientras los restaurantes tradicionales usaban meseras en patines que colgaban charolas en las ventanillas, en 1948 <strong>Harry y Esther Snyder</strong> fundaron el primer autoservicio de California en Baldwin Park: <strong>In-N-Out Burger</strong>. Harry inventó el sistema de altavoz de doble vía para hacer pedidos sin bajarse del vehículo."
          }
        ],
        callouts: [
          { cls: "box-food", t: "Legado del Autoservicio", d: "El sistema de pedidos por intercomunicador creado por Harry Snyder en 1948 se convirtió en el estándar mundial que utilizan todas las cadenas de comida rápida hoy en día." }
        ]
      }
    },

    // CHAPTER 5: The Streetcar Demise & GM Antitrust Scandal (1940s–1961)
    {
      id: 5,
      mapUrl: "https://maps.google.com/?q=Watts+Station+Pacific+Electric",
      en: {
        title: "The Streetcar Conspiracy & The Last Red Car",
        address: "Watts Station (Surviving 1904 Red Car Depot)",
        short: "5. The Streetcar Conspiracy",
        timeline: [
          { y: "1936", t: "National City Lines is founded by GM, Firestone, and Standard Oil to purchase transit systems." },
          { y: "1949", t: "Federal antitrust conviction of General Motors in United States v. National City Lines." },
          { y: "1953", t: "Pacific Electric sells its passenger passenger lines to Metropolitan Coach Lines." },
          { y: "April 9, 1961", t: "The final Red Car completes its last run from DTLA to Long Beach." }
        ],
        people: [
          { name: "Alfred P. Sloan", role: "President of General Motors", bio: "GM chief who spearheaded corporate diversification into diesel bus manufacturing and orchestrated investments into private transit holding firms." },
          { name: "Judge William J. Campbell", role: "Federal District Judge", bio: "Presided over the 1949 Chicago antitrust trial that found General Motors, Firestone, and Standard Oil guilty of monopolizing bus transit equipment." },
          { name: "Jesse L. Haugh", role: "President of Metropolitan Coach Lines", bio: "Transit executive who systematically converted Southern California's remaining rail passenger corridors into diesel bus operations." }
        ],
        stories: [
          {
            h: "The Formation of National City Lines",
            p: "In 1936, a holding company called <strong>National City Lines</strong> began quietly buying up electric streetcar networks in over 45 American cities. The company was secretly funded by corporate heavyweights with direct financial interests in automobile travel: <strong>General Motors</strong> (diesel bus manufacturer), <strong>Firestone Tire</strong> (rubber supplier), <strong>Standard Oil of California</strong> (diesel fuel refiner), and <strong>Mack Trucks</strong>."
          },
          {
            h: "The 1949 Federal Antitrust Conviction",
            p: "In the landmark federal case <em>United States v. National City Lines</em> (1949), the United States Department of Justice prosecuted GM and its partners. The federal jury found the corporate syndicate <strong>guilty of criminal antitrust conspiracy</strong> for conspiring to eliminate electric rail competition and monopolize the sale of diesel buses and petroleum products. Despite the conviction, the court issued only symbolic penalties: GM was fined a nominal $5,000, and individual executives were fined $1."
          },
          {
            h: "The Real Estate Shift & Deferred Maintenance",
            p: "While the corporate conspiracy accelerated the streetcar's demise, economic realities played a parallel role. Because tracks ran down the middle of public streets, streetcars became trapped in automobile traffic. As ridership declined, maintenance was deferred. Moreover, Huntington's land syndicates had already sold off their suburban real estate, removing the corporate subsidies that had originally kept passenger fares artificially cheap."
          },
          {
            h: "April 9, 1961: The End of an Era",
            p: "On the morning of <strong>April 9, 1961</strong>, Pacific Electric Car #1543 made its ceremonial final journey from Downtown LA to Long Beach, decorated with black banners reading <em>'Farewell to the Red Cars.'</em> The tracks were swiftly paved over, overhead copper electrical wires were cut down, and Los Angeles would remain completely devoid of rail transit for nearly 30 years."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Watts Station Landmark", d: "Watts Station (built 1904) was the only commercial building on the street to survive the 1965 Watts uprising untouched; it stands today fully preserved as a historic passenger rail monument." }
        ]
      },
      es: {
        title: "La Conspiración de los Tranvías y el Último 'Red Car'",
        address: "Estación Watts (Monumento Histórico de 1904)",
        short: "5. El Fin de los Tranvías",
        timeline: [
          { y: "1936", t: "Se crea National City Lines, respaldada por GM, Firestone y Standard Oil para comprar líneas de transporte." },
          { y: "1949", t: "Condena federal a General Motors por conspiración antimonopolio." },
          { y: "1953", t: "Pacific Electric vende sus rutas de pasajeros para reemplazarlas por camiones." },
          { y: "9 abr 1961", t: "El último 'Red Car' realiza su viaje final entre el centro de LA y Long Beach." }
        ],
        people: [
          { name: "Alfred P. Sloan", role: "Presidente de General Motors", bio: "Líder corporativo que impulsó la venta de autobuses a diésel e invirtió en empresas de transporte urbano para sustituir trenes." },
          { name: "Juez William J. Campbell", role: "Juez Federal", bio: "Presidió el juicio de 1949 en Chicago donde se halló culpable a GM, Firestone y Standard Oil de conspiración comercial." },
          { name: "Jesse L. Haugh", role: "Ejecutivo de Transporte", bio: "Director de Metropolitan Coach Lines que desmanteló sistemáticamente los rieles del sur del estado para colocar autobuses." }
        ],
        stories: [
          {
            h: "La Creación de National City Lines",
            p: "En 1936, una corporación llamada <strong>National City Lines</strong> comenzó a comprar discretamente las redes de tranvías en más de 45 ciudades del país. Estaba financiada por gigantes industriales con un interés claro en expandir el uso del automóvil: <strong>General Motors</strong> (fabricante de autobuses), <strong>Firestone</strong> (neumáticos) y <strong>Standard Oil</strong> (combustible diésel)."
          },
          {
            h: "El Juicio Antimonopolio de 1949",
            p: "En el histórico caso <em>EE. UU. contra National City Lines</em>, el Departamento de Justicia acusó a las corporaciones de conspiración. El jurado federal declaró a General Motors y sus socios <strong>culpables de violar las leyes antimonopolio</strong> por destruir la competencia eléctrica para imponer la venta exclusiva de autobuses. La sanción, sin embargo, fue irrisoria: una multa de solo $5,000 dólares para GM y $1 dólar para sus directores."
          },
          {
            h: "Declive Urbano y Falta de Inversión",
            p: "Aunque la conspiración aceleró el proceso, la decadencia también tuvo causas económicas. Al no tener carriles exclusivos, los tranvías quedaban atrapados en el tráfico de autos particulares. Con el tiempo, el mantenimiento se redujo y las compañías inmobiliarias dejaron de subsidiar los pasajes al haber vendido ya todos sus terrenos suburbanos."
          },
          {
            h: "9 de Abril de 1961: El Último Viaje",
            p: "En la mañana del <strong>9 de abril de 1961</strong>, el vagón #1543 de Pacific Electric realizó su último trayecto entre el centro de LA y Long Beach con carteles de luto. Las vías fueron cubiertas con asfalto, los cables de cobre fueron retirados y la metrópoli quedó sin una sola línea de transporte ferroviario durante tres décadas."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Estación Histórica de Watts", d: "La estación de Watts (1904) fue la única estructura que quedó intacta durante los disturbios de 1965, preservada hoy en día como monumento nacional a los tranvías." }
        ]
      }
    },

    // CHAPTER 6: The Freeway Metropolis & Divided Communities (1950s–1970s)
    {
      id: 6,
      mapUrl: "https://maps.google.com/?q=Four+Level+Interchange+Los+Angeles",
      en: {
        title: "The Freeway Metropolis & Divided Communities",
        address: "The 'Four-Level' Interchange (US-101 & CA-110 Junction)",
        short: "6. Freeway Metropolis",
        timeline: [
          { y: "1947", t: "California passes the Collier-Burns Highway Act to fund statewide freeways." },
          { y: "1953", t: "The world's first multi-tier 'Four-Level' Stack opens in Downtown LA." },
          { y: "1956", t: "President Eisenhower signs the Federal-Aid Highway Act, funding 90% of interstate construction." },
          { y: "1970", t: "Chicano moratorium activists march down Whittier Boulevard protesting war and urban neglect." }
        ],
        people: [
          { name: "Edward R. Roybal", role: "Pioneering City Councilman & Congressman", bio: "LA's first Mexican-American councilman since 1881, who fought to protect Eastside neighborhoods from being fractured by highway construction." },
          { name: "Abe Lincoln", role: "State Highway Bridge Engineer", bio: "Lead civil engineer who designed the 1953 Four-Level stack interchange, pioneering pre-stressed concrete overpass construction." },
          { name: "Dr. Arie Haagen-Smit", role: "Caltech Biochemist", bio: "Discovered the chemical formula of photochemical smog in 1952, proving car exhaust was the primary source of LA's toxic air basin pollution." }
        ],
        stories: [
          {
            h: "The 'Four-Level' Interchange (The Stack)",
            p: "Dedicated in 1953, the famous <strong>'Four-Level' Interchange</strong> in DTLA was the world's very first four-tier highway stack. Connecting the 101 Hollywood Freeway with the 110 Harbor/Pasadena Freeway, it stood as a marvel of mid-century civil engineering. Its sweeping concrete overpasses became an international symbol of post-war modernity, appearing in hundreds of films and television title cards."
          },
          {
            h: "The Fracturing of East Los Angeles",
            p: "Freeway routes were not distributed equally. While affluent neighborhoods like Beverly Hills and South Pasadena used political clout and lawsuits to block proposed highway routes (such as the Beverly Hills Freeway and the 710 extension), state highway engineers routed multiple massive corridors straight through working-class Latino and minority communities. <strong>Boyle Heights and East LA were sliced by six distinct freeways</strong> (I-5, I-10, US-101, CA-60, CA-110, I-710), displacing over 10,000 residents and severing historic neighborhood walking corridors."
          },
          {
            h: "Chavez Ravine & Urban Displacement",
            p: "During the same post-war decades, the Mexican-American communities of <strong>La Loma, Palo Verde, and Bishop</strong> in Chavez Ravine were cleared under eminent domain for planned public housing. When the housing project was canceled, the city transferred the leveled land to Walter O'Malley to construct Dodger Stadium in 1962, cementing one of the most painful displacement struggles in the city's civic memory."
          },
          {
            h: "The Smog Crisis & The Birth of Emissions Law",
            p: "By the late 1950s, Los Angeles was choked by thick, eye-stinging photochemical smog that obscured the San Gabriel Mountains for weeks at a time. In 1952, Caltech biochemist <strong>Dr. Arie Haagen-Smit</strong> proved that automotive tailpipe emissions reacted with sunlight to create ground-level ozone. This scientific breakthrough forced California to establish the California Air Resources Board (CARB) and mandate the world’s first vehicular catalytic converters."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "The Stack Overlook", d: "Stand on the Grand Avenue pedestrian bridge just north of Temple Street to capture the classic postcard shot of the Four-Level stack interchange framed by palm trees." }
        ]
      },
      es: {
        title: "La Metrópoli de Autopistas y Comunidades Divididas",
        address: "Distribuidor 'Four-Level' (Cruce de US-101 y CA-110)",
        short: "6. Auge de Autopistas",
        timeline: [
          { y: "1947", t: "Ley Collier-Burns establece los impuestos de gasolina para construir la red de autopistas." },
          { y: "1953", t: "Inauguración del distribuidor vial 'Four-Level', el primero de cuatro pisos en el mundo." },
          { y: "1956", t: "Ley Federal de Autopistas financia el 90% de la construcción de carreteras interestatales." },
          { y: "Años 1960", t: "Seis autopistas cortan el barrio histórico de Boyle Heights y el Este de LA." }
        ],
        people: [
          { name: "Edward R. Roybal", role: "Concejal y Congresista", bio: "Primer concejal mexicoamericano de LA desde 1881, quien defendió a las comunidades del Este frente a los proyectos de autopistas." },
          { name: "Abe Lincoln", role: "Ingeniero Civil Estatal", bio: "Ingeniero que diseñó el distribuidor de cuatro pisos de DTLA, revolucionando las estructuras de concreto armado." },
          { name: "Dr. Arie Haagen-Smit", role: "Bioquímico de Caltech", bio: "Científico que descubrió en 1952 que el smog tóxico de LA provenía de los gases de escape de los automóviles." }
        ],
        stories: [
          {
            h: "El Distribuidor 'Four-Level' (The Stack)",
            p: "Inaugurado en 1953, el distribuidor <strong>'Four-Level'</strong> en el centro de LA fue el primero de cuatro niveles en el mundo. Al conectar la autopista 101 con la 110, se convirtió en una maravilla de la ingeniería civil de la posguerra y en el símbolo internacional de la metrópoli moderna."
          },
          {
            h: "La División del Este de Los Ángeles",
            p: "El trazo de las autopistas no fue equitativo. Mientras zonas de alto poder adquisitivo como Beverly Hills y South Pasadena usaron su influencia política para frenar proyectos carreteros, los ingenieros estatales trazaron las vías sobre comunidades hispanas y de clase trabajadora. <strong>Boyle Heights y el Este de LA fueron fragmentados por seis autopistas</strong> (I-5, I-10, US-101, CA-60, CA-110, I-710), desplazando a más de 10,000 residentes y dividiendo barrios históricos."
          },
          {
            h: "Chavez Ravine y el Desalojo Comunitario",
            p: "En esa misma época, las comunidades de <strong>La Loma, Palo Verde y Bishop</strong> en Chavez Ravine fueron expropiadas bajo el argumento de construir vivienda pública. Al cancelarse el proyecto, la ciudad cedió el terreno a Walter O'Malley para construir el Dodger Stadium en 1962, marcando uno de los episodios más sensibles en la historia cívica angelina."
          },
          {
            h: "La Crisis del Smog y el Control de Emisiones",
            p: "Hacia finales de los años 50, una densa capa de smog irritante cubría la cuenca e impedía ver las montañas de San Gabriel. En 1952, el bioquímico de Caltech <strong>Arie Haagen-Smit</strong> demostró que la reacción química entre el sol y los gases del escape creaba el ozono nocivo. Este hallazgo impulsó a California a crear la Junta de Recursos del Aire (CARB) e imponer los primeros convertidores catalíticos obligatorios del mundo."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Mirador del 'Four-Level'", d: "Párate en el puente peatonal de Grand Avenue al norte de Temple Street para tomar la clásica foto panorámica del distribuidor vial con las palmeras al fondo." }
        ]
      }
    },

    // CHAPTER 7: Aviation Gateway: Mines Field to LAX (1928–1984)
    {
      id: 7,
      mapUrl: "https://maps.google.com/?q=LAX+Theme+Building",
      en: {
        title: "Aviation Gateway: Mines Field to LAX & The Jet Age",
        address: "LAX Theme Building (1 World Way, Los Angeles, CA 90045)",
        short: "7. Aviation & The Jet Age",
        timeline: [
          { y: "1928", t: "The City of Los Angeles leases 640 acres of bean fields, founding Mines Field." },
          { y: "1930", t: "Dedicated as Los Angeles Municipal Airport, attracting early airmail routes." },
          { y: "1961", t: "The Space Age Theme Building and Jet Age central terminal complex open." },
          { y: "1984", t: "Tom Bradley International Terminal opens for the 1984 Summer Olympics." }
        ],
        people: [
          { name: "Paul R. Williams", role: "Master Architect", bio: "Pioneering African-American architect who co-designed the parabolic Theme Building and helped define mid-century Los Angeles modernism." },
          { name: "William Pereira & Charles Luckman", role: "Master Planners", bio: "Visionary architects who designed the decentralized ring terminal layout at LAX to accommodate the explosive passenger volume of the Boeing 707 Jet Age." },
          { name: "Charles Lindbergh", role: "Aviation Pioneer", bio: "Surveyed early Southern California airfield sites and advocated for Los Angeles to establish a permanent municipal passenger airport." }
        ],
        stories: [
          {
            h: "From Dirt Bean Field to Mines Field (1928)",
            p: "In 1928, the city leased a flat 640-acre dirt field in Westchester that had previously been used for farming lima beans and barley. Known as <strong>Mines Field</strong>, it featured a single unpaved dirt runway, a wooden hangar, and no permanent passenger facilities. That same year, the field hosted the National Air Races, drawing over 200,000 spectators and convincing city voters to purchase the land as Los Angeles Municipal Airport in 1930."
          },
          {
            h: "The 1961 Jet Age Revolution & The Decentralized Ring",
            p: "With the commercial introduction of the <strong>Boeing 707</strong> jetliner in the late 1950s, passenger volumes exploded. To handle millions of transcontinental passengers, architectural firm Pereira & Luckman, in collaboration with master architect <strong>Paul R. Williams</strong>, designed a revolutionary U-shaped decentralized 'island' terminal layout with separate satellite boarding gates connected by underground pedestrian tunnels."
          },
          {
            h: "The Iconic Theme Building",
            p: "At the exact center of the new 1961 airport rose the futuristic <strong>Theme Building</strong>. Designed in the Space Age 'Googie' architectural style, its monumental 135-foot parabolic intersecting arches of white steel and glass looked like a flying saucer that had landed from outer space. It housed a 360-degree observation deck and a suspended glass dining room overlooking the active runways."
          },
          {
            h: "The 1984 Olympics & The Transpacific Hub",
            p: "Under Mayor Tom Bradley, the city completed a massive modernization for the <strong>1984 Summer Olympic Games</strong>. The centerpiece was the brand new <strong>Tom Bradley International Terminal (TBIT)</strong> and a second-level elevated departure roadway. The expansion cemented LAX as the primary transpacific aviation gateway connecting North America directly to Asia, Latin America, and Oceania."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Architectural Monument", d: "The 1961 LAX Theme Building was designated a Los Angeles Historic-Cultural Monument in 1992, standing as one of the world's finest examples of Mid-Century Space Age architecture." }
        ]
      },
      es: {
        title: "Puerta Aérea: De Mines Field a LAX y la Era del Jet",
        address: "Edificio Theme de LAX (1 World Way, Los Angeles, CA 90045)",
        short: "7. Aviación y la Era del Jet",
        timeline: [
          { y: "1928", t: "La ciudad renta 640 acres de sembradíos de frijol, fundando Mines Field." },
          { y: "1930", t: "Se inaugura como Aeropuerto Municipal de Los Ángeles para rutas de correo aéreo." },
          { y: "1961", t: "Abre el futurista Edificio Theme y las terminales de la Era del Jet." },
          { y: "1984", t: "Abre la Terminal Internacional Tom Bradley para las Olimpiadas de 1984." }
        ],
        people: [
          { name: "Paul R. Williams", role: "Arquitecto Maestro", bio: "Pionero arquitecto afroamericano que codiseñó el Edificio Theme y definió el modernismo arquitectónico angelino." },
          { name: "William Pereira y Charles Luckman", role: "Planificadores", bio: "Arquitectos que diseñaron la distribución en 'herradura' de LAX para responder a la llegada masiva de los aviones jet Boeing 707." },
          { name: "Charles Lindbergh", role: "Aviador Histórico", bio: "Inspeccionó los primeros campos aéreos de la región e impulsó la creación del aeropuerto municipal de la ciudad." }
        ],
        stories: [
          {
            h: "De Campos de Frijol a Mines Field (1928)",
            p: "En 1928, el Ayuntamiento arrendó 640 acres de cultivo de frijol en la zona costera de Westchester. Bautizado como <strong>Mines Field</strong>, contaba con una pista de tierra y un cobertizo de madera sin comodidades para viajeros. Ese año se celebraron allí las Carreras Aéreas Nacionales ante 200,000 personas, convenciendo al público de comprar el terreno en 1930 como aeropuerto municipal."
          },
          {
            h: "La Revolución de la Era del Jet en 1961",
            p: "La llegada del avión a reacción <strong>Boeing 707</strong> a finales de los años 50 multiplicó los pasajeros. Para evitar aglomeraciones en un solo edificio, los arquitectos Pereira, Luckman y <strong>Paul R. Williams</strong> diseñaron una innovadora terminal descentralizada en forma de herradura con salas de embarque conectadas por túneles peatonales subterráneos."
          },
          {
            h: "El Emblemático Edificio Theme",
            p: "En el corazón del aeropuerto se alzó en 1961 el futurista <strong>Edificio Theme</strong>. Diseñado en estilo 'Googie' de la Era Espacial con dos enormes arcos parabólicos de acero de 135 pies de altura, evoca un platillo volador posado en tierra. Albergaba un restaurante panorámico suspendido con vista a las pistas."
          },
          {
            h: "Las Olimpiadas de 1984 y el Eje del Pacífico",
            p: "Bajo la alcaldía de Tom Bradley, la ciudad remodeló el aeropuerto para los <strong>Juegos Olímpicos de 1984</strong>, construyendo la <strong>Terminal Internacional Tom Bradley (TBIT)</strong> y el viaducto elevado de salidas. La obra consagró a LAX como el principal enlace aéreo transpacífico entre Norteamérica, Asia y Latinoamérica."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Monumento Histórico", d: "El Edificio Theme de 1961 fue declarado Monumento Histórico-Cultural en 1992, considerado una de las obras cumbres de la arquitectura espacial del siglo XX." }
        ]
      }
    },

    // CHAPTER 8: The Modern Rail Renaissance & Transit Future (1980–Present)
    {
      id: 8,
      mapUrl: "https://maps.google.com/?q=Union+Station+Los+Angeles",
      en: {
        title: "The Modern Rail Renaissance & Transit Future",
        address: "Union Station Regional Transit Hub & Subway Concourse",
        short: "8. Modern Rail Renaissance",
        timeline: [
          { y: "1980", t: "LA County voters approve Proposition A, funding a return to rail transit." },
          { y: "1990", t: "The Blue Line (A Line) opens to Long Beach along the historic 1961 Red Car route." },
          { y: "1993", t: "The Red Line (B Line) heavy rail subway opens beneath Downtown LA." },
          { y: "2023", t: "The $1.8 billion Regional Connector subway opens beneath downtown, linking three light rail lines." }
        ],
        people: [
          { name: "Kenneth Hahn", role: "LA County Supervisor", bio: "Champion of public transportation who authored Proposition A in 1980, creating the dedicated sales-tax funding pipeline that built the modern Metro system." },
          { name: "Tom Bradley", role: "Mayor of Los Angeles", bio: "Presided over the groundbreaking and 1990 opening of the Blue Line, bringing passenger trains back to Los Angeles after a 30-year absence." },
          { name: "Stephanie Wiggins", role: "Metro Chief Executive Officer", bio: "First African-American woman to lead LA Metro, overseeing historic rail expansions, bus frequency overhauls, and preparations for the 2028 Olympic Games." }
        ],
        stories: [
          {
            h: "Proposition A (1980): The Funding Breakthrough",
            p: "By 1980, gridlock on Southern California freeways had reached crisis levels. Led by County Supervisor <strong>Kenneth Hahn</strong>, Los Angeles voters took a revolutionary step by passing <strong>Proposition A</strong>—a voter-approved half-cent sales tax dedicated permanently to constructing a modern rail transit network. This local revenue stream freed Los Angeles from relying solely on unpredictable federal transit grants."
          },
          {
            h: "1990: The Return of the Blue Line (A Line)",
            p: "On July 14, 1990, passenger rail officially returned to Los Angeles with the opening of the <strong>Metro Blue Line (now the A Line)</strong>. In a stroke of historical poetry, the 22-mile light rail line was constructed along the exact right-of-way of the historic 1961 Pacific Electric Red Car line to Long Beach. Today, following the completion of recent northern extensions, the A Line is the longest continuous light rail line in the world (nearly 50 miles long)."
          },
          {
            h: "Tunnelling Beneath the City: The B & D Subways",
            p: "In 1993, Los Angeles opened its very first heavy-rail underground subway: the <strong>Red Line (B Line)</strong> from Union Station to Westlake, later tunneling through the Santa Monica Mountains into North Hollywood and down Wilshire Boulevard (<strong>D Line</strong>). Underground crews operated mammoth tunnel boring machines through earthquake fault zones, ancient tar deposits, and methane pockets to build deep seismic-resistant tunnels."
          },
          {
            h: "The Regional Connector & Destination 2028",
            p: "In 2023, Metro opened the <strong>Regional Connector</strong>: a 1.9-mile subterranean link beneath downtown that consolidated three separate rail lines (A, E, and former L Lines), allowing seamless one-seat rides from East LA to Santa Monica and Long Beach to Pasadena without transferring. Looking ahead to the <strong>2028 Olympic and Paralympic Games</strong>, Metro is completing the D Line 'Subway to the Sea' extension to Westwood/UCLA, the LAX Automated People Mover, and planning rapid transit over the Sepulveda Pass."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "The Modern Union Station", d: "Step inside historic Union Station to transfer directly between Metro subway/light rail lines, Metrolink regional commuter trains, Amtrak interstate trains, and express airport FlyAway shuttles." }
        ]
      },
      es: {
        title: "El Renacimiento del Riel y el Futuro del Transporte",
        address: "Centro de Transferencia de Union Station y Andenes del Metro",
        short: "8. Renacimiento del Riel",
        timeline: [
          { y: "1980", t: "Votantes aprueban la Proposición A, creando fondos para reconstruir el tren." },
          { y: "1990", t: "Inauguración de la Línea Azul (Línea A) a Long Beach sobre la ruta del antiguo 'Red Car'." },
          { y: "1993", t: "Abre el primer tramo del metro subterráneo Línea Roja (Línea B) bajo el centro." },
          { y: "2023", t: "Abre el Regional Connector subterráneo de $1,800 millones unificando tres líneas." }
        ],
        people: [
          { name: "Kenneth Hahn", role: "Supervisor del Condado de LA", bio: "Impulsor del transporte público que redactó la Proposición A en 1980 para financiar la construcción de la red de Metro." },
          { name: "Tom Bradley", role: "Alcalde de Los Ángeles", bio: "Lideró la construcción y apertura de la Línea Azul en 1990, trayendo de vuelta los trenes de pasajeros tras 30 años de ausencia." },
          { name: "Stephanie Wiggins", role: "Directora Ejecutiva de Metro", bio: "Primera mujer afroamericana en dirigir LA Metro, liderando las expansiones de tren y preparativos para los Juegos Olímpicos de 2028." }
        ],
        stories: [
          {
            h: "La Proposición A (1980): El Rescate Financiero",
            p: "Hacia 1980, el colapso vial de las autopistas exigía soluciones de fondo. Impulsada por el supervisor <strong>Kenneth Hahn</strong>, la ciudadanía aprobó la <strong>Proposición A</strong>: un impuesto de medio centavo a las ventas destinado exclusivamente a financiar trenes urbanos. Este fondo local permitió a la ciudad planificar y construir su propio sistema de transporte masivo sin depender del presupuesto federal."
          },
          {
            h: "1990: El Regreso de la Línea Azul (Línea A)",
            p: "El 14 de julio de 1990, los trenes de pasajeros renacieron en Los Ángeles con la apertura de la <strong>Línea Azul de Metro (hoy Línea A)</strong>. Por justicia histórica, la línea de 22 millas se tendió sobre el mismo trazo del último 'Red Car' a Long Beach de 1961. Con sus ampliaciones recientes, la Línea A es hoy la línea de tren ligero continuo más larga del mundo (casi 50 millas)."
          },
          {
            h: "Túneles bajo la Metrópoli: Las Líneas B y D",
            p: "En 1993 se inauguró el primer metro subterráneo pesado: la <strong>Línea Roja (Línea B)</strong> desde Union Station hasta Westlake, extendiéndose después por el Valle de San Fernando y sobre Wilshire Boulevard (<strong>Línea D</strong>). Grandes tuneladoras perforaron fallas sísmicas, mantos de asfalto y bolsas de gas metano con tecnología antisísmica de punta."
          },
          {
            h: "El Regional Connector y Rumbo a 2028",
            p: "En 2023, Metro abrió el <strong>Regional Connector</strong>: un túnel de 1.9 millas bajo el centro que unificó las líneas A y E, permitiendo viajar directo desde el Este de LA hasta la playa de Santa Mónica y desde Long Beach hasta Pasadena sin transbordos. De cara a los <strong>Juegos Olímpicos de 2028</strong>, se avanza en la extensión de la Línea D hacia UCLA, el tren automático People Mover en LAX y el proyecto por el Sepulveda Pass."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "El Eje de Union Station", d: "Entra a la histórica Union Station para conectar directamente entre las líneas de Metro, los trenes regionales Metrolink, Amtrak nacional y los autobuses expresos FlyAway al aeropuerto LAX." }
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

  // Progress Bar & Counter
  const pct = Math.round((currentStop / totalStops) * 100);
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  if (progressFill) progressFill.style.width = pct + '%';
  if (progressText) progressText.textContent = `${u.stopWord} ${currentStop} ${u.ofWord} ${totalStops} • ${d.title}`;

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

  // Story Content
  const storyContainer = document.getElementById('story-content');
  if (storyContainer) {
    storyContainer.innerHTML = d.stories.map(story => `
      <h3 class="story-heading">${story.h}</h3>
      <p>${story.p}</p>
    `).join('');
  }

  // Callouts Grid
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
      <button type="button" class="pill-btn ${idx + 1 === currentStop ? 'active' : ''}" onclick="goToStop(${idx + 1})">
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
