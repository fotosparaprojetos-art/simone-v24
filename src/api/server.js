'use strict';

// ─── SiMone V24 · src/api/server.js ──────────────────────────────────────────
//
// VARIÁVEIS DE AMBIENTE (Vercel dashboard ou .env local):
//   DATABASE_URL  → connection string PostgreSQL / Supabase
//   ADMIN_KEY     → chave secreta para endpoints /admin/*
//
// CONFIRME antes de subir:
//   TABELA_SESSOES → nome exato da tabela de sessões no seu banco

const TABELA_SESSOES = 'sessoes_profissional'; // ← CONFIRME

// ─── DEPENDÊNCIAS (todas no topo — não importar dentro de handlers) ───────────

const express        = require('express');
const { Pool }       = require('pg');
const bcrypt         = require('bcrypt');
// Se bcrypt nativo tiver problemas de build na Vercel (bindings nativos),
// troque por:  const bcrypt = require('bcryptjs');
// e ajuste package.json: "bcryptjs": "^2.4.3"
const { randomUUID } = require('crypto'); // nativo do Node — sem instalar nada

const app  = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.set('trust proxy', true);
app.use(express.json());

// ─── HEALTH ──────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => res.json({ ok: true }));

// ─── MIDDLEWARE: autenticarProfissional ───────────────────────────────────────

async function autenticarProfissional(req, res, next) {
  const token = req.headers['x-session-token'];
  if (!token) return res.status(401).json({ erro: 'Sessão inválida.' });

  try {
    const { rows } = await pool.query(
      `SELECT profissional_id, crm, perfil
       FROM ${TABELA_SESSOES}
       WHERE token = $1 AND expira_em > now()
       LIMIT 1`,
      [token]
    );
    if (rows.length === 0) return res.status(401).json({ erro: 'Sessão expirada.' });
    req.profissionalId = rows[0].profissional_id;
    req.crm            = rows[0].crm;
    req.perfil         = rows[0].perfil;
    next();
  } catch (err) {
    console.error('[autenticarProfissional]', err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
}

// ─── MIDDLEWARE: autenticarAdmin ──────────────────────────────────────────────
//
// Estratégia ativa: x-admin-key via variável de ambiente.
// Para migrar para sessão: descomente bloco [2] e comente bloco [1].

async function autenticarAdmin(req, res, next) {
  // [1] Chave estática ─────────────────────────────────────────────────────────
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    console.error('[autenticarAdmin] ADMIN_KEY não definida no ambiente.');
    return res.status(500).json({ erro: 'Configuração de segurança ausente.' });
  }

  if (req.headers['x-admin-key'] !== adminKey) {
    console.warn('[autenticarAdmin] Negado — IP:', req.ip, '| UA:', req.headers['user-agent']);
    return res.status(403).json({ erro: 'Acesso negado.' });
  }

  // [2] Sessão + perfil (descomente para usar) ─────────────────────────────────
  // const sessionToken = req.headers['x-session-token'];
  // if (!sessionToken) return res.status(403).json({ erro: 'Acesso negado.' });
  // const { rows } = await pool.query(
  //   `SELECT profissional_id, crm, perfil FROM ${TABELA_SESSOES}
  //    WHERE token = $1 AND expira_em > now() LIMIT 1`,
  //   [sessionToken]
  // );
  // if (rows.length === 0 || rows[0].perfil !== 'admin') {
  //   return res.status(403).json({ erro: 'Acesso negado.' });
  // }
  // req.adminId = rows[0].crm;

  req.adminId = req.headers['x-admin-id'] || 'admin';
  next();
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTENTICAÇÃO
// ─────────────────────────────────────────────────────────────────────────────

// POST /profissional/login ─────────────────────────────────────────────────────
// FIX #2 + #6 + #7: retorno compatível com o front, imports no topo, SELECT id

app.post('/profissional/login', async (req, res) => {
  const { crm, senha } = req.body || {};
  if (!crm || !senha) {
    return res.status(400).json({ erro: 'CRM e senha obrigatórios.' });
  }

  try {
    const { rows } = await pool.query(
      // FIX #7: incluir id para popular profissional_id na sessão
      'SELECT id, crm, nome, perfil, senha_hash FROM profissionais WHERE crm = $1 LIMIT 1',
      [crm.trim()]
    );

    if (rows.length === 0) {
      // Resposta genérica — não revela se CRM existe
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const prof  = rows[0];
    const valido = await bcrypt.compare(senha, prof.senha_hash);

    if (!valido) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const session_token = randomUUID();
    const expiraEm      = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8h

    await pool.query(
      // Tabela de sessões deve ter coluna profissional_id além de crm
      `INSERT INTO ${TABELA_SESSOES} (token, profissional_id, crm, perfil, expira_em)
       VALUES ($1, $2, $3, $4, $5)`,
      [session_token, prof.id, prof.crm, prof.perfil, expiraEm]
    );

    // FIX #2: retorno compatível com salvarSessao() do front
    return res.json({
      session_token,
      profissional_id: prof.id,
      crm:             prof.crm,
      nome:            prof.nome,
      perfil:          prof.perfil
    });

  } catch (err) {
    console.error('[profissional/login]', err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

// POST /profissional/logout ────────────────────────────────────────────────────
// FIX #4: endpoint que o front chama ao clicar em Sair — estava ausente

app.post('/profissional/logout', async (req, res) => {
  const token = req.headers['x-session-token'];
  if (!token) return res.json({ ok: true }); // idempotente

  try {
    await pool.query(
      `DELETE FROM ${TABELA_SESSOES} WHERE token = $1`,
      [token]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('[profissional/logout]', err);
    // Não retornar erro — logout deve sempre funcionar para o usuário
    return res.json({ ok: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINTS DE PROFISSIONAL
// ─────────────────────────────────────────────────────────────────────────────

// GET /profissional/questionados ───────────────────────────────────────────────

app.get('/profissional/questionados', autenticarProfissional, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT q.id, q.codigo_questionado, q.criado_em
       FROM questionados q
       JOIN autorizacoes a ON a.questionado_id = q.id
       WHERE a.crm = $1
       ORDER BY q.criado_em DESC`,
      [req.crm]
    );
    return res.json({ questionados: rows });
  } catch (err) {
    console.error('[profissional/questionados]', err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

// POST /profissional/validar-acesso ───────────────────────────────────────────

app.post('/profissional/validar-acesso', autenticarProfissional, async (req, res) => {
  const { codigo_questionado, token_autorizacao } = req.body || {};
  if (!codigo_questionado || !token_autorizacao) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT q.id
       FROM questionados q
       JOIN autorizacoes a ON a.questionado_id = q.id
       WHERE q.codigo_questionado = $1
         AND a.token_autorizacao  = $2
         AND a.crm                = $3
       LIMIT 1`,
      [codigo_questionado.trim(), token_autorizacao.trim(), req.crm]
    );

    if (rows.length === 0) {
      return res.status(403).json({ autorizado: false, erro: 'Acesso não autorizado.' });
    }

    return res.json({ autorizado: true, questionado_id: rows[0].id });

  } catch (err) {
    console.error('[profissional/validar-acesso]', err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

// GET /profissional/questionado/:id ───────────────────────────────────────────

app.get('/profissional/questionado/:id', autenticarProfissional, async (req, res) => {
  const { id } = req.params;

  try {
    const { rows: auth } = await pool.query(
      `SELECT 1 FROM autorizacoes
       WHERE questionado_id = $1 AND crm = $2 LIMIT 1`,
      [id, req.crm]
    );

    if (auth.length === 0) {
      return res.status(403).json({ erro: 'Acesso não autorizado.' });
    }

    const { rows: resultados } = await pool.query(
      `SELECT eixos, gravidade, assinatura, flags, criado_em
       FROM resultados
       WHERE questionado_id = $1
       ORDER BY criado_em DESC`,
      [id]
    );

    const { rows: long } = await pool.query(
      `SELECT texto FROM leituras_longitudinais
       WHERE questionado_id = $1
       ORDER BY criado_em DESC LIMIT 1`,
      [id]
    );

    return res.json({
      resultados,
      longitudinal: long.length > 0 ? long[0] : null
    });

  } catch (err) {
    console.error('[profissional/questionado/:id]', err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT PÚBLICO: QUESTIONÁRIO (/avaliar)
// ─────────────────────────────────────────────────────────────────────────────

// POST /avaliar ────────────────────────────────────────────────────────────────
// Entrada: { respostas: { s1_1: 2, s1_2: 0, ..., p_4: 3 } }
//          codigo_questionado + token_autorizacao opcionais (persistência)
//
// Saída:
//   {
//     eixos: { S, O, A, P },
//     global: { G, Da, Dd, eixoDominante, classificacoes: { G, Da, Dd } },
//     coerencia: { nivel, flags },
//     devolutiva: { usuario: { titulo, texto, direcao } }
//   }
//
// Mapeamento de campos — extraído do index.html real:
//   S (12 itens): s1_1–s1_6 (Corpo) + s2_1–s2_6 (Emocional)
//   O (11 itens): o1_1–o1_5 (Clareza) + o2_1–o2_6 (Organização)
//   A  (9 itens): a1_1–a1_5 (Início) + a2_1–a2_4 (Sustentação)
//   P  (4 itens): p_1–p_4 (Propósito)

const MAPA_EIXOS = {
  S: ['s1_1','s1_2','s1_3','s1_4','s1_5','s1_6',
      's2_1','s2_2','s2_3','s2_4','s2_5','s2_6'],
  O: ['o1_1','o1_2','o1_3','o1_4','o1_5',
      'o2_1','o2_2','o2_3','o2_4','o2_5','o2_6'],
  A: ['a1_1','a1_2','a1_3','a1_4','a1_5',
      'a2_1','a2_2','a2_3','a2_4'],
  P: ['p_1','p_2','p_3','p_4'],
};

const NOMES_EIXO = { S: 'Sentir', O: 'Organizar', A: 'Agir', P: 'Propósito' };

// Média de um conjunto de chaves nas respostas
function mediaEixo(respostas, chaves) {
  const vals = chaves.map(k => parseFloat(respostas[k])).filter(v => !isNaN(v));
  if (vals.length === 0) return null;
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
}

// Desvio padrão de um conjunto de valores
function desvioPadrao(vals) {
  if (vals.length < 2) return 0;
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.sqrt(vals.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / vals.length);
}

// Classificação de G (0–4)
function classificarG(v) {
  if (v === null) return 'indeterminado';
  if (v < 1.0)   return 'leve';
  if (v < 2.0)   return 'moderado';
  if (v < 3.0)   return 'elevado';
  return 'grave';
}

// Da = amplitude entre eixos (max – min), range 0–4
function classificarDa(v) {
  if (v < 0.8)  return 'integrado';
  if (v < 1.6)  return 'variado';
  if (v < 2.4)  return 'fragmentado';
  return 'dissociado';
}

// Dd = dispersão interna média por eixo, range 0–2
function classificarDd(v) {
  if (v < 0.5)  return 'coerente';
  if (v < 1.0)  return 'variável';
  if (v < 1.5)  return 'disperso';
  return 'incoerente';
}

// Nível geral de coerência (para data.coerencia.nivel)
function nivelCoerencia(Da, Dd) {
  if (Da < 1.0 && Dd < 0.7) return 'coerente';
  if (Da < 2.0 && Dd < 1.2) return 'variável';
  return 'disperso';
}

// Texto de devolutiva baseado nos eixos e classificação
function gerarDevolutivaUsuario(eixos, global) {
  const dom  = global.eixoDominante;
  const gCls = global.classificacoes.G;
  const nDom = NOMES_EIXO[dom] || dom;

  const titulos = {
    leve:     'Funcionamento preservado, com sinais de atenção',
    moderado: 'Funcionamento comprometido em áreas específicas',
    elevado:  'Sobrecarga funcional detectada em múltiplas áreas',
    grave:    'Sobrecarga significativa — atenção recomendada',
  };

  const textos = {
    S: `O domínio do ${nDom} aparece como o eixo de maior impacto neste momento. Sinais físicos e emocionais estão interferindo na sua capacidade de funcionar no dia a dia.`,
    O: `O domínio do ${nDom} concentra a maior parte da sobrecarga. Dificuldades de clareza mental e organização estão tornando as demandas mais pesadas do que o necessário.`,
    A: `O domínio do ${nDom} aparece como o principal ponto de tensão. A mobilização para iniciar e sustentar ações está custando mais esforço do que o esperado.`,
    P: `O domínio do ${nDom} concentra a maior parte da sobrecarga. Questões relacionadas a sentido e alinhamento estão influenciando a forma como você experimenta o que faz.`,
  };

  const direcoes = {
    leve:     'Este parece um momento de manutenção. Pequenos ajustes em rotina e autocuidado tendem a ser suficientes.',
    moderado: 'Vale investigar o que está por trás dessas dificuldades antes que se intensifiquem. Conversar com um profissional pode ajudar a mapear.',
    elevado:  'A sobrecarga identificada merece atenção. Reduzir demandas e buscar suporte profissional é recomendado.',
    grave:    'O padrão identificado indica necessidade de atenção próxima. Buscar apoio profissional é fortemente recomendado.',
  };

  return {
    titulo:  titulos[gCls]  || 'Avaliação concluída',
    texto:   textos[dom]    || 'Resultado processado com base nas respostas fornecidas.',
    direcao: direcoes[gCls] || '',
  };
}

function calcularResultado(respostas) {
  // 1. Médias por eixo
  const eixos = {};
  for (const [k, chaves] of Object.entries(MAPA_EIXOS)) {
    eixos[k] = mediaEixo(respostas, chaves);
  }

  // 2. G = média das médias dos eixos
  const validos = Object.values(eixos).filter(v => v !== null);
  const G = validos.length > 0
    ? parseFloat((validos.reduce((a, b) => a + b, 0) / validos.length).toFixed(2))
    : null;

  // 3. Da = amplitude (max – min entre eixos)
  const Da = validos.length > 1
    ? parseFloat((Math.max(...validos) - Math.min(...validos)).toFixed(2))
    : 0;

  // 4. Dd = média dos desvios internos de cada eixo
  const desvios = Object.entries(MAPA_EIXOS).map(([k, chaves]) => {
    const vals = chaves.map(c => parseFloat(respostas[c])).filter(v => !isNaN(v));
    return desvioPadrao(vals);
  });
  const Dd = parseFloat((desvios.reduce((a, b) => a + b, 0) / desvios.length).toFixed(2));

  // 5. Eixo dominante (maior média)
  const eixoDominante = Object.entries(eixos)
    .filter(([, v]) => v !== null)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'S';

  // 6. Classificações
  const classificacoes = {
    G:  classificarG(G),
    Da: classificarDa(Da),
    Dd: classificarDd(Dd),
  };

  // 7. Coerência
  const nivel = nivelCoerencia(Da, Dd);
  const flags = [];
  if (Da >= 2.0) flags.push('contraste_entre_eixos');
  if (Dd >= 1.0) flags.push('dispersao_interna');
  const coerencia = { nivel, flags };

  // 8. Global
  const global = { G, Da, Dd, eixoDominante, classificacoes };

  // 9. Devolutiva
  const devolutiva = { usuario: gerarDevolutivaUsuario(eixos, global) };

  return { eixos, global, coerencia, devolutiva };
}

app.post('/avaliar', async (req, res) => {
  const { respostas, codigo_questionado, token_autorizacao } = req.body || {};

  if (!respostas || typeof respostas !== 'object' || Array.isArray(respostas)) {
    return res.status(400).json({ erro: 'Respostas ausentes ou inválidas.' });
  }

  // Validar que todos os 36 campos estão presentes
  const TODOS = Object.values(MAPA_EIXOS).flat();
  const ausentes = TODOS.filter(k => respostas[k] === undefined || respostas[k] === null);
  if (ausentes.length > 0) {
    return res.status(400).json({ erro: 'Respostas incompletas.', ausentes });
  }

  try {
    const resultado = calcularResultado(respostas);

    // Persistência opcional: só se o questionado e token forem enviados
    if (codigo_questionado && token_autorizacao) {
      try {
        const { rows: auth } = await pool.query(
          `SELECT q.id AS questionado_id
           FROM questionados q
           JOIN autorizacoes a ON a.questionado_id = q.id
           WHERE q.codigo_questionado = $1
             AND a.token_autorizacao  = $2
           LIMIT 1`,
          [codigo_questionado.trim(), token_autorizacao.trim()]
        );

        if (auth.length > 0) {
          const qid = auth[0].questionado_id;
          const { G, Da, Dd, eixoDominante, classificacoes } = resultado.global;
          await pool.query(
            `INSERT INTO resultados
               (questionado_id, eixos, gravidade, assinatura, flags, criado_em)
             VALUES ($1, $2, $3, $4, $5, now())`,
            [
              qid,
              JSON.stringify(resultado.eixos),
              classificacoes.G,
              eixoDominante,
              JSON.stringify(resultado.coerencia.flags)
            ]
          );
        }
      } catch (dbErr) {
        // Falha na persistência não impede retorno do resultado ao usuário
        console.error('[avaliar] falha ao persistir:', dbErr.message);
      }
    }

    return res.json(resultado);

  } catch (err) {
    console.error('[avaliar]', err);
    res.status(500).json({ erro: 'Erro interno ao processar avaliação.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT PÚBLICO: SOLICITAÇÃO DE TROCA DE E-MAIL
// ─────────────────────────────────────────────────────────────────────────────

// POST /profissional/solicitar-atualizacao-email ───────────────────────────────

app.post('/profissional/solicitar-atualizacao-email', async (req, res) => {
  const { crm, email_novo, nome, documento } = req.body || {};

  if (!crm || !email_novo || !nome || !documento) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_novo)) {
    return res.status(400).json({ erro: 'E-mail inválido.' });
  }

  const ip         = req.ip || req.socket?.remoteAddress || null;
  const user_agent = req.headers['user-agent'] || null;

  try {
    const { rows: prof } = await pool.query(
      'SELECT email FROM profissionais WHERE crm = $1 LIMIT 1',
      [crm.trim()]
    );

    // Resposta genérica — não revela se CRM existe (anti-enumeração)
    if (prof.length === 0) return res.json({ ok: true });

    const email_antigo = prof[0].email || null;

    // FIX #1: índice parcial usa ON CONFLICT (coluna) WHERE condição
    // NÃO usar ON CONFLICT ON CONSTRAINT para índices parciais
    await pool.query(
      `INSERT INTO solicitacoes_atualizacao_email
         (crm, email_antigo, email_novo, nome_informado, documento_informado,
          ip_solicitante, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (crm) WHERE status = 'pendente' DO NOTHING`,
      [
        crm.trim(),
        email_antigo,
        email_novo.trim().toLowerCase(),
        nome.trim(),
        documento.trim(),
        ip,
        user_agent
      ]
    );

    return res.json({ ok: true });

  } catch (err) {
    console.error('[solicitar-atualizacao-email]', err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINTS ADMIN
// ─────────────────────────────────────────────────────────────────────────────

// GET /admin/solicitacoes-email ────────────────────────────────────────────────

app.get('/admin/solicitacoes-email', autenticarAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, crm, email_antigo, email_novo, nome_informado,
              documento_informado, status, ip_solicitante, user_agent,
              criado_em, analisado_em, analisado_por
       FROM solicitacoes_atualizacao_email
       ORDER BY
         CASE status WHEN 'pendente' THEN 0 ELSE 1 END,
         criado_em DESC`
    );
    return res.json({ solicitacoes: rows });
  } catch (err) {
    console.error('[admin/solicitacoes-email]', err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

// POST /admin/solicitacao-email/aprovar ───────────────────────────────────────

app.post('/admin/solicitacao-email/aprovar', autenticarAdmin, async (req, res) => {
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ erro: 'ID obrigatório.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `SELECT * FROM solicitacoes_atualizacao_email
       WHERE id = $1 AND status = 'pendente' FOR UPDATE`,
      [id]
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ erro: 'Solicitação não encontrada ou já processada.' });
    }

    const sol = rows[0];

    await client.query(
      'UPDATE profissionais SET email = $1 WHERE crm = $2',
      [sol.email_novo, sol.crm]
    );

    // FIX #8: DELETE por crm é correto — invalida TODAS as sessões do profissional.
    // Se a tabela de sessões tiver só o token como identificador e não tiver coluna crm,
    // adapte para: DELETE ... WHERE profissional_id = (SELECT id FROM profissionais WHERE crm = $1)
    await client.query(
      `DELETE FROM ${TABELA_SESSOES} WHERE crm = $1`,
      [sol.crm]
    );

    await client.query(
      `UPDATE solicitacoes_atualizacao_email
       SET status = 'aprovado', analisado_em = now(), analisado_por = $2
       WHERE id = $1`,
      [id, req.adminId]
    );

    await client.query('COMMIT');
    console.info('[aprovar-email] CRM:', sol.crm, '| email_novo:', sol.email_novo, '| admin:', req.adminId);
    return res.json({ ok: true });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[admin/solicitacao-email/aprovar]', err);
    res.status(500).json({ erro: 'Erro interno.' });
  } finally {
    client.release();
  }
});

// POST /admin/solicitacao-email/negar ─────────────────────────────────────────

app.post('/admin/solicitacao-email/negar', autenticarAdmin, async (req, res) => {
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ erro: 'ID obrigatório.' });

  try {
    const { rowCount } = await pool.query(
      `UPDATE solicitacoes_atualizacao_email
       SET status = 'negado', analisado_em = now(), analisado_por = $2
       WHERE id = $1 AND status = 'pendente'`,
      [id, req.adminId]
    );

    if (rowCount === 0) {
      return res.status(404).json({ erro: 'Solicitação não encontrada ou já processada.' });
    }

    return res.json({ ok: true });

  } catch (err) {
    console.error('[admin/solicitacao-email/negar]', err);
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

// ─── START ────────────────────────────────────────────────────────────────────
// FIX #5: app.listen condicional — obrigatório para Vercel (serverless)
// Em serverless, o módulo é importado diretamente — listen nunca é chamado.
// Localmente (node server.js), listen funciona normalmente.

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`SiMone API rodando na porta ${PORT}`));
}

module.exports = app;
