'use strict';

// SiMone V24 — Biblioteca Clínica Final (CORRIGIDA)

const LIMITES_PADRAO =
  'Leitura funcional baseada em autorrelato. Interpretar em contexto e, quando possível, acompanhar longitudinalmente.';

const EIXO = {
  S: {
    nome: 'Sentir',
    pro: 'custo energético em regulação corporal e emocional',
    usuario: 'seu corpo e suas emoções estão consumindo mais energia do que o habitual'
  },
  O: {
    nome: 'Organizar',
    pro: 'custo cognitivo relacionado à clareza e organização',
    usuario: 'o maior esforço está em entender, organizar e decidir'
  },
  A: {
    nome: 'Agir',
    pro: 'custo na conversão de intenção em ação',
    usuario: 'o maior esforço está em começar e manter ações'
  }
};

const DISPERSAO = {
  difuso:    'distribuição difusa',
  moderado:  'distribuição parcialmente concentrada',
  polarizado: 'distribuição polarizada'
};

const DIADES = {
  D1: 'emoção interferindo no início',
  D2: 'clareza interferindo no início',
  D3: 'organização interferindo na sustentação',
  D4: 'corpo interferindo na continuidade',
  D5: 'emoção interferindo na clareza',
  D6: 'clareza interferindo na organização',
  D7: 'corpo e emoção atuando juntos',
  D8: 'dificuldade de iniciar e sustentar'
};

const COERENCIA = {
  coerente:             '',
  leve:                 'Pequena variação interna.',
  atencao:              'Sinais de inconsistência.',
  baixa_confiabilidade: 'Baixa consistência do registro.'
};

function ajustarLongitudinal(status, texto) {
  if (!status || status === 'insuficiente' || status === 'pontual') {
    return `Leitura de momento único. ${texto}`;
  }
  return texto;
}

function gerarRelatorio(r) {
  const g    = r.global.classificacoes.G;
  const da   = r.global.classificacoes.Da;
  const dom  = r.global.eixoDominante;
  const coer = r.coerencia?.nivel || 'coerente';

  const diade =
    r.diades?.ativas?.length > 0
      ? DIADES[r.diades.ativas[0].id]
      : null;

  let sintese =
    `${g} com ${DISPERSAO[da]}, ` +
    `predomínio no eixo ${dom} (${EIXO[dom].nome}).`;

  let interpretacao =
    `O padrão atual indica ${DISPERSAO[da]}, com ` +
    `${EIXO[dom].pro}. ` +
    (diade ? `Observa-se ${diade}. ` : '') +
    COERENCIA[coer];

  sintese        = ajustarLongitudinal(r.longitudinal?.status, sintese);
  interpretacao  = ajustarLongitudinal(r.longitudinal?.status, interpretacao);

  return {
    sintese,
    interpretacao,
    implicacoes: 'Aumento do custo para iniciar, organizar ou sustentar ações.',
    limites:     LIMITES_PADRAO,
    conduta:     `Atuar no eixo dominante (${dom}) e reduzir carga global.`
  };
}

function gerarUsuario(r) {
  const g   = r.global.classificacoes.G;
  const da  = r.global.classificacoes.Da;
  const dom = r.global.eixoDominante;

  const eixo = EIXO[dom];

  const diade =
    r.diades?.ativas?.length > 0
      ? DIADES[r.diades.ativas[0].id]
      : null;

  let texto =
    `Hoje ${eixo.usuario}. ` +
    (da === 'difuso'
      ? 'Esse peso está mais espalhado. '
      : 'Existe um ponto mais concentrado puxando sua energia. ') +
    'Isso não é falta de vontade. Parte da sua energia está sendo usada antes da ação acontecer. ' +
    (diade ? `Existe uma combinação: ${diade}. ` : '') +
    'Por isso, tarefas simples podem parecer maiores.';

  texto = ajustarLongitudinal(r.longitudinal?.status, texto);

  return {
    titulo:  eixo.nome,
    texto,
    direcao:
      g === 'elevado'
        ? 'Reduza exigência e foque no essencial.'
        : 'Simplifique o próximo passo.'
  };
}

function obterDevolutiva(resultado) {
  if (!resultado || !resultado.global) {
    throw new Error('resultado inválido');
  }

  return {
    relatorio: gerarRelatorio(resultado),
    usuario:   gerarUsuario(resultado),
    _interno: {
      eixo:      resultado.global.eixoDominante,
      dispersao: resultado.global.classificacoes.Da
    }
  };
}

module.exports = { obterDevolutiva };
