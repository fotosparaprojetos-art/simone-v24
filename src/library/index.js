'use strict';

/**
 * simone-library/index.js
 * SiMone V24 — Biblioteca de devolutivas
 *
 * Compatível com:
 * - engine.js novo
 * - server.js novo
 *
 * Regras:
 * - nunca expor _interno ao front-end
 * - sem diagnóstico
 * - sem rótulos criativos
 * - leitura profissional funcional
 * - leitura do questionado humana, completa e acolhedora
 * - longitudinal modula o quanto a leitura pode afirmar
 */

// ─────────────────────────────────────────────────────────────
// LONGITUDINAL
// ─────────────────────────────────────────────────────────────

const LONGITUDINAL_TEXTO = {
  insuficiente: 'Ainda não há medições suficientes para leitura longitudinal.',
  pontual:      'Padrão observado em um único momento.',
  repeticao:    'Padrão observado em mais de uma medição, ainda sem consistência suficiente.',
  padrao:       'Padrão repetido com consistência funcional.',
  consolidado:  'Padrão mantido ao longo do tempo.',
  oscilacao:    'Oscilação entre medições, sem estabilidade definida.'
};

const LIMITES_PADRAO = 'Leitura baseada em autorrelato. Sujeita a variação de percepção. Deve ser interpretada em contexto e, quando possível, acompanhada em mais de uma medição.';

function traduzirLongitudinal(longitudinal) {
  if (!longitudinal || !longitudinal.status) return LONGITUDINAL_TEXTO.insuficiente;
  return LONGITUDINAL_TEXTO[longitudinal.status] || LONGITUDINAL_TEXTO.insuficiente;
}

function modularPorLongitudinal(status, relatorio, usuario, textoLongitudinal) {
  switch (status) {
    case 'insuficiente':
    case 'pontual':
      return {
        relatorio: {
          sintese:       relatorio.sintese,
          interpretacao: 'Esta é uma leitura de momento único. O que aparece aqui reflete o estado funcional recente, sem base suficiente para caracterizar padrão estabelecido.',
          implicacoes:   'Uma única medição permite reconhecer o estado atual, mas não sustenta conclusão sobre persistência, tendência ou estabilização do funcionamento.',
          longitudinal:  textoLongitudinal,
          limites:       relatorio.limites || LIMITES_PADRAO,
          conduta:       'Uma nova medição em outro momento é necessária para avaliar consistência e repetição do padrão.'
        },
        usuario: {
          titulo:  usuario.titulo || 'Leitura inicial do momento atual',
          texto:   'Este resultado mostra como seu funcionamento apareceu agora. Ele ajuda a entender onde a energia está sendo mais consumida, mas ainda não define um padrão fixo.',
          direcao: 'Novas medições em outros momentos ajudam a verificar se isso se repete ou se foi um estado passageiro.'
        }
      };

    case 'repeticao':
      return {
        relatorio: {
          sintese:       relatorio.sintese,
          interpretacao: relatorio.interpretacao,
          implicacoes:   'O padrão reapareceu, o que aumenta sua relevância funcional, mas ainda não permite tratá-lo como configuração consolidada.',
          longitudinal:  textoLongitudinal,
          limites:       relatorio.limites || LIMITES_PADRAO,
          conduta:       'Monitorar continuidade, frequência e direção do padrão antes de ampliar inferências.'
        },
        usuario: {
          titulo:  usuario.titulo,
          texto:   usuario.texto,
          direcao: 'Esse modo de funcionar apareceu mais de uma vez. Vale observar se ele continua se repetindo antes de tirar conclusões maiores.'
        }
      };

    case 'padrao':
      return {
        relatorio: {
          sintese:       relatorio.sintese,
          interpretacao: relatorio.interpretacao,
          implicacoes:   relatorio.implicacoes,
          longitudinal:  textoLongitudinal,
          limites:       relatorio.limites || LIMITES_PADRAO,
          conduta:       relatorio.conduta
        },
        usuario: {
          titulo:  usuario.titulo,
          texto:   usuario.texto,
          direcao: usuario.direcao
        }
      };

    case 'consolidado':
      return {
        relatorio: {
          sintese:       relatorio.sintese,
          interpretacao: relatorio.interpretacao,
          implicacoes:   relatorio.implicacoes,
          longitudinal:  textoLongitudinal,
          limites:       relatorio.limites || LIMITES_PADRAO,
          conduta:       relatorio.conduta
        },
        usuario: {
          titulo:  usuario.titulo,
          texto:   usuario.texto,
          direcao: usuario.direcao
        }
      };

    default:
      return {
        relatorio: {
          sintese:       relatorio.sintese,
          interpretacao: 'Status longitudinal não reconhecido. A leitura atual foi preservada, mas a interpretação temporal ficou suspensa.',
          implicacoes:   relatorio.implicacoes,
          longitudinal:  textoLongitudinal,
          limites:       relatorio.limites || LIMITES_PADRAO,
          conduta:       relatorio.conduta
        },
        usuario: {
          titulo:  usuario.titulo,
          texto:   usuario.texto,
          direcao: usuario.direcao
        }
      };
  }
}

// ─────────────────────────────────────────────────────────────
// MAPAS BASE
// ─────────────────────────────────────────────────────────────

const EIXO_PRO = {
  S: {
    nome: 'Sentir',
    tecnico: 'o eixo Sentir aparece como principal vetor de custo energético, indicando maior peso de sinais corporais e emocionais sobre o funcionamento atual',
    impacto: 'há maior probabilidade de cansaço subjetivo, tensão, irritabilidade, desgaste emocional e maior custo para sustentar tarefas simples',
    usuarioTitulo: 'O maior gasto hoje está em sentir',
    usuarioTexto: 'Hoje seu corpo e suas emoções estão consumindo mais energia do que o resto. Quando isso acontece, até o que parece simples pode começar a pesar mais.',
    usuarioDirecao: 'Reduzir estímulo, proteger ambiente e não exigir o mesmo ritmo de um dia mais estável tende a ajudar.'
  },
  O: {
    nome: 'Organizar',
    tecnico: 'o eixo Organizar aparece como principal vetor de custo energético, indicando maior dificuldade para clareza, priorização, ordenação e manejo da complexidade',
    impacto: 'há maior chance de confusão, hesitação, excesso de reordenação, dificuldade de decidir por onde começar e perda de hierarquia entre tarefas',
    usuarioTitulo: 'O maior gasto hoje está em organizar',
    usuarioTexto: 'Hoje o que mais consome sua energia é entender, ordenar, decidir e dar forma ao que precisa ser feito. Quando isso pesa, tudo parece mais embaralhado.',
    usuarioDirecao: 'Reduzir complexidade, definir poucas prioridades e deixar o próximo passo mais claro tende a aliviar a carga.'
  },
  A: {
    nome: 'Agir',
    tecnico: 'o eixo Agir aparece como principal vetor de custo energético, indicando maior dificuldade para iniciar, manter ritmo e concluir ações',
    impacto: 'há maior chance de adiamento, interrupção, perda de continuidade, aumento do esforço para começar e dificuldade em sustentar execução',
    usuarioTitulo: 'O maior gasto hoje está em agir',
    usuarioTexto: 'Hoje o principal peso não está em entender nem apenas em sentir. Está em transformar intenção em ação e conseguir manter o movimento.',
    usuarioDirecao: 'Reduzir a meta para uma ação menor e concreta costuma ajudar mais do que tentar recuperar tudo de uma vez.'
  }
};

const CARGA_PRO = {
  leve: {
    sintese: 'carga global leve',
    leitura: 'A carga global aparece em intensidade leve.',
    impacto: 'Há interferência discreta, com preservação relativa do funcionamento.',
    usuario: 'Existe sinal de esforço, mas ainda sem bloqueio dominante.'
  },
  moderado: {
    sintese: 'carga global moderada',
    leitura: 'A carga global aparece em intensidade moderada, já com efeito funcional relevante.',
    impacto: 'A interferência já tende a aparecer em organização do dia, tolerância a demandas e manutenção de ritmo.',
    usuario: 'O custo interno já está alto o bastante para começar a atrapalhar seu funcionamento.'
  },
  elevado: {
    sintese: 'carga global elevada',
    leitura: 'A carga global aparece em intensidade elevada, com comprometimento funcional mais amplo.',
    impacto: 'O padrão tende a atingir mais de uma área do funcionamento e aumentar risco de travamento, queda de rendimento e retração de esforço.',
    usuario: 'A energia está muito consumida. O funcionamento de hoje tende a sair mais caro por dentro do que parece por fora.'
  }
};

const DISPERSAO_PRO = {
  difuso: {
    sintese: 'distribuição difusa',
    leitura: 'A carga está distribuída, sem concentração muito nítida em um único eixo.',
    impacto: 'O desgaste tende a ser mais global, com sensação de peso espalhado e menor clareza sobre um único ponto crítico.',
    usuario: 'O peso está mais espalhado. Não parece um ponto só. Parece que várias partes estão cobrando energia ao mesmo tempo.'
  },
  moderado: {
    sintese: 'distribuição parcialmente concentrada',
    leitura: 'Há concentração relativa em um eixo, mas ainda com participação relevante dos demais.',
    impacto: 'Existe um vetor mais exigido, porém sem exclusividade completa. O restante do funcionamento ainda participa da carga.',
    usuario: 'Existe um ponto mais pesado, mas ele não está sozinho. Outras áreas também estão participando desse custo.'
  },
  polarizado: {
    sintese: 'distribuição polarizada',
    leitura: 'A carga está mais concentrada em um eixo específico, com vetor dominante funcional mais claro.',
    impacto: 'O padrão tende a ficar mais legível, com um ponto principal de impedância puxando o restante do funcionamento.',
    usuario: 'Há um ponto específico puxando sua energia com mais força. Ele tende a travar ou pesar no resto.'
  }
};

const DIADES_INFO = {
  nenhuma: {
    pro: 'Não foram identificadas díades dominantes neste recorte. A leitura favorece carga global e vetor principal, sem mecanismo combinatório suficientemente destacado.',
    user: 'Hoje o peso aparece mais como estado geral do que como uma combinação muito específica entre duas áreas.'
  },
  D1: {
    pro: 'A díade D1 sugere interferência entre carga emocional e dificuldade de iniciar tarefas, com afeto pesando diretamente sobre o início da ação.',
    user: 'O que você sente está pesando no começo das tarefas. Não é só emoção nem só ação: uma coisa está travando a outra.'
  },
  D2: {
    pro: 'A díade D2 sugere interferência entre clareza mental e início da ação, com dificuldade de organizar o pensamento repercutindo na partida das tarefas.',
    user: 'Entender e começar estão embolados. Quando a clareza cai, sair do ponto zero fica mais difícil.'
  },
  D3: {
    pro: 'A díade D3 sugere interferência entre organização prática e sustentação, com dificuldade de manter curso quando as demandas exigem ordem e continuidade.',
    user: 'Organizar e manter o ritmo estão se atrapalhando. Mesmo quando começa, sustentar fica mais caro.'
  },
  D4: {
    pro: 'A díade D4 sugere interferência entre corpo e sustentação, com peso corporal ou fadiga repercutindo na manutenção das tarefas.',
    user: 'Seu corpo parece estar puxando a energia para baixo no meio do caminho. Sustentar está custando mais.'
  },
  D5: {
    pro: 'A díade D5 sugere interferência entre carga emocional e clareza mental, com afeto repercutindo sobre a organização do pensamento.',
    user: 'O emocional está invadindo a clareza. Fica mais difícil pensar direito quando o que se sente pesa demais.'
  },
  D6: {
    pro: 'A díade D6 sugere acoplamento entre clareza e organização prática, com dificuldade de estruturar internamente e operacionalizar externamente.',
    user: 'Entender e organizar estão pesando juntos. Não é só decidir, nem só arrumar: as duas coisas estão drenando energia ao mesmo tempo.'
  },
  D7: {
    pro: 'A díade D7 sugere acoplamento entre sinais corporais e emocionais, indicando convergência de desgaste físico e afetivo.',
    user: 'Corpo e emoção estão andando juntos no gasto de energia. O que pesa por dentro também aparece no corpo.'
  },
  D8: {
    pro: 'A díade D8 sugere acoplamento entre início e sustentação, com custo tanto para partir quanto para manter continuidade.',
    user: 'O esforço não está só em começar. Também está em continuar. O movimento inteiro está caro.'
  }
};

const COERENCIA_INFO = {
  coerente: {
    pro: 'A consistência interna do protocolo sustenta leitura funcional com boa confiabilidade para este recorte.',
    user: 'Seu registro formou um desenho consistente.'
  },
  leve: {
    pro: 'Há pequena ressalva de consistência, sem anular a leitura, mas pedindo cautela na força das conclusões.',
    user: 'Seu registro ainda ajuda a entender o momento, embora exista um pequeno sinal de oscilação interna.'
  },
  atencao: {
    pro: 'A presença de flags relevantes reduz a força interpretativa e recomenda cautela adicional na leitura do padrão.',
    user: 'Seu registro mostra um padrão útil, mas com sinais que pedem cuidado na interpretação.'
  },
  baixa_confiabilidade: {
    pro: 'A consistência interna do protocolo está reduzida. O dado pode refletir oscilação importante, dificuldade de autorreferência ou resposta instável. A leitura deve ser tratada com prudência.',
    user: 'Seu registro mostra sinais importantes, mas ainda não permite uma leitura firme sem cautela.'
  }
};

// ─────────────────────────────────────────────────────────────
// GERADORES DE TEXTO
// ─────────────────────────────────────────────────────────────

function sinteseProfissional(g, da, dom, diade) {
  const carga = CARGA_PRO[g];
  const dispersao = DISPERSAO_PRO[da];
  const eixo = EIXO_PRO[dom];
  const di = DIADES_INFO[diade];

  return `${capitalize(carga.sintese)} com ${dispersao.sintese}, predominando ${eixo.nome.toLowerCase()}${diade !== 'nenhuma' ? `, com mecanismo destacado por ${diade}` : ''}.`;
}

function interpretacaoProfissional(g, da, dom, diade, coerenciaNivel) {
  const carga = CARGA_PRO[g];
  const dispersao = DISPERSAO_PRO[da];
  const eixo = EIXO_PRO[dom];
  const di = DIADES_INFO[diade];
  const co = COERENCIA_INFO[coerenciaNivel];

  return [
    carga.leitura,
    dispersao.leitura,
    eixo.tecnico + '.',
    di.pro,
    co.pro
  ].join(' ');
}

function implicacoesProfissionais(g, da, dom, diade) {
  const carga = CARGA_PRO[g];
  const dispersao = DISPERSAO_PRO[da];
  const eixo = EIXO_PRO[dom];
  const di = DIADES_INFO[diade];

  return [
    carga.impacto,
    dispersao.impacto,
    eixo.impacto,
    diade !== 'nenhuma'
      ? `O mecanismo combinado descrito por ${diade} tende a aumentar o custo para tarefas cotidianas, reduzir flexibilidade e tornar mais previsível o ponto de travamento.`
      : 'Sem mecanismo díadico dominante, o impacto tende a aparecer mais como desgaste geral e redução de margem funcional.'
  ].join(' ');
}

function condutaProfissional(g, da, dom, diade, coerenciaNivel) {
  const condutas = [];

  if (coerenciaNivel === 'baixa_confiabilidade') {
    condutas.push('Reaplicar em outro momento ou revisar o preenchimento antes de ampliar a interpretação.');
  }

  if (g === 'leve') {
    condutas.push('Monitorar evolução sem ampliar exigências desnecessárias.');
  }

  if (g === 'moderado') {
    condutas.push('Reduzir dispersão de demandas e definir prioridade funcional única para o período imediato.');
  }

  if (g === 'elevado') {
    condutas.push('Reduzir carga global, proteger ambiente e restringir o foco ao mínimo funcional necessário.');
  }

  if (dom === 'S') {
    condutas.push('Atuar primeiro em regulação de estímulo, ritmo e sobrecarga sensível antes de exigir desempenho.');
  }

  if (dom === 'O') {
    condutas.push('Atuar primeiro em clareza, simplificação, ordenação e redução de complexidade operacional.');
  }

  if (dom === 'A') {
    condutas.push('Atuar primeiro em quebra de tarefa, ponto de partida concreto e manutenção de continuidade mínima.');
  }

  if (da === 'difuso') {
    condutas.push('Evitar múltiplas frentes simultâneas; a redução de carga geral tende a produzir melhor resposta do que intervenção dispersa.');
  }

  if (da === 'polarizado') {
    condutas.push('Intervir prioritariamente no vetor dominante, pois ele tende a puxar o restante do funcionamento.');
  }

  if (diade !== 'nenhuma') {
    condutas.push(`Considerar o mecanismo descrito por ${diade} como ponto de observação clínica e operacional prioritário.`);
  }

  return condutas.join(' ');
}

function tituloUsuario(g, da, dom) {
  if (g === 'leve' && da === 'difuso') return 'Hoje existe esforço, mas sem um travamento dominante';
  if (g === 'elevado' && da === 'polarizado') return `Hoje há um ponto muito concentrado puxando sua energia em ${EIXO_PRO[dom].nome.toLowerCase()}`;
  if (g === 'elevado') return 'Hoje sua energia está muito consumida';
  if (da === 'polarizado') return EIXO_PRO[dom].usuarioTitulo;
  return `Hoje ${EIXO_PRO[dom].nome.toLowerCase()} aparece como o ponto mais exigido`;
}

function textoUsuario(g, da, dom, diade, coerenciaNivel) {
  const carga = CARGA_PRO[g];
  const dispersao = DISPERSAO_PRO[da];
  const eixo = EIXO_PRO[dom];
  const di = DIADES_INFO[diade];
  const co = COERENCIA_INFO[coerenciaNivel];

  const partes = [
    carga.usuario,
    dispersao.usuario,
    eixo.usuarioTexto,
    di.user
  ];

  if (coerenciaNivel === 'baixa_confiabilidade') {
    partes.push('Mesmo assim, vale manter cautela: este resultado ainda pede nova observação antes de ser tratado como um desenho firme.');
  } else if (coerenciaNivel === 'atencao') {
    partes.push(co.user);
  }

  return partes.join(' ');
}

function direcaoUsuario(g, da, dom, diade) {
  const partes = [
    EIXO_PRO[dom].usuarioDirecao
  ];

  if (g === 'elevado') {
    partes.push('Hoje o melhor costuma ser proteger energia e reduzir exigência, não tentar compensar tudo.');
  } else if (g === 'moderado') {
    partes.push('Escolher menos coisas e tornar o próximo passo mais simples tende a funcionar melhor do que insistir no ritmo habitual.');
  } else {
    partes.push('Vale acompanhar sem se cobrar mais do que este momento comporta.');
  }

  if (da === 'polarizado') {
    partes.push('Aliviar esse ponto principal costuma ajudar mais do que tentar mexer em tudo ao mesmo tempo.');
  }

  if (diade !== 'nenhuma') {
    partes.push('Observe especialmente essa combinação que está se formando, porque ela ajuda a explicar onde a energia está sendo drenada.');
  }

  return partes.join(' ');
}

// ─────────────────────────────────────────────────────────────
// GERAÇÃO PROGRAMÁTICA DA BIBLIOTECA
// ─────────────────────────────────────────────────────────────

function gerarEntrada(g, da, dom, diade, coerenciaNivel = 'coerente') {
  return {
    relatorio: {
      sintese:       sinteseProfissional(g, da, dom, diade),
      interpretacao: interpretacaoProfissional(g, da, dom, diade, coerenciaNivel),
      implicacoes:   implicacoesProfissionais(g, da, dom, diade),
      limites:       LIMITES_PADRAO,
      conduta:       condutaProfissional(g, da, dom, diade, coerenciaNivel)
    },
    usuario: {
      titulo:  tituloUsuario(g, da, dom),
      texto:   textoUsuario(g, da, dom, diade, coerenciaNivel),
      direcao: direcaoUsuario(g, da, dom, diade)
    }
  };
}

const BIBLIOTECA = (() => {
  const out = {};
  const cargas = ['leve', 'moderado', 'elevado'];
  const dispersoes = ['difuso', 'moderado', 'polarizado'];
  const eixos = ['S', 'O', 'A'];
  const diades = ['nenhuma', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'];

  for (const g of cargas) {
    for (const da of dispersoes) {
      for (const dom of eixos) {
        for (const diade of diades) {
          const chave = `G_${g}__Da_${da}__dom_${dom}__${diade}`;
          out[chave] = gerarEntrada(g, da, dom, diade);
        }
      }
    }
  }

  return out;
})();

// ─────────────────────────────────────────────────────────────
// VALIDAÇÃO
// ─────────────────────────────────────────────────────────────

function entradaValida(entrada) {
  if (!entrada || typeof entrada !== 'object') return false;

  const r = entrada.relatorio;
  const u = entrada.usuario;

  if (!r || typeof r !== 'object') return false;
  if (!u || typeof u !== 'object') return false;

  const camposRelatorio = ['sintese', 'interpretacao', 'implicacoes', 'limites', 'conduta'];
  const camposUsuario   = ['titulo', 'texto', 'direcao'];

  for (const c of camposRelatorio) {
    if (!r[c] || typeof r[c] !== 'string') return false;
  }
  for (const c of camposUsuario) {
    if (!u[c] || typeof u[c] !== 'string') return false;
  }

  return true;
}

// ─────────────────────────────────────────────────────────────
// CHAVE
// ─────────────────────────────────────────────────────────────

function gerarChave(resultado) {
  const { global, diades } = resultado;
  const g   = global.classificacoes.G;
  const da  = global.classificacoes.Da;
  const dom = global.eixoDominante;
  const d   = diades.ativas.length > 0 ? diades.ativas[0].id : 'nenhuma';

  return `G_${g}__Da_${da}__dom_${dom}__${d}`;
}

// ─────────────────────────────────────────────────────────────
// FALLBACK
// ─────────────────────────────────────────────────────────────

function devolutivaFallback(resultado, chave, textoLongitudinal) {
  const { global, coerencia, diades } = resultado;

  const relatorioBase = {
    sintese:       `${capitalize(global.classificacoes.G)} com predominância de ${global.eixoDominante} e dispersão ${global.classificacoes.Da}.`,
    interpretacao: `A biblioteca não possui entrada explícita para a assinatura ${chave}. A leitura foi preservada por fallback controlado.`,
    implicacoes:   'O padrão indica custo funcional presente, mas exige preenchimento específico de biblioteca para maior precisão clínica de linguagem.',
    limites:       LIMITES_PADRAO,
    conduta:       'Preencher entrada específica da biblioteca para esta assinatura antes de ampliar o uso clínico da formulação.'
  };

  const usuarioBase = {
    titulo:  'Seu resultado já mostra um padrão, mas a tradução ainda está em construção',
    texto:   'O sistema reconheceu um desenho no seu funcionamento, mas este texto ainda está usando uma formulação de segurança enquanto a biblioteca é refinada.',
    direcao: 'Use esta leitura como indicação inicial do ponto de maior gasto de energia, sem tratá-la como formulação final.'
  };

  const status = resultado.longitudinal?.status || 'insuficiente';
  const modulado = modularPorLongitudinal(status, relatorioBase, usuarioBase, textoLongitudinal);

  return {
    ...modulado,
    _interno: {
      assinatura_id:   chave,
      flags_coerencia: coerencia.flags,
      modo_diades:     diades.ativas.length > 0 ? 'ativa' : 'nenhuma'
    }
  };
}

// ─────────────────────────────────────────────────────────────
// AJUSTE POR COERÊNCIA
// ─────────────────────────────────────────────────────────────

function ajustarPorCoerencia(entrada, coerencia) {
  const nivel = coerencia?.nivel || 'coerente';
  const info = COERENCIA_INFO[nivel] || COERENCIA_INFO.coerente;

  const relatorio = { ...entrada.relatorio };
  const usuario = { ...entrada.usuario };

  if (nivel === 'leve') {
    relatorio.limites = `${relatorio.limites} ${info.pro}`;
  }

  if (nivel === 'atencao') {
    relatorio.interpretacao = `${relatorio.interpretacao} ${info.pro}`;
    relatorio.limites = `${relatorio.limites} ${info.pro}`;
    usuario.texto = `${usuario.texto} ${info.user}`;
  }

  if (nivel === 'baixa_confiabilidade') {
    relatorio.interpretacao = `${relatorio.interpretacao} ${info.pro}`;
    relatorio.implicacoes = 'Há sinais funcionais relevantes, mas a força interpretativa deste protocolo está reduzida pela consistência interna do registro.';
    relatorio.conduta = `Priorizar reaplicação ou revisão do preenchimento. ${relatorio.conduta}`;
    usuario.texto = `${usuario.texto} Por isso, o mais seguro é tratar este resultado como uma observação importante, mas ainda não definitiva.`;
    usuario.direcao = 'Vale repetir o registro em outro momento para confirmar se este desenho se mantém.';
  }

  return { relatorio, usuario };
}

// ─────────────────────────────────────────────────────────────
// ENTRADA PRINCIPAL
// ─────────────────────────────────────────────────────────────

function obterDevolutiva(resultado) {
  if (!resultado || !resultado.global || !resultado.diades || !resultado.coerencia) {
    throw new Error('obterDevolutiva: resultado inválido ou incompleto');
  }

  const chave = gerarChave(resultado);
  const textoLong = traduzirLongitudinal(resultado.longitudinal);
  const status = resultado.longitudinal?.status || 'insuficiente';

  const entradaBase = BIBLIOTECA[chave];
  if (!entradaValida(entradaBase)) {
    return devolutivaFallback(resultado, chave, textoLong);
  }

  const ajustada = ajustarPorCoerencia(entradaBase, resultado.coerencia);
  const modulado = modularPorLongitudinal(status, ajustada.relatorio, ajustada.usuario, textoLong);

  return {
    ...modulado,
    _interno: {
      assinatura_id:   chave,
      flags_coerencia: resultado.coerencia.flags,
      modo_diades:     resultado.diades.ativas.length > 0 ? 'ativa' : 'nenhuma'
    }
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function capitalize(txt) {
  return txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt;
}

module.exports = {
  obterDevolutiva,
  gerarChave
};
