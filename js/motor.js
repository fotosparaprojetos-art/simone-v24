function maiorEixo(S,O,A,P){
  var eixos=[{nome:'sentir',valor:S},{nome:'organizar',valor:O},{nome:'agir',valor:A},{nome:'proposito',valor:P}];
  eixos.sort(function(a,b){return b.valor-a.valor;});
  if(eixos[0].valor===eixos[1].valor)return 'global';
  return eixos[0].nome;
}

function menorEixo(S,O,A,P){
  var eixos={sentir:S,organizar:O,agir:A,proposito:P};
  var entries=Object.entries(eixos).sort(function(a,b){return a[1]-b[1];});
  if(entries[0][1]===entries[1][1])return null;
  return entries[0][0];
}

function avaliarSimone(e){
  var S=e.S,O=e.O,A=e.A,P=e.P,G=e.G,delta=e.delta;
  if(typeof S!=='number'||isNaN(S)||typeof O!=='number'||isNaN(O)||
     typeof A!=='number'||isNaN(A)||typeof G!=='number'||isNaN(G)||
     typeof delta!=='number'||isNaN(delta)){
    return {codigo:'inconsistencia_tecnica',severidade:'tecnico',eixoDominante:null,eixoRecurso:null};
  }
  var dom=maiorEixo(S,O,A,P),rec=menorEixo(S,O,A,P);

  if(e.todosIguais&&e.valorUnico===0)return {codigo:'ausencia_de_sinal',severidade:'especial',eixoDominante:dom,eixoRecurso:rec};
  if(e.todosIguais&&e.valorUnico===1)return {codigo:'carga_leve_uniforme',severidade:'leve',eixoDominante:dom,eixoRecurso:rec};
  if(e.todosIguais&&e.valorUnico===2)return {codigo:'carga_difusa',severidade:'moderado',eixoDominante:dom,eixoRecurso:rec};
  if(e.todosIguais&&e.valorUnico===3)return {codigo:'carga_alta_uniforme',severidade:'alto',eixoDominante:dom,eixoRecurso:rec};

  if(e.todosIguais&&e.valorUnico===4)return {codigo:'saturacao_maxima',severidade:'critico',eixoDominante:dom,eixoRecurso:rec};
  if(S>=3.2&&O>=3.2&&A>=3.2&&P>=3.2)return {codigo:'colapso_global',severidade:'critico',eixoDominante:dom,eixoRecurso:rec};

  if(P<=1.5&&G>=2.5)return {codigo:'baixo_sentido',severidade:'alto',eixoDominante:dom,eixoRecurso:rec};
  if(G>=2.5&&S>=Math.max(O,A)+0.4&&S<3.2)return {codigo:'sobrecarga_emocional',severidade:'alto',eixoDominante:dom,eixoRecurso:rec};
  if(G>=2.5&&O>=Math.max(S,A)+0.4&&O<3.2)return {codigo:'sobrecarga_organizacional',severidade:'alto',eixoDominante:dom,eixoRecurso:rec};
  if(G>=2.5&&A>=Math.max(S,O)+0.4&&A<3.2)return {codigo:'sobrecarga_de_acao',severidade:'alto',eixoDominante:dom,eixoRecurso:rec};
  if(G>=2.5&&P>=G+0.4&&S<3.2&&O<3.2&&A<3.2)return {codigo:'sobrecarga_com_sentido',severidade:'alto',eixoDominante:dom,eixoRecurso:rec};
  if(G>=2.5&&delta<0.4)return {codigo:'limite_funcional',severidade:'alto',eixoDominante:dom,eixoRecurso:rec};

  if(G>=1.7&&G<=2.4&&delta<0.25)return {codigo:'falso_funcional',severidade:'alto',eixoDominante:dom,eixoRecurso:rec};
  if(G>=1.4&&G<=2.4&&O>=G+0.4&&A<=G-0.3)return {codigo:'ruminacao_sem_acao',severidade:'moderado',eixoDominante:dom,eixoRecurso:rec};
  if(G>=1.4&&G<=2.4&&A>=G+0.4&&O<=G-0.3)return {codigo:'atropelo_sem_ordem',severidade:'moderado',eixoDominante:dom,eixoRecurso:rec};
  if(G>=1.4&&G<=2.4&&S>=Math.max(O,A)+0.4)return {codigo:'sentir_dominante',severidade:'moderado',eixoDominante:dom,eixoRecurso:rec};
  if(G>=1.4&&G<=2.4&&O>=Math.max(S,A)+0.4)return {codigo:'organizar_dominante',severidade:'moderado',eixoDominante:dom,eixoRecurso:rec};
  if(G>=1.4&&G<=2.4&&A>=Math.max(S,O)+0.4)return {codigo:'agir_dominante',severidade:'moderado',eixoDominante:dom,eixoRecurso:rec};
  if(G>=1.4&&G<=2.4&&P>=Math.max(S,O,A)+0.4)return {codigo:'proposito_dominante',severidade:'moderado',eixoDominante:dom,eixoRecurso:rec};
  var soap=[S,O,A,P].sort(function(a,b){return b-a;}),semDom=(soap[0]-soap[1])<0.4;
  if(G>=1.4&&G<=2.4&&delta>=0.25&&delta<=0.5&&semDom)return {codigo:'carga_difusa',severidade:'moderado',eixoDominante:dom,eixoRecurso:rec};

  if(G<1.4&&S<=Math.min(O,A)-0.3)return {codigo:'leve_com_corpo_baixo',severidade:'leve',eixoDominante:dom,eixoRecurso:rec};
  if(G<1.4&&O<=Math.min(S,A)-0.3)return {codigo:'leve_com_mente_baixa',severidade:'leve',eixoDominante:dom,eixoRecurso:rec};
  if(G<1.4&&A<=Math.min(S,O)-0.3)return {codigo:'leve_com_acao_baixa',severidade:'leve',eixoDominante:dom,eixoRecurso:rec};
  if(G<1.4&&P<=Math.min(S,O,A)-0.3)return {codigo:'leve_com_proposito_baixo',severidade:'leve',eixoDominante:dom,eixoRecurso:rec};
  if(G<1.4)return {codigo:'leve_difuso',severidade:'leve',eixoDominante:dom,eixoRecurso:rec};
  if(G>=1.4&&G<=2.6)return {codigo:'carga_difusa',severidade:'moderado',eixoDominante:dom,eixoRecurso:rec};
  return {codigo:'inconsistencia_tecnica',severidade:'tecnico',eixoDominante:null,eixoRecurso:null};
}
