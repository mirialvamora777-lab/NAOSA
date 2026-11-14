const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];

// CONFIGURAR ESTRELLAS

function resizeStars() {

  const dpr = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;

  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(
    150,
    Math.floor(innerWidth * innerHeight / 8500)
  );

  stars = Array.from(
    { length: count },
    () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.15 + .2,
      a: Math.random() * .55 + .15,
      phase: Math.random() * Math.PI * 2
    })
  );


}

// DIBUJAR ESTRELLAS

function drawStars(t) {

  ctx.clearRect(
    0,
    0,
    innerWidth,
    innerHeight
  );

  for (const s of stars) {

    const twinkle =
      .72 + .28 * Math.sin(t * .0007 + s.phase);

    ctx.beginPath();

    ctx.arc(
      s.x,
      s.y,
      s.r,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(226,232,244,${s.a * twinkle})`;

    ctx.fill();
  }

  requestAnimationFrame(drawStars);
}

// ACTUALIZAR AL CAMBIAR EL TAMAÑO DE PANTALLA

window.addEventListener(
  "resize",
  resizeStars
);

resizeStars();
requestAnimationFrame(drawStars);


// Modelos NASA en la vista ampliada; previews GLB uniformes y sin fondos externos.
// Las páginas antiguas /gltf_embed/ son iframes: su fondo interior no puede modificarse
// de manera confiable desde el CSS de esta web. El botón «FONDO TRANSPARENTE»
// conmuta a la alternativa 3D local sin fondo.

const MODEL_DATA = Object.freeze({
  luna: {
    name: 'La Luna',
    file: 'models/luna.glb',
    orbit: '20deg 73deg auto'
  },

  tierra: {
    name: 'La Tierra',
    file: 'models/tierra.glb',
    orbit: '20deg 73deg auto'
  },

  marte: {
    name: 'Marte',
    file: 'models/marte.glb',
    orbit: '20deg 73deg auto'
  },

  saturno: {
    name: 'Saturno',
    file: 'models/saturno.glb',
    orbit: '20deg 65deg auto'
  },


venus: {
  name: 'Venus',
  file: 'models/venus.glb',
  orbit: '20deg 73deg auto'
},

jupiter: {
  name: 'Júpiter',
  file: 'models/jupiter.glb',
  orbit: '20deg 73deg auto'
},

urano: {
  name: 'Urano',
  file: 'models/urano.glb',
  orbit: '20deg 73deg auto'
},

neptuno: {
  name: 'Neptuno',
  file: 'models/neptuno.glb',
  orbit: '20deg 73deg auto'
},


  opportunity: {
    name: 'Opportunity',
    file: 'models/opportunity.glb',
    orbit: '28deg 65deg auto',
    fallback: 'models/opportunity-demo.glb'
  },

  cassini: {
    name: 'Cassini',
    file: 'models/cassini.glb',
    orbit: '28deg 68deg auto',
    fallback: 'models/cassini-demo.glb'
  }
});
const overlay=document.getElementById('model-overlay');
const focusedModel=document.getElementById('focus-model');
const modelTitle=document.getElementById('model-title');
const closeButton=document.getElementById('model-close');
const toggleButton=document.getElementById('model-toggle');
const nasaStage=document.getElementById('nasa-planet-stage');
let previousFocus=null, selectedKey=null, nasaShown=false;

function setupFallback(viewer,fallback){
  viewer.addEventListener('error',()=>{
    if(fallback && !viewer.dataset.fallbackUsed){
      viewer.dataset.fallbackUsed='true';
      viewer.setAttribute('src',fallback);
    }
  });
}
for(const viewer of document.querySelectorAll('.nasa-remote')){
  setupFallback(viewer,viewer.dataset.fallback);
}
setupFallback(focusedModel,null);

function showLocal3D(item){
  nasaStage.replaceChildren();
  nasaStage.hidden=true;
  focusedModel.hidden=false;
  focusedModel.dataset.fallbackUsed='';
  // Para planetas, el modelo integrado es una alternativa gráfica provisional.
  focusedModel.setAttribute('src',item.nasa ? item.file : item.file);
  focusedModel.setAttribute('camera-orbit',item.orbit);
  focusedModel.setAttribute('alt',`Modelo 3D de ${item.name}`);
  nasaShown=false;
  if(item.nasa){ toggleButton.textContent='VER NASA 3D'; }
}
function showNasaEmbed(item){
  focusedModel.hidden=true;
  focusedModel.removeAttribute('src');
  nasaStage.hidden=false;
  nasaStage.replaceChildren();
  const frame=document.createElement('iframe');
  frame.src=item.nasa;
  frame.title=`NASA, ${item.name} en 3D interactivo`;
  frame.loading='eager';
  frame.setAttribute('allowfullscreen','');
  frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
  nasaStage.appendChild(frame);
  nasaShown=true;
  toggleButton.textContent='FONDO TRANSPARENTE';
}
function openModel(key){
  const item=MODEL_DATA[key]; if(!item)return;
  previousFocus=document.activeElement;
  selectedKey=key;
  modelTitle.textContent=item.name;
  toggleButton.hidden=!item.nasa;
  if(item.nasa) showNasaEmbed(item);
  else {
    showLocal3D(item);
    focusedModel.dataset.fallbackUsed='';
  }
  overlay.hidden=false;
  overlay.setAttribute('aria-hidden','false');
  document.body.classList.add('viewer-open');
  closeButton.focus();
}
function closeModel(){
  overlay.hidden=true;
  overlay.setAttribute('aria-hidden','true');
  document.body.classList.remove('viewer-open');
  focusedModel.removeAttribute('src');
  nasaStage.replaceChildren();
  nasaStage.hidden=true;
  focusedModel.hidden=false;
  selectedKey=null;
  if(previousFocus && previousFocus.focus)previousFocus.focus();
}
// If NASA model fails to load in-browser, use the included local demonstration file.
focusedModel.addEventListener('error',()=>{
  const item=MODEL_DATA[selectedKey];
  if(item && item.fallback && !focusedModel.dataset.fallbackUsed){
    focusedModel.dataset.fallbackUsed='true';
    focusedModel.src=item.fallback;
  }
});
toggleButton.addEventListener('click',()=>{
  const item=MODEL_DATA[selectedKey];if(!item || !item.nasa)return;
  if(nasaShown)showLocal3D(item); else showNasaEmbed(item);
});
document.querySelectorAll('[data-planet]').forEach(card=>{
  card.addEventListener('click',event=>{event.preventDefault();openModel(card.dataset.planet);});
});
document.querySelectorAll('[data-model]').forEach(card=>{
  card.addEventListener('click',()=>openModel(card.dataset.model));
});
closeButton.addEventListener('click',closeModel);
document.getElementById('model-back').addEventListener('click',closeModel);
document.querySelector('[data-close-viewer]').addEventListener('click',closeModel);
document.addEventListener('keydown',event=>{if(!overlay.hidden && event.key==='Escape')closeModel();});


/* =========================================
   LEGADO CÓSMICO
   OPTIMIZACIÓN DE RENDIMIENTO 3D
   ========================================= */

function optimizarModelos3D() {

  // Evitar que todas las tarjetas giren
  // constantemente en segundo plano.
  document.querySelectorAll(
    "model-viewer.preview-model"
  ).forEach(modelo => {

    modelo.removeAttribute("auto-rotate");
    modelo.setAttribute("loading", "lazy");

  });

  // Permitir que model-viewer reduzca la
  // resolución durante movimientos exigentes.
  customElements.whenDefined("model-viewer")
    .then(() => {

      const ModelViewer =
        customElements.get("model-viewer");

      if (ModelViewer) {
        ModelViewer.minimumRenderScale = 0.35;
      }

    });

}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    optimizarModelos3D,
    { once: true }
  );
} else {
  optimizarModelos3D();
}
