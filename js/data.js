(function(){
  const moves={
    impacto:{name:'Impacto',type:'normal',power:8,pp:30},folha:{name:'Folha-lâmina',type:'grass',power:12,pp:20},brasa:{name:'Brasa viva',type:'fire',power:12,pp:20},onda:{name:'Bolha d’água',type:'water',power:12,pp:20},faísca:{name:'Faísca',type:'electric',power:12,pp:20},sombra:{name:'Sopro sombrio',type:'shadow',power:14,pp:15},cura:{name:'Pólen curativo',type:'fairy',power:-12,pp:10}
  };
  const species={
    lumito:{name:'Lumito',type:'fairy',color:'#f9c86a',accent:'#fff2a1',shape:'fox',moves:['impacto','faísca','cura'],desc:'Uma raposinha luminosa que guia viajantes na neblina.'},
    brotling:{name:'Brotling',type:'grass',color:'#63cf91',accent:'#b5f484',shape:'sprout',moves:['impacto','folha'],desc:'Uma criatura-broto que dança quando a chuva chega.'},
    brasalto:{name:'Brasalto',type:'fire',color:'#f07858',accent:'#ffd071',shape:'lizard',moves:['impacto','brasa'],desc:'Pequeno lagarto que guarda uma brasa no peito.'},
    gotinha:{name:'Gotinha',type:'water',color:'#5dbbe8',accent:'#b5edff',shape:'blob',moves:['impacto','onda'],desc:'Uma gota curiosa que salta de poça em poça.'},
    noturno:{name:'Noturno',type:'shadow',color:'#846ed4',accent:'#c4afff',shape:'owl',moves:['impacto','sombra'],desc:'Uma coruja misteriosa, mas muito amigável.'},
    pedrino:{name:'Pedrino',type:'normal',color:'#a9a9b5',accent:'#e5d4bd',shape:'rock',moves:['impacto','folha'],desc:'Um montinho de pedras com um coração enorme.'}
  };
  window.NevData={moves,species,types:{grass:'#59c47a',fire:'#f2764a',water:'#52a7e8',electric:'#f2c94c',shadow:'#9a7fe0',fairy:'#f08fc0',normal:'#b8b8c8'},items:[{id:'potion',name:'Poção',icon:'🧪',price:18,desc:'Recupera 20 PV da criatura líder.'},{id:'revive',name:'Reviver',icon:'✨',price:35,desc:'Revive a criatura líder com metade dos PV.'},{id:'orb',name:'Orbe de névoa',icon:'🔮',price:24,desc:'Ajuda a acolher uma criatura selvagem.'}]};
})();
