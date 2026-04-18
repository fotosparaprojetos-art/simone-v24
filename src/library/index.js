'use strict';

/**
 * simone-library/index.js
 * SiMone V24 — Biblioteca de devolutivas
 *
 * ESTADO: STUB — textos profissionais ainda não preenchidos
 * Compatível com: engine.js novo + server.js novo
 *
 * REGRAS:
 * - Nunca expor _interno ao front-end (sanitização feita no server.js)
 * - Nenhuma lógica clínica aqui — apenas lookup, fallback e modulação longitudinal
 * - Sem diagnóstico, sem rótulos criativos, sem pseudoclínica
 * - Leitura clínica plena apenas em status "consolidado"
 */

const BIBLIOTECA = {
  // TODO: preencher com textos profissionais
  // Chave: 'G_{g}__Da_{da}__dom_{eixo}__{diadeId}'
};

// ─── TRADUÇÃO LONGITUDINAL ────────────────────────────────────────────────────

const LONGITUDINAL_TEXTO = {
  insuficiente: 'Ainda não há medições suficientes para leitura longitudinal.',
  pontual:      'Padrão observado em um único momento.',
  repeticao:    'Padrão observado em mais de uma medição, ainda sem consistência suficiente.',
  padrao:       'Padrão repetido com consistência funcional.',
  consolidado:  'Padrão mantido ao longo do tempo.',
  oscilacao:    'Oscilação entre medições, sem estabilidade definida.',
};

function traduzirLongitudinal(longitudinal) {
  if (!longitudinal || !longitudinal.status) {
    return LONGITUDINAL_TEXTO.insuficiente;
  }
  return LONGITUDINAL_TEXTO[longitudinal.status] || LONGITUDINAL_TEXTO.insuficiente;
}

// ─── MODULAÇÃO LONGITUDINAL ───────────────────────────────────────────────────

const LIMITES_PADRAO = 'Leitura baseada em autorrelato. Sujeita a variação de percepção. Confirmação longitudinal recomendada.';

function modularPorLongitudinal(status, relatorio, usuario, textoLongitudinal) {
  switch (status) {

    case 'insuficiente':
    case 'pontual':
      return {
        relatorio: {
          sintese:       relatorio.sintese,
          interpretacao: 'Esta é uma leitura de momento único. O que aparece aqui reflete o estado funcional recente — não um padrão estabelecido. Uma nova medição em outro momento é necessária para avaliar consistência.',
          implicacoes:   'Sem implicações geradas a partir de uma única medição.',
          longitudinal:  textoLongitudinal,
          limites:       relatorio.limites || LIMITES_PADRAO,
          conduta:       'Uma nova medição em outro momento é necessária para avaliar consistência.'
        },
        usuario: {
          titulo:  relatorio.sintese || '—',
          texto:   'Este é o seu primeiro registro. Uma medição mostra o estado de agora — não define um padrão. Novas medições em outros momentos permitem verificar se isso se repete ou não.',
          direcao: '—'
        }
      };

    case 'repeticao':
      return {
        relatorio: {
          sintese:       relatorio.sintese,
          interpretacao: 'Padrão em observação. Presente em mais de uma medição, mas ainda sem consistência suficiente para leitura interpretativa.',
          implicacoes:   'Sem implicações geradas neste estágio.',
          longitudinal:  textoLongitudinal,
          limites:       relatorio.limites || LIMITES_PADRAO,
          conduta:       'Monitorar. Não tratar como padrão estabelecido.'
        },
        usuario: {
          titulo:  usuario.titulo || '—',
          texto:   'Este padrão apareceu mais de uma vez. Ainda é cedo para conclusões — mais medições vão definir se é consistente ou passageiro.',
          direcao: '—'
        }
      };

    case 'padrao':
      return {
        relatorio: {
          sintese:       relatorio.sintese,
          interpretacao: relatorio.interpretacao,
          implicacoes:   'Padrão com consistência funcional observada. Ainda não suficiente para orientações definitivas.',
          longitudinal:  textoLongitudinal,
          limites:       relatorio.limites || LIMITES_PADRAO,
          conduta:       'Acompanhar evolução. Nova medição recomendada para consolidação.'
        },
        usuario: {
          titulo:  usuario.titulo  || '—',
          texto:   usuario.texto   || '—',
          direcao: 'Este padrão está se consolidando. Acompanhe as próximas medições.'
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
          titulo:  usuario.titulo  || '—',
          texto:   usuario.texto   || '—',
          direcao: usuario.direcao || '—'
        }
      };

    default:
      return {
        relatorio: {
          sintese:       relatorio.sintese,
          interpretacao: 'Status longitudinal não reconhecido. Leitura interpretativa suspensa.',
          implicacoes:   '—',
          longitudinal:  textoLongitudinal,
          limites:       relatorio.limites || LIMITES_PADRAO,
          conduta:       'Verificar integridade dos dados longitudinais.'
        },
        usuario: {
          titulo:  '—',
          texto:   '—',
          direcao: '—'
        }
      };
  }
}

// ─── VALIDAÇÃO DE ENTRADA DE BIBLIOTECA ──────────────────────────────────────

function entradaValida(entrada) {
  if (!entrada || typeof entrada !== 'object') return false;
  const r = entrada.relatorio;
  const u = entrada.usuario;
  if (!r || typeof r !== 'object') return false;
  if (!u || typeof u !== 'object') return false;
  const camposRelatorio = ['sintese', 'interpretacao', 'implicacoes', 'limites', 'conduta'];
  const camposUsuario   = ['titulo', 'texto', 'direcao'];
  for (const c of camposRelatorio) { if (!r[c] || typeof r[c] !== 'string') return false; }
  for (const c of camposUsuario)   { if (!u[c] || typeof u[c] !== 'string') return false; }
  return true;
}

// ─── GERADOR DE CHAVE ─────────────────────────────────────────────────────────

function gerarChave(resultado) {
  const { global, diades } = resultado;
  const g   = global.classificacoes.G;
  const da  = global.classificacoes.Da;
  const dom = global.eixoDominante;
  const d   = diades.ativas.length > 0 ? diades.ativas[0].id : 'nenhuma';
  return `G_${g}__Da_${da}__dom_${dom}__${d}`;
}

// ─── FALLBACK ─────────────────────────────────────────────────────────────────

function devolutivaFallback(resultado, chave, textoLongitudinal) {
  const { global, coerencia, diades } = resultado;

  const relatorioBase = {
    sintese:       `${global.classificacoes.G.charAt(0).toUpperCase() + global.classificacoes.G.slice(1)} · Eixo dominante: ${global.eixoDominante} · Dispersão: ${global.classificacoes.Da}`,
    interpretacao: '—',
    implicacoes:   '—',
    limites:       LIMITES_PADRAO,
    conduta:       '—'
  };

  const usuarioBase = { titulo: '—', texto: '—', direcao: '—' };

  const status   = resultado.longitudinal?.status || 'insuficiente';
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

// ─── ENTRADA PRINCIPAL ────────────────────────────────────────────────────────

function obterDevolutiva(resultado) {
  if (!resultado || !resultado.global || !resultado.diades || !resultado.coerencia) {
    throw new Error('obterDevolutiva: resultado inválido ou incompleto');
  }

  const chave     = gerarChave(resultado);
  const textoLong = traduzirLongitudinal(resultado.longitudinal);
  const status    = resultado.longitudinal?.status || 'insuficiente';
  const entrada   = BIBLIOTECA[chave];

  if (!entradaValida(entrada)) {
    return devolutivaFallback(resultado, chave, textoLong);
  }

  const modulado = modularPorLongitudinal(status, entrada.relatorio, entrada.usuario, textoLong);

  return {
    ...modulado,
    _interno: {
      assinatura_id:   chave,
      flags_coerencia: resultado.coerencia.flags,
      modo_diades:     resultado.diades.ativas.length > 0 ? 'ativa' : 'nenhuma'
    }
  };
}

module.exports = { obterDevolutiva, gerarChave };
