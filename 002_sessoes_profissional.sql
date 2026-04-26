-- ─── SiMone V24 · Migration 002 ─────────────────────────────────────────────
-- Tabela de sessões — colunas exatas que o server.js espera.
-- Se a tabela já existir com estrutura diferente, use os ALTER TABLE abaixo.

-- OPÇÃO A: criar do zero (se não existir)
CREATE TABLE IF NOT EXISTS sessoes_profissional (
  token            text        PRIMARY KEY,
  profissional_id  uuid        NOT NULL,
  crm              text        NOT NULL,
  perfil           text        NOT NULL DEFAULT 'profissional',
  expira_em        timestamptz NOT NULL,
  criado_em        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessoes_crm        ON sessoes_profissional (crm);
CREATE INDEX IF NOT EXISTS idx_sessoes_expira_em  ON sessoes_profissional (expira_em);

-- OPÇÃO B: se a tabela já existe e faltam colunas, rode apenas o que falta:
-- ALTER TABLE sessoes_profissional ADD COLUMN IF NOT EXISTS profissional_id uuid;
-- ALTER TABLE sessoes_profissional ADD COLUMN IF NOT EXISTS perfil text DEFAULT 'profissional';
-- ALTER TABLE sessoes_profissional ADD COLUMN IF NOT EXISTS criado_em timestamptz DEFAULT now();

-- Limpeza automática de sessões expiradas (opcional — requer pg_cron no Supabase)
-- SELECT cron.schedule('limpar-sessoes', '0 * * * *',
--   $$DELETE FROM sessoes_profissional WHERE expira_em < now()$$);
