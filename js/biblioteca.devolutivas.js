// ════════════════════════════════════════════════════════════════
// biblioteca.devolutivas.js
// SiMone V24 — Biblioteca de devolutivas clínicas padronizadas
// ════════════════════════════════════════════════════════════════
//
// Cada entrada segue o contrato:
//   categoria .............. 'principal' | 'complementar' | 'modulador_longitudinal' | 'tecnico' | 'especial'
//   ativo .................. true se o estado está habilitado para uso clínico
//   usar_como_principal .... true se pode ser a assinatura primária da sessão
//   requer_longitudinal .... true se a devolutiva longitudinal exige ≥2 sessões
//   bloqueia_leitura_clinica true se o estado impede geração de devolutiva clínica
//   confiabilidade_reduzida  true se o resultado deve ser interpretado com cautela
//   sintese ................ frase-síntese da devolutiva (modo curto)
//   interpretacao .......... leitura expandida do estado
//   implicacoes ............ o que esse estado pode indicar funcionalmente
//   limites ................ o que esse estado NÃO diz
//   conduta ................ ação prática sugerida
//   longitudinal ........... texto da leitura longitudinal (quando sessoes ≥ 2)
//   _alerta ................ string de alerta clínico (ou null)
//
// ════════════════════════════════════════════════════════════════

var devolutivas = {

  // ────────────────────────────────────────────────
  // ESTADOS TÉCNICOS / ESPECIAIS
  // ────────────────────────────────────────────────

  inconsistencia_tecnica: {
    categoria: 'tecnico',
    ativo: true,
    usar_como_principal: false,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: true,
    confiabilidade_reduzida: true,
    sintese: 'Não foi possível gerar uma leitura funcional.',
    interpretacao: 'Os dados recebidos apresentaram inconsistência técnica que impediu a classificação.',
    implicacoes: 'Nenhuma leitura clínica pode ser derivada desta sessão.',
    limites: 'Este resultado não reflete o estado funcional da pessoa.',
    conduta: 'Verificar se todas as respostas foram registradas corretamente e repetir a avaliação.',
    longitudinal: null,
    _alerta: null
  },

  ausencia_de_sinal: {
    categoria: 'especial',
    ativo: true,
    usar_como_principal: false,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: true,
    confiabilidade_reduzida: true,
    sintese: 'Nenhum sinal de carga funcional foi registrado.',
    interpretacao: 'Todas as respostas indicaram ausência total de interferência. Isso pode refletir um estado real de baixa exigência, mas também pode indicar desatenção, pressa ou desconexão com o instrumento.',
    implicacoes: 'A ausência completa de sinal é rara e deve ser interpretada com cautela.',
    limites: 'Não é possível distinguir entre ausência real de carga e falta de engajamento com o instrumento.',
    conduta: 'Observar se o padrão se repete em sessões futuras. Se persistir, considerar conversa sobre o processo de resposta.',
    longitudinal: null,
    _alerta: null
  },

  // ────────────────────────────────────────────────
  // ESTADOS LEVES
  // ────────────────────────────────────────────────

  carga_leve_uniforme: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Hoje tudo parece estar mais lento.',
    interpretacao: 'As coisas estão acontecendo, porém mais devagar do que o normal. A carga é baixa e distribuída igualmente entre todos os eixos.',
    implicacoes: 'Pode indicar início de fadiga acumulada ou simplesmente um dia de menor energia.',
    limites: 'Não indica comprometimento funcional. É uma leitura de ritmo, não de risco.',
    conduta: 'Pode ajudar diminuir o ritmo e fazer menos tarefas hoje.',
    longitudinal: 'Se o padrão de lentidão uniforme se repete, pode indicar fadiga acumulada que ainda não se diferenciou em eixo específico.',
    _alerta: null
  },

  leve_difuso: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Funcionamento leve e irregular.',
    interpretacao: 'Hoje as coisas funcionam, mas sem muita consistência. Você consegue fazer, mas com variação ao longo do dia. Em alguns momentos flui, em outros não.',
    implicacoes: 'A irregularidade pode dificultar a sustentação de tarefas mais longas.',
    limites: 'Não indica comprometimento. É uma leitura de consistência, não de gravidade.',
    conduta: 'Pode ajudar escolher poucas tarefas e manter um ritmo mais constante.',
    longitudinal: 'Se a irregularidade persiste ao longo das sessões, vale investigar o que varia entre os dias.',
    _alerta: null
  },

  leve_com_corpo_baixo: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Sua mente quer seguir, mas seu corpo não acompanha.',
    interpretacao: 'Você consegue pensar e se organizar, mas na hora de agir falta energia. Isso faz com que tudo custe mais do que deveria ao longo do dia.',
    implicacoes: 'Pode indicar sono insuficiente, sedentarismo ou início de adoecimento físico.',
    limites: 'Não indica problema emocional ou cognitivo. O corpo está pedindo atenção.',
    conduta: 'Deite-se mais cedo hoje e tente relaxar para dormir melhor. Agora o mais importante é reduzir o esforço físico.',
    longitudinal: 'Se o corpo permanece como ponto de menor recurso, pode indicar necessidade de atenção à saúde física.',
    _alerta: null
  },

  leve_com_mente_baixa: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Hoje está difícil pensar com clareza.',
    interpretacao: 'Seu pensamento está mais lento. Isso dificulta organizar e decidir o que fazer.',
    implicacoes: 'Pode indicar sobrecarga cognitiva, falta de sono ou excesso de estímulos.',
    limites: 'Não indica comprometimento grave. É uma leitura de disponibilidade cognitiva no momento.',
    conduta: 'Pode ajudar escolher fazer tarefas simples hoje.',
    longitudinal: 'Se a clareza mental permanece como ponto mais fraco, vale avaliar padrões de sono e carga cognitiva.',
    _alerta: null
  },

  leve_com_acao_baixa: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Está difícil fazer qualquer coisa.',
    interpretacao: 'Você sabe o que precisa fazer, mas não transforma isso em ação de verdade.',
    implicacoes: 'Pode indicar desmotivação pontual ou resistência a tarefas específicas.',
    limites: 'Não indica incapacidade. É uma leitura de iniciativa, não de competência.',
    conduta: 'Escolha algo fácil para começar e foque no agora, sem se preocupar com outras tarefas.',
    longitudinal: 'Se a dificuldade de agir persiste, pode ser sinal de que algo mais profundo está travando a iniciativa.',
    _alerta: null
  },

  leve_com_proposito_baixo: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Hoje está leve, mas sem muito sentido.',
    interpretacao: 'As coisas acontecem, mas sem envolvimento. Isso pode levar a desengajamento ao longo do tempo.',
    implicacoes: 'Pode indicar desconexão com as atividades atuais ou fase de transição.',
    limites: 'Não indica perda de propósito estrutural. É uma leitura pontual de conexão.',
    conduta: 'Escolha algo pequeno que faça sentido para você hoje.',
    longitudinal: 'Se o propósito permanece como ponto mais fraco, vale refletir sobre o alinhamento entre o que você faz e o que importa para você.',
    _alerta: null
  },

  // ────────────────────────────────────────────────
  // ESTADOS MODERADOS
  // ────────────────────────────────────────────────

  carga_difusa: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Tudo exige esforço para acontecer, até nas coisas simples.',
    interpretacao: 'Hoje tudo exige esforço para acontecer. Mesmo as coisas simples precisam de mais energia do que o normal. A carga está distribuída sem um ponto dominante claro.',
    implicacoes: 'A distribuição uniforme pode mascarar o início de uma sobrecarga localizada.',
    limites: 'Não indica qual eixo vai ceder primeiro. É uma leitura de carga geral, não de vulnerabilidade.',
    conduta: 'Pode ajudar manter apenas o necessário e evitar começar coisas novas.',
    longitudinal: 'Se a carga difusa se mantém ao longo das sessões, pode indicar sobrecarga crônica sem ponto de alívio.',
    _alerta: null
  },

  sentir_dominante: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Hoje o que você está sentindo está pesando mais do que o normal.',
    interpretacao: 'O que você está sentindo está influenciando suas decisões e ações. Isso pode mudar o rumo do dia sem você perceber.',
    implicacoes: 'O emocional pode estar comandando escolhas que deveriam ser funcionais.',
    limites: 'Não indica transtorno emocional. É uma leitura de predominância, não de patologia.',
    conduta: 'Antes de tomar decisão, pode ajudar parar um instante e perceber como você está se sentindo.',
    longitudinal: 'Se o eixo Sentir permanece dominante, vale investigar fontes de carga emocional persistentes.',
    _alerta: null
  },

  organizar_dominante: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Você está tentando organizar tudo para dar conta do dia.',
    interpretacao: 'Sua atenção está muito voltada para organizar, planejar ou controlar. Isso ajuda em parte, mas pode travar a ação.',
    implicacoes: 'Excesso de planejamento pode ser sinal de ansiedade ou tentativa de controlar o que não se consegue executar.',
    limites: 'Não indica desorganização. Na verdade, indica excesso de tentativa de organização.',
    conduta: 'Pode ajudar parar de organizar por um momento e iniciar uma tarefa simples.',
    longitudinal: 'Se Organizar permanece dominante, pode indicar padrão de controle como estratégia de enfrentamento.',
    _alerta: null
  },

  agir_dominante: {
    categoria: 'principal',
    ativo: false,
    usar_como_principal: false,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Hoje está mais difícil fazer as coisas acontecerem.',
    interpretacao: 'Você sabe o que fazer, mas não consegue começar. A tarefa fica parada mesmo sendo óbvia e simples.',
    implicacoes: 'Pode indicar resistência, evitação ou esgotamento de iniciativa.',
    limites: 'Não indica preguiça ou falta de vontade. É uma leitura de custo de ativação.',
    conduta: 'Tente começar por algo bem simples. Dar o primeiro passo já é uma vitória hoje.',
    longitudinal: 'Se Agir permanece dominante, vale investigar se há padrão de evitação ou se o custo de ativação está cronicamente alto.',
    _alerta: null
  },

  proposito_dominante: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Mesmo com dificuldade, você continua porque isso importa.',
    interpretacao: 'O que você faz tem peso para você. Isso sustenta o movimento, mesmo com esforço.',
    implicacoes: 'O propósito está funcionando como motor, mas pode mascarar desgaste acumulado.',
    limites: 'Não indica que o esforço é sustentável. O sentido mantém, mas não protege do esgotamento.',
    conduta: 'Mantenha o ritmo, mas sem ultrapassar seus limites.',
    longitudinal: 'Se Propósito permanece dominante com carga alta, o risco de esgotamento por excesso de sentido aumenta.',
    _alerta: null
  },

  ruminacao_sem_acao: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Os pensamentos estão repetitivos.',
    interpretacao: 'Você fica voltando nas mesmas ideias e possibilidades, mas não sai disso. O dia não avança porque tudo fica sendo revisado.',
    implicacoes: 'Ruminação consome energia cognitiva e bloqueia a ação. Pode estar associada a ansiedade ou indecisão.',
    limites: 'Não indica transtorno obsessivo. É uma leitura de padrão cognitivo, não de diagnóstico.',
    conduta: 'Pode ajudar escolher uma decisão simples e executar sem revisar. Apenas fazer.',
    longitudinal: 'Se a ruminação se repete, pode indicar padrão ansioso que se beneficiaria de atenção clínica.',
    _alerta: null
  },

  atropelo_sem_ordem: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Está tudo acontecendo ao mesmo tempo, sem muita ordem.',
    interpretacao: 'Está tudo acontecendo ao mesmo tempo, de forma aleatória. A ação acontece, mas sem direção.',
    implicacoes: 'Pode indicar impulsividade funcional ou tentativa de compensar a falta de clareza com movimento.',
    limites: 'Não indica descontrole. É uma leitura de desalinhamento entre ação e organização.',
    conduta: 'Pode ajudar parar o que está difícil agora e retomar apenas uma tarefa.',
    longitudinal: 'Se o atropelo persiste, vale investigar se há padrão de hiperativação ou fuga para a ação.',
    _alerta: null
  },

  // ────────────────────────────────────────────────
  // ESTADOS ALTOS
  // ────────────────────────────────────────────────

  falso_funcional: {
    categoria: 'complementar',
    ativo: true,
    usar_como_principal: false,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: true,
    sintese: 'Parece que está tudo bem, mas está exigindo mais do que parece.',
    interpretacao: 'Por fora você segue funcionando, mas tudo está exigindo mais do que parece. Isso vai se acumulando sem chamar atenção.',
    implicacoes: 'O maior risco do falso funcional é justamente parecer que não há risco. A pessoa mantém a performance enquanto o custo interno cresce.',
    limites: 'Não indica que a pessoa está bem. Indica que a pessoa parece estar bem.',
    conduta: 'Diminua um pouco seu ritmo. Vá mais devagar e inclua pequenas pausas. Isso ajuda a não esgotar sua energia.',
    longitudinal: 'Se o padrão de falso funcional se repete, o risco de colapso aumenta porque a pessoa não recebe sinais de alerta.',
    _alerta: null
  },

  carga_alta_uniforme: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Parece que hoje você está no seu limite.',
    interpretacao: 'Tudo está exigindo muito de você, mas você ainda está conseguindo dar conta. Isso mantém o dia andando, mas com desgaste alto.',
    implicacoes: 'O limite funcional está próximo. Qualquer aumento de demanda pode desestabilizar.',
    limites: 'Não indica colapso. Indica proximidade do limite.',
    conduta: 'Pode ajudar diminuir o ritmo hoje e não assumir novas tarefas. Vale fazer uma pausa antes de seguir.',
    longitudinal: 'Se a carga alta uniforme persiste, o sistema está operando próximo do limite de forma crônica.',
    _alerta: null
  },

  sobrecarga_emocional: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'O que você está sentindo agora está interferindo no seu dia.',
    interpretacao: 'O que você está sentindo começa a influenciar suas decisões. Você muda o que faz ao longo do dia sem perceber.',
    implicacoes: 'A carga emocional pode estar comprometendo a capacidade de decisão e execução.',
    limites: 'Não indica transtorno emocional. Indica que o emocional está consumindo recursos que deveriam ir para outras funções.',
    conduta: 'Foque apenas no essencial e evite o que te desgasta hoje. Um ambiente mais silencioso pode ajudar a recuperar o fôlego.',
    longitudinal: 'Se a sobrecarga emocional se repete, pode indicar fonte de estresse persistente que precisa de atenção.',
    _alerta: null
  },

  sobrecarga_organizacional: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Hoje está difícil organizar suas tarefas.',
    interpretacao: 'Você tem várias coisas para fazer, mas não consegue definir uma ordem. Isso faz você começar várias e terminar poucas.',
    implicacoes: 'A sobrecarga organizacional pode gerar sensação de improdutividade mesmo com esforço alto.',
    limites: 'Não indica falta de capacidade. Indica excesso de demanda sobre a capacidade organizacional.',
    conduta: 'Pode ajudar escolher uma tarefa para fazer e ignorar o que não for importante agora.',
    longitudinal: 'Se a sobrecarga organizacional persiste, vale avaliar se o volume de demandas é compatível com os recursos disponíveis.',
    _alerta: null
  },

  sobrecarga_de_acao: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Hoje está mais difícil fazer as coisas acontecerem.',
    interpretacao: 'Você consegue fazer, mas tudo exige mais esforço do que deveria. Isso reduz o ritmo e aumenta o cansaço ao longo do dia.',
    implicacoes: 'O custo de cada ação está elevado. O dia rende menos e cansa mais.',
    limites: 'Não indica incapacidade de agir. Indica que agir está custando mais do que deveria.',
    conduta: 'Dê um descanso à sua lista de tarefas e faça apenas o que não pode esperar.',
    longitudinal: 'Se a sobrecarga de ação persiste, pode indicar esgotamento motor progressivo.',
    _alerta: null
  },

  baixo_sentido: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'O que você está fazendo não está sustentando seu esforço.',
    interpretacao: 'Mesmo com esforço alto, falta conexão com o que você está fazendo. Isso aumenta desgaste e reduz sustentação ao longo do tempo.',
    implicacoes: 'A falta de sentido é um dos fatores que mais acelera o esgotamento funcional.',
    limites: 'Não indica depressão. Indica desconexão entre esforço e significado.',
    conduta: 'Hoje vale reduzir o que não faz sentido e focar apenas no que vale.',
    longitudinal: 'Se o baixo sentido persiste, pode indicar desalinhamento crônico entre atividade e propósito pessoal.',
    _alerta: null
  },

  sobrecarga_com_sentido: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'O dia está mais exigente, mas você continua porque isso ainda faz sentido para você.',
    interpretacao: 'Você continua porque isso importa para você. Mesmo assim, o cansaço vai se acumulando aos poucos.',
    implicacoes: 'O propósito sustenta o movimento, mas não elimina o desgaste. Risco de esgotamento por excesso de dedicação.',
    limites: 'Não indica que a pessoa deveria parar. Indica que deveria modular o ritmo.',
    conduta: 'Diminua o ritmo hoje e pare por um tempo para se recompor.',
    longitudinal: 'Se a sobrecarga com sentido persiste, o propósito pode estar mascarando esgotamento progressivo.',
    _alerta: null
  },

  limite_funcional: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Agora está difícil organizar o pensamento.',
    interpretacao: 'Sua capacidade de analisar e decidir está baixa. Quanto mais você tenta pensar, mais confuso fica.',
    implicacoes: 'O sistema está operando no limite. A capacidade de decisão está comprometida.',
    limites: 'Não indica incapacidade permanente. Indica esgotamento de recursos neste momento.',
    conduta: 'Pode ajudar adiar decisões que não sejam necessárias agora. Vale parar um momento antes de continuar.',
    longitudinal: 'Se o limite funcional se repete, o sistema não está conseguindo se recuperar entre as sessões.',
    _alerta: null
  },

  // ────────────────────────────────────────────────
  // ESTADOS CRÍTICOS
  // ────────────────────────────────────────────────

  saturacao_maxima: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Hoje tudo está no máximo. Não dá para sustentar assim.',
    interpretacao: 'Seu corpo, sua mente e sua ação estão todos no limite ao mesmo tempo. Não é só esforço alto. Tudo está no máximo ao mesmo tempo. Continuar assim tende a aumentar o desgaste.',
    implicacoes: 'Saturação máxima é o estado de maior risco funcional. Todos os recursos estão esgotados simultaneamente.',
    limites: 'Não é diagnóstico. É uma leitura de estado que indica necessidade imediata de redução de carga.',
    conduta: 'Pode ajudar parar o que não for essencial, reduzir estímulos e buscar um ambiente mais calmo.',
    longitudinal: 'Se a saturação máxima se repete, o sistema está em colapso crônico e requer intervenção.',
    _alerta: 'Estado de saturação máxima. Todos os eixos no limite simultâneo. Avaliar necessidade de suporte imediato.'
  },

  colapso_global: {
    categoria: 'principal',
    ativo: true,
    usar_como_principal: true,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'Agora o que está sendo exigido está além do que você consegue dar conta.',
    interpretacao: 'Seu corpo e sua mente estão no limite. Continuar nesse ritmo vai aumentar o desgaste.',
    implicacoes: 'Colapso global indica que o sistema funcional ultrapassou sua capacidade de sustentação.',
    limites: 'Não indica colapso permanente. Indica estado agudo que requer proteção imediata.',
    conduta: 'Hoje vale reduzir exigências e proteger sua energia.',
    longitudinal: 'Se o colapso global se repete, o sistema não está se recuperando e a situação requer atenção profissional.',
    _alerta: 'Estado de colapso global. Carga acima de 3.2 em todos os eixos. Avaliar suporte e redução de demandas.'
  },

  // ────────────────────────────────────────────────
  // MODULADORES LONGITUDINAIS
  // ────────────────────────────────────────────────

  melhora_funcional: {
    categoria: 'modulador_longitudinal',
    ativo: true,
    usar_como_principal: false,
    requer_longitudinal: true,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'A carga global apresenta redução em relação às sessões anteriores.',
    interpretacao: 'Os indicadores mostram redução da carga funcional. Isso pode refletir recuperação, mudança de contexto ou adaptação.',
    implicacoes: 'A melhora pode ser transitória ou consolidada. Requer acompanhamento para confirmar tendência.',
    limites: 'Melhora funcional não significa ausência de carga. Significa redução relativa.',
    conduta: 'Manter as condições que estão favorecendo a recuperação.',
    longitudinal: 'A tendência é de redução da carga global. Manter acompanhamento para verificar se a melhora se sustenta.',
    _alerta: null
  },

  piora_funcional: {
    categoria: 'modulador_longitudinal',
    ativo: true,
    usar_como_principal: false,
    requer_longitudinal: true,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'A carga global apresenta aumento em relação às sessões anteriores.',
    interpretacao: 'Os indicadores mostram aumento da carga funcional. Isso pode refletir aumento de demandas, perda de recursos ou agravamento.',
    implicacoes: 'A piora pode indicar necessidade de intervenção ou ajuste de demandas.',
    limites: 'Piora funcional não significa colapso. Significa aumento relativo de carga.',
    conduta: 'Avaliar o que mudou entre as sessões e considerar redução de demandas.',
    longitudinal: 'A tendência é de aumento da carga global. Requer atenção para evitar evolução para estados críticos.',
    _alerta: null
  },

  oscilacao_funcional: {
    categoria: 'modulador_longitudinal',
    ativo: true,
    usar_como_principal: false,
    requer_longitudinal: true,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'A carga global oscila significativamente entre as sessões.',
    interpretacao: 'Não há tendência clara de melhora ou piora. O sistema alterna entre estados mais e menos exigidos.',
    implicacoes: 'A oscilação pode indicar instabilidade de contexto ou dificuldade de regulação.',
    limites: 'Oscilação não indica gravidade por si só. Indica variabilidade que merece acompanhamento.',
    conduta: 'Observar os fatores que coincidem com os picos e vales de carga.',
    longitudinal: 'O padrão é de oscilação sem tendência definida. Investigar fontes de variabilidade.',
    _alerta: null
  },

  // ────────────────────────────────────────────────
  // ESTADOS FUNDIDOS / INATIVOS (não usados diretamente)
  // ────────────────────────────────────────────────

  sobrecarga_distribuida: {
    categoria: 'principal',
    ativo: false,
    usar_como_principal: false,
    requer_longitudinal: false,
    bloqueia_leitura_clinica: false,
    confiabilidade_reduzida: false,
    sintese: 'A carga está distribuída sem vetor dominante.',
    interpretacao: 'Todos os eixos estão sob pressão semelhante. Não há um ponto que concentre a exigência.',
    implicacoes: 'Pode ser absorvido por carga_difusa ou limite_funcional dependendo da intensidade.',
    limites: 'Estado fundido com outros. Não deve ser usado isoladamente.',
    conduta: 'Avaliar pela intensidade global se é carga difusa moderada ou limite funcional alto.',
    longitudinal: null,
    _alerta: null
  }
};
