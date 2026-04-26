-- ─── SiMone V24 · Seed de Teste ──────────────────────────────────────────────
-- Dados mínimos para validar o fluxo ponta a ponta.
-- NÃO use em produção com dados reais.
--
-- Senha de teste: SiMone@2024
-- Gere o hash correto com:
--   node -e "require('bcrypt').hash('SiMone@2024',12).then(console.log)"
-- e substitua o valor abaixo antes de rodar.

-- 1. Profissional com perfil admin (para testar admin_email.html)
INSERT INTO profissionais (id, crm, nome, email, senha_hash, perfil)
VALUES (
  gen_random_uuid(),
  '123456',
  'Dr. Teste Admin',
  'admin@simone.com',
  '$2b$12$SUBSTITUA_PELO_HASH_REAL_GERADO_LOCALMENTE',
  'admin'
) ON CONFLICT (crm) DO NOTHING;

-- 2. Profissional comum (para testar login e painel)
INSERT INTO profissionais (id, crm, nome, email, senha_hash, perfil)
VALUES (
  gen_random_uuid(),
  '654321',
  'Dra. Teste Profissional',
  'prof@simone.com',
  '$2b$12$SUBSTITUA_PELO_HASH_REAL_GERADO_LOCALMENTE',
  'profissional'
) ON CONFLICT (crm) DO NOTHING;

-- 3. Questionado de teste
INSERT INTO questionados (id, codigo_questionado)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'QTEST001'
) ON CONFLICT (codigo_questionado) DO NOTHING;

-- 4. Autorização: profissional 654321 pode ver QTEST001
INSERT INTO autorizacoes (questionado_id, crm, token_autorizacao)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '654321',
  'TOKEN-TESTE-001'
) ON CONFLICT (questionado_id, crm) DO NOTHING;

-- 5. Resultado de exemplo (para o painel não aparecer vazio)
INSERT INTO resultados (questionado_id, eixos, gravidade, assinatura, flags)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '{"S": 2.3, "O": 1.8, "A": 3.1, "P": 2.5, "G": 2.4}',
  'moderado',
  'AP',
  '[]'
) ON CONFLICT DO NOTHING;

-- ─── Como gerar o hash da senha ───────────────────────────────────────────────
-- node -e "require('bcrypt').hash('SiMone@2024', 12).then(h => console.log(h))"
-- Cole o resultado nos dois INSERTs de profissionais acima.
