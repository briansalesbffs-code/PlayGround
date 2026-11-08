(function(){
  const W=window;
  let canvas,ctx,last=0,worldWidth=0,worldHeight=0,player={x:0,y:0,dir:1,step:0},keys={},joy={x:0,y:0},actors=[],onAction=()=>{},onEncounter=()=>{},active=false,joyPointer=null;
  function resize(){
    const width=innerWidth,height=innerHeight;
    if(worldWidth&&worldHeight){
      const sx=width/worldWidth,sy=height/worldHeight;
      player.x*=sx;player.y*=sy;
      actors.forEach(actor=>{actor.x*=sx;actor.y*=sy});
    }
    worldWidth=width;worldHeight=height;
    const d=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.floor(width*d);
    canvas.height=Math.floor(height*d);
    ctx.setTransform(d,0,0,d,0,0);
  }
  function init(opts){
    canvas=document.getElementById('world');
    ctx=canvas.getContext('2d');
    resize();
    addEventListener('resize',resize);
    player.x=innerWidth*.5;
    player.y=innerHeight*.63;
    actors=[
      {id:'iris',name:'Professora Íris',x:innerWidth*.5-55,y:innerHeight*.36,kind:'person',color:'#b898ff',label:'Íris'},
      {id:'loja',name:'Dona Lume',x:innerWidth*.72,y:innerHeight*.45,kind:'person',color:'#f5ad79',label:'Loja'},
      {id:'guia',name:'Guardião',x:innerWidth*.29,y:innerHeight*.43,kind:'person',color:'#89d9be',label:'Guia'}
    ];
    onAction=opts.action||(()=>{});
    onEncounter=opts.encounter||(()=>{});
    bindKeyboard();
    bindJoystick();
    requestAnimationFrame(frame);
  }
  function bindKeyboard(){
    const movementKeys=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'];
    addEventListener('keydown',e=>{
      const key=e.key.length===1?e.key.toLowerCase():e.key;
      if(movementKeys.includes(key)){
        keys[key]=true;
        e.preventDefault();
      }
    });
    addEventListener('keyup',e=>{
      const key=e.key.length===1?e.key.toLowerCase():e.key;
      delete keys[key];
    });
    addEventListener('blur',()=>{keys={};setJoy(0,0)});
  }
  function bindJoystick(){
    const stick=document.getElementById('joystick');
    const knob=document.getElementById('joyKnob');
    if(!stick||!knob)return;
    function update(e){
      const rect=stick.getBoundingClientRect();
      const radius=Math.max(1,rect.width*.34);
      const dx=e.clientX-(rect.left+rect.width/2);
      const dy=e.clientY-(rect.top+rect.height/2);
      const distance=Math.hypot(dx,dy),scale=distance>radius?radius/distance:1;
      const x=dx*scale,y=dy*scale;
      knob.style.transform=`translate(${x}px, ${y}px)`;
      setJoy(x/radius,y/radius);
    }
    function release(e){
      if(joyPointer!==e.pointerId)return;
      joyPointer=null;
      setJoy(0,0);
      knob.style.transform='translate(0px, 0px)';
      if(stick.hasPointerCapture(e.pointerId))stick.releasePointerCapture(e.pointerId);
    }
    stick.addEventListener('pointerdown',e=>{
      if(joyPointer!==null)return;
      joyPointer=e.pointerId;
      stick.setPointerCapture(e.pointerId);
      update(e);
      e.preventDefault();
    });
    stick.addEventListener('pointermove',e=>{if(joyPointer===e.pointerId)update(e)});
    stick.addEventListener('pointerup',release);
    stick.addEventListener('pointercancel',release);
  }
  function setActive(value){
    active=!!value;
    if(!active){
      keys={};setJoy(0,0);
      const knob=document.getElementById('joyKnob');
      if(knob)knob.style.transform='translate(0px, 0px)';
    }
  }
  function setPosition(x,y){player.x=x;player.y=y}
  function getPlayer(){return {...player}}
  function setJoy(x,y){joy={x,y}}
  function interact(){
    let nearest=null,dist=100;
    for(const actor of actors){const d=Math.hypot(actor.x-player.x,actor.y-player.y);if(d<dist){dist=d;nearest=actor}}
    if(nearest){onAction(nearest.id);return true}
    return false;
  }
  function frame(t){
    requestAnimationFrame(frame);
    const dt=Math.min(.04,(t-last)/1000||0);
    last=t;
    if(active){
      let dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0)+joy.x;
      let dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0)+joy.y;
      const len=Math.hypot(dx,dy);
      if(len>.15){
        dx/=Math.max(1,len);dy/=Math.max(1,len);
        const speed=165,ox=player.x,oy=player.y;
        player.x=Math.max(26,Math.min(innerWidth-26,player.x+dx*speed*dt));
        player.y=Math.max(innerHeight*.23,Math.min(innerHeight-75,player.y+dy*speed*dt));
        player.dir=dx<-.1?-1:dx>.1?1:player.dir;
        if(Math.hypot(player.x-ox,player.y-oy)>1){
          player.step+=dt*12;
          if(Math.random()<dt*1.6)W.NevAudio.play('step');
          if(player.step>10){player.step=0;if(player.y>innerHeight*.60&&Math.random()<.08)onEncounter()}
        }
      }
    }
    render(t);
  }
  function render(t){
    const w=innerWidth,h=innerHeight;
    if(!ctx)return;
    const g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#241c42');g.addColorStop(.42,'#33455a');g.addColorStop(1,'#426748');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#28394d';ctx.beginPath();ctx.moveTo(0,h*.48);for(let x=0;x<=w+40;x+=40)ctx.lineTo(x,h*.39+Math.sin(x*.012)*24);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();
    ctx.fillStyle='#3c674e';ctx.beginPath();ctx.moveTo(0,h*.62);for(let x=0;x<=w+40;x+=30)ctx.lineTo(x,h*.57+Math.sin(x*.02+1)*18);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();
    ctx.fillStyle='#9b8a69';ctx.beginPath();ctx.moveTo(w*.37,h);ctx.quadraticCurveTo(w*.48,h*.68,w*.49,h*.46);ctx.quadraticCurveTo(w*.53,h*.42,w*.56,h*.47);ctx.quadraticCurveTo(w*.56,h*.7,w*.66,h);ctx.fill();
    ctx.fillStyle='#b4a07b';ctx.beginPath();ctx.moveTo(w*.43,h);ctx.quadraticCurveTo(w*.5,h*.65,w*.51,h*.48);ctx.quadraticCurveTo(w*.53,h*.72,w*.60,h);ctx.fill();
    for(const [x,y,col] of [[.08,.40,'#d78678'],[.82,.38,'#dca95e'],[.15,.51,'#8a85bc']]){
      const bx=x*w,by=y*h,bw=Math.min(100,w*.18),bh=Math.min(85,h*.17);
      ctx.fillStyle='#49384b';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(bx-8,by+12);ctx.lineTo(bx+bw/2,by-bh*.52);ctx.lineTo(bx+bw+8,by+12);ctx.fill();
      ctx.fillStyle='#ffd994';ctx.fillRect(bx+bw*.14,by+bh*.27,bw*.2,bh*.23);ctx.fillRect(bx+bw*.65,by+bh*.27,bw*.2,bh*.23);ctx.fillStyle='#654739';ctx.fillRect(bx+bw*.42,by+bh*.53,bw*.2,bh*.47);
    }
    for(let i=0;i<100;i++){const x=(i*137)%w,y=h*.56+(i*79%(Math.max(1,h*.43)));ctx.fillStyle=i%4?'rgba(130,205,120,.45)':'rgba(242,208,126,.75)';ctx.beginPath();ctx.arc(x,y,1.3+i%3,0,7);ctx.fill()}
    actors.forEach(a=>drawPerson(a.x,a.y,a.color,a.label,false));drawPerson(player.x,player.y,'#72ddbd','',true);
    for(let i=0;i<18;i++){const x=(i*191+t*.008)%w,y=(i*89+t*.012)%h;ctx.fillStyle='rgba(220,237,255,.23)';ctx.beginPath();ctx.arc(x,y,2,0,7);ctx.fill()}
    const hint=document.getElementById('interactHint');
    if(hint)hint.classList.toggle('hidden',!actors.some(a=>Math.hypot(a.x-player.x,a.y-player.y)<100));
  }
  function drawPerson(x,y,color,label,isPlayer){
    const bob=Math.sin(performance.now()*.003+x)*2;
    ctx.fillStyle='rgba(0,0,0,.24)';ctx.beginPath();ctx.ellipse(x,y+14,18,6,0,0,7);ctx.fill();ctx.fillStyle='#382a49';ctx.fillRect(x-11,y-3+bob,22,18);
    ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x-12,y-26+bob,24,28,8);ctx.fill();ctx.fillStyle='#f0c4a4';ctx.beginPath();ctx.arc(x,y-32+bob,10,0,7);ctx.fill();
    ctx.fillStyle=isPlayer?'#2d2347':'#473752';ctx.beginPath();ctx.arc(x,y-36+bob,11,Math.PI,0);ctx.fill();
    if(label){ctx.font='bold 11px system-ui';const width=ctx.measureText(label).width+14;ctx.fillStyle='rgba(20,15,34,.76)';ctx.beginPath();ctx.roundRect(x-width/2,y-61,width,18,7);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(label,x,y-48)}
  }
  window.NevWorld={init,setActive,setJoy,getPlayer,setPosition,interact};
})();