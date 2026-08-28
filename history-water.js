/* ==========================================================================
   history-water.js - MarlonWalksLA LA Water History Tour
   Repository: marlonwalksla/marlonwalksla-website
   ========================================================================== */

let currentLang = 'en';
let currentStop = 1;
const totalStops = 8;

const tourData = {
  ui: {
    en: {
      title: "Liquid Empire: The Epic Story of Los Angeles Water",
      desc: "Explore over two centuries of hydrological engineering—from the hand-dug Zanja Madre and Owens Valley Water Wars to the St. Francis Dam disaster, the concrete river, and modern recycling.",
      selectorLabel: "Jump to Any Chapter:",
      stopWord: "CHAPTER",
      ofWord: "OF",
      timelineHead: "Chronological Milestones",
      peopleHead: "Notable Figures & Engineers",
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
      title: "Imperio Líquido: La Historia del Agua en Los Ángeles",
      desc: "Explora más de dos siglos de historia hídrica: desde la Zanja Madre y las Guerras del Agua en Owens Valley hasta la tragedia de la Presa San Francis, el río de concreto y el reciclaje moderno.",
      selectorLabel: "Ir a Cualquier Capítulo:",
      stopWord: "CAPÍTULO",
      ofWord: "DE",
      timelineHead: "Hitos Cronológicos",
      peopleHead: "Personajes Clave e Ingenieros",
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
    // CHAPTER 1: The Zanja Madre & Spanish Origins (Pre-1781–1860s)
    {
      id: 1,
      mapUrl: "https://maps.google.com/?q=Los+Angeles+Plaza+Park",
      en: {
        title: "The Living River & The Zanja Madre",
        address: "El Pueblo Historic Monument & Olvera Street",
        short: "1. The Zanja Madre",
        timeline: [
          { y: "Pre-1781", t: "Gabrielino-Tongva settle the village of Yanga near the reliable underground water table of the Porciúncula River." },
          { y: "1781", t: "Spanish settlers found El Pueblo de la Reina de los Ángeles, claiming absolute crown water rights over the basin." },
          { y: "1781–1800", t: "Pobladores construct the Zanja Madre (Mother Ditch) to divert river water to plaza crops by gravity." },
          { y: "1854", t: "The City of Los Angeles creates the official post of Zanjero (Water Overseer), making it the highest-paid city position." }
        ],
        people: [
          { name: "Felipe de Neve", role: "Governor of Las Californias", bio: "Established the founding charter of Los Angeles, intentionally siting the Plaza on elevated land adjacent to the river to guarantee gravity-fed agricultural irrigation." },
          { name: "The Zanjero", role: "Municipal Water Overseer", bio: "The most influential official in early Los Angeles, entrusted with opening ditch gates, allocating daily water shares, and penalizing unauthorized diversion or fouling." },
          { name: "William G. Dryden", role: "Pioneer Water Judge & Builder", bio: "Constructed the town's first pressurized wooden water wheel and brick reservoir in the Plaza in 1857, tapping the river current to supply homes." }
        ],
        stories: [
          {
            h: "The Porciúncula: A Subterranean Oasis",
            p: "Los Angeles was founded where it was because of a specific geological choke point. Where the Los Angeles River squeezes between the Santa Monica Mountains and the Elysian Hills, underground bedrock forces subterranean aquifers to the surface, maintaining a steady freshwater stream throughout rainless Mediterranean summers. The Gabrielino-Tongva established their primary settlement, <strong>Yanga</strong>, alongside these fertile banks."
          },
          {
            h: "The Mother Ditch (Zanja Madre)",
            p: "Within weeks of founding the settlement in September 1781, Spanish settlers engineered the <strong>Zanja Madre</strong>. Dug by indigenous laborers with picks and shovels, this main trench pulled water from the river north of town, winding around the Elysian bluffs into the central Plaza. Smaller ditches (<em>zanjas</em>) branched off across the flats, irrigating vineyards, cornfields, and orchards that fed the early colony."
          },
          {
            h: "The Rule of the Zanjero",
            p: "In a dry basin, water distribution was the most critical municipal task. The <strong>Zanjero</strong> held authority over dozens of miles of open dirt trenches, patrolled banks for blockages or dead livestock, and enforced strict watering schedules for farmers. The post commanded a higher municipal salary than the mayor or city council members."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Buried Brick Conduit", d: "In 2005, construction crews building the Metro Gold Line (now A Line) at Chinatown Station unearthed a fully intact, brick-vaulted underground section of the 1877 Zanja Madre." }
        ]
      },
      es: {
        title: "El Río Vivo y la Zanja Madre",
        address: "Monumento Histórico El Pueblo y Calle Olvera",
        short: "1. La Zanja Madre",
        timeline: [
          { y: "Antes de 1781", t: "Los indígenas Tongva habitan la aldea de Yanga junto a las corrientes subterráneas del río Porciúncula." },
          { y: "1781", t: "Pobladores españoles fundan El Pueblo de Los Ángeles, asegurando los derechos de agua de la corona." },
          { y: "1781–1800", t: "Se excava la Zanja Madre para desviar agua del río por gravedad hacia los sembradíos de la plaza." },
          { y: "1854", t: "La ciudad crea el cargo oficial de Zanjero, convirtiéndose en el puesto municipal mejor remunerado." }
        ],
        people: [
          { name: "Felipe de Neve", role: "Gobernador de Las Californias", bio: "Redactó las ordenanzas de fundación situando la Plaza en una elevación junto al río para garantizar el riego agrícola por gravedad." },
          { name: "El Zanjero", role: "Superintendente de Aguas", bio: "El funcionario con mayor poder en el pueblo colonial, encargado de abrir compuertas, racionar turnos de riego y multar el robo o daño al agua." },
          { name: "William G. Dryden", role: "Juez y Constructor Pionero", bio: "Instaló en 1857 la primera rueda hidráulica de madera y depósito de ladrillo en la Plaza para bombear agua potable." }
        ],
        stories: [
          {
            h: "El Río Porciúncula: Un Oasis Subterráneo",
            p: "Los Ángeles nació en este sitio gracias a una formación geológica singular. En el paso estrecho entre las colinas de Elysian y las montañas de Santa Mónica, el lecho rocoso subterráneo obligaba al agua a subir a la superficie, manteniendo un caudal constante durante veranos secos. Allí los Tongva fundaron su aldea principal: <strong>Yanga</strong>."
          },
          {
            h: "La Construcción de la Zanja Madre",
            p: "A pocas semanas de fundar la villa en septiembre de 1781, los colonos iniciaron la excavación de la <strong>Zanja Madre</strong>. Esta acequia principal extraía agua del río hacia el norte y la guiaba bordeando los cerros hasta la Plaza. De ella salían zanjas secundarias para regar huertas, maizales y los primeros viñedos comerciales de California."
          },
          {
            h: "La Autoridad del Zanjero",
            p: "En un valle semidesértico, la administración del agua superaba a cualquier otro cargo. El <strong>Zanjero</strong> recorría a caballo la red de canales, vigilaba la limpieza del caudal y asignaba turnos estrictos a los hacendados. Su sueldo superaba habitualmente al del propio alcalde municipal."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Vestigios en Chinatown", d: "En 2005, durante la construcción de la estación de Metro en Chinatown, los obreros desenterraron intacto un tramo abovedado de ladrillos de la Zanja Madre que databa de 1877." }
        ]
      }
    },

    // CHAPTER 2: Privatization, Wooden Pipes & The Birth of LADWP (1868–1902)
    {
      id: 2,
      mapUrl: "https://maps.google.com/?q=Buena+Vista+Pumping+Station+Los+Angeles",
      en: {
        title: "Privatization, Wooden Pipes & The Birth of LADWP",
        address: "Historic Buena Vista Pumping Station (North Broadway & LA River)",
        short: "2. The Private Water Era",
        timeline: [
          { y: "1868", t: "The City leases municipal water distribution rights to the private Los Angeles City Water Company for 30 years." },
          { y: "1878", t: "Young Irish immigrant William Mulholland takes a job as a ditch tender (zanjero) clearing weeds from the canals." },
          { y: "1898", t: "The 30-year private lease expires, sparking a fierce legal battle over municipal versus private utility ownership." },
          { y: "1902", t: "Voters approve municipal ownership by a 6-to-1 landslide, creating the Bureau of Water Works (today's LADWP)." }
        ],
        people: [
          { name: "Prudent Beaudry", role: "Downtown Developer & 13th Mayor", bio: "Early real estate developer who built high-pressure steam pumps to elevate river water onto the barren bluffs of Bunker Hill, making uphill living viable." },
          { name: "Solomon Lazard", role: "President, LA City Water Company", bio: "Downtown dry-goods merchant who organized the private syndicate that leased and operated the city's water infrastructure throughout the early boom decades." },
          { name: "William Mulholland (Early Career)", role: "Zanjero to Chief Superintendent", bio: "Self-educated laborer who lived in a small wooden shack along the river, studying hydraulics and geology by candlelight until he mastered the system." }
        ],
        stories: [
          {
            h: "The Wooden Pipe Experiment",
            p: "Following a severe flood in 1868 that wrecked the municipal water wheel, the broke city government leased its water infrastructure to a private syndicate headed by Solomon Lazard. The company laid miles of water mains made from <strong>hollowed-out pine logs</strong> wrapped in iron wire. The pipes frequently rotted, clogged with mud and small fish, burst under high summer pressure, and leaked badly through downtown streets."
          },
          {
            h: "Mulholland: The Self-Taught Ditch Tender",
            p: "In 1878, a 23-year-old Irish immigrant named <strong>William Mulholland</strong> arrived in Los Angeles and began working as a ditch tender for the private water company. He lived in a shack along the river, clearing brush, clearing debris, and studying mathematics, geology, and civil engineering manuals every night. His photographic memory and unmatched knowledge of the watershed propelled him to chief superintendent by 1886."
          },
          {
            h: "The 1902 Municipal Revolution",
            p: "As the population grew from 11,000 in 1880 to over 100,000 by 1900, the private water monopoly failed to expand storage or improve fire protection. After years of bitter arbitration, civic reformers fought to reclaim public control. In 1902, Angelenos voted overwhelmingly to buy out the company for $2 million, establishing the municipal <strong>Bureau of Water Works and Supply</strong> and appointing Mulholland as its founding chief engineer."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Buena Vista Pumping Station", d: "Constructed in the late 19th century near modern North Broadway, the Buena Vista station was the primary pumping facility lifting groundwater directly from the riverbed into city mains." }
        ]
      },
      es: {
        title: "Privatización, Tuberías de Madera y el LADWP",
        address: "Estación de Bombeo Buena Vista (North Broadway y Río de LA)",
        short: "2. Era del Agua Privada",
        timeline: [
          { y: "1868", t: "La ciudad arrienda la red de agua a la empresa privada Los Angeles City Water Company por 30 años." },
          { y: "1878", t: "El joven inmigrante irlandés William Mulholland entra a trabajar como zanjero limpiando maleza." },
          { y: "1898", t: "Vence el contrato de arrendamiento privado, iniciando una intensa disputa por el control público." },
          { y: "1902", t: "Votantes aprueban la municipalización por 6 a 1, fundando la base del actual LADWP." }
        ],
        people: [
          { name: "Prudent Beaudry", role: "Urbanizador y 13.º Alcalde", bio: "Pionero inmobiliario que instaló bombas de vapor para subir agua del río a las lomas de Bunker Hill, permitiendo urbanizar la zona." },
          { name: "Solomon Lazard", role: "Presidente de la Empresa Privada de Agua", bio: "Comerciante del centro que encabezó el grupo inversionista que administró el agua potable durante las primeras décadas de expansión." },
          { name: "William Mulholland (Primeros Años)", role: "De Zanjero a Superintendente", bio: "Trabajador autodidacta que vivió en una choza junto al río, estudiando hidráulica y geología a la luz de las velas hasta dominar la red." }
        ],
        stories: [
          {
            h: "El Experimento de los Troncos Huecos",
            p: "Tras una destructiva crecida del río en 1868 que destrozó la rueda de agua pública, la ciudad arrendó el sistema a un consorcio privado. La empresa tendió millas de tuberías hechas con <strong>troncos de pino ahuecados</strong> y reforzados con alambre. Con frecuencia la madera se pudría, se tapaba con lodo o peces pequeños y reventaba por la presión en las calles del centro."
          },
          {
            h: "Mulholland: El Zanjero Autodidacta",
            p: "En 1878, un joven irlandés de 23 años llamado <strong>William Mulholland</strong> llegó a Los Ángeles y fue contratado para limpiar zanjas. Instalado en una cabaña junto al río, pasaba las noches estudiando matemáticas, geología e hidráulica. Su memoria enciclopédica y comprensión del terreno lo llevaron a ser nombrado superintendente en 1886."
          },
          {
            h: "La Municipalización de 1902",
            p: "Al dispararse la población de 11,000 habitantes en 1880 a más de 100,000 en 1900, la compañía privada demostró ser incapaz de abastecer a los nuevos vecindarios. Los líderes cívicos exigieron el control público. En 1902, los votantes aprobaron por amplia mayoría adquirir la empresa por $2 millones, creando la empresa municipal que Mulholland dirigiría."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Estación Buena Vista", d: "Ubicada cerca del actual puente de North Broadway, la estación de vapor Buena Vista fue la instalación principal que extrajo agua subterránea del río a finales del siglo XIX." }
        ]
      }
    },

    // CHAPTER 3: The Owens River Aqueduct & 'There It Is' (1904–1913)
    {
      id: 3,
      mapUrl: "https://maps.google.com/?q=The+Cascades+Sylmar+Los+Angeles",
      en: {
        title: "The Owens Valley Scheme & The Great Aqueduct",
        address: "The Cascades (Foothill Blvd & I-5, Sylmar)",
        short: "3. The Great Aqueduct",
        timeline: [
          { y: "1904", t: "Fred Eaton and William Mulholland scout the snowpack-fed Owens River basin east of the Sierra Nevada." },
          { y: "1905", t: "LA voters approve a $1.5M bond to buy valley land after newspapers declare an impending water famine." },
          { y: "1908–1913", t: "Over 3,900 workers build the 233-mile Los Angeles Aqueduct, relying entirely on gravity flow." },
          { y: "Nov 5, 1913", t: "Water cascades into the San Fernando Valley before 40,000 onlookers as Mulholland speaks his famous words." }
        ],
        people: [
          { name: "William Mulholland", role: "Chief Engineer, Bureau of Water Works", bio: "Masterminded the construction of the world's longest aqueduct at the time, completing the monumental project on schedule and within budget." },
          { name: "Fred Eaton", role: "Former Mayor & Civil Engineer", bio: "Conceived the Owens River diversion scheme and quietly acquired extensive agricultural land and water rights throughout Inyo County." },
          { name: "Joseph Lippincott", role: "U.S. Reclamation Service Engineer", bio: "Federal engineer who shared confidential federal land surveys with Eaton and Mulholland while simultaneously on the city's payroll." }
        ],
        stories: [
          {
            h: "The Secret Reconnaissance of 1904",
            p: "By 1900, the expanding city was outgrowing the local Los Angeles River. Former mayor <strong>Fred Eaton</strong> convinced Chief Engineer <strong>William Mulholland</strong> that the Eastern Sierra snowmelt in Owens Valley held the answer. Posing as a cattle buyer and federal agent, Eaton systematically bought option contracts on ranches and riparian rights along the river, 250 miles north of downtown."
          },
          {
            h: "A Masterpiece of Gravity-Fed Engineering",
            p: "Between 1908 and 1913, Mulholland directed the construction of the <strong>Los Angeles Aqueduct</strong>: 233 miles of open ditches, covered concrete conduits, 142 mountain tunnels, and massive riveted steel siphons traversing desert canyons like the <em>Jawbone Siphon</em>. Operating without a single powered pumping station, gravity alone delivered water across the Mojave Desert."
          },
          {
            h: "'There It Is. Take It.' (November 5, 1913)",
            p: "On November 5, 1913, approximately 40,000 Angelenos gathered in the foothills of Sylmar at <strong>The Cascades</strong>. When Mulholland turned the handwheel opening the floodgates, Sierra water surged down the concrete chute into the San Fernando Valley. Mulholland gave a five-word dedication speech: <em>'There it is. Take it.'</em>"
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Viewing The Cascades", d: "You can view the historic 1913 open spillway and the adjacent 1970 Second Aqueduct cascade running down the hillside directly from Foothill Boulevard in Sylmar." }
        ]
      },
      es: {
        title: "El Plan de Owens Valley y el Gran Acueducto",
        address: "Las Cascadas (Foothill Blvd y Autopista I-5, Sylmar)",
        short: "3. El Gran Acueducto",
        timeline: [
          { y: "1904", t: "Fred Eaton y William Mulholland exploran la cuenca del río Owens alimentada por la Sierra Nevada." },
          { y: "1905", t: "Votantes aprueban bonos por $1.5 millones tras advertencias periodísticas de escasez inminente." },
          { y: "1908–1913", t: "Más de 3,900 obreros construyen el acueducto de 233 millas que opera 100% por gravedad." },
          { y: "5 nov 1913", t: "El agua desciende ante 40,000 personas en Sylmar con las célebres palabras de Mulholland." }
        ],
        people: [
          { name: "William Mulholland", role: "Ingeniero en Jefe del Agua", bio: "Diseñó y construyó el acueducto municipal más largo del planeta en su época, terminando la obra en tiempo y presupuesto." },
          { name: "Fred Eaton", role: "Exalcalde e Ingeniero Civil", bio: "Ideó el desvío del río Owens y compró miles de acres agrícolas simulando proyectos de irrigación locales." },
          { name: "Joseph Lippincott", role: "Ingeniero Federal de Reclamación", bio: "Compartió estudios hídricos gubernamentales confidenciales con Eaton y la ciudad mientras recibía honorarios municipales." }
        ],
        stories: [
          {
            h: "La Misión Secreta de 1904",
            p: "Hacia 1900, el crecimiento de la ciudad sobrepasó la capacidad del río local. El exalcalde <strong>Fred Eaton</strong> convenció a <strong>William Mulholland</strong> de que el deshielo de la Sierra Nevada era la solución. Presentándose como inversionista ganadero, Eaton adquirió opciones de compra de tierras y derechos de agua a lo largo de Owens Valley, 400 kilómetros al norte."
          },
          {
            h: "Proeza de Ingeniería por Gravedad",
            p: "De 1908 a 1913, Mulholland coordinó la construcción del <strong>Acueducto de Los Ángeles</strong>: 233 millas compuestas por canales abiertos, túneles de roca y sifones de acero como el <em>Jawbone Siphon</em>. Sin usar una sola bomba eléctrica, el agua cruzó el desierto de Mojave impulsada exclusivamente por la pendiente del terreno."
          },
          {
            h: "'Ahí Está. Tómenla.' (5 de noviembre de 1913)",
            p: "El 5 de noviembre de 1913, cerca de 40,000 residentes se congregaron en <strong>Las Cascadas</strong> de Sylmar. Al girar la compuerta, el agua de la sierra bajó con estruendo hacia el Valle de San Fernando. Mulholland resumió el momento con cinco palabras: <em>'There it is. Take it' (Ahí está. Tómenla)</em>."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Mirador de Las Cascadas", d: "El canal original de 1913 y la cascada del Segundo Acueducto de 1970 se pueden apreciar en funcionamiento desde Foothill Boulevard en Sylmar." }
        ]
      }
    },

    // CHAPTER 4: The California Water Wars & Owens Lake (1920s)
    {
      id: 4,
      mapUrl: "https://maps.google.com/?q=Alabama+Gates+Lone+Pine+CA",
      en: {
        title: "The California Water Wars & Dust of Owens Lake",
        address: "Alabama Gates Spillway (Lone Pine, Inyo County)",
        short: "4. The Water Wars",
        timeline: [
          { y: "1924", t: "Over 700 local residents seize the Alabama Gates spillway, diverting aqueduct water back into the river." },
          { y: "1926", t: "Owens Lake dries up completely, creating one of the worst sources of toxic dust pollution in North America." },
          { y: "1927", t: "Armed ranchers dynamite aqueduct siphons 17 times; LA sends armored patrol cars with armed guards." },
          { y: "1927", t: "The Watterson brothers' banking syndicate collapses, bankrupting valley resistance." }
        ],
        people: [
          { name: "Mark & Wilfred Watterson", role: "Inyo County Bankers & Leaders", bio: "Brothers who organized valley resistance against LADWP until their financial empire collapsed under charges of embezzlement." },
          { name: "Mary Austin", role: "Author & Environmental Chronicler", bio: "Celebrated writer whose classic book 'The Land of Little Rain' documented the cultural and ecological transformation of Owens Valley." },
          { name: "Sheriff J. Frank McKay", role: "Inyo County Sheriff", bio: "Local lawman who openly sympathized with the protesting ranchers, refusing to deploy tear gas or arrest citizens occupying the diversion gates." }
        ],
        stories: [
          {
            h: "The Occupation of Alabama Gates (1924)",
            p: "During a severe drought in the 1920s, Los Angeles diverted nearly all surface and well water from the Owens River, leaving local farms parched. On November 16, 1924, a caravan of armed ranchers marched on the <strong>Alabama Gates</strong> spillway north of Lone Pine, lowered the massive iron gate, and diverted the entire flow out of the aqueduct back into the riverbed. The protest turned into a four-day community picnic, complete with barbecue and brass bands."
          },
          {
            h: "Dynamite in the Desert",
            p: "Between 1926 and 1927, the conflict escalated into low-intensity guerrilla warfare. Siphons, conduits, and power lines along the aqueduct were <strong>dynamited 17 times</strong>. The City of Los Angeles dispatched private armed detectives, stationed snipers with searchlights along the mountain channels, and patrolled canal roads in armored cars fitted with machine guns."
          },
          {
            h: "The Disappearance of Owens Lake",
            p: "Prior to the aqueduct, Owens Lake was a 100-square-mile navigable body of water with commercial steamships. By 1926, the complete diversion of its feeder streams left an alkaline salt flat. Dry winds whipped up blinding clouds of carcinogenic PM-10 dust, creating an environmental crisis that would take nearly a century and billions of dollars to remediate."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Owens Lake Dust Mitigation", d: "Since 2000, LADWP has spent over $2.5 billion installing gravel blankets, native vegetation, and shallow flooding across the dry lake bed to control dust storms." }
        ]
      },
      es: {
        title: "Las Guerras del Agua y el Secado del Lago Owens",
        address: "Compuertas Alabama Gates (Lone Pine, Condado de Inyo)",
        short: "4. Las Guerras del Agua",
        timeline: [
          { y: "1924", t: "Más de 700 residentes toman las compuertas de Alabama Gates, regresando el agua a su cauce natural." },
          { y: "1926", t: "El lago Owens se seca por completo, convirtiéndose en una fuente grave de polvo alcalino." },
          { y: "1927", t: "Rancheros dinamitan el acueducto 17 veces; LA envía patrullas blindadas con guardias armados." },
          { y: "1927", t: "Quiebran los bancos de los hermanos Watterson, terminando con la resistencia financiera local." }
        ],
        people: [
          { name: "Hermanos Watterson", role: "Banqueros y Líderes Locales", bio: "Encabezaron la oposición comunitaria contra el LADWP hasta que sus instituciones financieras quebraron bajo cargos de fraude." },
          { name: "Mary Austin", role: "Escritora y Cronista", bio: "Autora de 'The Land of Little Rain' que documentó la riqueza natural y el posterior impacto ambiental en Owens Valley." },
          { name: "Sheriff J. Frank McKay", role: "Alguacil del Condado de Inyo", bio: "Autoridad local que simpatizó con los agricultores, negándose a desalojar o arrestar a los manifestantes en las compuertas." }
        ],
        stories: [
          {
            h: "La Toma de Alabama Gates (1924)",
            p: "Durante una dura sequía en los años 20, Los Ángeles desvió casi todo el caudal superficial y subterráneo del valle, secando los sembradíos locales. El 16 de noviembre de 1924, cientos de rancheros ocuparon las compuertas de <strong>Alabama Gates</strong> en Lone Pine y abrieron los desagües para vaciar el acueducto. La manifestación se convirtió en una protesta pacífica comunitaria con música y comida campestre."
          },
          {
            h: "Dinamita en el Desierto",
            p: "Hacia 1927, el descontento derivó en atentados nocturnos. Los ductos y sifones de concreto fueron <strong>volados con dinamita en 17 ocasiones</strong>. El Departamento de Agua de LA respondió enviando guardias armados con reflectores y vehículos blindados con ametralladoras para patrullar el canal en el desierto."
          },
          {
            h: "La Desaparición del Lago Owens",
            p: "Antes del acueducto, el lago Owens cubría más de 100 millas cuadradas y era navegado por barcos de vapor. Para 1926, al cortarse los ríos tributarios, el lago se evaporó por completo, dejando un manto de salitre que generaba densas tolvaneras de polvo tóxico arrastradas por el viento."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Mitigación Ambiental", d: "Desde el año 2000, LADWP ha invertido más de $2,500 millones de dólares en proyectos de vegetación y riego controlado sobre el lecho seco del lago Owens para frenar las tormentas de polvo." }
        ]
      }
    },

    // CHAPTER 5: The St. Francis Dam Disaster (1928)
    {
      id: 5,
      mapUrl: "https://maps.google.com/?q=St+Francis+Dam+Disaster+Site",
      en: {
        title: "The St. Francis Dam Collapse & Mulholland's Fall",
        address: "San Francisquito Canyon (Santa Clarita, CA)",
        short: "5. St. Francis Dam Collapse",
        timeline: [
          { y: "1926", t: "LADWP completes the 185-foot curved concrete St. Francis Dam to store 12 billion gallons of reserve water." },
          { y: "March 12, 1928 (Noon)", t: "Mulholland inspects muddy seepage leaks at the base and declares the structure sound." },
          { y: "March 12, 1928 (11:57 PM)", t: "The dam collapses catastrophically, sending a 140-foot wall of water down the canyon." },
          { y: "1929", t: "Mulholland resigns in grief and public disgrace after accepting full responsibility at the inquest." }
        ],
        people: [
          { name: "William Mulholland", role: "Chief Engineer & Dam Designer", bio: "His failure to detect unstable paleolithic rock formations and his unilateral decisions to raise the dam height led to Southern California's worst civil engineering disaster." },
          { name: "Tony Harnischfeger", role: "Dam Keeper", bio: "Lived in a cabin beneath the structure; alerted Mulholland to muddy leaks on the morning of March 12 and died alongside his family when the dam burst at midnight." },
          { name: "Thornton Edwards", role: "Santa Paula Motorcycle Officer", bio: "The 'Midnight Rider' who sped ahead of the 20-foot flood crest in darkness with sirens wailing, saving hundreds of sleeping valley residents." }
        ],
        stories: [
          {
            h: "The 12-Billion-Gallon Reservoir",
            p: "To buffer against aqueduct bombings in Owens Valley, Mulholland designed the <strong>St. Francis Dam</strong> in San Francisquito Canyon north of modern Santa Clarita. To expand capacity, Mulholland raised the dam's height twice during construction without widening its base. Unknown to engineers at the time, the eastern abutment rested against an ancient prehistoric landslide, and the western flank was anchored to soft, water-soluble red conglomerate rock."
          },
          {
            h: "Midnight Deluge: The Santa Clara Valley",
            p: "At <strong>11:57 PM on March 12, 1928</strong>, the structure gave way. A 140-foot wall of water crashed down the canyon, sweeping away the heavy concrete powerhouse and its workers. Traveling at 18 miles per hour, the surge entered the Santa Clara River, destroying towns including Castaic, Piru, Fillmore, Santa Paula, and Saticoy before emptying into the Pacific Ocean near Ventura at 5:30 AM. Over <strong>400 lives were lost</strong>."
          },
          {
            h: "'I Envy the Dead' (The Inquest)",
            p: "At the coroner's inquest, an emotionally broken Mulholland testified: <em>'Don't blame anyone else, you just fasten it on me. If there was an error in human judgment, I was the human, and I won't try to fasten it on anyone else. The only ones I envy about this whole thing are the ones who are dead.'</em> The tragedy ended his career, led to the creation of California's strict Dam Safety Division, and reshaped modern civil engineering oversight."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "National Memorial Site", d: "In 2019, Congress designated the ruins in San Francisquito Canyon as the Saint Francis Dam Disaster National Memorial, preserving the surviving concrete fragments." }
        ]
      },
      es: {
        title: "El Colapso de la Presa San Francis y la Caída de Mulholland",
        address: "Cañón San Francisquito (Santa Clarita, CA)",
        short: "5. Tragedia de San Francis",
        timeline: [
          { y: "1926", t: "LADWP concluye la presa de concreto de 185 pies para almacenar 12,000 millones de galones de reserva." },
          { y: "12 mar 1928 (Mediodía)", t: "Mulholland inspecciona filtraciones de lodo en la base y declara que la presa es segura." },
          { y: "12 mar 1928 (11:57 PM)", t: "La estructura colapsa, liberando una ola destructiva de más de 140 pies de altura." },
          { y: "1929", t: "Mulholland renuncia a su cargo tras asumir toda la responsabilidad en la investigación oficial." }
        ],
        people: [
          { name: "William Mulholland", role: "Diseñador e Ingeniero en Jefe", bio: "No detectó fallas geológicas en el cañón y aumentó la altura del muro sin ensanchar los cimientos, lo que derivó en la mayor catástrofe civil del estado." },
          { name: "Tony Harnischfeger", role: "Guardián de la Presa", bio: "Habitaba al pie de la presa; alertó a Mulholland sobre las filtraciones horas antes y pereció junto a su familia en la primera oleada." },
          { name: "Thornton Edwards", role: "Oficial de Policía en Motocicleta", bio: "El 'Jinete de Medianoche' de Santa Paula que recorrió las calles con sirena abierta alertando a las familias antes de la llegada de la riada." }
        ],
        stories: [
          {
            h: "Un Depósito de Emergencia",
            p: "Para resguardar el suministro ante los atentados en Owens Valley, Mulholland construyó la <strong>Presa San Francis</strong> al norte de Santa Clarita. Durante la obra decidió elevar dos veces la altura de la cortina de concreto sin ampliar el grosor de la base. Los extremos de la presa descansaban sobre formaciones rocosas inestables y solubles al agua."
          },
          {
            h: "Tragedia a Medianoche en el Valle",
            p: "A las <strong>11:57 PM del 12 de marzo de 1928</strong>, la presa cedió de golpe. Una ola de 140 pies arrasó la planta hidroeléctrica del cañón y avanzó por el cauce del río Santa Clara, destruyendo comunidades enteras en Castaic, Piru, Fillmore y Santa Paula hasta desembocar en el océano Pacífico a las 5:30 AM. Murieron más de <strong>400 personas</strong>."
          },
          {
            h: "'Envidio a los Muertos'",
            p: "Durante el juicio forense, Mulholland asumió toda la culpa visiblemente afectado: <em>'No culpen a nadie más; impútenmelo a mí. Si hubo un error de juicio humano, yo fui ese humano... a los únicos que envidio de todo esto es a los que murieron'</em>. El desastre puso fin a su trayectoria y forzó la creación de leyes estrictas de seguridad de presas en California."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "Monumento Nacional", d: "En 2019, el Congreso de EE. UU. designó el sitio del desastre en San Francisquito Canyon como Monumento Nacional, protegiendo los restos de concreto que aún permanecen." }
        ]
      }
    },

    // CHAPTER 6: Taming the Colorado & The MWD Era (1928–1941)
    {
      id: 6,
      mapUrl: "https://maps.google.com/?q=Lake+Mathews+Riverside",
      en: {
        title: "Taming the Colorado & The Metropolitan Water District",
        address: "Lake Mathews Terminal Reservoir (Riverside County)",
        short: "6. Colorado River Era",
        timeline: [
          { y: "1928", t: "The California Legislature charters the Metropolitan Water District of Southern California (MWD)." },
          { y: "1931", t: "Southern California voters pass a $220M bond during the Great Depression to build the Colorado River Aqueduct." },
          { y: "1939", t: "Crews complete 242 miles of desert conduits and five massive mountain pumping plants." },
          { y: "1941", t: "The first Colorado River water reaches the Lake Mathews terminal reservoir in Riverside County." }
        ],
        people: [
          { name: "William P. Whitsett", role: "First Chairman of the MWD Board", bio: "San Fernando Valley developer who built the multi-city political coalition uniting 13 founding cities across Southern California to finance regional water imports." },
          { name: "Frank E. Weymouth", role: "Chief Engineer & General Manager, MWD", bio: "Engineered the Colorado River Aqueduct, designing high-lift pumping systems that raised water over desert mountain passes." },
          { name: "Herbert Hoover", role: "Secretary of Commerce & U.S. President", bio: "Brokered the multi-state 1922 Colorado River Compact and championed the construction of Boulder Dam (Hoover Dam)." }
        ],
        stories: [
          {
            h: "Beyond Mulholland: The Regional MWD Coalition",
            p: "Following the St. Francis disaster, Los Angeles abandoned unilateral aqueduct construction in favor of regional cooperation. In 1928, the state established the <strong>Metropolitan Water District of Southern California (MWD)</strong>. Thirteen charter cities—including Los Angeles, Pasadena, Glendale, Burbank, Anaheim, and Santa Monica—banded together to secure water from the Colorado River, over 240 miles east."
          },
          {
            h: "Lifting Water 1,617 Feet Across the Desert",
            p: "Unlike the gravity-fed Owens Valley aqueduct, the <strong>Colorado River Aqueduct</strong> faced the jagged desert ranges of eastern California. Chief Engineer <strong>Frank Weymouth</strong> solved the challenge with five mammoth pumping stations powered by hydroelectricity from Hoover Dam. The pumps hoisted billions of gallons of water a total of 1,617 vertical feet over mountain ridges."
          },
          {
            h: "Depression-Era Lifeline & Post-War Expansion",
            p: "Funded by a $220 million bond measure in 1931, the project employed more than 35,000 workers during the height of the Great Depression. When deliveries began in 1941 at <strong>Lake Mathews</strong>, the system provided the indispensable freshwater foundation that supported Southern California's World War II aerospace boom and post-war suburban growth."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "The Colorado River Compact", d: "The 1922 interstate compact divided river water based on unusually wet historical years, causing long-term structural overallocation that Western states continue to negotiate today." }
        ]
      },
      es: {
        title: "El Río Colorado y el Distrito Metropolitano (MWD)",
        address: "Embalse Terminal Lake Mathews (Condado de Riverside)",
        short: "6. Era del Río Colorado",
        timeline: [
          { y: "1928", t: "La Legislatura de California autoriza la creación del Distrito Metropolitano de Agua del Sur (MWD)." },
          { y: "1931", t: "Votantes aprueban bonos por $220 millones durante la Gran Depresión para el Acueducto del Colorado." },
          { y: "1939", t: "Se concluyen 242 millas de canales, túneles y cinco plantas de bombeo en el desierto." },
          { y: "1941", t: "Llega la primera entrega de agua del río Colorado al embalse terminal de Lake Mathews." }
        ],
        people: [
          { name: "William P. Whitsett", role: "Primer Presidente del MWD", bio: "Líder regional que consolidó la alianza entre 13 ciudades fundadoras del sur del estado para costear la infraestructura del Colorado." },
          { name: "Frank E. Weymouth", role: "Ingeniero en Jefe del MWD", bio: "Diseñó el Acueducto del Río Colorado, incorporando complejos sistemas de bombeo para elevar el caudal sobre cordilleras." },
          { name: "Herbert Hoover", role: "Secretario de Comercio y Presidente", bio: "Negoció el Tratado del Río Colorado de 1922 e impulsó la construcción de la emblemática Presa Hoover." }
        ],
        stories: [
          {
            h: "Alianza Regional: La Creación del MWD",
            p: "Tras el colapso de la Presa San Francis, Los Ángeles dejó atrás los proyectos independientes y apostó por la cooperación regional. En 1928 nació el <strong>Metropolitan Water District (MWD)</strong>, uniendo a 13 ciudades fundadoras (como LA, Pasadena, Glendale, Burbank, Anaheim y Santa Mónica) para traer agua desde el caudaloso río Colorado."
          },
          {
            h: "Elevando el Agua 1,617 Pies sobre las Montañas",
            p: "A diferencia del primer acueducto que funcionaba por gravedad, el <strong>Acueducto del Río Colorado</strong> debía sortear desiertos y cadenas montañosas. El ingeniero <strong>Frank Weymouth</strong> instaló cinco grandes estaciones de bombeo impulsadas por la energía de la Presa Hoover, elevando el agua 1,617 pies sobre los pasos serranos."
          },
          {
            h: "Motor de Empleo y Auge Industrial",
            p: "Financiado en 1931 en plena Gran Depresión, el proyecto dio trabajo a más de 35,000 personas. Al inaugurarse el embalse de <strong>Lake Mathews</strong> en 1941, este suministro garantizó el agua necesaria para la industria militar durante la Segunda Guerra Mundial y la subsecuente expansión suburbana."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "El Tratado del Río Colorado", d: "El pacto de 1922 dividió el agua tomando como base años excepcionalmente lluviosos, lo que generó un déficit histórico que los estados de la cuenca siguen negociando en la actualidad." }
        ]
      }
    },

    // CHAPTER 7: Paving the River & The State Water Project (1938–1973)
    {
      id: 7,
      mapUrl: "https://maps.google.com/?q=Los+Angeles+River+Glendale+Narrows",
      en: {
        title: "Paving the River & The State Water Project",
        address: "Glendale Narrows (LA River Bike Path & Riverdale Ave)",
        short: "7. The Concrete River",
        timeline: [
          { y: "1938", t: "The Great Flood of 1938 kills 115 people and causes massive property destruction across LA County." },
          { y: "1938–1960", t: "The U.S. Army Corps of Engineers encases 51 miles of the Los Angeles River in 3.5 million barrels of concrete." },
          { y: "1960", t: "California voters pass the Burns-Porter Act funding the statewide California Aqueduct." },
          { y: "1973", t: "The Edmonston Pumping Plant begins lifting Northern California water 1,926 feet over the Tehachapi Mountains." }
        ],
        people: [
          { name: "Major Theodore Wyman", role: "U.S. Army Corps of Engineers District Chief", bio: "Directed the systematic channelization and concrete paving of the Los Angeles River to eliminate urban flood risks." },
          { name: "Edmund G. 'Pat' Brown", role: "Governor of California", bio: "Championed the 444-mile California Aqueduct and State Water Project, moving snowmelt from the Sacramento Delta to Southern California." },
          { name: "Arthur Powell Davis", role: "Reclamation Engineer", bio: "Pioneered early master planning for comprehensive statewide river capture and multi-basin canal transfers." }
        ],
        stories: [
          {
            h: "The 1938 Cataclysm & Channelization",
            p: "In early March 1938, consecutive storms dumped torrential rains across the San Gabriel Mountains. The Los Angeles River burst its banks, killing 115 people and cutting off city communications. Responding to civic panic, the federal government tasked the <strong>U.S. Army Corps of Engineers</strong> with flood control. Over two decades, engineers encased <strong>51 of the river's 52 miles in a concrete channel</strong>, transforming a natural willow-lined waterway into a storm drain."
          },
          {
            h: "The State Water Project: The Longest Straw",
            p: "Under Governor <strong>Pat Brown</strong> in 1960, California voters authorized the <strong>State Water Project</strong>. The centerpiece was the 444-mile <strong>California Aqueduct</strong>, carrying runoff from the snow-fed Feather River and the Sacramento-San Joaquin Delta straight down the Central Valley to supply Southern California urban centers."
          },
          {
            h: "The Tehachapi Lift: Moving Rivers Over Mountains",
            p: "Reaching Southern California required crossing the formidable Tehachapi Mountains. In 1973, the state brought online the <strong>Edmonston Pumping Plant</strong> at the southern edge of the Central Valley. Operating 80,000-horsepower motor units, the plant lifts water <strong>1,926 vertical feet in a single push</strong>—the highest single-lift water pump system on Earth."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "The Glendale Narrows Soft Bottom", d: "In the Glendale Narrows section of the LA River, the groundwater table was so high that concrete could not be poured; this left a natural soft riverbed with lush islands, ducks, and tall willows." }
        ]
      },
      es: {
        title: "El Río Encementado y el Acueducto de California",
        address: "Glendale Narrows (Paseo Ciclista del Río de LA)",
        short: "7. El Río de Concreto",
        timeline: [
          { y: "1938", t: "La Gran Inundación de 1938 deja 115 muertos y causa graves daños en todo el condado." },
          { y: "1938–1960", t: "El Cuerpo de Ingenieros del Ejército recubre 51 millas del río con 3.5 millones de barriles de concreto." },
          { y: "1960", t: "Votantes aprueban el Proyecto Estatal de Agua y la construcción del Acueducto de California." },
          { y: "1973", t: "La Planta Edmonston comienza a bombear agua del norte 1,926 pies sobre las montañas Tehachapi." }
        ],
        people: [
          { name: "Mayor Theodore Wyman", role: "Jefe de Ingenieros del Ejército", bio: "Supervisó la canalización y el recubrimiento de concreto del lecho del río para evitar desbordamientos urbanos." },
          { name: "Edmund G. 'Pat' Brown", role: "Gobernador de California", bio: "Impulsó el Acueducto de California de 444 millas, transportando agua desde el norte del estado hasta el sur." },
          { name: "Arthur Powell Davis", role: "Ingeniero Hidráulico", bio: "Diseñó los primeros modelos técnicos para la transferencia de cuencas a gran escala en California." }
        ],
        stories: [
          {
            h: "La Inundación de 1938 y la Canalización",
            p: "En marzo de 1938, lluvias torrenciales desbordaron el río de Los Ángeles, cobrando 115 vidas y destruyendo puentes y vecindarios. En respuesta, el <strong>Cuerpo de Ingenieros del Ejército</strong> asumió el control del cauce. En las dos décadas siguientes, cubrieron <strong>51 de sus 52 millas con losas de concreto</strong>, convirtiendo un río natural en un canal de desagüe pluvial."
          },
          {
            h: "El Proyecto Estatal: El Acueducto de California",
            p: "En 1960, bajo la gestión del gobernador <strong>Pat Brown</strong>, se aprobó el <strong>Proyecto Estatal de Agua</strong>. Su columna vertebral, el <strong>Acueducto de California</strong> (444 millas), recolecta agua del río Feather y del delta de Sacramento para enviarla hacia el sur a través del Valle Central."
          },
          {
            h: "La Planta Edmonston y el Salto Tehachapi",
            p: "Para ingresar a la cuenca angelina, el agua debía superar la cordillera Tehachapi. En 1973 se inauguró la <strong>Planta de Bombeo Edmonston</strong>. Con motores de 80,000 caballos de fuerza, la estación eleva el agua <strong>1,926 pies verticales en un solo impulso</strong>, marcando el récord mundial de elevación continua de agua."
          }
        ],
        callouts: [
          { cls: "box-tip", t: "El Fondo Natural de Glendale Narrows", d: "En el tramo de Glendale Narrows, el nivel del agua subterránea era tan alto que impidió colar concreto, conservando un lecho natural con sauces, garzas y peces." }
        ]
      }
    },

    // CHAPTER 8: Mono Lake, Conservation & River Revival (1979–Present)
    {
      id: 8,
      mapUrl: "https://maps.google.com/?q=Los+Angeles+State+Historic+Park",
      en: {
        title: "Mono Lake, Conservation & The River Revival",
        address: "LA State Historic Park & Taylor Yard (Bowtie Parcel)",
        short: "8. River Revival & Future",
        timeline: [
          { y: "1970", t: "LADWP completes the Second LA Aqueduct, increasing diversions from streams feeding Mono Lake." },
          { y: "1979", t: "The Mono Lake Committee files a historic lawsuit to stop ecological destruction of the saline lake." },
          { y: "1983", t: "The California Supreme Court issues the landmark Public Trust Doctrine ruling in National Audubon Society v. Superior Court." },
          { y: "1986", t: "Poet Lewis MacAdams founds Friends of the Los Angeles River (FoLAR), sparking the movement to revitalize the concrete channel." }
        ],
        people: [
          { name: "David Gaines", role: "Biologist & Mono Lake Defender", bio: "Co-founded the Mono Lake Committee in 1978, using grassroots science to demonstrate how stream diversions threatened millions of migratory birds." },
          { name: "Dorothy Green", role: "Environmental Leader & LADWP Commissioner", bio: "Founding president of Heal the Bay who championed urban stormwater capture, water recycling, and coastal restoration." },
          { name: "Lewis MacAdams", role: "Poet & Founder of FoLAR", bio: "Broke through river fences with wire cutters in 1986, creating a decades-long movement to naturalize the concrete river and return native wildlife." }
        ],
        stories: [
          {
            h: "The Battle for Mono Lake & The Public Trust",
            p: "When LADWP expanded diversions in 1970, <strong>Mono Lake</strong> dropped over 40 vertical feet, exposing land bridges that let predators reach gull rookeries. Led by biologist <strong>David Gaines</strong>, conservationists sued under the ancient Roman legal principle of the <strong>Public Trust Doctrine</strong>. In 1983, the California Supreme Court ruled that the state has an ongoing duty to protect navigable waterways and wildlife habitats, forcing LA to reduce diversions."
          },
          {
            h: "Lewis MacAdams & The River Renaissance",
            p: "In 1986, poet and activist <strong>Lewis MacAdams</strong> and friends cut a hole in the chain-link fence along the concrete river, declaring it a living ecosystem. He founded <strong>Friends of the Los Angeles River (FoLAR)</strong>, advocating for bike paths, public parks, kayak recreation, and green wetlands. Today, master plans are revitalizing riverfront sites like the <em>Taylor Yard Bowtie parcel</em>."
          },
          {
            h: "Closing the Loop: 100% Water Recycling",
            p: "Facing recurrent Sierra droughts and Colorado River deficits, Los Angeles is shifting from water importation to local resilience. Projects like <strong>Pure Water Southern California</strong> and LADWP's <strong>Operation NEXT</strong> are retrofitting the Hyperion Water Reclamation Plant to purify 100% of municipal wastewater, transforming LA from a water-dependent desert outpost into a circular water economy."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Pure Water Southern California", d: "When completed, the regional water recycling facility in Carson will produce 150 million gallons of purified drinking water every single day—enough for 1.5 million residents." }
        ]
      },
      es: {
        title: "El Lago Mono, Conservación y el Renacimiento del Río",
        address: "Parque Histórico Estatal de LA y Taylor Yard",
        short: "8. Renacimiento y Futuro",
        timeline: [
          { y: "1970", t: "LADWP concluye el Segundo Acueducto, aumentando el desvío de los ríos del lago Mono." },
          { y: "1979", t: "El Comité del Lago Mono demanda al municipio para frenar la degradación ecológica del lago." },
          { y: "1983", t: "La Suprema Corte de California emite un fallo histórico aplicando la Doctrina de Fideicomiso Público." },
          { y: "1986", t: "El poeta Lewis MacAdams funda FoLAR, iniciando el movimiento para recuperar el río de LA." }
        ],
        people: [
          { name: "David Gaines", role: "Biólogo y Defensor del Lago Mono", bio: "Cofundó el Comité del Lago Mono en 1978, demostrando con estudios científicos el impacto del desvío de agua en aves migratorias." },
          { name: "Dorothy Green", role: "Ambientalista y Comisionada de LADWP", bio: "Fundadora de Heal the Bay que lideró proyectos de captación de lluvia, reciclaje de agua y limpieza costera." },
          { name: "Lewis MacAdams", role: "Poeta y Fundador de FoLAR", bio: "Cortó las cercas metálicas del río en 1986 para iniciar el movimiento ciudadano que busca renaturalizar el cauce de concreto." }
        ],
        stories: [
          {
            h: "La Batalla del Lago Mono y la Doctrina Pública",
            p: "Al ampliarse las extracciones en 1970, el nivel del <strong>Lago Mono</strong> bajó más de 40 pies, exponiendo puentes de tierra que permitieron a depredadores atacar nidos de aves migratorias. Guiados por el biólogo <strong>David Gaines</strong>, defensores ambientales recurrieron a la <strong>Doctrina de Fideicomiso Público</strong>. En 1983, la Suprema Corte estatal determinó que el estado debe proteger el valor ecológico de los cuerpos de agua, obligando a LA a reducir las extracciones."
          },
          {
            h: "Lewis MacAdams y el Retorno del Río",
            p: "En 1986, el poeta <strong>Lewis MacAdams</strong> cortó la cerca de alambre del canal de concreto y fundó <strong>Friends of the Los Angeles River (FoLAR)</strong>. Su iniciativa transformó la percepción del río, abriendo veredas para bicicletas, paseos peatonales y áreas verdes en antiguos talleres ferroviarios como <em>Taylor Yard</em>."
          },
          {
            h: "Hacia el Reciclaje Total de Agua",
            p: "Ante las sequías recurrentes en la sierra y las mermas en el río Colorado, Los Ángeles invierte en sustentabilidad local. Iniciativas como <strong>Pure Water Southern California</strong> y <strong>Operation NEXT</strong> modernizan plantas como Hyperion para reciclar el 100% de las aguas residuales de la ciudad y reinyectarlas a los mantos acuíferos."
          }
        ],
        callouts: [
          { cls: "box-lore", t: "Agua Pura del Sur de California", d: "La planta de reciclaje regional en Carson producirá 150 millones de galones diarios de agua purificada, suficiente para abastecer a 1.5 millones de personas." }
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

  // Stepper Navigation Buttons
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
