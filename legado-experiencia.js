/*
 * LEGADO CÓSMICO · Extensión independiente / Standalone extension.
 * Bilingüe ES/EN + modo misión. No sustituye ni edita el código existente.
 * Funciona sobre el HTML original y reutiliza sus visores 3D.
 */
(() => {
  'use strict';

  const LANG_KEY = 'legado-cosmico-language-tab';
  let language = 'es';
  try { language = sessionStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'es'; } catch (_) {}
  const shouldAsk = (() => { try { return !sessionStorage.getItem(LANG_KEY); } catch (_) { return true; } })();

  const dictionary = {
    'LEGADO CÓSMICO — Museo espacial': 'COSMIC LEGACY — Space museum',
    'Legado Cósmico: explora las historias que dejaron las misiones espaciales.': 'Cosmic Legacy: explore the stories left behind by space missions.',
    'Legado Cósmico, inicio': 'Cosmic Legacy, home',
    'Navegación principal': 'Main navigation',
    'INICIO': 'HOME', 'EXPLORAR': 'EXPLORE', 'CUERPOS CELESTES': 'CELESTIAL BODIES',
    'MUSEO VIRTUAL': 'VIRTUAL MUSEUM',
    'UN VIAJE POR NUESTRO VECINDARIO CÓSMICO': 'A JOURNEY THROUGH OUR COSMIC NEIGHBORHOOD',
    'Las misiones terminan, pero sus descubrimientos permanecen.': 'Missions end, but their discoveries live on.',
    'Comenzar exploración': 'Begin exploring',
    'SELECCIONA UN': 'SELECT A', 'DESTINO': 'DESTINATION',
    'EL UNIVERSO EN MOVIMIENTO': 'THE UNIVERSE IN MOTION',
    'Sistema solar': 'An interactive', 'interactivo.': 'solar system.',
    'Recorre los ocho planetas en tres dimensiones. Gira la cámara, acércate y elige tu próximo destino.': 'Explore the eight planets in 3D. Rotate the camera, zoom in and choose your next destination.',
    '↶ VISTA GENERAL': '↶ OVERVIEW', 'VISTA GENERAL': 'OVERVIEW', 'Vista general': 'Overview',
    'PAUSAR': 'PAUSE', 'Pausar': 'Pause', 'Reanudar': 'Resume', 'REANUDAR': 'RESUME',
    'MODELO NASA ↗': 'NASA MODEL ↗', 'Velocidad ×1': 'Speed ×1', 'Velocidad ×2': 'Speed ×2', 'Velocidad ×0.5': 'Speed ×0.5',
    'ARRASTRA PARA GIRAR · RUEDA PARA ZOOM · SELECCIONA UN PLANETA': 'DRAG TO ROTATE · SCROLL TO ZOOM · SELECT A PLANET',
    'Mercurio': 'Mercury', 'La Luna': 'The Moon', 'La Tierra': 'Earth', 'Tierra': 'Earth',
    'Marte': 'Mars', 'Júpiter': 'Jupiter', 'Saturno': 'Saturn', 'Urano': 'Uranus', 'Neptuno': 'Neptune',
    'Visualización artística 3D · tamaños, distancias y velocidades no están a escala.': 'Artistic 3D visualization · sizes, distances and speeds are not to scale.',
    'PRIMERA PARADA': 'FIRST STOP', 'Un sistema.': 'One system.', 'Infinitas historias.': 'Endless stories.',
    'Ocho mundos, ocho paisajes y miles de preguntas por descubrir. Elige un cuerpo celeste para comenzar tu recorrido.': 'Eight worlds, eight landscapes, and thousands of questions to discover. Choose a celestial body to begin your journey.',
    '01 — SATÉLITE NATURAL': '01 — NATURAL SATELLITE', '02 — PLANETA ROCOSO': '02 — ROCKY PLANET',
    '03 — PLANETA ROCOSO': '03 — ROCKY PLANET', '04 — GIGANTE GASEOSO': '04 — GAS GIANT',
    '05 — PLANETA ROCOSO': '05 — ROCKY PLANET', '06 — GIGANTE GASEOSO': '06 — GAS GIANT',
    '07 — GIGANTE HELADO': '07 — ICE GIANT', '08 — GIGANTE HELADO': '08 — ICE GIANT',
    'Un archivo de impactos y huellas humanas.': 'An archive of impacts and human footprints.',
    'Nuestro hogar visto desde la inmensidad.': 'Our home seen from the vastness of space.',
    'El planeta que seguimos intentando comprender.': 'The planet we are still trying to understand.',
    'Un mundo de anillos.': 'A world of rings.',
    'EXPLORAR CUERPO': 'EXPLORE BODY', 'EXPLORAR CUERPO →': 'EXPLORE BODY →',
    'DESPLÁZATE PARA DESCUBRIR': 'SCROLL TO DISCOVER',
    'MODELOS 3D': '3D MODELS', 'Naves y': 'Spacecraft and', 'rovers.': 'rovers.',
    'SONDA ESPACIAL': 'SPACE PROBE', 'VER EN 360°': 'VIEW IN 360°',
    '← VOLVER': '← BACK', 'MODELO 3D': '3D MODEL',
    'FONDO TRANSPARENTE': 'TRANSPARENT BACKGROUND', 'VER NASA 3D': 'VIEW NASA 3D',
    'ARRASTRA PARA GIRAR': 'DRAG TO ROTATE', 'DESLIZA PARA ACERCAR': 'SWIPE TO ZOOM',
    'UNA EXPERIENCIA EDUCATIVA · NASA SPACE APPS CHALLENGE': 'AN EDUCATIONAL EXPERIENCE · NASA SPACE APPS CHALLENGE',
    'HECHO PARA EXPLORAR': 'MADE FOR EXPLORING',
    'Sistema solar tridimensional interactivo': 'Interactive 3D solar system',
    'Sistema solar 3D: arrastra para girar la cámara, usa rueda del mouse para zoom y los botones de planeta para elegir destino': '3D solar system: drag to rotate the camera, scroll to zoom and use the planet buttons to choose a destination',
    'Seleccionar planeta en el sistema solar': 'Choose a planet in the solar system',
    'Explorar la Luna': 'Explore the Moon', 'Explorar la Tierra': 'Explore Earth',
    'Explorar Marte': 'Explore Mars', 'Explorar Saturno': 'Explore Saturn',
    'Modelo tridimensional de luna': '3D model of the Moon',
    'Tierra tridimensional': '3D Earth', 'Modelo tridimensional de marte': '3D model of Mars',
    'Modelo tridimensional de Saturno': '3D model of Saturn',
    'Modelos 3D de naves y vehículos': '3D models of spacecraft and vehicles',
    'Abrir rover Opportunity en 3D': 'Open the Opportunity rover in 3D',
    'Abrir nave Cassini en 3D': 'Open the Cassini spacecraft in 3D',
    'Modelo NASA 3D de Opportunity': 'NASA 3D model of Opportunity',
    'Modelo NASA 3D de Cassini': 'NASA 3D model of Cassini',
    'Visor espacial 3D': '3D space viewer',
    'Cambiar entre vista NASA y 3D transparente': 'Switch between NASA view and transparent 3D',
    'Cerrar visor': 'Close viewer',
    'Modelo interactivo tridimensional': 'Interactive 3D model',
    'El navegador no tiene WebGL activo. Prueba Chrome o Edge.': 'WebGL is not enabled in this browser. Try Chrome or Edge.'
  };
  const attrNames = ['aria-label', 'alt', 'title', 'placeholder', 'content'];
  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  const normalize = s => s.replace(/\s+/g, ' ').trim();

  function translated(input) {
    const source = normalize(input);
    if (language === 'es') return source;
    if (dictionary[source]) return dictionary[source];
    const speed = source.match(/^Velocidad\s+×(.+)$/);
    if (speed) return `Speed ×${speed[1]}`;
    const focus = source.match(/^Enfocar\s+(.+)$/);
    if (focus) return `Focus on ${dictionary[focus[1]] || focus[1]}`;
    if (source.startsWith('No fue posible iniciar el visor WebGL:')) return source.replace('No fue posible iniciar el visor WebGL:', 'Unable to start the WebGL viewer:');
    const model = source.match(/^Modelo 3D de\s+(.+)$/);
    if (model) return `3D model of ${dictionary[model[1]] || model[1]}`;
    const embed = source.match(/^NASA,\s+(.+)\s+en 3D interactivo$/);
    if (embed) return `NASA, interactive 3D ${dictionary[embed[1]] || embed[1]}`;
    return source;
  }

  function applyText(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE || !node.parentElement || node.parentElement.closest('[data-lc-owned]')) return;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentElement.tagName)) return;
    if (!normalize(node.nodeValue)) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const raw = originalText.get(node);
    const leading = raw.match(/^\s*/)[0], trailing = raw.match(/\s*$/)[0];
    const result = language === 'es' ? raw : leading + translated(raw) + trailing;
    if (node.nodeValue !== result) node.nodeValue = result;
  }
  function applyAttributes(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE || element.closest('[data-lc-owned]')) return;
    let record = originalAttrs.get(element);
    if (!record) { record = {}; originalAttrs.set(element, record); }
    for (const name of attrNames) {
      if (!element.hasAttribute(name) || (name === 'content' && !(element.matches('meta[name="description"]')))) continue;
      const current = element.getAttribute(name);
      if (!record[name] || (current !== record[name].shown && current !== record[name].source)) {
        record[name] = {source:current, shown:current};
      }
      const next = language === 'es' ? record[name].source : translated(record[name].source);
      record[name].shown = next;
      if (current !== next) element.setAttribute(name, next);
    }
  }
  function translateTree(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) { applyText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE || root.closest('[data-lc-owned]')) return;
    applyAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.nodeType === Node.TEXT_NODE) applyText(walker.currentNode);
      else applyAttributes(walker.currentNode);
    }
  }
  function translateOriginalPage() {
    document.documentElement.lang = language;
    document.title = language === 'en' ? dictionary['LEGADO CÓSMICO — Museo espacial'] : 'LEGADO CÓSMICO — Museo espacial';
    translateTree(document.body);
    applyAttributes(document.querySelector('meta[name="description"]'));
  }
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') applyAttributes(mutation.target);
      for (const node of mutation.addedNodes || []) translateTree(node);
    }
  });

  const L = {
    es: {
      nav:'MODO MISIÓN', language:'Idioma: ES', change:'Cambiar idioma',
      kicker:'ARCHIVO DE EXPLORACIÓN · 002', headline:'No solo observes. <em>Dirige la misión.</em>',
      intro:'Elige una misión real de NASA, toma decisiones científicas y descubre qué dejaron sus exploradores. Una experiencia educativa inspirada en misiones históricas.',
      selectorTitle:'Selecciona una misión', selectHelp:'Dos destinos. Dos historias reales. Tú decides qué investigar.',
      select:'SELECCIONAR MISIÓN',
      marsLine:'EL PLANETA ROJO', marsDesc:'Explora las pistas del agua antigua junto al rover Opportunity.',
      saturnLine:'EL GIGANTE DE LOS ANILLOS', saturnDesc:'Descubre las lunas y los anillos estudiados por Cassini-Huygens.',
      missionLabel:'CENTRO DE CONTROL', archive:'REGISTRO DE MISIÓN',
      phaseBrief:'INFORME DE MISIÓN', phaseQuiz:'DECISIÓN CIENTÍFICA', phaseDone:'MISIÓN COMPLETADA',
      begin:'COMENZAR MISIÓN', back:'CAMBIAR DESTINO', next:'SIGUIENTE ETAPA', finish:'VER RESULTADOS',
      retry:'REPETIR MISIÓN', newMission:'ELEGIR OTRA MISIÓN',
      question:'DECISIÓN', of:'DE', correct:'¡Buena decisión!', incorrect:'Aprendizaje registrado',
      correctExplain:'Respuesta científicamente correcta.', incorrectExplain:'La misión continúa; revisa la explicación científica.',
      score:'DECISIONES CORRECTAS', open3d:'EXPLORAR NAVE EN 3D', viewPlanet:'ENFOCAR PLANETA EN 3D',
      nasa:'CONSULTAR FUENTE NASA', source:'Datos científicos basados en NASA Science. Recreación educativa; no es una simulación de vuelo ni una misión oficial de NASA.',
      completed:'Has reconstruido el legado de esta misión.', completedDesc:'Cada decisión conecta una pregunta científica con un descubrimiento real. Tu recorrido queda completado en esta sesión.',
      stamp:'ARCHIVO EXPLORADO', stampSub:'LOGRO EDUCATIVO · LEGADO CÓSMICO',
      metrics:['LANZAMIENTO','DESTINO','HITO'], progress:'PROGRESO', noPenalty:'Puedes equivocarte y aprender: cada respuesta explica la ciencia.',
      welcomeEyebrow:'BIENVENIDO A LEGADO CÓSMICO', welcomeTitle:'El espacio no tiene fronteras. <em>Tu idioma tampoco.</em>',
      welcomeDesc:'¿En qué idioma quieres explorar el universo?', spanish:'Continuar en español', english:'Continue in English',
      welcomeNote:'Puedes cambiarlo en cualquier momento desde la barra superior.'
    },
    en: {
      nav:'MISSION MODE', language:'Language: EN', change:'Change language',
      kicker:'EXPLORATION ARCHIVE · 002', headline:'Don’t just observe. <em>Lead the mission.</em>',
      intro:'Choose a real NASA mission, make scientific decisions and discover the legacy of space exploration. An educational experience inspired by historic missions.',
      selectorTitle:'Choose a mission', selectHelp:'Two destinations. Two real stories. You decide what to investigate.',
      select:'SELECT MISSION',
      marsLine:'THE RED PLANET', marsDesc:'Follow clues of ancient water with the Opportunity rover.',
      saturnLine:'THE RINGED GIANT', saturnDesc:'Discover the moons and rings explored by Cassini-Huygens.',
      missionLabel:'MISSION CONTROL', archive:'MISSION LOG',
      phaseBrief:'MISSION BRIEFING', phaseQuiz:'SCIENTIFIC DECISION', phaseDone:'MISSION COMPLETED',
      begin:'START MISSION', back:'CHANGE DESTINATION', next:'NEXT STAGE', finish:'SEE RESULTS',
      retry:'RESTART MISSION', newMission:'CHOOSE ANOTHER MISSION',
      question:'DECISION', of:'OF', correct:'Great decision!', incorrect:'Lesson recorded',
      correctExplain:'Scientifically correct answer.', incorrectExplain:'The mission continues; review the scientific explanation.',
      score:'CORRECT DECISIONS', open3d:'EXPLORE SPACECRAFT IN 3D', viewPlanet:'FOCUS ON PLANET IN 3D',
      nasa:'VIEW NASA SOURCE', source:'Scientific information based on NASA Science. Educational recreation; not a flight simulator or an official NASA mission.',
      completed:'You have reconstructed this mission’s legacy.', completedDesc:'Every decision connects a scientific question to a real discovery. Your journey is complete for this session.',
      stamp:'ARCHIVE EXPLORED', stampSub:'EDUCATIONAL ACHIEVEMENT · COSMIC LEGACY',
      metrics:['LAUNCH','DESTINATION','MILESTONE'], progress:'PROGRESS', noPenalty:'Mistakes are part of discovery: every answer explains the science.',
      welcomeEyebrow:'WELCOME TO COSMIC LEGACY', welcomeTitle:'Space has no borders. <em>Neither should your language.</em>',
      welcomeDesc:'Which language would you like to explore the universe in?', spanish:'Continuar en español', english:'Continue in English',
      welcomeNote:'You can change it anytime from the top navigation.'
    }
  };
  const missions = {
    marte: {
      planet:'marte', model:'opportunity', image:'solar-assets/marte.jpg', source:'https://science.nasa.gov/mission/mer-opportunity/',
      es:{ title:'Opportunity · Tras las huellas del agua', type:'MISIÓN MARTE · MER-B', summary:'En 2004, Opportunity llegó a Marte con una pregunta fundamental: ¿existió agua líquida en su pasado? Examina evidencias y reconstruye su legado.', stats:['07 JUL 2003','MARTE','24 ENE 2004'], facts:['Opportunity aterrizó en Marte el 24 de enero de 2004.','Su tarea incluía identificar rocas y suelos con señales de actividad pasada del agua.','Su última comunicación con la Tierra fue el 10 de junio de 2018.'],
        questions:[
          {q:'¿Cuál era una prioridad científica de Opportunity?', options:['Buscar pruebas de agua líquida en el pasado de Marte','Medir la temperatura del Sol desde Mercurio','Estudiar los anillos de Urano'], answer:0, why:'Los rovers Spirit y Opportunity buscaron rocas y suelos con pistas de la actividad antigua del agua en Marte.'},
          {q:'El rover descubre pequeñas concreciones ricas en hematita. ¿Qué podría indicar esto?', options:['Que Marte tiene anillos invisibles','Que algunas rocas se formaron o alteraron en presencia de agua','Que la superficie está cubierta de lava reciente'], answer:1, why:'Las esférulas de hematita, conocidas como «blueberries», fueron una pista importante de procesos relacionados con el agua.'},
          {q:'¿Cuándo aterrizó Opportunity en Marte?', options:['15 de septiembre de 2017','20 de julio de 1969','24 de enero de 2004'], answer:2, why:'Opportunity llegó a Marte el 24 de enero de 2004. Su misión de 90 soles se extendió durante más de 14 años.'}
        ]},
      en:{ title:'Opportunity · Tracing Ancient Water', type:'MARS MISSION · MER-B', summary:'In 2004, Opportunity landed on Mars with a fundamental question: had liquid water existed there in the past? Examine evidence and reconstruct its legacy.', stats:['JUL 07, 2003','MARS','JAN 24, 2004'], facts:['Opportunity landed on Mars on January 24, 2004.','Its mission included finding rocks and soils that held signs of ancient water activity.','Its last communication with Earth was on June 10, 2018.'],
        questions:[
          {q:'What was a major science goal of Opportunity?', options:['Find evidence of liquid water on ancient Mars','Measure the Sun’s temperature from Mercury','Study the rings of Uranus'], answer:0, why:'The Spirit and Opportunity rovers studied rocks and soils for clues of past water activity on Mars.'},
          {q:'The rover finds tiny hematite-rich concretions. What might they indicate?', options:['Mars has invisible rings','Some rocks formed or changed in the presence of water','The surface is covered in recent lava'], answer:1, why:'Hematite-rich spheres nicknamed “blueberries” provided important evidence of water-related processes.'},
          {q:'When did Opportunity land on Mars?', options:['September 15, 2017','July 20, 1969','January 24, 2004'], answer:2, why:'Opportunity landed on January 24, 2004. Its 90-sol mission lasted more than 14 years.'}
        ]}
    },
    saturno: {
      planet:'saturno', model:'cassini', image:'solar-assets/saturno.jpg', source:'https://science.nasa.gov/mission/cassini/',
      es:{ title:'Cassini-Huygens · El secreto de Saturno', type:'MISIÓN SATURNO · CASSINI', summary:'Cassini investigó Saturno, sus anillos y sus lunas durante años. Sigue las decisiones que revelaron océanos, atmósferas y nuevos mundos.', stats:['15 OCT 1997','SATURNO','15 SEP 2017'], facts:['Cassini fue lanzada el 15 de octubre de 1997.','Entró en órbita de Saturno en 2004 y estudió sus anillos y sus lunas.','Terminó su viaje el 15 de septiembre de 2017 al entrar en la atmósfera de Saturno.'],
        questions:[
          {q:'¿Qué sistema estaba diseñada para investigar Cassini?', options:['Solo la superficie de la Tierra','Saturno, sus anillos, atmósfera y lunas','Únicamente la Luna terrestre'], answer:1, why:'Cassini investigó Saturno como sistema: el planeta, sus anillos, la magnetosfera y lunas como Titán y Encélado.'},
          {q:'La sonda Huygens acompañó a Cassini. ¿Dónde descendió?', options:['En Titán, una luna de Saturno','En la superficie del Sol','En las nubes de Venus'], answer:0, why:'Huygens descendió sobre Titán en enero de 2005 y proporcionó información directa sobre su atmósfera y superficie.'},
          {q:'¿Por qué se dirigió Cassini a la atmósfera de Saturno al final de su misión?', options:['Para transformar a Saturno en estrella','Porque descubrió una nueva luna de la Tierra','Para evitar contaminar potencialmente lunas de interés astrobiológico'], answer:2, why:'La entrada controlada de Cassini en Saturno ayudó a proteger lunas como Encélado y Titán de una posible contaminación futura.'}
        ]},
      en:{ title:'Cassini-Huygens · Secrets of Saturn', type:'SATURN MISSION · CASSINI', summary:'Cassini studied Saturn, its rings and its moons for years. Follow decisions that revealed oceans, atmospheres and extraordinary worlds.', stats:['OCT 15, 1997','SATURN','SEP 15, 2017'], facts:['Cassini launched on October 15, 1997.','It entered Saturn orbit in 2004 and explored the planet, its rings and its moons.','The mission ended with an atmospheric entry into Saturn on September 15, 2017.'],
        questions:[
          {q:'What system was Cassini designed to investigate?', options:['Only the surface of Earth','Saturn, its rings, atmosphere and moons','Only Earth’s Moon'], answer:1, why:'Cassini studied the Saturn system: the planet, rings, magnetosphere and moons such as Titan and Enceladus.'},
          {q:'The Huygens probe traveled with Cassini. Where did it descend?', options:['On Titan, a moon of Saturn','On the surface of the Sun','In the clouds of Venus'], answer:0, why:'Huygens descended onto Titan in January 2005 and returned direct observations of its atmosphere and surface.'},
          {q:'Why did Cassini enter Saturn’s atmosphere at the end of the mission?', options:['To turn Saturn into a star','Because it discovered a new moon of Earth','To avoid possibly contaminating moons of astrobiological interest'], answer:2, why:'Cassini’s controlled end in Saturn helped protect moons such as Enceladus and Titan against possible future contamination.'}
        ]}
    }
  };

  const state = {mission:null, phase:'choose', step:0, answer:null, score:0};
  const t = key => L[language][key];
  const esc = str => String(str).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function createMission() {
    const solar = document.getElementById('sistema-solar');
    if (!solar) return;
    const section = document.createElement('section');
    section.className = 'lc-mission';
    section.id = 'modo-mision';
    section.setAttribute('data-lc-owned', '');
    section.setAttribute('aria-label', 'Modo misión espacial / Space mission mode');
    solar.insertAdjacentElement('afterend', section);
    section.addEventListener('click', event => {
      const button = event.target.closest('[data-lc-action]');
      if (!button || !section.contains(button)) return;
      const action = button.dataset.lcAction;
      if (action === 'choose') { state.mission = button.dataset.id; state.phase = 'brief'; state.step = 0; state.answer = null; state.score = 0; }
      if (action === 'start') { state.phase='quiz'; state.step=0; }
      if (action === 'answer' && state.answer === null) {
        const chosen = Number(button.dataset.index);
        state.answer = chosen;
        const q = missions[state.mission][language].questions[state.step];
        if (chosen === q.answer) state.score++;
      }
      if (action === 'next') {
        state.step++;
        state.answer=null;
        if (state.step >= missions[state.mission][language].questions.length) state.phase='done';
      }
      if (action === 'retry') { state.phase='brief'; state.step=0; state.answer=null; state.score=0; }
      if (action === 'back') { state.phase='choose'; state.mission=null; state.step=0; state.answer=null; state.score=0; }
      if (action === 'model') { document.querySelector(`[data-model="${missions[state.mission].model}"]`)?.click(); }
      if (action === 'planet') {
        document.querySelector(`[data-solar-planet="${missions[state.mission].planet}"]`)?.click();
        document.getElementById('sistema-solar')?.scrollIntoView({behavior:'smooth',block:'start'});
      }
      if (['choose','start','answer','next','retry','back'].includes(action)) renderMission();
    });
    renderMission();

    const nav = document.querySelector('.topbar nav');
    if (nav) {
      const link=document.createElement('a');link.href='#modo-mision';link.id='lc-mission-nav';link.textContent=t('nav');link.setAttribute('data-lc-owned','');nav.appendChild(link);
    }
    const topbar=document.querySelector('.topbar');
    if (topbar) {
      const button=document.createElement('button');button.type='button';button.id='lc-language-switch';button.className='lc-language-switch';
      button.setAttribute('data-lc-owned','');button.addEventListener('click', () => setLanguage(language === 'es' ? 'en' : 'es'));
      topbar.appendChild(button);
    }
    updateNav();
  }

  function renderMission() {
    const section=document.getElementById('modo-mision');if (!section) return;
    const selected = state.mission && missions[state.mission];
    const data = selected && selected[language];
    const progress = state.phase==='done' ? 100 : state.phase==='quiz' ? (state.step + (state.answer===null?0:1)) / 3 * 100 : 0;
    const stateLabel = state.phase==='brief'?t('phaseBrief'):state.phase==='quiz'?t('phaseQuiz'):state.phase==='done'?t('phaseDone'):t('selectorTitle');
    let pane='';
    if (state.phase === 'choose') {
      pane=`<div class="lc-mission-picker-heading"><span class="lc-mission-overline">${esc(t('missionLabel'))}</span><h3>${esc(t('selectorTitle'))}</h3><p>${esc(t('selectHelp'))}</p></div>
      <div class="lc-mission-options">${['marte','saturno'].map(id=>{
        const m=missions[id], d=m[language];
        return `<button class="lc-mission-option" type="button" data-lc-action="choose" data-id="${id}">
          <span class="lc-mission-option-top"><span>${id==='marte'?esc(t('marsLine')):esc(t('saturnLine'))}</span><span aria-hidden="true">↗</span></span>
          <span class="lc-mission-option-name">${id==='marte'?'OPPORTUNITY':'CASSINI-HUYGENS'}</span>
          <span class="lc-mission-option-desc">${esc(id==='marte'?t('marsDesc'):t('saturnDesc'))}</span>
          <span class="lc-mission-option-cta">${esc(t('select'))} <b>→</b></span>
        </button>`;}).join('')}</div>`;
    } else if (state.phase==='brief') {
      pane=`<span class="lc-mission-overline">${esc(t('phaseBrief'))} / ${esc(data.type)}</span><h3>${esc(data.title)}</h3><p class="lc-mission-summary">${esc(data.summary)}</p>
      <div class="lc-mission-metrics">${data.stats.map((v,i)=>`<div><small>${esc(t('metrics')[i])}</small><strong>${esc(v)}</strong></div>`).join('')}</div>
      <div class="lc-mission-log"><span>${esc(t('archive'))}</span>${data.facts.map(f=>`<p>✦ ${esc(f)}</p>`).join('')}</div>
      <div class="lc-mission-actions"><button type="button" class="lc-mission-primary" data-lc-action="start">${esc(t('begin'))} <b>↗</b></button><button type="button" class="lc-mission-secondary" data-lc-action="back">${esc(t('back'))}</button></div>`;
    } else if (state.phase==='quiz') {
      const question=data.questions[state.step];
      const answered=state.answer !== null, success=state.answer===question.answer;
      pane=`<div class="lc-mission-quiz-top"><span class="lc-mission-overline">${esc(t('phaseQuiz'))}</span><span class="lc-mission-step">${esc(t('question'))} ${state.step+1} ${esc(t('of'))} 3</span></div>
        <h3>${esc(question.q)}</h3><div class="lc-mission-choices">${question.options.map((opt,i)=>`<button type="button" data-lc-action="answer" data-index="${i}" ${answered?'disabled':''} class="lc-mission-choice ${answered&&i===question.answer?'is-correct':''} ${answered&&i===state.answer&&i!==question.answer?'is-wrong':''}"><span class="lc-mission-letter">${String.fromCharCode(65+i)}</span><span>${esc(opt)}</span><span class="lc-choice-mark">${answered&&i===question.answer?'✓':answered&&i===state.answer?'×':'↗'}</span></button>`).join('')}</div>
        ${answered?`<div class="lc-mission-feedback" role="status"><strong>${esc(success?t('correct'):t('incorrect'))}</strong><p>${esc(question.why)}</p></div>`:`<p class="lc-mission-tip">${esc(t('noPenalty'))}</p>`}
        <div class="lc-mission-actions">${answered?`<button class="lc-mission-primary" type="button" data-lc-action="next">${esc(state.step===2?t('finish'):t('next'))} <b>↗</b></button>`:''}<button type="button" class="lc-mission-secondary" data-lc-action="back">${esc(t('back'))}</button></div>`;
    } else {
      pane=`<span class="lc-mission-overline">${esc(t('phaseDone'))} / ${esc(data.type)}</span><div class="lc-mission-medal" aria-hidden="true">✦</div><h3>${esc(t('completed'))}</h3><p class="lc-mission-summary">${esc(t('completedDesc'))}</p>
        <div class="lc-mission-score"><strong>${state.score} / 3</strong><span>${esc(t('score'))}</span></div>
        <div class="lc-mission-certificate"><span>✧ ${esc(t('stamp'))}</span><small>${esc(t('stampSub'))}</small></div>
        <div class="lc-mission-actions"><button type="button" class="lc-mission-primary" data-lc-action="model">${esc(t('open3d'))} <b>↗</b></button><button type="button" class="lc-mission-secondary" data-lc-action="planet">${esc(t('viewPlanet'))}</button><button type="button" class="lc-mission-secondary" data-lc-action="retry">${esc(t('retry'))}</button><button type="button" class="lc-mission-secondary" data-lc-action="back">${esc(t('newMission'))}</button></div>`;
    }
    const planetClass = selected ? state.mission : 'intro';
    section.innerHTML=`<div class="lc-mission-heading"><div><p class="lc-mission-eyebrow"><span>✦</span> ${esc(t('kicker'))}</p><h2>${t('headline')}</h2></div><p>${esc(t('intro'))}</p></div>
      <div class="lc-mission-shell" data-destination="${planetClass}">
        <div class="lc-mission-visual">
          <div class="lc-mission-stars" aria-hidden="true"></div>
          <div class="lc-mission-radar" aria-hidden="true"></div>
          <div class="lc-mission-globe" aria-hidden="true"></div>
          <div class="lc-mission-visual-top"><span>LC / ${selected?esc(data.type):'SPACE MISSIONS'}</span><span>✧ ${esc(t('missionLabel'))}</span></div>
          <div class="lc-mission-visual-bottom"><small>NASA / ${selected?esc(selected.model.toUpperCase()):'EXPLORATION ARCHIVE'}</small><strong>${selected?esc(data.title):'01 — 02'}</strong></div>
        </div>
        <div class="lc-mission-console"><div class="lc-mission-console-top"><span>✳ ${esc(t('missionLabel'))}</span><span>${esc(stateLabel)}</span></div>
          <div class="lc-mission-content" aria-live="polite">${pane}</div>
          <div class="lc-mission-console-bottom"><div class="lc-mission-progress-label"><span>${esc(t('progress'))}</span><span>${Math.round(progress)}%</span></div><div class="lc-mission-progress-track"><span style="width:${progress}%"></span></div>
          <a href="${selected?esc(selected.source):'https://science.nasa.gov/'}" target="_blank" rel="noopener noreferrer">${esc(t('nasa'))} ↗</a></div>
        </div>
      </div><p class="lc-mission-disclaimer">${esc(t('source'))}</p>`;
  }

  function updateNav() {
    const nav=document.getElementById('lc-mission-nav');
    const button=document.getElementById('lc-language-switch');
    if (nav) nav.textContent=t('nav');
    if (button) {button.textContent=t('language')+' · ⇄';button.setAttribute('aria-label',t('change'));button.title=t('change');}
  }
  function setLanguage(next) {
    language=next==='en'?'en':'es';
    try{sessionStorage.setItem(LANG_KEY,language);}catch(_){}
    translateOriginalPage();
    updateNav();
    renderMission();
    const gate=document.getElementById('lc-language-gate');
    if(gate){gate.remove();document.body.classList.remove('lc-language-open');}
  }
  function createWelcomeGate() {
    if (!shouldAsk) return;
    const gate=document.createElement('div');gate.id='lc-language-gate';gate.className='lc-language-gate';gate.setAttribute('data-lc-owned','');
    gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');
    gate.setAttribute('aria-labelledby','lc-language-title');
    gate.innerHTML=`<div class="lc-language-sky" aria-hidden="true"><div class="lc-language-planet"></div></div>
      <div class="lc-language-panel"><div class="lc-language-emblem" aria-hidden="true">✦</div>
      <p class="lc-language-kicker">LEGADO CÓSMICO <span>·</span> COSMIC LEGACY</p>
      <h2 id="lc-language-title">El espacio no tiene fronteras.<br><em>Space knows no borders.</em></h2>
      <p class="lc-language-prompt">¿En qué idioma deseas explorar? <span>Choose your language to begin.</span></p>
      <div class="lc-language-options"><button type="button" data-lc-lang="es"><span class="lc-language-icon">ES</span><span><strong>Español</strong><small>Explorar en español</small></span><span>↗</span></button>
      <button type="button" data-lc-lang="en"><span class="lc-language-icon">EN</span><span><strong>English</strong><small>Explore in English</small></span><span>↗</span></button></div>
      <p class="lc-language-footer">IDIOMA / LANGUAGE <span>·</span> SE PUEDE CAMBIAR DESPUÉS / YOU CAN SWITCH LATER</p></div>`;
    document.body.appendChild(gate);
    document.body.classList.add('lc-language-open');
    gate.querySelectorAll('[data-lc-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lcLang)));
    const choices=[...gate.querySelectorAll('button')];
    gate.addEventListener('keydown',e=>{
      if(e.key==='Tab'){
        if(e.shiftKey&&document.activeElement===choices[0]){e.preventDefault();choices[1].focus();}
        else if(!e.shiftKey&&document.activeElement===choices[1]){e.preventDefault();choices[0].focus();}
      }
    });
    choices[0].focus();
  }

  createMission();
  translateOriginalPage();
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:attrNames});
  createWelcomeGate();
})();
