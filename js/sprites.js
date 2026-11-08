(function(){
  function draw(canvas,id,scale=1){if(!canvas)return; const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height; c.clearRect(0,0,w,h); c.save(); c.translate(w/2,h*.57); c.scale(scale,scale); c.lineJoin='round'; c.lineCap='round';
    const s=window.NevData.species[id]||window.NevData.species.lumito, fill=s.color, hi=s.accent;
    c.fillStyle='rgba(8,5,20,.22)';c.beginPath();c.ellipse(0,70,62,15,0,0,Math.PI*2);c.fill();
    const shape=s.shape;
    if(shape==='fox'){
      c.fillStyle=fill;c.beginPath();c.moveTo(-44,-36);c.lineTo(-57,-95);c.quadraticCurveTo(-31,-83,-21,-58);c.quadraticCurveTo(8,-80,25,-57);c.lineTo(48,-84);c.lineTo(45,-28);c.quadraticCurveTo(67,17,38,47);c.quadraticCurveTo(2,75,-40,47);c.quadraticCurveTo(-69,13,-44,-36);c.fill();
      c.fillStyle=hi;c.beginPath();c.ellipse(3,14,39,32,0,0,Math.PI*2);c.fill();c.fillStyle='#332346';for(const x of [-15,15]){c.beginPath();c.ellipse(x,-8,4,7,0,0,Math.PI*2);c.fill()}c.beginPath();c.arc(0,9,3,0,7);c.fill();
    } else if(shape==='sprout'){
      c.fillStyle=fill;c.beginPath();c.ellipse(0,8,56,59,0,0,Math.PI*2);c.fill();c.fillStyle=hi;c.beginPath();c.ellipse(0,25,32,29,0,0,Math.PI*2);c.fill();c.strokeStyle='#287a59';c.lineWidth=7;c.beginPath();c.moveTo(0,-38);c.quadraticCurveTo(-9,-75,-34,-76);c.quadraticCurveTo(-36,-47,-3,-39);c.moveTo(2,-40);c.quadraticCurveTo(13,-78,40,-70);c.quadraticCurveTo(37,-45,2,-40);c.stroke();c.fillStyle='#26344a';for(const x of [-17,17]){c.beginPath();c.arc(x,3,4,0,7);c.fill()}
    } else if(shape==='lizard'){
      c.fillStyle=fill;c.beginPath();c.ellipse(0,4,54,49,-.08,0,7);c.moveTo(38,23);c.quadraticCurveTo(86,12,74,-27);c.quadraticCurveTo(109,17,60,48);c.fill();c.fillStyle=hi;c.beginPath();c.ellipse(-4,18,30,26,0,0,7);c.fill();c.fillStyle='#32253a';for(const x of [-20,17]){c.beginPath();c.arc(x,-9,4,0,7);c.fill()}c.fillStyle='#ffae52';c.beginPath();c.moveTo(-4,-53);c.quadraticCurveTo(-21,-74,-5,-88);c.quadraticCurveTo(2,-69,10,-82);c.quadraticCurveTo(27,-60,7,-51);c.fill();
    } else if(shape==='blob'){
      c.fillStyle=fill;c.beginPath();c.moveTo(-55,25);c.quadraticCurveTo(-71,-20,-34,-43);c.quadraticCurveTo(-10,-78,16,-45);c.quadraticCurveTo(65,-38,55,17);c.quadraticCurveTo(48,64,0,58);c.quadraticCurveTo(-47,64,-55,25);c.fill();c.fillStyle=hi;c.beginPath();c.ellipse(-18,-16,11,18,-.6,0,7);c.fill();c.fillStyle='#23415b';for(const x of [-17,17]){c.beginPath();c.arc(x,5,4,0,7);c.fill()}
    } else if(shape==='owl'){
      c.fillStyle=fill;c.beginPath();c.moveTo(-48,-14);c.lineTo(-52,-65);c.lineTo(-15,-46);c.quadraticCurveTo(0,-58,17,-46);c.lineTo(51,-65);c.lineTo(47,-7);c.quadraticCurveTo(68,45,0,57);c.quadraticCurveTo(-64,47,-48,-14);c.fill();c.fillStyle=hi;for(const x of [-20,20]){c.beginPath();c.arc(x,-5,17,0,7);c.fill();c.fillStyle='#352742';c.beginPath();c.arc(x,-5,6,0,7);c.fill();c.fillStyle=hi}c.fillStyle='#ffbf66';c.beginPath();c.moveTo(-6,13);c.lineTo(7,13);c.lineTo(0,24);c.fill();
    } else {
      c.fillStyle=fill;c.beginPath();c.moveTo(-48,39);c.lineTo(-55,-5);c.lineTo(-25,-56);c.lineTo(1,-46);c.lineTo(24,-66);c.lineTo(53,-22);c.lineTo(46,34);c.lineTo(18,55);c.lineTo(-23,52);c.fill();c.fillStyle=hi;c.beginPath();c.ellipse(0,25,24,17,0,0,7);c.fill();c.fillStyle='#353140';for(const x of [-17,17]){c.beginPath();c.arc(x,0,4,0,7);c.fill()}
    }
    c.strokeStyle='rgba(45,34,65,.4)';c.lineWidth=3;c.beginPath();c.moveTo(-21,45);c.lineTo(-24,57);c.moveTo(22,45);c.lineTo(24,57);c.stroke();c.restore();
  }
  function scene(canvas){if(!canvas)return;let c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.clearRect(0,0,w,h);let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2b2050');g.addColorStop(1,'#101327');c.fillStyle=g;c.fillRect(0,0,w,h);for(let i=0;i<34;i++){let x=(i*173)%w,y=(i*97)%h;c.fillStyle=`rgba(190,220,255,${.15+(i%5)*.09})`;c.beginPath();c.arc(x,y,1+i%3,0,7);c.fill()}c.fillStyle='#192e34';for(let i=0;i<12;i++){let x=i*w/10-20; c.beginPath();c.moveTo(x,h*.72);c.lineTo(x+45,h*.46-(i%3)*20);c.lineTo(x+90,h*.72);c.fill()}c.fillStyle='#31674c';c.beginPath();c.ellipse(w*.5,h*1.1,w*.68,h*.38,0,0,7);c.fill();}
  window.NevSprites={draw,scene};
})();
