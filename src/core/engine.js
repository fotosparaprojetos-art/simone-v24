// SiMone V24 — engine.js (núcleo completo)

// -----------------------------
// MAPEAMENTO Q36
// -----------------------------
const BLOCOS = {
  S1: [1,2,3,4,5,6],
  S2: [7,8,9,10,11,12],
  O1: [13,14,15,16,17],
  O2: [18,19,20,21,22,23],
  A1: [24,25,26,27,28],
  A2: [29,30,31,32],
  P:  [33,34,35,36]
};

// -----------------------------
// HELPERS
// -----------------------------
function media(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('media: array inválido ou vazio');
  }
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function pick(respostas, ids) {
  return ids.map(i => {
    if (!(i in respostas)) throw new Error(`pick: chave ${i} ausente em respostas`);
    return respostas[i];
  });
}

function round1(v) {
  if (v == null || isNaN(v)) throw new Error(`round1: valor inválido (${v})`);
  return Math.round(v * 10) / 10;
}

// -----------------------------
// VALIDAÇÃO
// -----------------------------
function validar(respostas) {
  if (!respostas || typeof respostas !== 'object' || Array.isArray(respostas)) {
    throw new Error('respostas inválidas: deve ser um objeto');
  }

  const keys = Object.keys(respostas).map(Number);
  if (keys.length !== 36) {
    throw new Error(`devem existir exatamente 36 respostas (recebido: ${keys.length})`);
  }

  for (let i = 1; i <= 36; i++) {
    if (!(i in respostas)) {
      throw new Error(`resposta ausente para questão ${i}`);
    }
    const v = respostas[i];
    if (!Number.isInteger(v) || v < 0 || v > 4) {
      throw new Error(`valor inválido em questão ${i}: ${v} (esperado inteiro 0–4)`);
    }
  }
}

// -----------------------------
// BLOCOS
// -----------------------------
function calcularBlocos(respostas) {
  const out = {};

  for (const k in BLOCOS) {
    const vals = pick(respostas, BLOCOS[k]);
    out[k] = media(vals);
  }

  return out;
}

// -----------------------------
// EIXOS (NORMALIZADOS)
// -----------------------------
function calcularEixos(blocos) {
  const chaves = ['S1','S2','O1','O2','A1','A2','P'];
  for (const k of chaves) {
    if (!(k in blocos) || blocos[k] == null || isNaN(blocos[k])) {
      throw new Error(`calcularEixos: bloco ${k} ausente ou inválido`);
    }
  }

  const S = (blocos.S1 * 6 + blocos.S2 * 6) / 12 / 4;
  const O = (blocos.O1 * 5 + blocos.O2 * 6) / 11 / 4;
  const A = (blocos.A1 * 5 + blocos.A2 * 4) / 9  / 4;
  const P = blocos.P / 4;

  return { S, O, A, P };
}

// -----------------------------
// TRÍADE
// -----------------------------
function calcularTriade(eixos) {
  const { S, O, A, P } = eixos;

  for (const [k, v] of Object.entries({ S, O, A })) {
    if (v == null || isNaN(v)) {
      throw new Error(`calcularTriade: eixo ${k} inválido`);
    }
  }

  const G = (S + O + A) / 3;

  const arr = [
    { k: 'S', v: S },
    { k: 'O', v: O },
    { k: 'A', v: A }
  ].sort((a, b) => b.v - a.v);

  const Da = arr[0].v - arr[2].v;
  const Dd = arr[0].v - arr[1].v;

  return {
    G,
    Da,
    Dd,
    dominante: arr[0].k,
    classificacoes: {
      G: G < 0.375 ? 'leve'      : G < 0.625 ? 'moderado'   : 'elevado',
      Da: Da < 0.20 ? 'difuso'   : Da < 0.40  ? 'moderado'   : 'polarizado',
      Dd: Dd < 0.10 ? 'incerto'  : 'claro',
      P:  P < 0.375 ? 'preservado' : P < 0.625 ? 'reduzido'  : 'comprometido'
    }
  };
}

// -----------------------------
// DÍADES
// -----------------------------
const DIADES = [
  { id:'D1', a:'S2', b:'A1' },
  { id:'D2', a:'O1', b:'A1' },
  { id:'D3', a:'O2', b:'A2' },
  { id:'D4', a:'S1', b:'A2' },
  { id:'D5', a:'S2', b:'O1' },
  { id:'D6', a:'O1', b:'O2' },
  { id:'D7', a:'S1', b:'S2', alerta: true },
  { id:'D8', a:'A1', b:'A2', alerta: true }
];

function validarEstruturaDiades() {
  for (const d of DIADES) {
    if (!d.id || !d.a || !d.b) {
      throw new Error(`DIADES: entrada malformada — ${JSON.stringify(d)}`);
    }
    if (!(d.a in BLOCOS) || !(d.b in BLOCOS)) {
      throw new Error(`DIADES: bloco inexistente em díade ${d.id} (a:${d.a}, b:${d.b})`);
    }
  }
}

validarEstruturaDiades();

function calcularDiades(blocos, triade) {
  const candidatas = DIADES.map(d => {
    const v1 = blocos[d.a] / 4;
    const v2 = blocos[d.b] / 4;

    const ativa =
      v1 >= 0.50 &&
      v2 >= 0.50 &&
      (v1 >= 0.75 || v2 >= 0.75);

    return {
      id:     d.id,
      blocos: [d.a, d.b],
      alerta: !!d.alerta,
      v1,
      v2,
      soma:   v1 + v2,
      ativa
    };
  }).filter(d => d.ativa);

  let ativas = [];

  if (triade.classificacoes.G === 'elevado') {
    if (triade.classificacoes.Da === 'polarizado') {
      ativas = candidatas.filter(d => !d.alerta);
    } else {
      ativas = candidatas.filter(d => d.alerta);
    }
  }

  if (triade.classificacoes.G === 'moderado') {
    if (triade.classificacoes.Da === 'polarizado') {
      const top = [...candidatas].sort((a, b) => b.soma - a.soma)[0];
      if (top) ativas = [top];
    }
  }

  return { ativas };
}

// -----------------------------
// COERÊNCIA
// -----------------------------
function calcularCoerencia(respostas, blocos, eixos, triade) {
  const flags = [];

  // intra-bloco
  for (const k in BLOCOS) {
    const vals = pick(respostas, BLOCOS[k]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const m   = media(vals);

    if ((max - min) >= 3 && m >= 2) {
      flags.push(`inconsistencia_${k}`);
    }
  }

  // desalinhamento sub-bloco
  if (Math.abs(blocos.S1 - blocos.S2) >= 2) flags.push('desalinhamento_S');
  if (Math.abs(blocos.O1 - blocos.O2) >= 2) flags.push('desalinhamento_O');
  if (Math.abs(blocos.A1 - blocos.A2) >= 2) flags.push('desalinhamento_A');

  // dissociação
  if ((eixos.S >= 0.60 && eixos.A <= 0.40) || (eixos.A >= 0.60 && eixos.S <= 0.40)) {
    flags.push('dissociacao');
  }

  // propósito
  if (triade.G >= 0.625 && eixos.P < 0.25) {
    flags.push('proposito');
  }

  // rigidez
  const vals = Object.values(respostas);
  const freq  = {};
  vals.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const maxf = Math.max(...Object.values(freq));
  if (maxf / vals.length >= 0.80) {
    flags.push('rigidez');
  }

  return {
    flags,
    nivel:
      flags.length === 0 ? 'coerente'           :
      flags.length === 1 ? 'leve'               :
      flags.length === 2 ? 'atencao'            :
                           'baixa_confiabilidade'
  };
}

// -----------------------------
// LONGITUDINAL (MÍNIMO)
// -----------------------------
function calcularLongitudinal(historico, atual) {
  if (!Array.isArray(historico) || historico.length < 2) {
    return { status: 'insuficiente', ocorrencias: 0 };
  }

  if (!atual || !atual.diades || !Array.isArray(atual.diades.ativas)) {
    return { status: 'insuficiente', ocorrencias: 0 };
  }

  const alvo = atual.diades.ativas[0]?.id;
  if (!alvo) {
    return { status: 'insuficiente', ocorrencias: 0 };
  }

  const todos = [...historico, atual];

  let ocorrencias = 0;
  for (const m of todos) {
    const ativas = m?.diades?.ativas;
    if (Array.isArray(ativas) && ativas.find(d => d.id === alvo)) {
      ocorrencias++;
    }
  }

  const status =
    ocorrencias === 1 ? 'pontual'     :
    ocorrencias === 2 ? 'repeticao'   :
    ocorrencias === 3 ? 'padrao'      :
    ocorrencias >= 4  ? 'consolidado' :
                        'insuficiente';

  return { status, ocorrencias, alvo };
}

// -----------------------------
// FUNÇÃO PRINCIPAL
// -----------------------------
function calcular({ respostas, historico = [] }) {

  validar(respostas);

  const blocos    = calcularBlocos(respostas);
  const eixos     = calcularEixos(blocos);
  const triade    = calcularTriade(eixos);
  const diades    = calcularDiades(blocos, triade);
  const coerencia = calcularCoerencia(respostas, blocos, eixos, triade);

  const snapshot = { blocos, diades, global: triade, coerencia };
  const longitudinal = calcularLongitudinal(historico, snapshot);

  return {
    versao: 'V24',
    blocos,
    eixos: {
      S: round1(eixos.S),
      O: round1(eixos.O),
      A: round1(eixos.A),
      P: round1(eixos.P)
    },
    global: {
      G:              round1(triade.G),
      Da:             round1(triade.Da),
      Dd:             round1(triade.Dd),
      eixoDominante:  triade.dominante,
      classificacoes: triade.classificacoes
    },
    coerencia,
    diades,
    longitudinal
  };
}

module.exports = { calcular };

// -----------------------------
// NOTAS CONCEITUAIS
// -----------------------------
// [1] S agora é (S1*6 + S2*6)/12/4, matematicamente equivalente a
//     (S1 + S2)/2/4, mas mantém a forma ponderada explícita por simetria
//     com O e A — auditável e consistente.
//
// [2] A detecção de "rigidez" flageia 80% de respostas iguais sem
//     distinguir padrão de zeros de padrão de doses máximas.
//     Isso pode ter relevância clínica diferente. Não alterado por ora
//     (regra congelada), mas recomenda-se revisão futura.
//
// [3] O gate de díades para G === 'leve' resulta em ativas = [] sem
//     nenhuma flag explicativa no output. Comportamento preservado
//     conforme modelo. Considerar expor campo "gate_status" na próxima versão.
