(function(){
  const D=window.NevData; const speciesList=Object.keys(D.species); const $=s=>document.querySelector(s);
  function pickCreature(seed){const id=speciesList[(seed*speciesList.length)|0 % speciesList.length]; return {id, level:2+((seed*7)|0), hp:26, maxHp:26, xp:0}; }
  function makeCreature(id,level=3){const s=D.species[id]; return {id, level, hp:18+level*8, maxHp:18+level*8, xp:0}; }
  function createGame(){
    return {
      team:[makeCreature('lumito',3), makeCreature('brotling',2)], lead:0, bag:{potion:2,revive:1,orb:2}, coins:42, crystals:[false,false,false], story:'A névoa se espalha. Encontre os três cristais.', steps:0, areaName:'Vila Aurora',
      startNew(){this.team=[makeCreature('lumito',3), makeCreature('brotling',2)]; this.lead=0; this.coins=42; this.bag={potion:2,revive:1,orb:2}; this.crystals=[false,false,false]; this.story='A névoa se espalha. Encontre os três cristais.'; this.steps=0; localStorage.setItem('nevoa-save',JSON.stringify(this)); this.toWorld(); },
      continueGame(){ const raw=localStorage.getItem('nevoa-save'); if(!raw){this.startNew(); return;} try{Object.assign(this,JSON.parse(raw));}catch(e){this.startNew();} this.toWorld(); },
      save(){localStorage.setItem('nevoa-save',JSON.stringify(this)); window.NevUI.toast('Jornada salva.'); },
      toTitle(){document.getElementById('titleScreen').classList.remove('hidden');document.getElementById('hud').classList.add('hidden');document.getElementById('menuScreen').classList.add('hidden');document.getElementById('battleScreen').classList.add('hidden');document.getElementById('world').style.display='block';document.getElementById('titleBadge').textContent='v1.0 · PWA para celular';window.NevWorld.setActive(false); },
      toWorld(){document.getElementById('titleScreen').classList.add('hidden');document.getElementById('hud').classList.remove('hidden');document.getElementById('world').style.display='block';window.NevWorld.setActive(true);updateHud();},
      useItem(id){ if(!this.bag[id])return false; if(id==='potion'){const m=this.team[this.lead]; if(m.hp>=m.maxHp) return false; this.bag[id]--; m.hp=Math.min(m.maxHp,m.hp+18); updateHud(); return true;} if(id==='revive'){const m=this.team[this.lead]; if(m.hp>0) return false; this.bag[id]--; m.hp=Math.ceil(m.maxHp/2); updateHud(); return true;} return false; },
      healTeam(){this.team.forEach(m=>m.hp=m.maxHp); updateHud(); },
      capture(id,level){const existing=this.team.findIndex(m=>m.id===id); if(existing>=0){this.team[existing].hp=this.team[existing].maxHp; return;} this.team.push(makeCreature(id,level)); if(this.team.length>3){this.team.shift();} this.lead=Math.max(0,this.team.length-1); updateHud(); },
      onBattleEnd(success,enemy){ this.steps += 5; if(success && enemy && !this.crystals.includes(enemy.id)) { if(enemy.id==='lumito'||enemy.id==='brotling'||enemy.id==='brasalto'||enemy.id==='gotinha'||enemy.id==='noturno'||enemy.id==='pedrino'){ /* progress */ } }
        if (enemy && enemy.boss) { this.crystals[0]=true; }
        updateHud(); },
      triggerEncounter(){const roll=Math.random(); const ids=Object.keys(D.species); const id=ids[(Math.random()*ids.length)|0]; const level=2+Math.floor(Math.random()*3); window.NevBattle.start(this,id,level,false); }
    }
  }
  function updateHud(){const g=window.gameState; const hud=$('#hud'); if(!g) return; $('#areaName').textContent = g.areaName || 'Vila Aurora'; $('#crystalCount').textContent = String(g.crystals.filter(Boolean).length); $('#coinCount').textContent = String(g.coins); $('#objectiveText').textContent = g.story || 'Explore a região'; }
  function desktopBindings(){
    const g=window.gameState;
    document.addEventListener('keydown',e=>{
      if(e.repeat)return;
      if(e.key===' '||e.key==='Enter'){
        e.preventDefault();
        if(!$('#dialogue').classList.contains('hidden')){window.NevUI.advance();return;}
        if($('#menuScreen').classList.contains('hidden')&&$('#shopScreen').classList.contains('hidden')&&$('#battleScreen').classList.contains('hidden'))window.NevWorld.interact();
      }
      if(e.key==='m'||e.key==='M'){
        if($('#menuScreen').classList.contains('hidden'))window.NevUI.openMenu(g);
      }
      if(e.key==='Escape'){
        window.NevUI.hide('#menuScreen');
        window.NevUI.hide('#shopScreen');
      }
    });
  }
  function init(){window.gameState=createGame(); window.NevWorld.init({action:(id)=>{ const g=window.gameState; if(id==='iris'){ window.NevUI.say('Íris', ['“A névoa está crescendo. Preciso dos três cristais da lenda.”','“Vá para os campos e capture ou desafie criaturas.”'],()=>{ g.story='Encontre e treine criaturas pela vila e pelos campos.'}); }
    else if(id==='loja'){ window.NevUI.openShop(g,(itemId)=>{ const item=D.items.find(i=>i.id===itemId); if(!item)return; if(g.coins<item.price){ window.NevUI.toast('Moedas insuficientes.'); return;} g.coins-=item.price; g.bag[itemId]=(g.bag[itemId]||0)+1; updateHud(); window.NevUI.toast(`${item.name} adicionado à bolsa.`); }); }
    else if(id==='guia'){ window.NevUI.say('Guardião', ['“A névoa revela criaturas raras à noite.”','“Evite a rocha alta: há um bastião antigo ali.”'],()=>{}); }
    else { window.NevUI.toast('Nada por aqui.'); }
  }, encounter:()=>{ if(Math.random()<.9){window.gameState.triggerEncounter(); }} }); window.NevUI.setup(()=>window.gameState); window.NevUI.say('Íris','“Bem-vindo(a), treinadora. A névoa chama por coragem.”',()=>{}); desktopBindings(); window.NevSprites.scene(document.getElementById('titleCanvas')); }
  window.NevGame={createGame,init,updateHud};
  window.addEventListener('DOMContentLoaded',()=>{ init(); });
})();
