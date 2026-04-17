'use strict';

const express    = require('express');
const rateLimit  = require('express-rate-limit');
const { calcular }        = require('../core/engine');
const { obterDevolutiva } = require('../library/index');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── MAPEAMENTO FRONT → ENGINE ────────────────────────────────────────────────
//
// Front envia: { respostas: { s1_1: 2, s1_2: 3, ... } }
// Engine espera: { 1: 2, 2: 3, ... }

const MAPA = [
  null,
  's1_1','s1_2','s1_3','s1_4','s1_5','s1_6',
  's2_1','s2_2','s2_3','s2_4','s2_5','s2_6',
  'o1_1','o1_2','o1_3','o1_4','o1_5',
  'o2_1','o2_2','o2_3','o2_4','o2_5','o2_6',
  'a1_1','a1_2','a1_3','a1_4','a1_5',
  'a2_1','a2_2','a2_3','a2_4',
  'p_1','p_2','p_3','p_4'
];

const CHAVES_ESPERADAS = MAPA.slice(1);

function adaptarPayload(respostas) {
  if (!respostas || typeof respostas !== 'object' || Array.isArray(respostas)) {
    throw new TypeError('respostas ausentes ou formato inválido');
  }

  const faltam = CHAVES_ESPERADAS.filter(k => !(k in respostas));
  if (faltam.length > 0) {
    throw new RangeError(`payload incompleto: faltam ${faltam.length} campo(s)`);
  }

  const out = {};
  for (let i = 1; i <= 36; i++) {
    const chave = MAPA[i];
    const val   = respostas[chave];
    if (!Number.isInteger(val) || val < 0 || val > 4) {
      throw new TypeError(`campo ${chave} inválido: ${val}`);
    }
    out[i] = val;
  }

  return out;
}

// ─── SANITIZAÇÃO ─────────────────────────────────────────────────────────────

function sanitizarResposta(obj) {
  const limpo = JSON.parse(JSON.stringify(obj));

  function removerInterno(o) {
    if (o && typeof o === 'object') {
      delete o._interno;
      for (const k of Object.keys(o)) removerInterno(o[k]);
    }
  }

  removerInterno(limpo);
  return limpo;
}

// ─── MIDDLEWARES ──────────────────────────────────────────────────────────────

app.use(express.json({ limit: '32kb' }));

const limiter = rateLimit({
  windowMs: 60000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'muitas requisições, tente novamente em breve' }
});

// ─── ROTAS ────────────────────────────────────────────────────────────────────

app.get('/health', (_, res) => {
  res.json({ status: 'ok', versao: 'V24' });
});

app.post('/avaliar', limiter, (req, res) => {
  let respostas;

  try {
    respostas = adaptarPayload(req.body?.respostas);
  } catch (e) {
    console.error('[SiMone] adaptação falhou:', e.message);
    return res.status(400).json({ erro: 'payload inválido' });
  }

  let resultado;

  try {
    resultado = calcular({ respostas, historico: [] });
  } catch (e) {
    console.error('[SiMone] engine falhou:', e.message);
    return res.status(500).json({ erro: 'erro interno ao processar avaliação' });
  }

  let devolutiva;

  try {
    devolutiva = obterDevolutiva(resultado);
  } catch (e) {
    console.error('[SiMone] devolutiva falhou:', e.message);
    return res.status(500).json({ erro: 'erro interno ao processar avaliação' });
  }

  return res.json(sanitizarResposta({ ...resultado, devolutiva }));
});

// ─── INICIALIZAÇÃO ────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[SiMone] V24 rodando na porta ${PORT}`);
});

module.exports = app;
