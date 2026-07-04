export const PLATFORM_PROFILES = {
  tiktok: {
    label: "TikTok",
    hashtags: ["#TikTok", "#ParaTi", "#FYP"],
    editingTips: [
      "Abre con el resultado antes del segundo dos y usa subtítulos grandes en bloques de tres a cinco palabras.",
      "Elimina toda pausa inicial, añade un cambio visual cada dos segundos y cierra con una pregunta breve.",
      "Usa un primer plano para el hook, cortes rápidos en la explicación y un zoom sutil en el giro final."
    ]
  },
  instagram: {
    label: "Instagram Reels",
    hashtags: ["#Reels", "#ReelsEspañol", "#ContenidoDigital"],
    editingTips: [
      "Combina subtítulos limpios con B-roll aspiracional y deja el mensaje principal visible al final.",
      "Empieza con una frase en pantalla que funcione sin audio y mantén una composición visual consistente.",
      "Usa cortes precisos, una pista en tendencia a volumen bajo y termina con una invitación a guardar el reel."
    ]
  },
  youtube: {
    label: "YouTube Shorts",
    hashtags: ["#Shorts", "#YouTubeShorts", "#AprendeEnYouTube"],
    editingTips: [
      "Plantea una promesa clara al inicio, desarrolla una sola idea y reserva la respuesta completa para el cierre.",
      "Usa una progresión visual en tres partes: problema, descubrimiento y resultado.",
      "Mantén los elementos importantes en el centro del encuadre y refuerza cada transición con texto breve."
    ]
  },
  kick: {
    label: "Kick",
    hashtags: ["#KickStreaming", "#KickClips", "#Streamer"],
    editingTips: [
      "Conserva la reacción auténtica, recorta el contexto a una sola frase y destaca el chat en el momento clave.",
      "Empieza medio segundo antes de la reacción y añade un replay corto del instante decisivo.",
      "Alterna entre gameplay, cámara y chat para que el momento se entienda sin haber visto el stream completo."
    ]
  },
  twitch: {
    label: "Twitch",
    hashtags: ["#Twitch", "#TwitchClips", "#Streaming"],
    editingTips: [
      "Usa el mensaje del chat como contexto inicial y deja que la reacción del streamer sea el remate.",
      "Recorta silencios, conserva el audio ambiente y añade un punch-in justo antes del momento inesperado.",
      "Incluye una barra de progreso sutil para anticipar el desenlace y mantener la retención."
    ]
  }
};

export const STYLE_PROFILES = {
  dynamic: {
    label: "dinámico",
    hookTemplates: [
      "Esto pasó justo cuando pensé que ya tenía todo bajo control.",
      "En menos de un minuto entendí por qué {insight}.",
      "El momento cambió por completo cuando ocurrió esto.",
      "Si haces {topic}, presta atención a los próximos segundos."
    ],
    titleTemplates: [
      "El giro que nadie vio venir",
      "Todo cambió en este momento",
      "El error que casi arruina el resultado",
      "Esto no estaba en el plan"
    ],
    hashtags: ["#ContenidoDinamico", "#MomentoClave", "#NoTeLoPierdas"]
  },
  educational: {
    label: "educativo",
    hookTemplates: [
      "Si estás intentando {topic}, necesitas entender esto primero.",
      "La mayoría aprende esta lección demasiado tarde: {insight}.",
      "Este error parece pequeño, pero cambia por completo el resultado.",
      "Te explico en menos de un minuto lo que me tomó meses entender."
    ],
    titleTemplates: [
      "La regla que cambia la forma de hacerlo",
      "Lo que debes saber antes de empezar",
      "La lección que aprendí demasiado tarde",
      "Tres señales que no deberías ignorar"
    ],
    hashtags: ["#Aprende", "#Consejos", "#EducacionDigital"]
  },
  storytelling: {
    label: "storytelling",
    hookTemplates: [
      "Todo iba bien hasta que tomé una decisión que no podía deshacer.",
      "Pensé que sería un día normal, pero terminó cambiando todo lo que creía sobre este tema.",
      "Esta historia comienza con un error y termina con una lección inesperada.",
      "Estuve a punto de abandonar justo antes de que todo comenzara a funcionar."
    ],
    titleTemplates: [
      "La decisión que cambió toda la historia",
      "Estuve a punto de abandonar aquí",
      "El día que todo salió distinto",
      "No entendí la señal hasta que fue tarde"
    ],
    hashtags: ["#Storytime", "#HistoriaReal", "#Experiencias"]
  },
  controversial: {
    label: "provocador",
    hookTemplates: [
      "Voy a decir algo que muchos no quieren escuchar sobre {topic}.",
      "El consejo más repetido sobre esto también puede ser el más dañino.",
      "No, trabajar más no siempre mejora el resultado. Este es el motivo.",
      "La opinión popular se equivoca en un detalle importante: {insight}."
    ],
    titleTemplates: [
      "La verdad incómoda que nadie menciona",
      "Este consejo popular no funciona",
      "Por qué dejé de seguir la regla",
      "La opinión que divide a los creadores"
    ],
    hashtags: ["#Opinion", "#Debate", "#VerdadIncomoda"]
  },
  inspirational: {
    label: "inspirador",
    hookTemplates: [
      "Si hoy sientes que no avanzas, necesitas escuchar esto.",
      "El resultado llegó después del momento en que casi decidí rendirme.",
      "No necesitas tener todo resuelto para empezar a {topic}.",
      "A veces el progreso comienza cuando aceptas que {insight}."
    ],
    titleTemplates: [
      "El progreso que no podía ver",
      "Empezar antes de sentirte listo",
      "La razón por la que seguí intentándolo",
      "Un recordatorio para los días difíciles"
    ],
    hashtags: ["#Motivacion", "#Crecimiento", "#SigueAdelante"]
  },
  humorous: {
    label: "humorístico",
    hookTemplates: [
      "Yo entrando confiado, sin saber que todo estaba a punto de salir mal.",
      "El plan era simple. La realidad tenía otros planes.",
      "Nadie me preparó para esta parte de {topic}.",
      "Este es el segundo exacto en que mi gran idea dejó de ser una gran idea."
    ],
    titleTemplates: [
      "Expectativa contra realidad",
      "Mi plan duró exactamente cinco minutos",
      "Todo bajo control, claramente",
      "El tutorial olvidó mencionar esta parte"
    ],
    hashtags: ["#Humor", "#Fail", "#ExpectativaVsRealidad"]
  }
};

export const AUDIENCE_PROFILES = {
  general: {
    label: "audiencia general",
    callToActions: ["¿Te ha pasado algo parecido?", "Guárdalo para recordarlo después.", "¿Qué habrías hecho tú?"],
    hashtags: ["#ParaTodos", "#Descubre", "#EnEspañol"]
  },
  creators: {
    label: "creadores de contenido",
    callToActions: ["Guárdalo para tu próxima sesión de contenido.", "¿Qué cambiarías en tu proceso creativo?", "Compártelo con otro creador."],
    hashtags: ["#Creadores", "#CreadorDeContenido", "#ContentCreator"]
  },
  gamers: {
    label: "gamers y streamers",
    callToActions: ["¿Te habría pasado lo mismo en directo?", "Etiqueta a tu compañero de squad.", "¿Cuál ha sido tu mejor momento en stream?"],
    hashtags: ["#Gaming", "#Gamers", "#Streamers"]
  },
  entrepreneurs: {
    label: "emprendedores",
    callToActions: ["Guárdalo antes de tomar tu próxima decisión.", "¿Qué lección te dejó tu primer proyecto?", "Compártelo con alguien que esté empezando."],
    hashtags: ["#Emprendedores", "#Negocios", "#Emprendimiento"]
  },
  professionals: {
    label: "profesionales",
    callToActions: ["¿Aplicarías esta idea en tu trabajo?", "Guárdalo para tu próximo proyecto.", "Compártelo con tu equipo."],
    hashtags: ["#Profesionales", "#Carrera", "#Productividad"]
  },
  students: {
    label: "estudiantes",
    callToActions: ["Guárdalo para tu próxima sesión de estudio.", "¿Qué te habría gustado saber antes?", "Envíalo a tu grupo de estudio."],
    hashtags: ["#Estudiantes", "#Estudio", "#Aprendizaje"]
  }
};

export const TOPIC_PROFILES = [
  {
    key: "business",
    keywords: ["negocio", "tienda", "cliente", "ventas", "empresa", "emprend", "dinero", "marca"],
    topic: "hacer crecer un proyecto",
    insights: ["crecer sin dirección también puede ser una forma de retroceder", "la decisión más rentable no siempre es la más obvia", "escuchar al cliente cambia el producto"],
    hashtags: ["#NegociosDigitales", "#Emprender", "#Marketing"]
  },
  {
    key: "gaming",
    keywords: ["juego", "gameplay", "partida", "rango", "equipo", "stream", "twitch", "kick", "gamer"],
    topic: "mejorar dentro y fuera del juego",
    insights: ["la mejor jugada comienza antes de tocar el control", "mantener la calma también es una habilidad", "un pequeño error puede cambiar toda la partida"],
    hashtags: ["#GamingClips", "#Gameplay", "#ComunidadGamer"]
  },
  {
    key: "technology",
    keywords: ["tecnología", "codigo", "código", "program", "web", "app", "software", "inteligencia artificial", "ia"],
    topic: "construir con tecnología",
    insights: ["la solución simple suele llegar después de entender bien el problema", "automatizar un mal proceso solo lo hace fallar más rápido", "terminar una versión pequeña enseña más que planear una perfecta"],
    hashtags: ["#Tecnologia", "#Programacion", "#DesarrolloWeb"]
  },
  {
    key: "learning",
    keywords: ["aprender", "curso", "estudio", "estudiante", "enseñar", "libro", "clase", "examen"],
    topic: "aprender de forma más inteligente",
    insights: ["recordar no es lo mismo que comprender", "practicar poco y seguido supera a estudiar todo de una vez", "equivocarse rápido acelera el aprendizaje"],
    hashtags: ["#Aprendizaje", "#Estudiar", "#Educacion"]
  },
  {
    key: "wellness",
    keywords: ["salud", "ejercicio", "gym", "entren", "hábito", "habito", "rutina", "bienestar", "mental"],
    topic: "crear hábitos que duren",
    insights: ["la constancia imperfecta supera a la intensidad ocasional", "un sistema sencillo vence a la motivación", "descansar también forma parte del progreso"],
    hashtags: ["#Habitos", "#Bienestar", "#VidaSaludable"]
  },
  {
    key: "creativity",
    keywords: ["contenido", "video", "editar", "creador", "diseño", "arte", "creativ", "podcast", "youtube"],
    topic: "crear contenido con intención",
    insights: ["una idea clara vale más que diez efectos", "publicar también forma parte del proceso creativo", "la conexión comienza con una historia específica"],
    hashtags: ["#Creatividad", "#Contenido", "#EdicionDeVideo"]
  }
];

export const DEFAULT_TOPIC_PROFILE = {
  key: "general",
  topic: "convertir una experiencia en una lección",
  insights: ["el detalle más pequeño puede contener la mejor historia", "el contexto cambia por completo una decisión", "una experiencia concreta conecta más que un consejo genérico"],
  hashtags: ["#Ideas", "#Experiencias", "#ContenidoEnEspañol"]
};

export const DESCRIPTION_TEMPLATES = [
  "El punto de partida es una situación muy concreta: {summary} El clip la convierte en una lección clara para {audience}. {callToAction}",
  "La historia comienza aquí: {summary} El cierre revela una idea difícil de olvidar. {callToAction}",
  "El momento central puede resumirse así: {summary} Con un ritmo {style}, deja una conclusión útil para {audience}. {callToAction}",
  "La narrativa sigue una decisión específica: {summary} El foco está en aquello que cambió el resultado. {callToAction}"
];

export const UNIVERSAL_EDITING_TIPS = [
  "Elimina cualquier saludo inicial y entra directamente en la frase con mayor tensión.",
  "Añade B-roll solo cuando aporte contexto; deja el rostro en pantalla durante la parte más emocional.",
  "Haz que la primera y la última frase se conecten para crear una sensación de cierre natural.",
  "Destaca una palabra clave por subtítulo y usa silencios muy breves antes de la revelación.",
  "Construye el clip alrededor de una sola idea y elimina cualquier explicación que no cambie el desenlace."
];
