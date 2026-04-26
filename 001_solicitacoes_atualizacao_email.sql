-- ─── SiMone V24 · Migration 001 ─────────────────────────────────────────────
-- Tabela de solicitações de atualização de e-mail (CRM)
-- Executar uma única vez contra o banco de produção.

CREATE TABLE IF NOT EXISTS solicitacoes_atualizacao_email (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  crm                   text        NOT NULL,
  email_antigo          text,
  email_novo            text        NOT NULL,
  nome_informado        text        NOT NULL,
  documento_informado   text        NOT NULL,
  status                text        NOT NULL DEFAULT 'pendente'
                                    CHECK (status IN ('pendente','aprovado','negado')),
  ip_solicitante        text,
  user_agent            text,
  criado_em             timestamptz NOT NULL DEFAULT now(),
  analisado_em          timestamptz,
  analisado_por         text
);

-- Impede múltiplas solicitações pendentes para o mesmo CRM.
-- O índice é parcial: ao aprovar/negar, o CRM pode abrir nova solicitação.
-- ATENÇÃO: o server.js referencia este índice pelo nome em ON CONFLICT.
-- Não renomeie sem atualizar também o server.js.
CREATE UNIQUE INDEX IF NOT EXISTS idx_sae_unico_pendente
  ON solicitacoes_atualizacao_email (crm)
  WHERE status = 'pendente';

CREATE INDEX IF NOT EXISTS idx_sae_crm    ON solicitacoes_atualizacao_email (crm);
CREATE INDEX IF NOT EXISTS idx_sae_status ON solicitacoes_atualizacao_email (status);
