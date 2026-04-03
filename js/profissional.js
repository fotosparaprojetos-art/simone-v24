var NOMES_SUBEIXO_PROF={s1:'Corpo',s2:'Emocional',o1:'Clareza mental',o2:'Organização',a1:'Início',a2:'Sustentação',p:'Propósito'};
var NOMES_EIXO_PROF={sentir:'Sentir',organizar:'Organizar',agir:'Agir',proposito:'Propósito'};
var PRIORIDADE_SEC={sobrecarga_emocional:1,sobrecarga_organizacional:1,sobrecarga_de_acao:1,baixo_sentido:1,sobrecarga_com_sentido:1,falso_funcional:2,ruminacao_sem_acao:2,atropelo_sem_ordem:2};
var TEXTOS_ITENS_PROF={
  s1:['Já começo o dia com sensação de pouca energia no corpo','Percebo meu corpo tenso ao longo do dia','Mesmo dormindo, acordo sem me sentir recuperado','Perco energia física ao longo do dia para continuar minhas tarefas','Até tarefas simples parecem exigir esforço físico demais','Meu corpo dá sinais de sobrecarga durante o dia'],
  s2:['Me irritei com facilidade ao longo do dia','Senti inquietação ao longo do dia','Reagi de forma intensa a coisas que normalmente não me afetariam tanto','O peso emocional do dia me deixou esgotado','Tive dificuldade de me acalmar depois de me abalar','O que senti atrapalhou o que eu precisava fazer'],
  o1:['Minha mente ficou lenta para entender','Minhas ideias ficaram embaralhadas','Fiquei pensando nas mesmas coisas repetidamente','Minha atenção se dispersava','Minha cabeça ficou acelerada'],
  o2:['Tive dificuldade de organizar o que precisava fazer','Tive dificuldade de definir o que era mais importante fazer primeiro','Fiquei organizando sem avançar nas tarefas','Quando a demanda aumentava, minha organização se perdia','Misturei o que era urgente com o que podia esperar','A ordem das tarefas ficou confusa'],
  a1:['Tive dificuldade de começar tarefas','Adiei tarefas que eu precisava começar','Evitei iniciar tarefas','Precisei de muito esforço interno para dar o primeiro passo','Resisti a tarefas que exigiam fazer algo diferente do que já conheço'],
  a2:['Tive dificuldade de manter o que estava fazendo','Eu parava tarefas antes de terminar','Eu perdia o ritmo no meio do que estava fazendo','No fim do dia, tarefas importantes ainda estavam por fazer'],
  p:['O que eu fazia parecia sem sentido','O que eu fazia não combinava comigo','Eu não via motivo no que estava fazendo','Senti que o esforço que fiz não valeu o que produzi']
};

function _mediaIds(respostas,ids){
  var s=0,c=0;
  for(var i=0;i<ids.length;i++){
    var v=respostas[ids[i]];
    if(v!==null&&v!==undefined&&!isNaN(v)){s+=Number(v);c++;}
  }
  return c?s/c:null;
}

function _r(v){return v!=null?Math.round(v*100)/100:null;}

// CORRIGIDO: lê direto de devolutivas usando codigo como chave, sintese como retorno
function tituloDev(codigo){
  if(!codigo)return '';
  if(typeof devolutivas!=='undefined'&&devolutivas[codigo]){
    return devolutivas[codigo].sintese||codigo;
  }
  return codigo;
}

function calcularSubeixosPro(respostas){
  return {
    s1:_mediaIds(respostas,['s1_1','s1_2','s1_3','s1_4','s1_5','s1_6']),
    s2:_mediaIds(respostas,['s2_1','s2_2','s2_3','s2_4','s2_5','s2_6']),
    o1:_mediaIds(respostas,['o1_1','o1_2','o1_3','o1_4','o1_5']),
    o2:_mediaIds(respostas,['o2_1','o2_2','o2_3','o2_4','o2_5','o2_6']),
    a1:_mediaIds(respostas,['a1_1','a1_2','a1_3','a1_4','a1_5']),
    a2:_mediaIds(respostas,['a2_1','a2_2','a2_3','a2_4']),
    p:_mediaIds(respostas,['p_1','p_2','p_3','p_4'])
  };
}

function detectarAssinaturasSecundarias(e){
  var S=e.S,O=e.O,A=e.A,P=e.P,G=e.G,delta=e.delta;
  var sec=[];
  if(G>=1.4&&G<=2.4&&O>=G+0.4&&A<=G-0.3)sec.push('ruminacao_sem_acao');
  if(G>=1.4&&G<=2.4&&A>=G+0.4&&O<=G-0.3)sec.push('atropelo_sem_ordem');
  if(G>=1.7&&G<=2.4&&delta<0.25)sec.push('falso_funcional');
  if(P<=1.5&&G>=1.4)sec.push('baixo_sentido');
  if(G>=2.5&&S>=Math.max(O,A)+0.4&&S<3.2)sec.push('sobrecarga_emocional');
  if(G>=2.5&&O>=Math.max(S,A)+0.4&&O<3.2)sec.push('sobrecarga_organizacional');
  if(G>=2.5&&A>=Math.max(S,O)+0.4&&A<3.2)sec.push('sobrecarga_de_acao');
  if(G>=2.5&&P>=G+0.4)sec.push('sobrecarga_com_sentido');
  sec=[...new Set(sec)];
  sec.sort(function(a,b){return (PRIORIDADE_SEC[a]||3)-(PRIORIDADE_SEC[b]||3);});
  return sec;
}

function montarPainelProfissional(dados){
  var eixos=dados.eixos,assinatura=dados.assinatura,respostas=dados.respostas||{};
  var S=eixos.S,O=eixos.O,A=eixos.A,P=eixos.P,G=eixos.G,delta=eixos.delta;
  var sub=calcularSubeixosPro(respostas);

  var eixosArr=[{k:'sentir',v:S},{k:'organizar',v:O},{k:'agir',v:A},{k:'proposito',v:P}];
  eixosArr.sort(function(a,b){return b.v-a.v;});
  var dominante=(eixosArr[0].v-eixosArr[1].v<0.2)?'global':eixosArr[0].k;
  var recurso=(eixosArr[2].v-eixosArr[3].v<0.2)?null:eixosArr[eixosArr.length-1].k;

  var subKeys=Object.keys(sub).filter(function(k){return sub[k]!==null;});
  var subDomK=subKeys.length?subKeys.reduce(function(a,b){return sub[a]>=sub[b]?a:b;}):null;
  var subDomNome=subDomK?NOMES_SUBEIXO_PROF[subDomK]:null;

  var itens=subDomK?(TEXTOS_ITENS_PROF[subDomK]||[]):[];
  var maxV=null,maxIdx=0;
  for(var i=0;i<itens.length;i++){
    var id=subDomK+'_'+(i+1);
    var v=respostas[id];
    if(v!==null&&v!==undefined&&!isNaN(v)&&(maxV===null||Number(v)>maxV)){maxV=Number(v);maxIdx=i;}
  }

  var heatmap={};
  var heixos={sentir:S,organizar:O,agir:A,proposito:P};
  Object.keys(heixos).forEach(function(k){
    var v=heixos[k];
    heatmap[k]=(v!==null&&v!==undefined&&!isNaN(v))?Math.round((v/4)*100):null;
  });

  var secundarias=detectarAssinaturasSecundarias({S:S,O:O,A:A,P:P,G:G,delta:delta});
  secundarias=secundarias.filter(function(s){return s!==assinatura;});

  return {
    eixos:{S:_r(S),O:_r(O),A:_r(A),P:_r(P),G:_r(G),delta:_r(delta)},
    assinatura:assinatura,
    dominante:dominante,
    dominanteNome:dominante==='global'?'Distribuído':NOMES_EIXO_PROF[dominante]||dominante,
    recurso:recurso,
    recursoNome:recurso?(NOMES_EIXO_PROF[recurso]||recurso):null,
    subeixoDominante:subDomNome,
    itemCritico:{texto:maxV!==null?(itens[maxIdx]||''):'',valor:maxV},
    assinaturasSecundarias:secundarias,
    heatmap:heatmap
  };
}

function gerarSaidaProfissional(eixos,resultado,respostas){
  return montarPainelProfissional({eixos:eixos,assinatura:resultado.codigo,respostas:respostas});
}

function _eixoDomSessao(eixos){
  var S=Number(eixos.S)||0,O=Number(eixos.O)||0,A=Number(eixos.A)||0,P=Number(eixos.P)||0;
  var arr=[{k:'sentir',v:S},{k:'organizar',v:O},{k:'agir',v:A},{k:'proposito',v:P}];
  arr.sort(function(a,b){return b.v-a.v;});
  if(arr[0].v-arr[1].v<0.2)return 'global';
  return arr[0].k;
}

function _eixoRecursoSessao(eixos){
  var S=Number(eixos.S)||0,O=Number(eixos.O)||0,A=Number(eixos.A)||0,P=Number(eixos.P)||0;
  var arr=[{k:'sentir',v:S},{k:'organizar',v:O},{k:'agir',v:A},{k:'proposito',v:P}];
  arr.sort(function(a,b){return a.v-b.v;});
  return arr[0].k;
}

function analisarEvolucaoClinica(historico){
  if(!historico||historico.length===0)return null;
  var n=historico.length;

  if(n===1){
    var e1=historico[0].eixos||{};
    var dom1=_eixoDomSessao(e1);
    return {
      tendenciaGlobal:'estabilidade',riscoCrescente:false,cargaAltaPersistente:false,
      perdaDeProposito:false,eixoRecorrente:dom1==='global'?'Distribuído':(NOMES_EIXO_PROF[dom1]||dom1),
      assinaturaRecorrente:tituloDev(historico[0].assinatura),
      subeixoRecorrente:null,oscilacaoRelevante:false,alertaMudancaBrusca:false,
      resumoClinico:[]
    };
  }

  var gVals=historico.map(function(s){return Number((s.eixos||{}).G)||0;});
  var pVals=historico.map(function(s){return Number((s.eixos||{}).P)||0;});
  var gPrimeiro=gVals[0],gUltimo=gVals[n-1];
  var diff=gUltimo-gPrimeiro;

  var tendenciaGlobal;
  if(diff>=0.3)tendenciaGlobal='piora';
  else if(diff<=-0.3)tendenciaGlobal='melhora';
  else{
    var mudancasG=0;
    for(var i=1;i<gVals.length;i++){if(Math.abs(gVals[i]-gVals[i-1])>=0.3)mudancasG++;}
    tendenciaGlobal=(mudancasG>=n/2)?'oscilacao':'estabilidade';
  }

  var gravOrdem={leve:1,moderado:2,alto:3,critico:4,especial:0,tecnico:0};
  var gravUlt=gravOrdem[historico[n-1].gravidade||'']||0;
  var gravPenult=n>=2?(gravOrdem[historico[n-2].gravidade||'']||0):0;
  var riscoCrescente=(gUltimo>gPrimeiro&&Math.abs(diff)>=0.3&&gravUlt>=gravPenult);
  var cargaAltaPersistente=n>=2&&gVals[n-1]>=2.5&&gVals[n-2]>=2.5;

  var pPrimeiro=pVals[0],pUltimo=pVals[n-1];
  var perdaDeProposito=(pUltimo-pPrimeiro<=-0.3);
  if(!perdaDeProposito&&n>=2){
    var min1=_eixoRecursoSessao(historico[n-1].eixos||{});
    var min2=_eixoRecursoSessao(historico[n-2].eixos||{});
    if(min1==='proposito'&&min2==='proposito')perdaDeProposito=true;
  }

  var contEixos={sentir:0,organizar:0,agir:0,proposito:0};
  historico.forEach(function(s){
    var d=_eixoDomSessao(s.eixos||{});
    if(d&&contEixos[d]!==undefined)contEixos[d]++;
  });
  var maxEixoCount=Math.max.apply(null,Object.values(contEixos));
  var eixosEmpatados=Object.keys(contEixos).filter(function(k){return contEixos[k]===maxEixoCount;});
  var eixoRecK=eixosEmpatados.length===1?eixosEmpatados[0]:'global';

  var contAss={};
  historico.forEach(function(s){var a=s.assinatura||'';contAss[a]=(contAss[a]||0)+1;});
  var maxAssCount=Math.max.apply(null,Object.values(contAss));
  var assEmpatadas=Object.keys(contAss).filter(function(k){return contAss[k]===maxAssCount;});
  var assK=assEmpatadas.length===1?tituloDev(assEmpatadas[0]):'Distribuída';

  var eixosDom=historico.map(function(s){return _eixoDomSessao(s.eixos||{});});
  var mudancasDom=0;
  for(var j=1;j<eixosDom.length;j++){if(eixosDom[j]!==eixosDom[j-1])mudancasDom++;}
  var oscilacaoRelevante=mudancasDom>=2;

  var alertaMudancaBrusca=false;
  for(var k=1;k<gVals.length;k++){if(Math.abs(gVals[k]-gVals[k-1])>=0.6){alertaMudancaBrusca=true;break;}}

  var subeixoRecorrente=null;
  var sessoesComRespostas=historico.filter(function(s){return s.respostas||s.itens;});
  if(sessoesComRespostas.length>=2){
    var contSub={};
    sessoesComRespostas.forEach(function(s){
      var itens=s.respostas||s.itens||{};
      var sub=calcularSubeixosPro(itens);
      var subKeys=Object.keys(sub).filter(function(k){return sub[k]!==null;});
      if(!subKeys.length)return;
      var subDomK=subKeys.reduce(function(a,b){return sub[a]>=sub[b]?a:b;});
      contSub[subDomK]=(contSub[subDomK]||0)+1;
    });
    var subKeys2=Object.keys(contSub);
    if(subKeys2.length){
      var maxSub=Math.max.apply(null,Object.values(contSub));
      var subEmpatados=subKeys2.filter(function(k){return contSub[k]===maxSub;});
      if(subEmpatados.length===1)subeixoRecorrente=NOMES_SUBEIXO_PROF[subEmpatados[0]]||null;
    }
  }

  var analise={
    tendenciaGlobal:tendenciaGlobal,riscoCrescente:riscoCrescente,cargaAltaPersistente:cargaAltaPersistente,
    perdaDeProposito:perdaDeProposito,
    eixoRecorrente:eixoRecK==='global'?'Distribuído':(NOMES_EIXO_PROF[eixoRecK]||eixoRecK),
    assinaturaRecorrente:assK,
    subeixoRecorrente:subeixoRecorrente,
    oscilacaoRelevante:oscilacaoRelevante,alertaMudancaBrusca:alertaMudancaBrusca,
    resumoClinico:[]
  };
  analise.resumoClinico=gerarResumoClinico(analise);
  return analise;
}

function gerarResumoClinico(analise){
  var frases=[];
  var mapaTend={piora:'A carga global vem aumentando nas últimas sessões.',melhora:'A carga global apresenta redução nas últimas sessões.',oscilacao:'Há oscilação relevante entre as sessões.',estabilidade:'O padrão global se mantém estável ao longo das sessões.'};
  if(mapaTend[analise.tendenciaGlobal])frases.push(mapaTend[analise.tendenciaGlobal]);
  if(analise.cargaAltaPersistente)frases.push('A carga global permanece alta nas sessões mais recentes.');
  if(analise.perdaDeProposito)frases.push('Propósito mostra redução progressiva.');
  var eixoVal=analise.eixoRecorrente;
  if(eixoVal&&eixoVal!=='global'&&eixoVal!=='Distribuído'&&eixoVal!==null){
    frases.push(eixoVal+' permanece como área predominante de exigência.');
  }
  if(frases.length<4&&analise.assinaturaRecorrente&&analise.assinaturaRecorrente!=='Distribuída'){
    frases.push('O caso mostra padrão recorrente de '+analise.assinaturaRecorrente.toLowerCase()+'.');
  }
  return frases.slice(0,4);
}

function gerarTendencia(sessoes){
  if(!sessoes||sessoes.length===0)return null;
  var analise=analisarEvolucaoClinica(sessoes);
  return {
    tendenciaGlobal:analise.tendenciaGlobal,
    eixoMaisRecorrente:analise.eixoRecorrente,
    assinaturaRecorrente:analise.assinaturaRecorrente,
    sessoes:sessoes.length
  };
}

function _tendenciaTexto(t){
  var mapa={piora:'Piora',melhora:'Melhora',estabilidade:'Estabilidade',oscilacao:'Oscilação'};
  return mapa[t]||t;
}

function gerarGraficoLongitudinal(historico){
  if(!historico||historico.length===0)return '';

  var W=560,H=220,padL=36,padR=20,padT=16,padB=32;
  var innerW=W-padL-padR,innerH=H-padT-padB;
  var n=historico.length;

  var series={S:[],O:[],A:[],P:[],G:[]};
  var marcas=[];
  historico.forEach(function(s,idx){
    var ex=s.eixos||{};
    marcas.push(s.marco||'D'+idx);
    ['S','O','A','P','G'].forEach(function(k){
      var v=ex[k];
      series[k].push((v!==null&&v!==undefined&&!isNaN(v))?Number(v):null);
    });
  });

  function xPos(i){return padL+(i/(Math.max(n-1,1)))*innerW;}
  function yPos(v){return padT+innerH-(v/4)*innerH;}

  var cores={S:'#7bb3cc',O:'#9b8ec4',A:'#72b98a',P:'#c4956e',G:'#2c2c3e'};
  var espessuras={S:1.5,O:1.5,A:1.5,P:1.5,G:2.5};

  var svg='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:'+W+'px;display:block;overflow:visible;">';
  svg+='<rect x="'+padL+'" y="'+padT+'" width="'+innerW+'" height="'+innerH+'" fill="#fafafa" rx="4"/>';

  [0,1,2,3,4].forEach(function(v){
    var y=yPos(v);
    svg+='<line x1="'+padL+'" y1="'+y+'" x2="'+(padL+innerW)+'" y2="'+y+'" stroke="#e8e8e8" stroke-width="1"/>';
    svg+='<text x="'+(padL-5)+'" y="'+(y+4)+'" text-anchor="end" font-size="9" fill="#bbb">'+v+'</text>';
  });

  marcas.forEach(function(m,i){
    var x=xPos(i);
    svg+='<text x="'+x+'" y="'+(padT+innerH+14)+'" text-anchor="middle" font-size="9" fill="#aaa">'+m+'</text>';
  });

  ['S','O','A','P','G'].forEach(function(k){
    var pts=series[k];
    var cor=cores[k],esp=espessuras[k];
    var pathD='';
    var pendurado=false;
    pts.forEach(function(v,i){
      if(v===null){pendurado=false;return;}
      var x=xPos(i),y=yPos(v);
      pathD+=(pendurado?'L':'M')+x+' '+y+' ';
      pendurado=true;
    });
    if(pathD)svg+='<path d="'+pathD+'" fill="none" stroke="'+cor+'" stroke-width="'+esp+'" stroke-linejoin="round" stroke-linecap="round"/>';
    pts.forEach(function(v,i){
      if(v===null)return;
      var x=xPos(i),y=yPos(v),r=k==='G'?4:3;
      svg+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+cor+'" stroke="white" stroke-width="1.5"/>';
    });
  });

  svg+='</svg>';

  var leg='<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;">';
  var nomes={S:'Sentir',O:'Organizar',A:'Agir',P:'Propósito',G:'Global'};
  ['S','O','A','P','G'].forEach(function(k){
    leg+='<div style="display:flex;align-items:center;gap:4px;font-size:0.72rem;color:#555;">';
    leg+='<svg width="18" height="4"><line x1="0" y1="2" x2="18" y2="2" stroke="'+cores[k]+'" stroke-width="'+(k==='G'?3:2)+'"/></svg>';
    leg+=nomes[k]+'</div>';
  });
  leg+='</div>';

  return svg+leg;
}
