import * as THREE from 'three';
import './style.css';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

const classes = [
  { name:'Warrior', role:'VANGUARD', icon:'⚔', color:'#e8a77d', desc:'A balanced front-line duelist. Master of the blade and unbreakable resolve.', stats:[78,70,30,55], skills:[['Rising Edge','A quick twin slash', '⚔',12,0],['Aegis Break','Crush armor in a wide arc','◈',20,8],['Meteor Rush','Charge through nearby foes','☄',25,12],['Valor Surge','Empower your next strike','✦',0,18]] },
  { name:'Mage', role:'ARCANE', icon:'✧', color:'#9c8bf4', desc:'A keeper of the old constellations. Weave elemental spells from a safe distance.', stats:[35,40,92,48], skills:[['Starbolt','Launch a focused astral bolt','✧',14,0],['Frost Nova','Explode with chilling energy','❄',22,9],['Comet Fall','Call a comet onto your target','☄',32,15],['Mana Well','Restore a portion of your mana','◉',0,18]] },
  { name:'Paladin', role:'WARDEN', icon:'✥', color:'#f0cf75', desc:'A steadfast guardian whose sacred light shields allies and punishes the wicked.', stats:[64,92,53,42], skills:[['Radiant Cut','Strike with a holy blade','✥',14,0],['Sanctuary','Blast nearby foes with light','☼',21,9],['Judgment','Call down a beam of justice','✦',29,14],['Holy Guard','Mend your wounds with light','♡',0,18]] },
  { name:'Ranger', role:'WILDSHOT', icon:'➶', color:'#91d89b', desc:'A swift hunter who reads the wind and never lets a quarry escape.', stats:[82,42,38,88], skills:[['Quick Shot','Fire a precise arrow','➶',12,0],['Briar Trap','Snare and strike nearby foes','❋',19,7],['Eagle Volley','Rain arrows across the field','➹',26,13],['Windstep','Gain a burst of movement','〰',0,18]] },
  { name:'Assassin', role:'SHADOW', icon:'☾', color:'#c39be2', desc:'A nimble shadow duelist. Build momentum for devastating critical strikes.', stats:[90,34,35,94], skills:[['Shadow Fang','A quick, keen strike','†',13,0],['Veil Dance','Slash all nearby enemies','☾',20,8],['Nightfall','Deliver a heavy finishing blow','✦',29,14],['Smoke Veil','Vanish and recover health','◌',0,18]] },
  { name:'Monk', role:'DISCIPLE', icon:'✊', color:'#e9a47f', desc:'A disciplined martial artist who turns inner energy into explosive force.', stats:[75,68,56,66], skills:[['Palm Strike','A focused chi attack','✊',13,0],['Spirit Wave','Release chi in a circle','◎',20,8],['Dragon Fist','A mighty empowered punch','🐉',30,14],['Inner Calm','Restore health and mana','☯',0,18]] },
  { name:'Cleric', role:'LUMINAR', icon:'☼', color:'#a9d8eb', desc:'A luminous healer who channels starlight into restorative and radiant magic.', stats:[40,62,86,45], skills:[['Light Lance','Pierce foes with radiance','☼',13,0],['Dawn Burst','A radiant area blast','✧',20,8],['Astral Hymn','A powerful beam of light','♫',28,14],['Mending Grace','Restore health and mana','♡',0,18]] },
  { name:'Alchemist', role:'ARTIFICER', icon:'⚗', color:'#d7d989', desc:'A clever artificer who transmutes volatile reagents into battlefield advantage.', stats:[52,56,82,52], skills:[['Flask Toss','Hurl a volatile flask','⚗',14,0],['Crystal Shatter','Burst a crystal around foes','◇',21,8],['Nova Catalyst','Trigger a brilliant reaction','✺',30,14],['Quick Tonic','Restore health and mana','⚕',0,18]] },
];

function portrait(name, color='#77dff5', type='hero') {
  const seed = Math.max(0, classes.findIndex(c=>c.name===name));
  const hair = ['#271b37','#e8c77d','#5b304d','#db9d65','#26384b','#713e37','#f0e2c2','#435d65'][seed];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 280"><defs><linearGradient id="bg" x2="0" y2="1"><stop stop-color="${color}" stop-opacity=".42"/><stop offset="1" stop-color="#101528"/></linearGradient><linearGradient id="cloth" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#34375b"/></linearGradient><radialGradient id="orb"><stop stop-color="#fff4cf"/><stop offset="1" stop-color="${color}" stop-opacity=".1"/></radialGradient></defs><rect width="220" height="280" rx="24" fill="url(#bg)"/><circle cx="110" cy="105" r="78" fill="url(#orb)" opacity=".55"/><path d="M38 278q6-78 72-83 66 5 72 83" fill="url(#cloth)" stroke="#d8e6ff" stroke-opacity=".38" stroke-width="3"/><path d="M72 105q-8-72 38-73 47 0 41 74l-9-24-18-15-39 16z" fill="${hair}"/><ellipse cx="110" cy="112" rx="42" ry="52" fill="#f2c5a5"/><path d="M68 105q1-71 42-71 48 0 43 75l-17-24-18-15-39 16z" fill="${hair}"/><path d="M81 112h14m30 0h14" stroke="#31243c" stroke-width="5" stroke-linecap="round"/><path d="M101 139q9 7 18 0" fill="none" stroke="#a45d6b" stroke-width="3" stroke-linecap="round"/><path d="M53 230l57-32 58 32-18 48H70z" fill="#101628" opacity=".6"/><path d="M85 196l25 24 25-24" fill="none" stroke="#ffe2a0" stroke-width="4"/><path d="M110 215l-8 23 8 8 9-8z" fill="#fff0c1"/><circle cx="110" cy="233" r="31" fill="none" stroke="${color}" stroke-opacity=".7" stroke-width="2"/><path d="M110 12v23m-11-12h22" stroke="#fff0c1" stroke-opacity=".7" stroke-width="2"/><text x="110" y="267" text-anchor="middle" fill="#fff" fill-opacity=".55" font-size="8" font-family="sans-serif" letter-spacing="3">${type==='avatar'?'ASTRAL REGALIA':'AETHERIA'}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const avatarPool = [
  {name:'Aurora Vanguard',set:'Celestial Guard',rarity:5,class:'Warrior',color:'#f4d38a'},
  {name:'Moonlit Oracle',set:'Nocturne Veil',rarity:5,class:'Mage',color:'#a78bfa'},
  {name:'Suncrest Paladin',set:'Dawn Oath',rarity:4,class:'Paladin',color:'#f3c96b'},
  {name:'Sylvan Tracker',set:'Verdant Hunt',rarity:4,class:'Ranger',color:'#83dfa3'},
  {name:'Duskblade',set:'Umbral Edge',rarity:4,class:'Assassin',color:'#cf9bea'},
  {name:'Wayfarer Monk',set:'Sky Temple',rarity:3,class:'Monk',color:'#f2a17b'},
  {name:'Starlight Acolyte',set:'Lumen Choir',rarity:3,class:'Cleric',color:'#8eddf3'},
  {name:'Prism Tinkerer',set:'Arcane Works',rarity:3,class:'Alchemist',color:'#cfda76'},
  {name:'Cloud Sailor',set:'Harbor Days',rarity:3,class:'Ranger',color:'#7ad2dc'},
  {name:'Frostbound Knight',set:'Hollow Guard',rarity:4,class:'Warrior',color:'#a6e2ff'},
  {name:'Ember Scholar',set:'Cinder Codex',rarity:3,class:'Mage',color:'#ff9d72'},
  {name:'Rose Duelist',set:'Petal Waltz',rarity:3,class:'Assassin',color:'#ff9fc4'},
];

const defaultState = {name:'Astra',className:'Warrior',level:1,xp:0,hp:100,mp:60,potions:5,coins:420,gems:120,shards:0,tickets:0,missionClaimed:false,owned:[],equipped:null,kills:0,skillsUsed:0,fragments:0,visited:false,playSeconds:0,progressAt:Date.now(),sound:true,quality:'HIGH'};
let state;
try { state = {...defaultState, ...JSON.parse(localStorage.getItem('aetheria-save') || '{}')}; } catch { state = {...defaultState}; }
let selectedClass = classes.findIndex(c=>c.name===state.className); if (selectedClass<0) selectedClass=0;
let selectedTarget = null, scene, camera, renderer, clock, player, mixerTime=0, enemies=[], npcs=[], particles=[], keys={}, dragState=null, yaw=0, cameraPitch=.42;
let soundOn = state.sound !== false, modalOpen=false, lastSave=0, totalRuntime=0, resumePlayAt=Date.now();
const missions = [
  {key:'kills',icon:'⚔',title:'Thin the Wilds',desc:'Defeat 8 creatures around Aurora Isle.',goal:8,unit:'foes',get:()=>state.kills},
  {key:'skillsUsed',icon:'✧',title:'Practice Your Art',desc:'Use class skills 5 times in combat.',goal:5,unit:'skills',get:()=>state.skillsUsed},
  {key:'fragments',icon:'◇',title:'Starlit Salvage',desc:'Gather 4 astral fragments dropped by creatures.',goal:4,unit:'fragments',get:()=>state.fragments},
  {key:'visited',icon:'❄',title:'Into the Hollow',desc:'Visit the Frost Hollow gate in the north-east.',goal:1,unit:'discovery',get:()=>state.visited?1:0},
];
function save(){ state.sound=soundOn; state.className=classes[selectedClass].name; localStorage.setItem('aetheria-save',JSON.stringify(state)); }
function doneMissions(){return missions.every(m=>m.get()>=m.goal)}
function progress(m){return Math.min(m.goal,m.get())}
function toast(text,kind=''){const el=document.createElement('div');el.className=`toast ${kind}`;el.innerHTML=`<span class="t-icon">${kind==='good'?'✦':kind==='gold'?'✧':'◈'}</span><span>${text}</span>`;$('#toasts').append(el);setTimeout(()=>{el.classList.add('out');setTimeout(()=>el.remove(),450)},3400)}

function initWorld(){
  const canvas=$('#game'); scene=new THREE.Scene(); scene.background=new THREE.Color('#a9c5df'); scene.fog=new THREE.FogExp2('#a9c5df',.013);
  camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,220); camera.position.set(0,10,16);
  try { renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false}); } catch(e){ console.warn('WebGL unavailable',e); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.8)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.1;
  clock=new THREE.Clock();
  scene.add(new THREE.HemisphereLight('#e4f2ff','#385247',2.1));
  const sun=new THREE.DirectionalLight('#fff0d4',2.3); sun.position.set(-25,38,18); sun.castShadow=true; sun.shadow.mapSize.set(2048,2048); sun.shadow.camera.left=-55; sun.shadow.camera.right=55; sun.shadow.camera.top=55; sun.shadow.camera.bottom=-55; scene.add(sun);
  buildIsland();
  player=makeHero(); player.position.set(0,0,4); scene.add(player);
  for(let i=0;i<9;i++) spawnEnemy(i);
  makeNPC('Liora','Harbor Guide',-4,2,'✦','#f2d89c'); makeNPC('Milo','Starlight Merchant',3,1,'◇','#87d9ec');
  addWorldLabel('LUMEN HARBOR',0,0,-12,'#fff0c1'); addPortal(17,0,-25);
  window.addEventListener('resize',resizeWorld); $('#game').addEventListener('pointerdown',onPointerDown); window.addEventListener('pointermove',onPointerMove); window.addEventListener('pointerup',()=>dragState=null);
  animate();
}
function resizeWorld(){if(!renderer||!camera)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));}
function mat(color,roughness=.85,metalness=0){return new THREE.MeshStandardMaterial({color,roughness,metalness})}
function box(parent,x,y,z,sx,sy,sz,color){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat(color));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function sphere(parent,x,y,z,r,color,seg=12){const o=new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(8,seg-2)),mat(color));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function cylinder(parent,x,y,z,r1,r2,h,color,segments=12){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),mat(color));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function buildIsland(){
  const land=new THREE.Mesh(new THREE.CylinderGeometry(33,38,5,12,1),mat('#6a9875'));land.position.y=-3.2;land.receiveShadow=true;land.castShadow=true;scene.add(land);
  const grass=new THREE.Mesh(new THREE.CircleGeometry(33,12),mat('#77aa7c'));grass.rotation.x=-Math.PI/2;grass.position.y=-.67;grass.receiveShadow=true;scene.add(grass);
  const shore=new THREE.Mesh(new THREE.TorusGeometry(32.4,.75,8,48),new THREE.MeshStandardMaterial({color:'#78d6dc',roughness:.36,metalness:.15,transparent:true,opacity:.8}));shore.rotation.x=Math.PI/2;shore.position.y=-.43;scene.add(shore);
  const water=new THREE.Mesh(new THREE.PlaneGeometry(300,300),new THREE.MeshStandardMaterial({color:'#5d9bb5',roughness:.35,metalness:.12}));water.rotation.x=-Math.PI/2;water.position.y=-6.1;scene.add(water);
  for(let i=0;i<48;i++){const a=i/48*Math.PI*2,r=rand(22,30),x=Math.cos(a)*r,z=Math.sin(a)*r;tree(x,z,rand(.7,1.3));}
  for(let i=0;i<19;i++){const x=rand(-23,23),z=rand(-22,20);if(Math.abs(x)<6&&z>-6&&z<8)continue;rock(x,z,rand(.55,1.2));}
  for(const [x,z,c] of [[-8,-10,'#b27e69'],[-12,-11,'#d7b575'],[7,-13,'#738eaa'],[12,-8,'#b7807c']])house(x,z,c);
  // Floating cliffs, distant clouds and tiny sky-islands give the harbor its signature horizon.
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const island=new THREE.Group();const r=rand(54,82);island.position.set(Math.cos(a)*r,rand(1,13),Math.sin(a)*r-18);const top=new THREE.Mesh(new THREE.CylinderGeometry(rand(3,5),rand(1,2),rand(4,8),7),mat('#627d85'));top.castShadow=true;island.add(top);const cap=new THREE.Mesh(new THREE.CylinderGeometry(rand(3,5),rand(3,5),.7,7),mat('#729b78'));cap.position.y=2;island.add(cap);scene.add(island);}
  for(let i=0;i<14;i++){const cloud=new THREE.Group();const x=rand(-68,68),z=rand(-70,35);for(let j=0;j<4;j++)sphere(cloud,(j-1.5)*1.3,rand(-.3,.3),rand(-.5,.5),rand(1.5,2.7),'#ecf5f2',10);cloud.position.set(x,rand(10,25),z);cloud.userData.speed=rand(.3,1);scene.add(cloud);particles.push({cloud});}
}
function tree(x,z,s=1){const g=new THREE.Group();cylinder(g,0,1.25,0,.24,.34,2.5,'#725647',7);sphere(g,0,3.2,0,1.35,'#477b61',9);sphere(g,-.65,2.65,.2,.9,'#68966b',9);sphere(g,.62,2.85,-.16,.85,'#548963',9);g.scale.setScalar(s);g.position.set(x,-.5,z);scene.add(g);}
function rock(x,z,s){const o=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),mat('#89928c'));o.position.set(x,-.2+s*.3,z);o.rotation.set(rand(0,2),rand(0,2),rand(0,2));o.castShadow=true;scene.add(o);}
function house(x,z,color){const g=new THREE.Group();box(g,0,1.15,0,4.4,2.6,3.4,'#d5c7a8');const roof=new THREE.Mesh(new THREE.ConeGeometry(3.2,2.2,4),mat(color));roof.position.set(0,3.4,0);roof.rotation.y=Math.PI/4;roof.castShadow=true;g.add(roof);box(g,0,.65,1.73,.8,1.3,.15,'#654c42');for(const sx of [-1.25,1.25]){box(g,sx,1.65,1.74,.65,.65,.1,'#93c7d2');}g.position.set(x,-.55,z);scene.add(g);}
function makeHero(){const g=new THREE.Group();const tunic=classes[selectedClass].color;const torso=sphere(g,0,1.22,0,.52,'#28405a');torso.scale.set(.78,1.05,.55);sphere(g,0,2.07,0,.36,'#edc3a5');const hair=sphere(g,0,2.3,-.03,.37,'#493048');hair.scale.set(1,.55,.95);sphere(g,-.13,2.08,.32,.045,'#27243b',8);sphere(g,.13,2.08,.32,.045,'#27243b',8);box(g,0,1.36,.42,.16,.38,.08,tunic);for(const x of [-.22,.22]){const leg=box(g,x,.45,0,.22,.75,.24,'#30384d');leg.userData.leg=true;const arm=box(g,x*2,1.35,0,.19,.68,.2,tunic);arm.userData.arm=true;}cylinder(g,0,1.5,.05,.06,.06,1.5,'#bfc9d0',8).rotation.z=-.42;const blade=box(g,.65,1.6,.1,.11,.95,.1,'#d8e8ed');blade.rotation.z=-.3;g.userData.parts=[...g.children];return g;}
function spawnEnemy(index){const types=[['Mossling','#79ad75','◉'],['Aether Mite','#c47c93','✦'],['Cloud Hare','#d6d3c3','❖'],['Glimmer Slime','#70c6c0','◇']];const [name,color,emoji]=types[index%types.length];const g=makeEnemyModel(color,index%2===0);let x,z;do{x=rand(-25,25);z=rand(-24,17);}while(Math.abs(x)<7&&z>-7&&z<9);g.position.set(x,0,z);scene.add(g);const enemy={name,color,emoji,group:g,hp:55,maxHp:55,level:Math.max(1,state.level+Math.floor(rand(-1,2))),alive:true,home:new THREE.Vector3(x,0,z),phase:rand(0,6),nameplate:createPlate(name,'enemy')};enemies.push(enemy);}
function makeEnemyModel(color,round){const g=new THREE.Group();if(round){const b=sphere(g,0,.58,0,.62,color);b.scale.set(1,.82,.9);}else{sphere(g,0,.48,0,.47,color).scale.set(1,.8,1.1);sphere(g,0,.98,-.1,.38,color);}sphere(g,-.2,.72,.47,.07,'#202432',8);sphere(g,.2,.72,.47,.07,'#202432',8);for(const x of [-.5,.5]){const leg=cylinder(g,x,.16,0,.07,.08,.28,'#4e5360',7);leg.rotation.z=x*.4;}return g;}
function makeNPC(name,role,x,z,mark,color){const g=new THREE.Group();cylinder(g,0,.8,0,.32,.42,1.35,'#3b5f74',10);sphere(g,0,1.72,0,.3,'#f1c8a9');sphere(g,0,1.95,-.05,.31,color);for(const x2 of [-.12,.12])sphere(g,x2,1.75,.26,.035,'#263047',8);const orb=sphere(g,0,2.35,0,.16,color);orb.material.emissive=new THREE.Color(color);orb.material.emissiveIntensity=.7;g.position.set(x,0,z);scene.add(g);const npc={name,role,group:g,mark,color,nameplate:createPlate(`${name} · ${role}`,'npc')};npcs.push(npc);}
function addWorldLabel(text,x,y,z,color){const c=document.createElement('canvas');c.width=512;c.height=100;const ctx=c.getContext('2d');ctx.font='bold 34px Cinzel,serif';ctx.textAlign='center';ctx.fillStyle=color;ctx.shadowColor='#18283c';ctx.shadowBlur=8;ctx.fillText(text,256,58);const tex=new THREE.CanvasTexture(c);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));sprite.scale.set(9,1.75,1);sprite.position.set(x,2.6+y,z);scene.add(sprite);}
function addPortal(x,y,z){const g=new THREE.Group();const ring=new THREE.Mesh(new THREE.TorusGeometry(2.15,.22,12,36),new THREE.MeshStandardMaterial({color:'#9deeff',emissive:'#3ba4d7',emissiveIntensity:1.6,metalness:.55,roughness:.25}));g.add(ring);const inner=new THREE.Mesh(new THREE.CircleGeometry(1.95,32),new THREE.MeshBasicMaterial({color:'#539fd0',transparent:true,opacity:.23,side:THREE.DoubleSide}));g.add(inner);g.position.set(x,2,z);scene.add(g);const arch=box(scene,x,-.1,z,.35,4.1,.45,'#758da2');const arch2=box(scene,x,-.1,z,.35,4.1,.45,'#758da2');arch2.position.x+=4.2;box(scene,x+2,-2.05,z,.5,.4,4.7,'#758da2');addWorldLabel('FROST HOLLOW',x,3,z,'#dff8ff');particles.push({portal:g});}
function createPlate(name,type){const p=document.createElement('div');p.className=`nameplate ${type}`;p.innerHTML=`<span class="np-name">${esc(name)}</span><span class="np-lv"></span><div class="np-bar"><i></i></div>`;$('#nameplates').append(p);return p;}

// Weekly progress is tied to an ISO week so claimed rewards cannot be repeated by reloading.
function weekStamp(date=new Date()){
  const d=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate()));
  d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));
  const year=d.getUTCFullYear(), first=new Date(Date.UTC(year,0,1));
  return `${year}-W${String(Math.ceil((((d-first)/86400000)+1)/7)).padStart(2,'0')}`;
}
function ensureWeek(){
  const current=weekStamp();
  if(state.weekKey!==current){state.weekKey=current;state.kills=0;state.skillsUsed=0;state.fragments=0;state.visited=false;state.weeklyClaimed=false;state.missionClaimed=false;save();}
}
ensureWeek();
const names=['Astra','Lyra','Kael','Mira','Orin','Sora','Elowen','Tarin','Nia','Aeris'];
function renderClassSelect(){
  $('#class-grid').innerHTML=classes.map((c,i)=>`<button class="class-card ${i===selectedClass?'active':''}" data-class="${i}" type="button"><span style="color:${c.color}">${c.icon}</span><b>${c.name}</b></button>`).join('');
  $$('#class-grid [data-class]').forEach(b=>b.onclick=()=>{selectedClass=+b.dataset.class;renderClassSelect();});
  const c=classes[selectedClass];$('#class-count').textContent=`${selectedClass+1} / ${classes.length}`;
  $('#class-preview-img').src=portrait(c.name,c.color);$('#preview-role').textContent=c.role;$('#preview-name').textContent=c.name;
  $('#detail-role').textContent=c.role;$('#detail-desc').textContent=c.desc;
  ['atk','def','mag','spd'].forEach((id,i)=>$(`#stat-${id}`).style.width=`${c.stats[i]}%`);
  $('#detail-skills').innerHTML=c.skills.map((s,i)=>`<span title="${esc(s[1])}"><b>${i+1}</b> ${esc(s[0])}</span>`).join('');
}
function enterWorld(){
  state.name=($('#char-name').value.trim().replace(/[^\w -]/g,'').slice(0,14)||'Astra');state.className=classes[selectedClass].name;
  state.hp=100;state.mp=60;save();$('#player-name').textContent=state.name;$('#player-class').textContent=state.className;
  $('#player-portrait').src=portrait(state.className,classes[selectedClass].color);$('#start-screen').classList.add('gone');$('#loading').classList.add('done');$('#hud').classList.remove('hidden');
  initWorld();renderSkills();renderHUD();chat(`${state.name} arrived at Lumen Harbor.`);setTimeout(()=>toast(`Welcome to Aurora Isle, ${esc(state.name)}.`,'good'),500);
}
function bindStart(){
  $('#btn-start').onclick=()=>{$('#title-view').classList.remove('active');$('#create-view').classList.add('active');renderClassSelect();};
  $('#btn-back-title').onclick=()=>{$('#create-view').classList.remove('active');$('#title-view').classList.add('active');};
  $('#btn-create').onclick=enterWorld;$('#random-name').onclick=()=>$('#char-name').value=names[Math.floor(Math.random()*names.length)];
  $('#sound-toggle').onclick=()=>{soundOn=!soundOn;state.sound=soundOn;$('#sound-toggle em').textContent=soundOn?'SOUND ON':'SOUND OFF';save();};
}
function renderSkills(){
  const c=classes[selectedClass];$('#skill-slots').innerHTML=c.skills.map((s,i)=>`<button class="skill-slot" data-skill="${i}" title="${esc(s[0])}: ${esc(s[1])} · ${s[4]} MP"><span class="slot-key">${i+1}</span><span class="slot-glyph">${s[2]}</span><span class="slot-name">${esc(s[0])}</span><i class="cooldown"></i></button>`).join('');
  $$('#skill-slots [data-skill]').forEach(b=>b.onclick=()=>useSkill(+b.dataset.skill));
}
function renderHUD(){
  if(!$('#hud'))return;const maxHp=100+Math.max(0,state.level-1)*12,maxMp=60+Math.max(0,state.level-1)*5;
  state.hp=clamp(state.hp,0,maxHp);state.mp=clamp(state.mp,0,maxMp);
  $('#player-level').textContent=state.level;$('#hp-fill').style.width=`${state.hp/maxHp*100}%`;$('#hp-text').textContent=`${Math.ceil(state.hp)} / ${maxHp}`;
  $('#mp-fill').style.width=`${state.mp/maxMp*100}%`;$('#mp-text').textContent=`${Math.ceil(state.mp)} / ${maxMp}`;
  $('#xp-fill').style.width=`${state.xp}%`;$('#xp-text').textContent=`${state.xp}% · ${state.coins} ◈`;
  $('#potion-count').textContent=state.potions;$('#mission-dot').classList.toggle('show',doneMissions()&&!state.weeklyClaimed);
  $('#gacha-dot').classList.toggle('show',state.tickets>0);renderTracker();updateTarget();
}
function renderTracker(){
  $('#tracker-list').innerHTML=missions.map(m=>{const n=progress(m),complete=n>=m.goal;return `<li class="${complete?'complete':''}"><span>${m.icon}</span><div><b>${esc(m.title)}</b><small>${n}/${m.goal} ${m.unit}</small></div></li>`;}).join('');
  $('#tracker-reward').classList.toggle('ready',doneMissions()&&!state.weeklyClaimed);$('#tracker-reward').classList.toggle('claimed',!!state.weeklyClaimed);
}
function chat(message){const row=document.createElement('p');row.innerHTML=`<span>${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span> ${esc(message)}`;$('#chat-lines').append(row);while($('#chat-lines').children.length>24)$('#chat-lines').firstChild.remove();$('#chat-lines').scrollTop=$('#chat-lines').scrollHeight;}
function addXP(amount){state.xp+=amount;while(state.xp>=100){state.xp-=100;state.level++;state.hp=100+(state.level-1)*12;state.mp=60+(state.level-1)*5;toast(`Level up! You reached level ${state.level}.`,'good');} }
function setTarget(enemy){selectedTarget=enemy||null;updateTarget();}
function updateTarget(){const frame=$('#target-frame');if(!frame)return;if(!selectedTarget||!selectedTarget.alive){frame.classList.add('hidden');return;}frame.classList.remove('hidden');$('#target-name').textContent=selectedTarget.name;$('#target-emoji').textContent=selectedTarget.emoji;$('#target-level').textContent=`Lv. ${selectedTarget.level}`;$('#target-hp-fill').style.width=`${selectedTarget.hp/selectedTarget.maxHp*100}%`;$('#target-hp-text').textContent=`${Math.ceil(selectedTarget.hp/selectedTarget.maxHp*100)}%`;}
function showModal(title,subtitle,body,foot='',extra=''){
  const root=$('#modal-root');root.innerHTML=`<div class="modal-layer"><section class="modal-card glass-strong ${extra}"><header class="modal-head"><div><span class="brand-kicker">AETHERIA ONLINE</span><h2>${title}</h2><p>${subtitle}</p></div><button class="modal-close" aria-label="Close">✕</button></header>${body}${foot}</section></div>`;
  modalOpen=true;root.querySelector('.modal-close').onclick=closeModal;root.querySelector('.modal-layer').addEventListener('pointerdown',e=>{if(e.target===e.currentTarget)closeModal();});
}
function closeModal(){if(!modalOpen)return;modalOpen=false;$('#modal-root').innerHTML='';}

