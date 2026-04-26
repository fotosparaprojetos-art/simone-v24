-- ─── SiMone V24 · Migration 003 ─────────────────────────────────────────────
-- Tabelas core do sistema: profissionais, questionados, autorizacoes, resultados
-- Execute na ordem abaixo.

-- 1. profissionais
CREATE TABLE IF NOT EXISTS profissionais (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  crm         text        UNIQUE NOT NULL,
  nome        text        NOT NULL,
  email       text,
  senha_hash  text        NOT NULL,
  perfil      text        NOT NULL DEFAULT 'profissional'
                          CHECK (perfil IN ('profissional','admin')),
  criado_em   timestamptz NOT NULL DEFAULT now()
);

-- 2. questionados
CREATE TABLE IF NOT EXISTS questionados (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_questionado  text        UNIQUE NOT NULL,
  criado_em           timestamptz NOT NULL DEFAULT now()
);

-- 3. autorizacoes (relaciona profissional ↔ questionado via token)
CREATE TABLE IF NOT EXISTS autorizacoes (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  questionado_id      uuid        NOT NULL REFERENCES questionados(id) ON DELETE CASCADE,
  crm                 text        NOT NULL,
  token_autorizacao   text        NOT NULL,
  criado_em           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (questionado_id, crm)
);

CREATE INDEX IF NOT EXISTS idx_aut_crm           ON autorizacoes (crm);
CREATE INDEX IF NOT EXISTS idx_aut_token         ON autorizacoes (token_autorizacao);
CREATE INDEX IF NOT EXISTS idx_aut_questionado   ON autorizacoes (questionado_id);

-- 4. resultados (output do /avaliar — colunas que o server.js grava e o painel lê)
CREATE TABLE IF NOT EXISTS resultados (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  questionado_id  uuid        NOT NULL REFERENCES questionados(id) ON DELETE CASCADE,
  eixos           jsonb       NOT NULL,   -- { S, O, A, P, G }
  gravidade       text,                   -- leve | moderado | elevado | grave
  assinatura      text,                   -- ex: "SA", "OP"
  flags           jsonb       DEFAULT '[]'::jsonb,
  criado_em       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_res_questionado ON resultados (questionado_id);
CREATE INDEX IF NOT EXISTS idx_res_criado_em   ON resultados (criado_em DESC);

-- 5. leituras_longitudinais (opcional — painel lê se existir)
CREATE TABLE IF NOT EXISTS leituras_longitudinais (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  questionado_id  uuid        NOT NULL REFERENCES questionados(id) ON DELETE CASCADE,
  texto           text        NOT NULL,
  criado_em       timestamptz NOT NULL DEFAULT now()
);
