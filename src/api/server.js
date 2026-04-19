'use strict';

const express       = require('express');
const cors          = require('cors');
const rateLimit     = require('express-rate-limit');
const crypto        = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { calcular }        = require('../core/engine');
const { obterDevolutiva } = require('../library/index');

const app = express();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.error('[SiMone] Supabase não configurado — SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente');
}

function requireSupabase(req, res, next) {
  if (!supabase) {
    return res.status(503).json({ erro: 'backend não configurado' });
  }
  next();
}

const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function gerarCodigo(tamanho = 7) {
  const bytes = crypto.randomBytes(tamanho);
  return Array.from(bytes)
    .map(b => ALFABETO[b % ALFABETO.length])
    .join('');
}

function gerarToken(tamanho = 10) {
  return gerarCodigo(tamanho);
}

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

async function verificarSessao(req, res, next) {
  const token = req.headers['x-session-token'];
  if (!token) return res.status(401).json({ erro: 'sessão ausente' });
  if (!supabase) return res.status(503).json({ erro: 'backend não configurado' });

  try {
    const { data: sessao, error } = await supabase
      .from('sessoes_profissional')
      .select('profissional_id, questionado_id, expira_em')
      .eq('session_token', token)
      .maybeSingle();

    if (error || !sessao) return res.status(401).json({ erro: 'sessão inválida' });
    if (new Date(sessao.expira_em) < new Date()) return res.status(401).json({ erro: 'sessão expirada' });

    req.profissional_id = sessao.profissional_id;
    req.questionado_id  = sessao.questionado_id;
    next();
  } catch (e) {
    console.error('[SiMone] verificarSessao falhou:', e.message);
    return res.status(500).json({ erro: 'erro interno' });
  }
}

app.use(cors({ origin: true }));
app.use(express.json({ limit: '32kb' }));

const limiter = rateLimit({
  windowMs: 60000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'muitas requisições, tente novamente em breve' }
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok', versao: 'V24', supabase: !!supabase });
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

app.post('/questionado/identificar', limiter, requireSupabase, async (req, res) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string') return res.status(400).json({ erro: 'email obrigatório' });

  try {
    const { data: existente } = await supabase
      .from('questionados')
      .select('id, codigo_questionado')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existente) {
      return res.json({ questionado_id: existente.id, codigo_questionado: existente.codigo_questionado, existente: true });
    }

    const codigo_questionado = gerarCodigo(7);
    const { data: novo, error } = await supabase
      .from('questionados')
      .insert({ email: email.toLowerCase().trim(), codigo_questionado, aceite_anonimato: true, autoriza_repasse: false, ativo: true })
      .select('id, codigo_questionado')
      .single();

    if (error) throw error;
    return res.json({ questionado_id: novo.id, codigo_questionado: novo.codigo_questionado, existente: false });
  } catch (e) {
    console.error('[SiMone] identificar falhou:', e.message);
    return res.status(500).json({ erro: 'erro interno' });
  }
});

app.post('/questionado/gerar-autorizacao', limiter, requireSupabase, async (req, res) => {
  const { codigo_questionado, email } = req.body || {};
  if (!codigo_questionado || !email) return res.status(400).json({ erro: 'campos obrigatórios ausentes' });

  try {
    const { data: q } = await supabase
      .from('questionados')
      .select('id')
      .eq('codigo_questionado', codigo_questionado)
      .eq('email', email.toLowerCase().trim())
      .eq('ativo', true)
      .maybeSingle();

    if (!q) return res.status(404).json({ erro: 'questionado não encontrado' });

    await supabase
      .from('vinculos')
      .update({ autorizado: false, expira_em: new Date().toISOString() })
      .eq('questionado_id', q.id);

    const token_autorizacao = gerarToken(10);
    const expira_em = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('vinculos')
      .insert({ questionado_id: q.id, profissional_id: null, token_autorizacao, expira_em, autorizado: false });

    if (error) throw error;
    return res.json({ token_autorizacao, expira_em });
  } catch (e) {
    console.error('[SiMone] gerar-autorizacao falhou:', e.message);
    return res.status(500).json({ erro: 'erro interno' });
  }
});

app.post('/profissional/validar-acesso', limiter, requireSupabase, async (req, res) => {
  const { crm, uf_crm, codigo_profissional, codigo_questionado, token_autorizacao } = req.body || {};
  if (!crm || !uf_crm || !codigo_profissional || !codigo_questionado || !token_autorizacao) {
    return res.status(400).json({ erro: 'campos obrigatórios ausentes' });
  }

  try {
    const { data: prof } = await supabase
      .from('profissionais')
      .select('id')
      .eq('crm', crm.trim())
      .eq('uf_crm', uf_crm.toUpperCase().trim())
      .eq('codigo_profissional', codigo_profissional.trim())
      .eq('ativo', true)
      .maybeSingle();

    if (!prof) return res.status(403).json({ autorizado: false, erro: 'profissional não autorizado' });

    const { data: q } = await supabase
      .from('questionados')
      .select('id')
      .eq('codigo_questionado', codigo_questionado.trim())
      .eq('ativo', true)
      .maybeSingle();

    if (!q) return res.status(404).json({ autorizado: false, erro: 'questionado não encontrado' });

    const { data: vinculo } = await supabase
      .from('vinculos')
      .select('id, expira_em')
      .eq('questionado_id', q.id)
      .eq('token_autorizacao', token_autorizacao.trim())
      .eq('autorizado', false)
      .maybeSingle();

    if (!vinculo) return res.status(403).json({ autorizado: false, erro: 'token inválido ou já utilizado' });
    if (new Date(vinculo.expira_em) < new Date()) return res.status(403).json({ autorizado: false, erro: 'token expirado' });

    const { error: errVinculo } = await supabase
      .from('vinculos')
      .update({ autorizado: true, profissional_id: prof.id })
      .eq('id', vinculo.id);

    if (errVinculo) throw errVinculo;

    const session_token = gerarToken(16);
    const sessao_expira = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const { error: errSessao } = await supabase
      .from('sessoes_profissional')
      .insert({ profissional_id: prof.id, questionado_id: q.id, session_token, expira_em: sessao_expira });

    if (errSessao) throw errSessao;

    return res.json({ autorizado: true, questionado_id: q.id, profissional_id: prof.id, session_token, expira_em: sessao_expira });
  } catch (e) {
    console.error('[SiMone] validar-acesso falhou:', e.message);
    return res.status(500).json({ erro: 'erro interno' });
  }
});

app.get('/profissional/questionado/:id', limiter, verificarSessao, async (req, res) => {
  const alvo = req.params.id;
  if (req.questionado_id !== alvo) return res.status(403).json({ erro: 'acesso não autorizado' });

  try {
    const { data: resultados, error } = await supabase
      .from('resultados')
      .select('*')
      .eq('questionado_id', alvo)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const textoLongitudinal = !resultados || resultados.length <= 1
      ? 'Dados insuficientes para leitura longitudinal.'
      : 'Leitura longitudinal ainda em consolidação nesta fase.';

    return res.json({ questionado_id: alvo, resultados: resultados || [], longitudinal: { texto: textoLongitudinal } });
  } catch (e) {
    console.error('[SiMone] carregar questionado falhou:', e.message);
    return res.status(500).json({ erro: 'erro interno' });
  }
});

module.exports = app;
