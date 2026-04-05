// ════════════════════════════════════════════════════════════════
// obterDevolutiva.js
// SiMone V24 — Camada intermediária de devolutiva clínica
// ════════════════════════════════════════════════════════════════
//
// Recebe:  { estado, sessoes, dados_validos }
// Retorna: { sintese, interpretacao, implicacoes, limites, conduta,
//            longitudinal, _bloqueado, _categoria, _codigo, _alerta }
//
// Regras de decisão (nesta ordem):
//   1. Entrada inválida ou dados_validos !== true  → fallback técnico
//   2. Estado vazio ou não-string                  → fallback ausente
//   3. Estado não encontrado na biblioteca         → fallback ausente
//   4. Estado encontrado mas inativo               → fallback ausente (específico)
//   5. Estado que bloqueia leitura clínica          → bloqueado (inclui ausencia_de_sinal)
//   6. Modulador longitudinal                      → tratamento longitudinal
//   7. Estado complementar                         → devolutiva sem uso como principal
//   8. Estado principal                            → devolutiva completa
//   9. Normalização final                          → garante contrato completo
//
// Contrato: todo retorno garante os 10 campos preenchidos.
//           Nenhum campo clínico fica null por omissão da biblioteca.
//           longitudinal nunca é null.
//
// ════════════════════════════════════════════════════════════════

function obterDevolutiva(params) {

  // ── Constantes ──

  var BASELINE = 'Baseline \u2014 sem leitura longitudinal dispon\u00EDvel.';
  var LONGITUDINAL_INDISPONIVEL = 'Leitura longitudinal n\u00E3o dispon\u00EDvel.';

  // ── Estrutura de retorno padrão ──
  // Todos os 10 campos, sempre. Nunca retornar sem preencher.

  var retorno = {
    sintese:       null,
    interpretacao: null,
    implicacoes:   null,
    limites:       null,
    conduta:       null,
    longitudinal:  null,
    _bloqueado:    false,
    _categoria:    null,
    _codigo:       null,
    _alerta:       null
  };

  // ── Helper: preencher retorno a partir de entry da biblioteca ──
  // Garante que campos ausentes na biblioteca não fiquem null no retorno.

  function preencherRetorno(entry) {
    retorno.sintese       = entry.sintese       || 'Sem s\u00EDntese dispon\u00EDvel.';
    retorno.interpretacao = entry.interpretacao  || 'Sem interpreta\u00E7\u00E3o dispon\u00EDvel.';
    retorno.implicacoes   = entry.implicacoes    || 'Sem implica\u00E7\u00F5es registradas.';
    retorno.limites       = entry.limites        || 'Sem limites registrados.';
    retorno.conduta       = entry.conduta        || 'Sem conduta sugerida.';
    retorno._alerta       = entry._alerta        || null;
  }

  // ── Helper: resolver longitudinal com base em sessões e entry ──

  function resolverLongitudinal(entry) {
    if (sessoes < 2) {
      retorno.longitudinal = BASELINE;
      return;
    }
    retorno.longitudinal = entry.longitudinal || LONGITUDINAL_INDISPONIVEL;
  }

  // ── Helper: normalizador final ──
  // Última linha de defesa. Garante que nenhum campo saia vazio
  // mesmo que um caminho futuro esqueça de preencher.

  function normalizar(r) {
    r.sintese       = r.sintese       || 'Sem s\u00EDntese dispon\u00EDvel.';
    r.interpretacao = r.interpretacao  || 'Sem interpreta\u00E7\u00E3o dispon\u00EDvel.';
    r.implicacoes   = r.implicacoes    || 'Sem implica\u00E7\u00F5es registradas.';
    r.limites       = r.limites        || 'Sem limites registrados.';
    r.conduta       = r.conduta        || 'Sem conduta sugerida.';
    r.longitudinal  = r.longitudinal   || BASELINE;
    r._categoria    = r._categoria     || 'ausente';
    r._codigo       = (typeof r._codigo === 'string' && r._codigo.trim() !== '') ? r._codigo : null;
    r._alerta       = r._alerta        || null;
    return r;
  }

  // ════════════════════════════════════════════════════════════════
  // 1. VALIDAÇÃO DE ENTRADA
  // ════════════════════════════════════════════════════════════════

  if (!params || typeof params !== 'object') {
    retorno._bloqueado    = true;
    retorno._categoria    = 'tecnico';
    retorno._codigo       = null;
    retorno.sintese       = 'Par\u00E2metros inv\u00E1lidos.';
    retorno.interpretacao = 'A fun\u00E7\u00E3o recebeu entrada nula ou malformada.';
    retorno.implicacoes   = 'Nenhuma leitura cl\u00EDnica pode ser derivada.';
    retorno.limites       = 'Resultado descartado por falha t\u00E9cnica.';
    retorno.conduta       = 'Verificar a chamada e reenviar com par\u00E2metros v\u00E1lidos.';
    retorno.longitudinal  = BASELINE;
    return normalizar(retorno);
  }

  var estado = params.estado;
  var sessoes = (typeof params.sessoes === 'number') ? params.sessoes : 0;
  var dados_validos = params.dados_validos === true;

  retorno._codigo = (typeof estado === 'string' && estado.trim() !== '') ? estado : null;

  // ════════════════════════════════════════════════════════════════
  // 2. DADOS NÃO VÁLIDOS → FALLBACK TÉCNICO
  // ════════════════════════════════════════════════════════════════

  if (!dados_validos) {
    retorno._bloqueado    = true;
    retorno._categoria    = 'tecnico';
    retorno.sintese       = 'Dados insuficientes para gerar devolutiva.';
    retorno.interpretacao = 'Os dados da sess\u00E3o n\u00E3o passaram na valida\u00E7\u00E3o de integridade.';
    retorno.implicacoes   = 'Nenhuma leitura cl\u00EDnica pode ser derivada desta sess\u00E3o.';
    retorno.limites       = 'Resultado descartado por falha de valida\u00E7\u00E3o.';
    retorno.conduta       = 'Repetir a avalia\u00E7\u00E3o garantindo que todas as respostas sejam registradas.';
    retorno.longitudinal  = BASELINE;
    return normalizar(retorno);
  }

  // ════════════════════════════════════════════════════════════════
  // 3. ESTADO VAZIO OU NÃO-STRING → FALLBACK AUSENTE
  // ════════════════════════════════════════════════════════════════

  if (!estado || typeof estado !== 'string' || estado.trim() === '') {
    retorno._bloqueado    = false;
    retorno._categoria    = 'ausente';
    retorno._codigo       = null;
    retorno.sintese       = 'Nenhum estado funcional identificado.';
    retorno.interpretacao = 'O motor n\u00E3o retornou um c\u00F3digo de estado v\u00E1lido.';
    retorno.implicacoes   = 'Sem c\u00F3digo de estado, nenhuma leitura funcional pode ser produzida.';
    retorno.limites       = 'Este resultado n\u00E3o representa uma avalia\u00E7\u00E3o funcional.';
    retorno.conduta       = 'Verificar o motor de classifica\u00E7\u00E3o.';
    retorno.longitudinal  = BASELINE;
    return normalizar(retorno);
  }

  // ════════════════════════════════════════════════════════════════
  // 4. BUSCAR NA BIBLIOTECA
  // ════════════════════════════════════════════════════════════════

  var entry = (typeof devolutivas !== 'undefined' && devolutivas[estado])
    ? devolutivas[estado]
    : null;

  // ── 4a. Estado não existe na biblioteca ──

  if (!entry) {
    retorno._bloqueado    = false;
    retorno._categoria    = 'ausente';
    retorno.sintese       = 'Estado n\u00E3o encontrado na biblioteca: ' + estado + '.';
    retorno.interpretacao = 'O c\u00F3digo \u201C' + estado + '\u201D n\u00E3o possui entrada cadastrada na biblioteca de devolutivas.';
    retorno.implicacoes   = 'O motor gerou um c\u00F3digo que a biblioteca n\u00E3o reconhece.';
    retorno.limites       = 'Pode indicar vers\u00E3o desatualizada da biblioteca ou c\u00F3digo novo sem mapeamento.';
    retorno.conduta       = 'Revisar o mapeamento motor \u2194 biblioteca.';
    retorno.longitudinal  = BASELINE;
    return normalizar(retorno);
  }

  // ── 4b. Estado existe mas está inativo ──

  if (entry.ativo === false) {
    retorno._bloqueado    = false;
    retorno._categoria    = 'ausente';
    retorno.sintese       = 'Estado desativado: ' + estado + '.';
    retorno.interpretacao = 'O estado \u201C' + estado + '\u201D est\u00E1 cadastrado na biblioteca mas marcado como inativo.';
    retorno.implicacoes   = 'Este estado pode ter sido fundido com outro ou descontinuado.';
    retorno.limites       = 'N\u00E3o gera devolutiva cl\u00EDnica enquanto permanecer inativo.';
    retorno.conduta       = 'Verificar se o estado foi absorvido por outra classifica\u00E7\u00E3o.';
    retorno.longitudinal  = BASELINE;
    return normalizar(retorno);
  }

  // ════════════════════════════════════════════════════════════════
  // 5. ESTADO QUE BLOQUEIA LEITURA CLÍNICA
  // ════════════════════════════════════════════════════════════════
  //
  // Inclui ausencia_de_sinal (categoria 'especial') e inconsistencia_tecnica
  // (categoria 'tecnico'). A categoria vem da biblioteca, não de hardcode.
  // longitudinal = BASELINE: não há leitura longitudinal processável.
  //

  if (entry.bloqueia_leitura_clinica) {
    retorno._bloqueado = true;
    retorno._categoria = entry.categoria || 'tecnico';
    preencherRetorno(entry);
    retorno.longitudinal = BASELINE;
    return normalizar(retorno);
  }

  // ════════════════════════════════════════════════════════════════
  // 6. MODULADOR LONGITUDINAL
  // ════════════════════════════════════════════════════════════════
  //
  // Moduladores não são estados funcionais da sessão.
  // São leituras derivadas da comparação entre sessões.
  // Por isso:
  //   - nunca são usados como assinatura principal
  //   - requerem ≥2 sessões para gerar texto longitudinal
  //   - com <2 sessões: BASELINE (mesmo texto dos demais, por contrato)
  //

  if (entry.categoria === 'modulador_longitudinal') {
    retorno._categoria = 'modulador_longitudinal';
    preencherRetorno(entry);
    resolverLongitudinal(entry);
    return normalizar(retorno);
  }

  // ════════════════════════════════════════════════════════════════
  // 7. ESTADO COMPLEMENTAR
  // ════════════════════════════════════════════════════════════════
  //
  // Diferença para modulador:
  //   - complementar descreve condição funcional real (ex: falso funcional)
  //   - modulador descreve tendência longitudinal (ex: melhora/piora)
  //
  // Diferença para principal:
  //   - complementar nunca é assinatura primária da sessão
  //   - pode ter confiabilidade_reduzida (anotada no campo limites)
  //

  if (entry.categoria === 'complementar') {
    retorno._categoria = 'complementar';
    preencherRetorno(entry);

    if (entry.confiabilidade_reduzida) {
      retorno.limites = (retorno.limites || '') +
        (retorno.limites ? ' ' : '') +
        'Confiabilidade reduzida: este estado deve ser interpretado com cautela.';
    }

    resolverLongitudinal(entry);
    return normalizar(retorno);
  }

  // ════════════════════════════════════════════════════════════════
  // 8. ESTADO PRINCIPAL → DEVOLUTIVA COMPLETA
  // ════════════════════════════════════════════════════════════════

  // ── Proteção: estado que chegou aqui mas não deveria ser principal ──
  // Se a biblioteca marca usar_como_principal === false e a categoria
  // não é complementar nem modulador, é erro de configuração.
  // Reclassifica antes de preencher, não depois.

  if (entry.usar_como_principal === false) {
    retorno._categoria = 'ausente';
    preencherRetorno(entry);
    retorno.limites = (retorno.limites ? retorno.limites + ' ' : '') +
      'Estado marcado como n\u00E3o-principal na biblioteca. Verificar configura\u00E7\u00E3o.';
    resolverLongitudinal(entry);
    return normalizar(retorno);
  }

  retorno._categoria = entry.categoria || 'principal';
  preencherRetorno(entry);
  resolverLongitudinal(entry);

  return normalizar(retorno);
}
