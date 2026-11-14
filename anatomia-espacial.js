/* Expansión autónoma: no modifica modelos ni funciones originales. */
(() => {
  "use strict";
  const COORDS = {
  "opportunity": {
    "solar": {
      "position": "-0.82000m 0.67980m -0.35000m",
      "normal": "0.00001 1.00000 0.00001"
    },
    "camera": {
      "position": "-0.12560m 1.54002m 0.40060m",
      "normal": "-0.00034 -0.00028 1.00000"
    },
    "antenna": {
      "position": "0.72000m 0.84007m -0.19728m",
      "normal": "0.00000 0.34202 0.93969"
    },
    "arm": {
      "position": "0.15007m 0.41000m 0.49976m",
      "normal": "-0.26914 -0.00000 0.96310"
    },
    "wheel": {
      "position": "0.61054m 0.13000m 0.60000m",
      "normal": "0.99998 0.00116 0.00645"
    },
    "body": {
      "position": "-0.27646m 0.45000m -0.00000m",
      "normal": "-1.00000 0.00000 0.00000"
    }
  },
  "cassini": {
    "dish": {
      "position": "1.06243m 1.96429m 0.89859m",
      "normal": "-0.34864 0.88599 -0.30573"
    },
    "huygens": {
      "position": "1.80206m -1.09999m 0.10011m",
      "normal": "0.99850 0.00613 0.05440"
    },
    "rtg": {
      "position": "-1.24422m -2.35965m 1.77946m",
      "normal": "0.00000 0.00000 1.00000"
    },
    "boom": {
      "position": "0.00000m 1.43299m -7.30000m",
      "normal": "-0.00000 1.00000 0.00000"
    },
    "engine": {
      "position": "0.13377m -3.25408m -0.18218m",
      "normal": "0.06975 -0.99620 -0.05220"
    },
    "bus": {
      "position": "-0.53409m -1.10202m 1.23647m",
      "normal": "-0.37670 0.40454 0.83334"
    }
  }
};
  const DATA = {
    opportunity: {source:'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-instruments/',parts:[
      ['camera','Mástil de cámaras','Camera mast','Pancam y Navcam captaban panoramas y ayudaban a elegir rutas seguras. El mástil también daba una perspectiva elevada al rover.','Pancam and Navcam captured panoramas and helped choose safe routes. The mast also gave the rover an elevated viewpoint.','Permitía estudiar capas de roca y el paisaje sin acercarse a todos los objetivos.','It helped scientists study rock layers and the landscape without approaching every target.'],
      ['solar','Paneles solares','Solar arrays','Convertían la luz solar en electricidad para los sistemas del rover y la recarga de sus baterías.','They converted sunlight into electricity for the rover systems and battery charging.','El polvo acumulado y las tormentas podían reducir drásticamente la energía disponible.','Accumulated dust and dust storms could drastically reduce available power.'],
      ['antenna','Antena de alta ganancia','High-gain antenna','Permitía la comunicación por radio dirigida hacia la Tierra cuando había visibilidad adecuada.','It enabled directional radio communication with Earth when the geometry allowed it.','Transmitía datos científicos y recibía instrucciones para las siguientes operaciones.','It transmitted scientific data and received instructions for future operations.'],
      ['arm','Brazo robótico (IDD)','Robotic arm (IDD)','Acercaba instrumentos a las rocas y al suelo, como el espectrómetro APXS, el microscopio y la herramienta de abrasión.','It positioned tools such as APXS, the microscopic imager and the rock abrasion tool against rocks and soil.','El análisis de minerales ayudó a reconstruir la historia del agua en Marte.','Mineral analysis helped reconstruct the history of water on Mars.'],
      ['wheel','Ruedas y suspensión','Wheels and suspension','Seis ruedas y una suspensión rocker-bogie facilitaban el desplazamiento por terreno irregular.','Six wheels and a rocker-bogie suspension enabled travel over uneven terrain.','La movilidad permitió explorar diferentes afloramientos y cráteres.','Mobility made it possible to investigate different outcrops and craters.']
    ]},
    cassini: {source:'https://science.nasa.gov/mission/cassini/spacecraft/cassini-orbiter/',parts:[
      ['dish','Antena de alta ganancia','High-gain antenna','El gran reflector parabólico concentraba las señales de radio para comunicarse con la Tierra y también apoyaba observaciones de radar.','The large parabolic reflector concentrated radio signals for communication with Earth and also supported radar observations.','El radar ayudó a cartografiar la superficie de Titán a través de su atmósfera.','Radar helped map Titan’s surface through its atmosphere.'],
      ['huygens','Sonda Huygens','Huygens probe','La sonda de la ESA se separó de Cassini y descendió por la atmósfera de Titán en enero de 2005.','The ESA probe separated from Cassini and descended through Titan’s atmosphere in January 2005.','Transmitió mediciones e imágenes de este mundo durante su descenso y después de aterrizar.','It transmitted measurements and images during its descent and after landing.'],
      ['rtg','Generadores RTG','RTG generators','Tres generadores convertían el calor del decaimiento radiactivo en electricidad, sin depender de paneles solares.','Three generators converted heat from radioactive decay into electricity without relying on solar panels.','Suministraron energía a los instrumentos y sistemas durante la exploración de Saturno.','They powered instruments and systems during the exploration of Saturn.'],
      ['boom','Brazo del magnetómetro','Magnetometer boom','El mástil alejaba sensores magnéticos del cuerpo de la nave para reducir interferencias de sus sistemas eléctricos.','The boom placed magnetic sensors away from the spacecraft body to reduce interference from its electrical systems.','Contribuyó al estudio del campo magnético y el entorno de Saturno.','It contributed to the study of Saturn’s magnetic field and environment.'],
      ['engine','Propulsión principal','Main propulsion','Los motores principales realizaban maniobras importantes para ajustar la trayectoria y la órbita de la nave.','The main engines performed major maneuvers to adjust the spacecraft trajectory and orbit.','Una maniobra de inserción orbital permitió que Cassini se convirtiera en un orbitador de Saturno.','An orbit insertion maneuver allowed Cassini to become a Saturn orbiter.']
    ]}
  };
  const LABELS={
    es:{title:'ANATOMÍA ESPACIAL 360°',on:'Marcas: activadas',off:'Marcas: ocultas',spin:'Pausar giro',play:'Reanudar giro',progress:'Componentes descubiertos',intro:'Explora la ingeniería',instructions:'Selecciona un círculo rojo sobre la nave o un componente de la lista. Puedes seguir girando y acercando el modelo en todo momento.',function:'FUNCIÓN',impact:'IMPORTANCIA CIENTÍFICA',source:'Referencia oficial NASA ↗',adjust:'Ajustar posición de una marca',adjustHelp:'Selecciona un componente y activa el ajuste. Pulsa sobre la pieza del modelo para registrar su nueva posición en este navegador. Arrastrar no cambia la marca.',adjustStart:'Colocar marca seleccionada',adjustCancel:'Cancelar ajuste',reset:'Restaurar marcas originales',selected:'Marca actualizada.',miss:'No se detectó una superficie. Inténtalo otra vez.',ready:'Pulsa sobre la superficie de la pieza.',load:'Esperando que cargue el modelo 3D…',failed:'No se pudo cargar el modelo original. Revisa la ruta del GLB y la conexión a la biblioteca del visor.',completed:'¡Has explorado todos los componentes!',list:'Componentes',resetProgress:'Reiniciar recorrido',choose:'Selecciona un componente primero.'},
    en:{title:'SPACECRAFT ANATOMY 360°',on:'Markers: on',off:'Markers: hidden',spin:'Pause rotation',play:'Resume rotation',progress:'Components discovered',intro:'Explore the engineering',instructions:'Select a red marker on the spacecraft or a component in the list. You can still rotate and zoom the model at any time.',function:'FUNCTION',impact:'SCIENTIFIC IMPORTANCE',source:'Official NASA reference ↗',adjust:'Adjust marker position',adjustHelp:'Select a component and enable adjustment. Click the part on the model to save its new position in this browser. Dragging does not move the marker.',adjustStart:'Place selected marker',adjustCancel:'Cancel adjustment',reset:'Restore original markers',selected:'Marker updated.',miss:'No surface detected. Try again.',ready:'Click the surface of the part.',load:'Waiting for the 3D model to load…',failed:'The original model could not load. Check the GLB path and viewer library connection.',completed:'You explored every component!',list:'Components',resetProgress:'Restart exploration',choose:'Select a component first.'}
  };
  const viewer=document.getElementById('focus-model'), overlay=document.getElementById('model-overlay');
  if(!viewer||!overlay)return;
  const stage=viewer.closest('.model-stage');if(!stage)return;
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  function button(cls,fn){const b=el('button',cls);b.type='button';b.addEventListener('click',fn);return b;}
  const tools=el('div','lca-tools'), panel=el('aside','lca-panel');
  for(const n of [tools,panel]){n.hidden=true;n.setAttribute('data-lc-owned','');}
  const kicker=el('span','lca-kicker');
  const toggle=button('',()=>{showMarks=!showMarks;refreshMarkers();updateLabels();});
  const spin=button('',()=>{viewer.toggleAttribute('auto-rotate',!viewer.hasAttribute('auto-rotate'));updateLabels();});
  const restart=button('',()=>{if(!key)return;seen[key].clear();selected=null;adjusting=false;message='';refreshMarkers();renderPanel();});
  tools.append(kicker,toggle,spin,restart);
  const label=el('p','lca-label'), count=el('p','lca-muted'), bar=el('div','lca-progress'), fill=el('span');bar.append(fill);bar.setAttribute('role','progressbar');bar.setAttribute('aria-valuemin','0');
  const list=el('div','lca-component-list');const detail=el('div','lca-detail');detail.setAttribute('aria-live','polite');
  const source=el('a');source.target='_blank';source.rel='noopener noreferrer';
  const notice=el('p','lca-notice');notice.setAttribute('role','status');
  const config=el('details');const summary=el('summary');const help=el('p','lca-muted');const actions=el('div','lca-cal-actions');
  const adjust=button('',()=>{if(!selected){message='choose';updateLabels();return;}adjusting=!adjusting;message=adjusting?'ready':'';if(adjusting)viewer.removeAttribute('auto-rotate');refreshMarkers();updateLabels();});
  const reset=button('',()=>{if(!key)return;overrides[key]={};save();for(const part of DATA[key].parts)updatePoint(part[0]);adjusting=false;message='';refreshMarkers();updateLabels();});
  actions.append(adjust,reset);config.append(summary,help,actions);panel.append(label,count,bar,list,detail,source,notice,config);stage.append(tools,panel);
  let key=null, selected=null,showMarks=true, priorRotate=false, adjusting=false, message='',loaded=false, pointer=null;
  const seen={opportunity:new Set(),cassini:new Set()};let overrides={};try{overrides=JSON.parse(localStorage.getItem('lc-anatomy-v1')||'{}')||{};}catch(_){}
  function save(){try{localStorage.setItem('lc-anatomy-v1',JSON.stringify(overrides));}catch(_){}}
  const lang=()=>document.documentElement.lang==='en'?'en':'es', T=()=>LABELS[lang()], en=()=>lang()==='en';
  function recognizer(){if(overlay.hidden||viewer.hidden)return null;const src=(viewer.getAttribute('src')||'').split(/[?#]/)[0].toLowerCase();const match=src.match(/(?:^|\/)(opportunity|cassini)\.glb$/);return match?match[1]:null;}
  function markerFor(id){return viewer.querySelector('.lca-marker[data-part="'+id+'"]');}
  function point(id){const candidate=overrides[key]?.[id];return candidate&&typeof candidate.position==='string'&&typeof candidate.normal==='string'?candidate:COORDS[key][id];}
  function updatePoint(id){const b=markerFor(id),p=point(id);if(!b||!p)return;b.dataset.position=p.position;b.dataset.normal=p.normal;if(typeof viewer.updateHotspot==='function')viewer.updateHotspot({name:b.slot,position:p.position,normal:p.normal});}
  function choose(id){if(!key)return;selected=id;seen[key].add(id);adjusting=false;message='';viewer.removeAttribute('auto-rotate');refreshMarkers();renderPanel();}
  function refreshMarkers(){if(!key)return;for(const [i,part] of DATA[key].parts.entries()){const b=markerFor(part[0]);if(!b)continue;b.hidden=!showMarks||adjusting||!loaded;b.setAttribute('aria-pressed',String(selected===part[0]));b.setAttribute('aria-label',`${i+1}. ${part[en()?2:1]}`);b.title=part[en()?2:1];}}
  function updateLabels(){if(!key)return;const t=T();kicker.textContent=t.title;toggle.textContent=showMarks?t.on:t.off;toggle.setAttribute('aria-pressed',String(showMarks));spin.textContent=viewer.hasAttribute('auto-rotate')?t.spin:t.play;restart.textContent=t.resetProgress;summary.textContent=t.adjust;help.textContent=t.adjustHelp;adjust.textContent=adjusting?t.adjustCancel:t.adjustStart;adjust.setAttribute('aria-pressed',String(adjusting));adjust.disabled=!loaded;reset.textContent=t.reset;label.textContent=t.progress;notice.textContent=message?t[message]:(!loaded?t.load:'');source.textContent=t.source;refreshMarkers();}
  function renderPanel(){if(!key)return;const t=T(), parts=DATA[key].parts, n=seen[key].size;updateLabels();count.textContent=`${n} / ${parts.length}${n===parts.length?' · '+t.completed:''}`;bar.setAttribute('aria-label',t.progress);bar.setAttribute('aria-valuemax',parts.length);bar.setAttribute('aria-valuenow',n);fill.style.width=(100*n/parts.length)+'%';list.replaceChildren();list.setAttribute('aria-label',t.list);
    for(const [i,part] of parts.entries()){const b=button('',()=>choose(part[0]));b.setAttribute('aria-pressed',String(selected===part[0]));b.append(el('span','lca-num',i+1),el('span','',part[en()?2:1]));if(seen[key].has(part[0]))b.append(el('span','lca-seen','✓'));list.append(b);}
    const part=parts.find(x=>x[0]===selected);detail.replaceChildren();if(part){detail.append(el('h3','',part[en()?2:1]),el('p','lca-label',t.function),el('p','',part[en()?4:3]),el('p','lca-label',t.impact),el('p','',part[en()?6:5]));}else{detail.append(el('h3','',t.intro),el('p','',t.instructions));}source.href=DATA[key].source;
  }
  function removeMarkers(){viewer.querySelectorAll('.lca-marker').forEach(b=>b.remove());}
  function deactivate(){if(!key)return;removeMarkers();viewer.toggleAttribute('auto-rotate',priorRotate);tools.hidden=panel.hidden=true;stage.classList.remove('lc-anatomy-active');key=null;selected=null;adjusting=false;message='';pointer=null;}
  function sync(){const next=recognizer();if(next===key)return;deactivate();if(!next)return;key=next;selected=null;showMarks=true;loaded=false;priorRotate=viewer.hasAttribute('auto-rotate');tools.hidden=panel.hidden=false;stage.classList.add('lc-anatomy-active');
    for(const [i,part] of DATA[key].parts.entries()){const p=point(part[0]),b=button('lca-marker',event=>{event?.stopPropagation?.();choose(part[0]);});b.slot='hotspot-lca-'+key+'-'+part[0];b.dataset.part=part[0];b.dataset.position=p.position;b.dataset.normal=p.normal;b.dataset.visibilityAttribute='lca-visible';b.setAttribute('data-lc-owned','');b.textContent=i+1;b.hidden=true;viewer.append(b);}
    // `load` is authoritative; for an already cached model, the load event still fires after src changes.
    renderPanel();
  }
  viewer.addEventListener('load',()=>{sync();if(key){loaded=true;message='';refreshMarkers();updateLabels();}});
  viewer.addEventListener('error',()=>{if(key){loaded=false;message='failed';updateLabels();}});
  viewer.addEventListener('pointerdown',e=>{pointer=adjusting?{x:e.clientX,y:e.clientY}:null;});
  viewer.addEventListener('click',e=>{if(!adjusting||!selected||!loaded||!pointer||e.target.closest('.lca-marker'))return;const d=Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y);pointer=null;if(d>6)return;const hit=viewer.positionAndNormalFromPoint?.(e.clientX,e.clientY);if(!hit){message='miss';updateLabels();return;}overrides[key]??={};overrides[key][selected]={position:hit.position.toString(),normal:hit.normal.toString()};save();updatePoint(selected);adjusting=false;message='selected';refreshMarkers();updateLabels();});
  new MutationObserver(sync).observe(viewer,{attributes:true,attributeFilter:['src','hidden']});new MutationObserver(sync).observe(overlay,{attributes:true,attributeFilter:['hidden']});new MutationObserver(()=>{if(key)renderPanel();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});sync();
})();
