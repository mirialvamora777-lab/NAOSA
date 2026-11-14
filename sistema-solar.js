/*
 * LEGADO CÓSMICO · Sistema solar interactivo.
 * Módulo independiente: NO cambia script.js ni los model-viewer originales.
 * WebGL nativo: no depende de Three.js, npm ni servidores de terceros.
 * Las órbitas, tamaños y velocidades son ILUSTRATIVOS (no a escala).
 * Las texturas de Tierra, Marte, Luna y Saturno son versiones panorámicas
 * ligeras derivadas de las texturas de los GLB entregados por el equipo.
 * Los demás planetas utilizan texturas ilustrativas generadas para esta escena.
 */
(()=>{
  'use strict';
  const canvas=document.getElementById('solar3d-lienzo');
  if(!canvas) return;
  const section=document.getElementById('sistema-solar');
  const stage=document.getElementById('solar3d-escena');
  const status=document.getElementById('solar3d-estado');
  const reset=document.getElementById('solar3d-reset');
  const pause=document.getElementById('solar3d-pause');
  const speed=document.getElementById('solar3d-speed');
  const source=document.getElementById('solar3d-source');
  const selectedLabel=document.getElementById('solar3d-selected');
  const chips=[...document.querySelectorAll('[data-solar-planet]')];
  const gl=canvas.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:false}) || canvas.getContext('experimental-webgl',{antialias:true,alpha:true});
  if(!gl){status.textContent='El navegador no tiene WebGL activo. Prueba Chrome o Edge.';stage.classList.add('solar3d-error');return;}
  const V=`attribute vec3 aP;attribute vec3 aN;attribute vec2 aU;
    uniform mat4 uMVP;uniform mat4 uModel;
    varying vec2 vUV;varying vec3 vN;varying vec3 vWorld;
    void main(){vec4 world=uModel*vec4(aP,1.);vWorld=world.xyz;vN=normalize(mat3(uModel)*aN);vUV=aU;gl_Position=uMVP*vec4(aP,1.);}`;
  const F=`precision mediump float;
    uniform sampler2D uMap;uniform vec3 uSun;uniform vec3 uEye;uniform float uEmissive;
    varying vec2 vUV;varying vec3 vN;varying vec3 vWorld;
    void main(){vec3 base=texture2D(uMap,vec2(fract(vUV.x),1.-vUV.y)).rgb;
      vec3 N=normalize(vN);vec3 L=normalize(uSun-vWorld);
      float lit=max(dot(N,L),0.);
      float edge=pow(1.-max(dot(N,normalize(uEye-vWorld)),0.),3.);
      
vec3 color=mix(
  base*(.42+lit*.95)+base*edge*.18,
  base*1.22,
  uEmissive
);

      gl_FragColor=vec4(color,1.);}`;
  const lineV=`attribute vec3 aP;uniform mat4 uMVP;void main(){gl_Position=uMVP*vec4(aP,1.);}`;
  const lineF=`precision mediump float;uniform vec4 uColor;void main(){gl_FragColor=uColor;}`;
  const ringV=`attribute vec3 aP;attribute vec2 aU;uniform mat4 uMVP;varying vec2 vUV;
    void main(){vUV=aU;gl_Position=uMVP*vec4(aP,1.);}`;
  const ringF=`precision mediump float;uniform vec3 uTint;varying vec2 vUV;
    void main(){float r=vUV.x;float stripes=.58+.42*sin(r*145.);
      float bands=.42+.29*sin(r*36.)+.15*sin(r*92.);
      float edge=smoothstep(0.,.08,r)*(1.-smoothstep(.89,1.,r));
      float gap=1.-.83*(smoothstep(.52,.54,r)-smoothstep(.60,.62,r));
      float alpha=clamp((.23+.50*bands)*edge*gap,.0,.73);
      gl_FragColor=vec4(uTint*stripes,alpha);}`;
  const starV=`attribute vec3 aP;uniform mat4 uVP;uniform float uPixel;
    void main(){gl_Position=uVP*vec4(aP,1.);gl_PointSize=uPixel;}`;
  const starF=`precision mediump float;void main(){float d=length(gl_PointCoord-.5);float a=1.-smoothstep(.05,.50,d);gl_FragColor=vec4(.75,.86,1.,a*.68);}`;
  function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
  function program(v,f){const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,v));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
  function makeProgram(v,f,attributes,uniforms){const p=program(v,f);const a={},u={};attributes.forEach(k=>a[k]=gl.getAttribLocation(p,k));uniforms.forEach(k=>u[k]=gl.getUniformLocation(p,k));return {p,a,u};}
  let planetProgram,lineProgram,ringProgram,starProgram;
  try{
    planetProgram=makeProgram(V,F,['aP','aN','aU'],['uMVP','uModel','uMap','uSun','uEye','uEmissive']);
    lineProgram=makeProgram(lineV,lineF,['aP'],['uMVP','uColor']);
    ringProgram=makeProgram(ringV,ringF,['aP','aU'],['uMVP','uTint']);
    starProgram=makeProgram(starV,starF,['aP'],['uVP','uPixel']);
  }catch(error){status.textContent='No fue posible iniciar el visor WebGL: '+error.message;return;}
  const M={
    identity(){return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);},
    mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;},
    project(fov,aspect,near,far){let f=1/Math.tan(fov/2),o=new Float32Array(16);o[0]=f/aspect;o[5]=f;o[10]=(far+near)/(near-far);o[11]=-1;o[14]=2*far*near/(near-far);return o;},
    look(eye,at){let z=norm(sub(eye,at)),x=norm(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([
      x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);},
    model(pos,radius,angle=0,tilt=0){let c=Math.cos(angle),s=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt),r=radius;
      return new Float32Array([r*c,r*st*s,-r*ct*s,0,0,r*ct,r*st,0,r*s,-r*st*c,r*ct*c,0,pos[0],pos[1],pos[2],1]);},
    mv(m,p){let r=[0,0,0,0];for(let i=0;i<4;i++)r[i]=m[i]*p[0]+m[i+4]*p[1]+m[i+8]*p[2]+m[i+12]*p[3];return r;}
  };
  const sub=(a,b)=>a.map((x,i)=>x-b[i]);const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>{let n=Math.hypot(...a)||1;return a.map(x=>x/n);};
  function makeBuffer(data,target=gl.ARRAY_BUFFER){const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b;}
  function sphereMesh(lats=48,lons=80){let vertices=[],indices=[];
    for(let y=0;y<=lats;y++){let phi=y*Math.PI/lats;
      for(let x=0;x<=lons;x++){let th=x*2*Math.PI/lons,px=Math.sin(phi)*Math.cos(th),py=Math.cos(phi),pz=Math.sin(phi)*Math.sin(th);
        vertices.push(px,py,pz,px,py,pz,x/lons,y/lats);
      }}
    for(let y=0;y<lats;y++)for(let x=0;x<lons;x++){let a=y*(lons+1)+x,b=a+lons+1;indices.push(a,b,a+1,a+1,b,b+1);}
    return {buffer:makeBuffer(new Float32Array(vertices)),inds:makeBuffer(new Uint16Array(indices),gl.ELEMENT_ARRAY_BUFFER),count:indices.length};
  }
  const sphere=sphereMesh();
  function drawSphere(body,model,VP,eye){gl.useProgram(planetProgram.p);gl.bindBuffer(gl.ARRAY_BUFFER,sphere.buffer);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,sphere.inds);
    const stride=8*4;for(let [name,size,offset] of [['aP',3,0],['aN',3,12],['aU',2,24]]){const a=planetProgram.a[name];gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,size,gl.FLOAT,false,stride,offset);}
    gl.uniformMatrix4fv(planetProgram.u.uMVP,false,M.mul(VP,model));gl.uniformMatrix4fv(planetProgram.u.uModel,false,model);
    gl.uniform3fv(planetProgram.u.uSun,new Float32Array([0,0,0]));gl.uniform3fv(planetProgram.u.uEye,new Float32Array(eye));
    gl.uniform1f(planetProgram.u.uEmissive,body.key==='sol'?1:0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,textures[body.texture]||placeholder);gl.uniform1i(planetProgram.u.uMap,0);
    gl.drawElements(gl.TRIANGLES,sphere.count,gl.UNSIGNED_SHORT,0);
  }
  function ringMesh(){let v=[],inds=[],segments=132;for(let i=0;i<=segments;i++){
    const a=2*Math.PI*i/segments;for(let j=0;j<=1;j++){let r=j?1.0:0.0;let rr=j?2.42:1.27;
      v.push(Math.cos(a)*rr,0,Math.sin(a)*rr,r,i/segments);
    }}for(let i=0;i<segments;i++){const k=i*2;inds.push(k,k+1,k+2,k+1,k+3,k+2);}
    return {buffer:makeBuffer(new Float32Array(v)),inds:makeBuffer(new Uint16Array(inds),gl.ELEMENT_ARRAY_BUFFER),count:inds.length};
  }
  const ring=ringMesh();
  function drawRing(body,VP){const model=M.model(body.pos,body.radius,0,body.key==='saturno'?0.44:1.36);
    gl.useProgram(ringProgram.p);gl.bindBuffer(gl.ARRAY_BUFFER,ring.buffer);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ring.inds);
    const a=ringProgram.a;gl.enableVertexAttribArray(a.aP);gl.vertexAttribPointer(a.aP,3,gl.FLOAT,false,20,0);
    gl.enableVertexAttribArray(a.aU);gl.vertexAttribPointer(a.aU,2,gl.FLOAT,false,20,12);
    gl.uniformMatrix4fv(ringProgram.u.uMVP,false,M.mul(VP,model));gl.uniform3fv(ringProgram.u.uTint,new Float32Array(body.key==='saturno'?[.79,.70,.57]:[.55,.82,.86]));
    gl.disable(gl.CULL_FACE);gl.depthMask(false);gl.drawElements(gl.TRIANGLES,ring.count,gl.UNSIGNED_SHORT,0);gl.depthMask(true);
  }

  // ORBITAS 3D CON BRILLO Y GROSOR REAL
  function orbitMesh(radius) {
    function createBand(width) {
      const vertices = [];
      const segments = 320;
      const inner = radius - width / 2;
      const outer = radius + width / 2;

      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const b = ((i + 1) / segments) * Math.PI * 2;

        const ax = Math.cos(a), az = Math.sin(a);
        const bx = Math.cos(b), bz = Math.sin(b);

        vertices.push(
          ax * inner, 0, az * inner,
          ax * outer, 0, az * outer,
          bx * inner, 0, bz * inner,

          ax * outer, 0, az * outer,
          bx * outer, 0, bz * outer,
          bx * inner, 0, bz * inner
        );
      }

      return {
        buffer: makeBuffer(new Float32Array(vertices)),
        count: vertices.length / 3
      };
    }

    return {
      glow: createBand(1.65),
      middle: createBand(0.78),
      core: createBand(0.30)
    };
  }

  function drawOrbit(orbit, VP, alpha) {
    gl.useProgram(lineProgram.p);
    gl.uniformMatrix4fv(lineProgram.u.uMVP, false, VP);

    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    // Al acercar la cámara la banda se ve más ancha: se atenúa para que no se queme a blanco.
    const near = Math.min(1, Math.max(0.38, dist / 40));
    // Mezcla suave: órbitas normales azules, órbita del planeta elegido dorada.
    const mixT = Math.min(1, Math.max(0, (alpha - 0.62) / 0.38));
    const color = [
      0.42 + (1.00 - 0.42) * mixT,
      0.80 + (0.80 - 0.80) * mixT,
      1.00 + (0.42 - 1.00) * mixT
    ];

    const layers = [
      [orbit.glow, 0.13],
      [orbit.middle, 0.30],
      [orbit.core, 0.90]
    ];

    for (const [band, strength] of layers) {
      gl.bindBuffer(gl.ARRAY_BUFFER, band.buffer);

      gl.enableVertexAttribArray(lineProgram.a.aP);

      gl.vertexAttribPointer(
        lineProgram.a.aP,
        3,
        gl.FLOAT,
        false,
        12,
        0
      );

      gl.uniform4f(
        lineProgram.u.uColor,
        color[0],
        color[1],
        color[2],
        Math.min(1, alpha * strength * 1.3 * near)
      );

      gl.drawArrays(
        gl.TRIANGLES,
        0,
        band.count
      );
    }

    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    gl.depthMask(true);
    gl.enable(gl.DEPTH_TEST);
  }

  let seed=737511;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  let starPositions=[];for(let i=0;i<950;i++){let a=random()*Math.PI*2,z=random()*2-1,d=205+random()*85,r=Math.sqrt(1-z*z)*d;starPositions.push(r*Math.cos(a),z*d,r*Math.sin(a));}
  const starBuf=makeBuffer(new Float32Array(starPositions));
  function drawStars(VP,px){gl.useProgram(starProgram.p);gl.bindBuffer(gl.ARRAY_BUFFER,starBuf);gl.enableVertexAttribArray(starProgram.a.aP);gl.vertexAttribPointer(starProgram.a.aP,3,gl.FLOAT,false,12,0);
    gl.uniformMatrix4fv(starProgram.u.uVP,false,VP);gl.uniform1f(starProgram.u.uPixel,px);gl.depthMask(false);gl.drawArrays(gl.POINTS,0,starPositions.length/3);gl.depthMask(true);
  }
  const planets=[
    {key:'mercurio',name:'Mercurio',texture:'mercurio',radius:.60,orbit:6.7,angular:.64,phase:.7},
    {key:'venus',name:'Venus',texture:'venus',radius:.92,orbit:10.2,angular:.47,phase:2.4,source:'https://solarsystem.nasa.gov/gltf_embed/2342/'},
    {key:'tierra',name:'Tierra',texture:'tierra',radius:1.02,orbit:14.3,angular:.38,phase:4.1,source:'https://solarsystem.nasa.gov/gltf_embed/2393/'},
    {key:'marte',name:'Marte',texture:'marte',radius:.82,orbit:18.5,angular:.30,phase:1.7,source:'https://solarsystem.nasa.gov/gltf_embed/2372/'},
    {key:'jupiter',name:'Júpiter',texture:'jupiter',radius:2.05,orbit:25.1,angular:.18,phase:4.9,source:'https://solarsystem.nasa.gov/gltf_embed/2375/'},
    {key:'saturno',name:'Saturno',texture:'saturno',radius:1.83,orbit:33.0,angular:.13,phase:3.0,source:'https://solarsystem.nasa.gov/gltf_embed/2355/'},
    {key:'urano',name:'Urano',texture:'urano',radius:1.46,orbit:41.0,angular:.086,phase:5.65,source:'https://solarsystem.nasa.gov/gltf_embed/2344/'},
    {key:'neptuno',name:'Neptuno',texture:'neptuno',radius:1.49,orbit:49.2,angular:.068,phase:1.14,source:'https://solarsystem.nasa.gov/gltf_embed/2364/'}
  ];
  for(const p of planets){p.meshOrbit=orbitMesh(p.orbit);p.pos=[Math.cos(p.phase)*p.orbit,0,Math.sin(p.phase)*p.orbit];}
  const sun={key:'sol',name:'Sol',texture:'sol',pos:[0,0,0],radius:2.2};
  const moon={key:'luna',name:'Luna',texture:'luna',pos:[0,0,0],radius:.30};
  const textures={};
  const placeholder=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,placeholder);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([172,163,153,255]));
  const mipPOT=i=>(i&(i-1))===0;
  for(const key of ['sol','mercurio','venus','tierra','marte','jupiter','saturno','urano','neptuno','luna']){
    const im=new Image();im.onload=()=>{let tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
      if(mipPOT(im.naturalWidth)&&mipPOT(im.naturalHeight)){gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);}
      else{gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);}
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);textures[key]=tx;
    };im.src='solar-assets/'+key+'.jpg';
  }
  let target=[0,0,0],az=.60,elev=.67,dist=99,goalDist=99,focused=null,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,multiplier=1,elapsed=0,last=0,visible=true,hover=null;
  pause.textContent=playing?'Pausar':'Reanudar';
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const canvasLabels={};for(const body of planets){const label=document.createElement('button');label.type='button';label.className='solar3d-label';label.textContent=body.name;label.setAttribute('aria-label','Enfocar '+body.name);label.addEventListener('click',()=>focus(body.key));stage.appendChild(label);canvasLabels[body.key]=label;}
  let width=0,height=0,dpr=1,VP,eye;
  function fit(){const box=stage.getBoundingClientRect();width=box.width;height=box.height;dpr=Math.min(window.devicePixelRatio||1,1.7);const w=Math.max(2,Math.floor(width*dpr)),h=Math.max(2,Math.floor(height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);}
  function positionCanvas(world){if(!VP)return null;let p=M.mv(VP,[...world,1]);if(p[3]<=0)return null;let x=p[0]/p[3],y=p[1]/p[3];return [(x+1)*width/2,(1-y)*height/2,p[3]];}
  function focus(key){focused=planets.find(p=>p.key===key)||null;chips.forEach(b=>b.classList.toggle('active',b.dataset.solarPlanet===key));selectedLabel.textContent=focused?focused.name:'Vista general';
    window.dispatchEvent(new CustomEvent('solar3d:focus',{detail:{key:focused?focused.key:null,radius:focused?focused.radius:0,dist:focused?(focused.radius>1.2?10.5:7.0):0}}));
    if(focused){goalDist=focused.radius>1.2?10.5:7.0;source.hidden=!focused.source;source.href=focused.source||'#';}else{goalDist=99;source.hidden=true;}
  }
  function general(){focus(null);goalDist=99;}
  chips.forEach(chip=>chip.addEventListener('click',()=>focus(chip.dataset.solarPlanet)));
  reset.addEventListener('click',()=>{general();az=.60;elev=.67;});
  pause.addEventListener('click',()=>{playing=!playing;pause.textContent=playing?'Pausar':'Reanudar';pause.setAttribute('aria-pressed',String(!playing));});
  speed.addEventListener('click',()=>{multiplier=multiplier===1?2:multiplier===2?.5:1;speed.textContent=`Velocidad ×${multiplier}`;});
  let down=null,moved=false;
  canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,az,elev,dist,time:performance.now()};moved=false;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';});
  canvas.addEventListener('pointermove',e=>{if(!down)return;let dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)+Math.abs(dy)>6)moved=true;az=down.az-dx*.008;elev=clamp(down.elev+dy*.006,.12,1.49);});
  canvas.addEventListener('pointerup',e=>{if(!down)return;const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;if(!moved){let closest=null,sep=Infinity;
    for(const body of planets){let p=positionCanvas(body.pos);if(!p)continue;const distTo=Math.hypot(x-p[0],y-p[1]);const threshold=Math.max(17,body.radius*height/Math.max(1,p[2])*.8+13);if(distTo<threshold&&distTo<sep){sep=distTo;closest=body;}}
    if(closest)focus(closest.key);
  } down=null;canvas.style.cursor='grab';});
  canvas.addEventListener('pointercancel',()=>{down=null;canvas.style.cursor='grab';});
  canvas.addEventListener('wheel',e=>{e.preventDefault();goalDist=clamp(goalDist*Math.exp(e.deltaY*.0012),5,175);},{passive:false});
  // Two-finger pinch on touchscreen; one finger rotates via pointer events.
  let touches=new Map(),pinchDist=0;
  canvas.addEventListener('pointerdown',e=>{touches.set(e.pointerId,[e.clientX,e.clientY]);if(touches.size===2){const a=[...touches.values()];pinchDist=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);down=null;}});
  canvas.addEventListener('pointermove',e=>{if(!touches.has(e.pointerId))return;touches.set(e.pointerId,[e.clientX,e.clientY]);if(touches.size===2){const a=[...touches.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(pinchDist>0){goalDist=clamp(goalDist*pinchDist/d,5,175);}pinchDist=d;}});
  for(const ev of ['pointerup','pointercancel'])canvas.addEventListener(ev,e=>{touches.delete(e.pointerId);pinchDist=0;});
  const visObserver=new IntersectionObserver(e=>{visible=e[0].isIntersecting;},{threshold:.01});visObserver.observe(section);
  document.addEventListener('visibilitychange',()=>{last=0;});
  let spin=0;
  function frame(now){requestAnimationFrame(frame);if(!visible||document.hidden)return;
    fit();if(!width||!height)return;
    let dt=last?Math.min((now-last)/1000,.045):0;last=now;if(playing){elapsed+=dt*multiplier;spin+=dt*.2;}
    for(const p of planets){let a=p.phase+elapsed*p.angular;p.pos=[Math.cos(a)*p.orbit,0,Math.sin(a)*p.orbit];}
    const earth=planets[2];moon.pos=[earth.pos[0]+Math.cos(elapsed*2.7)*1.86,.11,earth.pos[2]+Math.sin(elapsed*2.7)*1.86];
    let goal=focused?focused.pos:[0,0,0];const lerp=1-Math.pow(.00015,dt||.016);
    for(let i=0;i<3;i++)target[i]+=(goal[i]-target[i])*lerp;
    dist+=(goalDist-dist)*lerp;
    eye=[target[0]+Math.sin(az)*Math.cos(elev)*dist,target[1]+Math.sin(elev)*dist,target[2]+Math.cos(az)*Math.cos(elev)*dist];
    VP=M.mul(M.project(Math.PI*.255,Math.max(.25,width/height),.1,520),M.look(eye,target));
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    drawStars(VP,Math.max(1.0,Math.min(2.3,dpr*1.6)));
    for(const p of planets){
      // Anillos orbitales más visibles: base .24; con un planeta elegido, los demás .62 y el suyo 1.
      const goalA=focused?(focused===p?1:.62):.24;
      if(p.orbitA===undefined)p.orbitA=.24;
      p.orbitA+=(goalA-p.orbitA)*Math.min(1,(dt||.016)*5);
      drawOrbit(p.meshOrbit,VP,p.orbitA);
    }
    drawSphere(sun,M.model(sun.pos,sun.radius,spin*.26),VP,eye);
    for(const p of planets){drawSphere(p,M.model(p.pos,p.radius,spin*(p.key==='venus'?-0.16:1.0)+p.phase),VP,eye);}
    drawSphere(moon,M.model(moon.pos,moon.radius,spin*.9),VP,eye);
    for(const p of planets){if(p.key==='saturno'||p.key==='urano')drawRing(p,VP);}
    for(const p of planets){let q=positionCanvas(p.pos),btn=canvasLabels[p.key];if(!q||q[0]<-35||q[0]>width+35||q[1]<-20||q[1]>height+20){btn.hidden=true;continue;}
      btn.hidden=false;btn.style.transform=`translate(-50%,-50%) translate(${q[0].toFixed(1)}px,${(q[1]+Math.max(14,p.radius*8+9)).toFixed(1)}px)`;btn.classList.toggle('active',focused===p);
    }
  }
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(fit).observe(stage);
  fit();requestAnimationFrame(frame);
})();

/* ============================================
   LEGADO CÓSMICO
   MEJORA VISUAL DEL SISTEMA SOLAR
   ============================================ */

(() => {
  const canvas = document.getElementById("solar3d-lienzo");
  if (!canvas) return;

  // Mejora el contraste visual del sistema solar.
  canvas.style.filter = "brightness(1.18) contrast(1.12) saturate(1.22)";

  // Refuerza el fondo espacial sin afectar los controles.
  const frame = canvas.closest(".solar3d-frame");

  if (frame) {
    frame.style.background = `
      radial-gradient(
        ellipse at 50% 55%,
        #182d4a 0%,
        #0b172b 50%,
        #030712 100%
      )
    `;
  }
})();
