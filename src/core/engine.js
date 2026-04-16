'use strict';

// SiMone V24 — engine.js (núcleo completo)

const BLOCOS = {
  S1: [1,2,3,4,5,6],
  S2: [7,8,9,10,11,12],
  O1: [13,14,15,16,17],
  O2: [18,19,20,21,22,23],
  A1: [24,25,26,27,28],
  A2: [29,30,31,32],
  P:  [33,34,35,36]
};

function media(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function pick(respostas, ids) {
  return ids.map(i => respostas[i]);
}

function validar(respostas) {
  if (Object.keys(respostas).length !== 36) {
    throw new Error('36 respostas obrigatórias');
  }
  for (let i = 1; i <= 36; i++) {
    const v = respostas[i];
    if (!Number.isInteger(v) || v < 0 || v > 4) {
      throw new Error(`valor inválido em ${i}`);
    }
  }
}

function calcularBlocos(respostas) {
  const out = {};
  for (const k in BLOCOS) {
    out[k] = media(pick(respostas, BLOCOS[k]));
  }
  return out;
}

function calcularEixos(b) {
  return {
    S: (b.S1 * 6 + b.S2 * 6) / 12 / 4,
    O: (b.O1 * 5 + b.O2 * 6) / 11 / 4,
    A: (b.A1 * 5 + b.A2 * 4) / 9  / 4,
    P: b.P / 4
  };
}

function calcularTriade(e) {
  const G = (e.S + e.O + e.A) / 3;

  const arr = [
    { k:'S', v:e.S },
    { k:'O', v:e.O },
    { k:'A', v:e.A }
  ].sort((a,b)=>b.v-a.v);

  const Da = arr[0].v - arr[2].v;
  const Dd = arr[0].v - arr[1].v;

  return {
    G,
    Da,
    Dd,
    dominante: arr[0].k,
    classificacoes: {
      G: G < 0.375 ? 'leve' : G < 0.625 ? 'moderado' : 'elevado',
      Da: Da < 0.20 ? 'difuso' : Da < 0.40 ? 'moderado' : 'polarizado',
      Dd: Dd < 0.10 ? 'incerto' : 'claro',
      P: e.P < 0.375 ? 'preservado' : e.P < 0.625 ? 'reduzido' : 'comprometido'
    }
  };
}

const DIADES = [
  { id:'D1', a:'S2', b:'A1' },
  { id:'D2', a:'O1', b:'A1' },
  { id:'D3', a:'O2', b:'A2' },
  { id:'D4', a:'S1', b:'A2' }
];

function calcularDiades(b, triade) {
  const candidatas = DIADES.map(d => {
    const v1 = b[d.a] / 4;
    const v2 = b[d.b] / 4;
    return {
      id: d.id,
      blocos: [d.a, d.b],
      soma: v1 + v2,
      ativa: v1 >= 0.5 && v2 >= 0.5
    };
  }).filter(d => d.ativa);

  return { ativas: candidatas };
}

function calcularLongitudinal(hist, atual) {
  if (!hist.length) return { status:'pontual', ocorrencias:1 };

  const todos = [...hist, atual];
  const ocorrencias = todos.length;

  const status =
    ocorrencias === 1 ? 'pontual' :
    ocorrencias === 2 ? 'repeticao' :
    ocorrencias === 3 ? 'padrao' :
    'consolidado';

  return { status, ocorrencias };
}

function calcular({ respostas, historico = [] }) {
  validar(respostas);

  const blocos = calcularBlocos(respostas);
  const eixos  = calcularEixos(blocos);
  const triade = calcularTriade(eixos);
  const diades = calcularDiades(blocos, triade);

  const snapshot = { blocos, diades, global: triade };
  const longitudinal = calcularLongitudinal(historico, snapshot);

  return {
    versao: 'V24',
    blocos,
    eixos,
    global: triade,
    diades,
    longitudinal
  };
}

module.exports = { calcular };
