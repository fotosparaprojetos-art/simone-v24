// /js/biblioteca.devolutivas.js
// SiMone V24 — Biblioteca Completa de Devolutivas Clínicas
// Formato padrão profissional · Versão 24.1
// Linguagem clínica funcional · Sem nomes autorais na saída

var devolutivas = {

  // ===== LOTE 1 =====

  colapso_global: {
    sintese: "Comprometimento funcional severo em todos os domínios avaliados, sem eixo preservado.",
    interpretacao: "Os achados indicam comprometimento elevado e simultâneo nos eixos somático, emocional, cognitivo e de execução. A distribuição da carga não apresenta gradiente — todos os blocos operam em nível elevado sem área de reserva funcional identificável. O padrão sugere esgotamento sistêmico instalado, no qual a capacidade de resposta adaptativa está reduzida em múltiplas dimensões ao mesmo tempo. A presença de dificuldade de iniciação e de sustentação simultaneamente indica que o comprometimento não é apenas de capacidade, mas de acesso a essa capacidade.",
    implicacoes: "Qualquer proposta de intervenção que adicione demanda ao sistema pode intensificar a sobrecarga sem produzir ganho funcional. A ausência de eixo preservado reduz os recursos disponíveis para apoiar a mudança. O risco de manutenção ou agravamento do padrão é elevado sem redução ativa da carga.",
    limites: "Os dados refletem autorrelato em momento único. A intensidade percebida pode ser influenciada pelo estado emocional no momento do preenchimento. Avaliação longitudinal é necessária para distinguir estado agudo de padrão instalado.",
    conduta: "Priorizar redução de demanda antes de qualquer intervenção estruturada. Não propor aumento de atividade ou responsabilidade no período imediato. Identificar com o paciente qual eixo apresenta maior custo subjetivo como ponto de entrada. Reavaliar em até 7 dias."
  },

  sobrecarga_emocional: {
    sintese: "Comprometimento funcional com predomínio no eixo emocional, afetando regulação e recuperação.",
    interpretacao: "Os achados indicam carga concentrada no eixo emocional com valores relativamente menos elevados nos demais domínios. O padrão inclui irritabilidade presente, inquietação frequente, recuperação emocional lenta após abalos e interferência direta do estado emocional na execução de tarefas. Os achados sugerem que a sobrecarga emocional está funcionando como limitador secundário de outros eixos — a capacidade cognitiva e de execução pode estar disponível, mas com acesso reduzido pela carga emocional anterior.",
    implicacoes: "O comprometimento emocional pode ser interpretado pelo paciente como fraqueza ou instabilidade pessoal, aumentando o custo subjetivo do estado. Intervenções que não considerem o eixo emocional como ponto de entrada tendem a ter adesão reduzida. A recuperação lenta após abalos indica baixa resiliência emocional no momento — não ausência estrutural de recursos.",
    limites: "A distinção entre sobrecarga emocional reativa a contexto e padrão instalado não é possível apenas pelo questionário. O contexto recente do paciente é necessário para interpretar a origem da carga.",
    conduta: "Explorar com o paciente os principais geradores de carga emocional no período recente. Não avançar para demandas de organização ou execução enquanto o eixo emocional estiver com comprometimento elevado. Avaliar a capacidade de recuperação como indicador de progresso nas reavaliações seguintes."
  },

  desorganizacao_funcional: {
    sintese: "Comprometimento funcional com predomínio no eixo de organização, afetando priorização e sequenciamento.",
    interpretacao: "Os achados indicam carga concentrada nos blocos de organização e clareza, com dificuldade de definir prioridades, sequenciar tarefas e distinguir o que é urgente do que pode esperar. O padrão sugere que a capacidade de executar pode estar disponível, mas o acesso a ela está comprometido pela ausência de estrutura organizacional funcional. O movimento de organizar sem avançar — presente no bloco O2 — indica gasto de energia no processo de estruturação sem conversão em execução real.",
    implicacoes: "O paciente pode apresentar sensação de esforço elevado com resultado percebido baixo, o que tende a aumentar a carga emocional secundária. A dificuldade de priorização pode gerar paralisia por acúmulo de demandas equivalentes. Estruturação externa do ambiente pode liberar capacidade de execução já disponível.",
    limites: "O comprometimento de organização relatado pode refletir alta demanda situacional e não apenas limitação funcional interna. O contexto de vida atual do paciente é relevante para interpretar a intensidade do padrão.",
    conduta: "Reduzir o número de decisões simultâneas como primeira medida. Trabalhar estruturação externa antes de treino de organização interna. Identificar com o paciente uma única prioridade para o período até a próxima sessão. Reavaliar se o padrão se mantém após redução de demanda ambiental."
  },

  baixo_sentido: {
    sintese: "Comprometimento funcional com predomínio no eixo de sentido percebido, com redução da percepção de propósito nas atividades.",
    interpretacao: "Os achados indicam que o eixo de propósito apresenta comprometimento elevado em relação aos demais domínios. O padrão inclui percepção de que as atividades realizadas parecem sem sentido, desalinhamento entre o que se faz e o que se valoriza, ausência de motivo percebido e sensação de que o esforço não corresponde ao resultado produzido. Os achados sugerem que a capacidade funcional pode estar parcialmente preservada, mas sem sustentação de significado que a mobilize de forma consistente.",
    implicacoes: "A redução de sentido percebido tende a comprometer a adesão a qualquer processo terapêutico que não endereça diretamente esse eixo. O paciente pode apresentar execução funcional pontual sem continuidade, pela ausência de ancoragem de propósito. Intervenções voltadas para ativação de valores e reconexão com atividades significativas têm impacto direto nesse padrão.",
    limites: "A redução de sentido percebido é altamente sensível ao contexto atual do paciente. Períodos de transição, perda ou mudança de papel social podem amplificar temporariamente esse padrão sem que reflita estado funcional estrutural.",
    conduta: "Explorar com o paciente quais atividades ainda produzem algum nível de sentido, mesmo que reduzido. Não avançar para demandas de execução sem antes identificar um ponto de ancoragem de propósito. Considerar esse eixo como entrada preferencial quando o comprometimento de outros eixos for moderado."
  },

  agir_dominante: {
    sintese: "Padrão funcional com predominância de execução sobre capacidade de organização e regulação.",
    interpretacao: "Os achados indicam que os eixos de ação apresentam valores relativamente preservados enquanto os eixos cognitivo e emocional mostram comprometimento maior. O padrão sugere que o paciente mantém capacidade de executar e iniciar tarefas, mas com redução da capacidade de organizar, regular e avaliar o que está sendo feito. Esse desequilíbrio pode estar associado a padrão de ação como estratégia de regulação emocional — fazer para não sentir — ou a estilo funcional de alta execução com baixo processamento anterior.",
    implicacoes: "O padrão pode produzir sensação de produtividade com acúmulo silencioso de carga não processada. A execução mantida pode mascarar o comprometimento dos eixos cognitivo e emocional, atrasando a percepção da necessidade de intervenção. Interrupções forçadas na execução — por doença, sobrecarga ou mudança de rotina — podem expor a carga acumulada de forma abrupta.",
    limites: "A preservação dos eixos de ação no autorrelato pode ser influenciada por padrão de autoavaliação que valoriza execução e subestima custo emocional e cognitivo.",
    conduta: "Explorar com o paciente o custo real da execução mantida — não apenas o resultado produzido. Avaliar se a ação está funcionando como regulação emocional. Não reforçar o padrão de execução sem endereçar os eixos de organização e regulação. Reavaliar após período de redução intencional de demanda."
  },

  falso_funcional: {
    sintese: "Discrepância entre baixa carga global relatada e comprometimento elevado no eixo de execução e sentido percebido.",
    interpretacao: "Os achados indicam padrão de baixa carga global com alta variabilidade entre eixos — o G reduzido não reflete preservação funcional uniforme. O eixo de propósito apresenta comprometimento elevado enquanto os eixos de ação mostram dificuldade de execução desproporcional à carga somática e emocional relatada. Os achados sugerem que a baixa carga global pode estar associada a redução de percepção ou a estado de baixa ativação geral, no qual o paciente não registra a sobrecarga porque o sistema está operando abaixo do limiar de percepção. A variabilidade elevada entre eixos (Δ alto) indica padrão não uniforme — a aparente funcionalidade global oculta comprometimento seletivo relevante.",
    implicacoes: "O padrão pode ser interpretado equivocadamente como funcionalidade preservada tanto pelo paciente quanto pelo profissional. A dificuldade de execução presente sem carga elevada relatada sugere que o limitador não é a sobrecarga — é a ausência de mobilização funcional. Intervenções baseadas apenas no G total podem subestimar o comprometimento real.",
    limites: "Este padrão requer atenção especial à validade do autorrelato. A percepção reduzida pode ser resultado de estado dissociativo leve, baixa interoceptividade ou adaptação prolongada a funcionamento reduzido.",
    conduta: "Não interpretar o G baixo como indicador de boa funcionalidade sem considerar o Δ e os valores de P e A. Explorar com o paciente a percepção subjetiva de capacidade versus desempenho real. Avaliar longitudinalmente para verificar se o padrão se mantém ou se emerge comprometimento maior com o tempo."
  },

  // ===== LOTE 2 =====

  sobrecarga_cognitiva: {
    sintese: "Comprometimento funcional com predomínio no eixo cognitivo, afetando clareza mental, foco e processamento.",
    interpretacao: "Os achados indicam carga concentrada nos blocos de clareza mental e organização, com lentidão para compreender, pensamentos embaralhados, dispersão de atenção e dificuldade de sequenciar. Os eixos somático e de execução apresentam comprometimento menor, indicando que a capacidade de agir pode estar disponível mas com acesso limitado pela sobrecarga de processamento. Os achados podem estar associados a alta demanda informacional, privação de sono ou estado de ativação persistente do sistema de alerta.",
    implicacoes: "A capacidade funcional do paciente pode estar subestimada pela interferência cognitiva no autorrelato. Intervenções que reduzam a carga de decisão e estruturem o ambiente externo podem liberar capacidade já disponível. O comprometimento cognitivo tende a amplificar a percepção de incompetência mesmo quando a execução é tecnicamente possível.",
    limites: "A clareza mental é altamente sensível ao horário, à qualidade do sono recente e ao estado de ativação no momento do preenchimento. Variações entre sessões podem refletir flutuações contextuais.",
    conduta: "Reduzir demanda de decisão no ambiente imediato como primeira medida. Avaliar qualidade de sono e carga informacional recente como fatores contribuintes. Trabalhar estruturação externa antes de qualquer treino de organização interna. Reavaliar após intervenção no ambiente."
  },

  desengajamento_funcional: {
    sintese: "Redução generalizada de engajamento com as atividades, com comprometimento de execução e sentido percebido.",
    interpretacao: "Os achados indicam padrão de afastamento funcional — o paciente executa menos, inicia com dificuldade e percebe redução de sentido nas atividades que realiza. O padrão não é de colapso agudo, mas de retirada progressiva do campo de ação. Os achados sugerem que a carga não é o fator limitante principal — o limitador é a ausência de mobilização suficiente para engajar o sistema funcional. Pode estar associado a estados de baixa ativação, perda de referência de propósito ou acúmulo de frustração com resultados percebidos.",
    implicacoes: "O desengajamento tende a se auto-reforçar — quanto menos o paciente faz, menor a percepção de capacidade e sentido. A ausência de ação não produz recuperação funcional nesse padrão; ao contrário, pode aprofundar o afastamento. Intervenções de baixíssima demanda com alto retorno de sentido têm maior impacto do que intervenções de alta estrutura.",
    limites: "Desengajamento funcional e estado depressivo compartilham características no autorrelato. A leitura clínica do contexto é necessária para distinguir os mecanismos.",
    conduta: "Identificar com o paciente uma atividade de baixíssima demanda que ainda produza algum nível de sentido. Não propor estrutura ou produtividade como meta inicial. Trabalhar reengajamento por via do sentido, não da execução. Monitorar evolução do eixo P como indicador de progresso."
  },

  hipercontrole_funcional: {
    sintese: "Padrão funcional com esforço elevado de controle e organização com redução da capacidade de execução espontânea.",
    interpretacao: "Os achados indicam que o paciente apresenta clareza mental relativamente preservada com comprometimento da execução — sabe o que precisa fazer mas não consegue fazer. O padrão sugere investimento elevado em controle, planejamento e monitoramento interno que consome os recursos necessários para a ação. Os achados podem estar associados a estados de alta vigilância, padrão perfeccionista instalado ou experiências anteriores de falha que geraram necessidade de controle excessivo antes de agir.",
    implicacoes: "O esforço de controle pode ser invisível ao observador externo — o paciente parece organizado mas não avança. A frustração acumulada pela discrepância entre planejamento e execução tende a intensificar o padrão de controle. Intervenções focadas em planejamento adicional podem reforçar o problema.",
    limites: "A distinção entre hipercontrole funcional e padrão de evitação por outras razões requer avaliação clínica do contexto. O questionário oferece o padrão — a origem requer exploração.",
    conduta: "Trabalhar redução do ciclo de planejamento antes da ação. Propor tarefas com critério de conclusão explicitamente reduzido. Não reforçar comportamento de organização adicional como preparação. Explorar com o paciente o que seria necessário para que a ação fosse 'boa o suficiente'."
  },

  dissociacao_operacional: {
    sintese: "Discrepância entre capacidade de execução relatada e baixa carga somática e emocional, com redução de sentido percebido.",
    interpretacao: "Os achados indicam padrão no qual o paciente executa — os eixos de ação apresentam valores elevados — mas com carga somática e emocional baixas e sentido percebido reduzido. O padrão sugere execução dissociada de ancoragem interna: o paciente age sem perceber o custo somático, sem conexão emocional com o que faz e sem percepção de propósito. Os achados podem estar associados a funcionamento em modo automático, adaptação prolongada a alta demanda ou estado de desconexão interoceptiva.",
    implicacoes: "A execução mantida pode mascarar comprometimento real de bem-estar funcional. O paciente pode não identificar sinais de sobrecarga até que o sistema entre em colapso. A ausência de sentido percebido em estado de alta execução é fator de risco para desengajamento abrupto posterior.",
    limites: "A baixa carga somática e emocional relatada pode refletir redução de percepção e não ausência real de carga. Este padrão requer atenção à validade do autorrelato.",
    conduta: "Explorar com o paciente a experiência subjetiva das atividades que executa — não apenas o que faz, mas como registra internamente. Não interpretar a execução mantida como indicador de funcionalidade preservada. Avaliar longitudinalmente para identificar acúmulo silencioso de carga."
  },

  colapso_sustentacao: {
    sintese: "Comprometimento funcional com predomínio na capacidade de sustentar atividades iniciadas.",
    interpretacao: "Os achados indicam que o paciente apresenta capacidade de início relativamente preservada com comprometimento marcado na sustentação. O padrão inclui dificuldade de manter o que está fazendo, interrupção de tarefas antes da conclusão, perda de ritmo no meio das atividades e acúmulo de tarefas importantes não finalizadas. Os achados sugerem que o sistema funcional esgota seus recursos durante a execução — a energia inicial existe, mas não há reserva para manutenção do esforço.",
    implicacoes: "O padrão de início preservado pode criar expectativa de desempenho que não se sustenta, gerando frustração acumulada. Tarefas longas ou de alta demanda contínua são particularmente comprometidas. A sensação de incompletude persistente tende a aumentar a carga emocional secundária.",
    limites: "A dificuldade de sustentação pode refletir tanto limitação funcional quanto estrutura inadequada das tarefas. Tarefas sem divisão clara em etapas amplificam esse padrão independentemente do estado funcional.",
    conduta: "Dividir tarefas em unidades menores com pontos de parada explícitos. Não avaliar desempenho por conclusão total — avaliar por avanço em etapas. Identificar em qual ponto do ciclo de execução a perda de ritmo ocorre com maior frequência. Reavaliar após modificação da estrutura das tarefas."
  },

  travamento_inicio: {
    sintese: "Comprometimento funcional com predomínio na iniciação de tarefas, com capacidade de sustentação relativamente preservada.",
    interpretacao: "Os achados indicam que a barreira funcional principal está no início das atividades — uma vez iniciada a tarefa, o paciente apresenta capacidade de mantê-la em nível maior do que o comprometimento de iniciação sugere. O padrão inclui dificuldade de começar, adiamento de tarefas reconhecidas como necessárias e resistência a atividades que exigem mudança de modo. Os achados sugerem comprometimento seletivo do mecanismo de ativação funcional, não da capacidade de execução em si.",
    implicacoes: "A capacidade produtiva do paciente pode ser significativamente maior do que o desempenho atual indica. A dificuldade de iniciação pode ser interpretada como baixa motivação quando reflete um padrão funcional específico. Intervenções voltadas para redução do limiar de início têm impacto desproporcional no desempenho geral.",
    limites: "A distinção entre travamento de início funcional e evitação por outros fatores não é possível pelo questionário. A leitura clínica do contexto é necessária para diferenciar os mecanismos.",
    conduta: "Trabalhar redução do tamanho do primeiro passo como estratégia principal. Identificar contextos em que a iniciação ocorre com menos resistência. Não interpretar a dificuldade de início como indicador de capacidade reduzida. Verificar se o eixo de sentido está contribuindo para a barreira de início."
  },

  latencia_de_sentido: {
    sintese: "Redução marcada de sentido percebido com capacidade cognitiva e de execução parcialmente preservadas.",
    interpretacao: "Os achados indicam que o eixo de propósito apresenta comprometimento severo enquanto os eixos cognitivo e de execução mostram valores menos comprometidos. O padrão sugere que o paciente mantém capacidade de organizar e agir, mas sem percepção de razão suficiente para fazê-lo de forma consistente. A preservação relativa da clareza cognitiva com redução marcada de sentido indica que o limitador não é a capacidade — é a ausência de ancoragem de propósito que mobilize essa capacidade. Os achados podem estar associados a estados de transição, perda de referência de valor ou desalinhamento prolongado entre atividades realizadas e atividades significativas.",
    implicacoes: "A execução pode ocorrer por obrigação sem mobilização interna, o que tende a produzir carga sem recuperação. A adesão a qualquer processo terapêutico será reduzida enquanto o eixo de sentido não apresentar melhora. A capacidade cognitiva preservada pode ser usada pelo paciente para racionalizar o desengajamento.",
    limites: "Redução de sentido percebido é altamente sensível ao contexto de vida atual. Períodos de transição, luto ou mudança de papel social podem produzir esse padrão transitoriamente.",
    conduta: "Explorar com o paciente o que ainda produz algum nível de sentido — mesmo que reduzido. Não propor estrutura ou produtividade antes de identificar ancoragem de propósito. Usar a capacidade cognitiva preservada para exploração de valores, não para planejamento de execução. Monitorar o eixo P como indicador principal de progresso."
  },

  hiperclareza_improdutiva: {
    sintese: "Clareza cognitiva elevada com comprometimento da capacidade de organização prática e execução.",
    interpretacao: "Os achados indicam que o bloco de clareza mental apresenta valores baixos de comprometimento — o paciente pensa com clareza, identifica o que precisa ser feito e processa informações — mas o bloco de organização prática e os eixos de execução mostram comprometimento elevado. O padrão sugere que a capacidade de compreender e analisar não está se convertendo em capacidade de organizar e agir. Os achados podem estar associados a estados de análise excessiva sem resolução, excesso de opções percebidas ou bloqueio na transição entre cognição e ação.",
    implicacoes: "O paciente pode apresentar frustração elevada pela discrepância entre clareza mental e desempenho funcional. A percepção de 'saber o que fazer mas não conseguir fazer' tende a aumentar a autocrítica e a carga emocional secundária. Intervenções cognitivas adicionais podem reforçar o padrão.",
    limites: "A clareza cognitiva elevada no autorrelato pode coexistir com rigidez de pensamento não captada pelo questionário. A avaliação clínica direta é necessária para caracterizar a qualidade do processamento.",
    conduta: "Não propor intervenções cognitivas adicionais. Trabalhar a transição entre análise e ação com tarefas de baixíssima complexidade decisória. Identificar com o paciente o ponto em que a análise se torna obstáculo. Avaliar se o padrão de excesso de clareza está funcionando como estratégia de evitação."
  },

  // ===== LOTE 3 =====

  rigidez_funcional: {
    sintese: "Padrão funcional com redução de flexibilidade adaptativa, com dificuldade de responder a mudanças de demanda.",
    interpretacao: "Os achados sugerem padrão de funcionamento com baixa variabilidade adaptativa — o paciente opera dentro de um repertório funcional estreito com dificuldade de responder a situações que exigem mudança de modo, adaptação a novas demandas ou tolerância à imprevisibilidade. O padrão pode se expressar como resistência a tarefas diferentes do habitual, dificuldade de reorganizar prioridades diante de mudanças e aumento de carga quando a rotina é alterada.",
    implicacoes: "Ambientes com alta variabilidade de demanda tendem a comprometer desproporcionalmente o funcionamento desse paciente. A rigidez funcional pode ser interpretada como teimosia ou falta de iniciativa quando reflete uma estratégia adaptativa de conservação de recursos. Mudanças terapêuticas devem ser introduzidas de forma gradual e previsível.",
    limites: "A rigidez funcional pode refletir tanto estado funcional atual quanto padrão de personalidade ou estilo cognitivo mais estável. O questionário não distingue entre os dois.",
    conduta: "Introduzir mudanças de forma gradual e com antecedência. Não propor rupturas de rotina como intervenção. Trabalhar previsibilidade como recurso antes de explorar flexibilidade. Reavaliar após período de maior estabilidade ambiental."
  },

  estagnacao_funcional: {
    sintese: "Padrão funcional estável em nível de comprometimento, sem movimento de melhora ou piora identificável.",
    interpretacao: "Os achados indicam padrão de manutenção de carga sem progressão em nenhuma direção. O paciente não apresenta piora aguda, mas também não apresenta sinais de recuperação funcional. O padrão pode estar associado a adaptação ao nível atual de comprometimento, ausência de fatores de mudança no ambiente, estratégias de enfrentamento que estabilizam sem recuperar ou teto de resposta ao processo terapêutico atual.",
    implicacoes: "A estabilização em nível comprometido pode ser percebida pelo paciente como funcionamento normal se o estado se mantém por período prolongado. O risco de cronificação aumenta quanto mais tempo o padrão se mantém sem mudança. A ausência de piora pode reduzir a percepção de urgência de intervenção.",
    limites: "Estagnação funcional e estabilização funcional saudável produzem padrões semelhantes no autorrelato. A distinção depende do nível absoluto de carga e da trajetória longitudinal anterior.",
    conduta: "Revisar a estratégia terapêutica atual — manutenção de carga por período prolongado pode indicar limite de resposta à abordagem vigente. Explorar com o paciente fatores ambientais que possam estar sustentando o padrão. Introduzir variação controlada para testar responsividade do sistema funcional."
  },

  crise_existencial_funcional: {
    sintese: "Comprometimento funcional com predomínio no eixo de sentido, com questionamento de propósito nas atividades centrais da vida.",
    interpretacao: "Os achados indicam comprometimento severo do eixo de propósito com impacto direto na capacidade de engajamento funcional. O padrão não se restringe a atividades específicas — o questionamento de sentido atinge as atividades centrais da rotina do paciente. Os achados sugerem que o sistema funcional está operando sem ancoragem de propósito suficiente para mobilizar os demais eixos de forma consistente. Pode estar associado a estados de transição significativa, perda de referências de valor ou desalinhamento prolongado entre o que se faz e o que se considera relevante.",
    implicacoes: "Intervenções voltadas para execução e organização terão impacto reduzido enquanto o eixo de sentido não apresentar algum nível de recuperação. O paciente pode apresentar resistência a propostas terapêuticas percebidas como sem propósito. O comprometimento de sentido em nível severo requer atenção à continuidade do processo.",
    limites: "Comprometimento severo de sentido percebido requer avaliação clínica direta. O questionário identifica o padrão funcional — a natureza e profundidade da crise de sentido requer exploração clínica.",
    conduta: "Priorizar o eixo de sentido como ponto de entrada exclusivo na fase atual. Não avançar para demandas funcionais sem identificar ancoragem de propósito. Explorar com o paciente o que ainda produz algum nível de significado, mesmo que mínimo. Considerar encaminhamento complementar se o padrão não apresentar movimento nas próximas avaliações."
  },

  colapso_de_significado: {
    sintese: "Ausência de sentido percebido nas atividades avaliadas, com comprometimento global do eixo de propósito.",
    interpretacao: "Os achados indicam comprometimento máximo do eixo de propósito — o paciente não identifica sentido, motivo ou correspondência entre esforço e resultado em nenhuma das dimensões avaliadas. O padrão é de esvaziamento funcional do campo de significado, no qual as atividades são percebidas como arbitrárias, sem valor ou desconectadas de qualquer referência de propósito. Os demais eixos podem apresentar comprometimento variável, mas o eixo P atua como limitador central de qualquer mobilização funcional.",
    implicacoes: "A ausência total de sentido percebido compromete a efetividade de qualquer intervenção que dependa de engajamento voluntário. O risco de abandono do processo terapêutico é elevado. Intervenções que não partem do eixo de sentido tendem a ser percebidas como mais uma demanda sem propósito.",
    limites: "O comprometimento máximo do eixo de sentido requer avaliação clínica direta e urgente. O questionário sinaliza o padrão — a profundidade e as implicações clínicas completas não podem ser determinadas apenas pelos dados.",
    conduta: "Priorizar exploração clínica direta do estado do paciente antes de qualquer intervenção estruturada. Não propor demandas funcionais na fase atual. Avaliar necessidade de suporte especializado complementar. Manter acompanhamento próximo com reavaliação em intervalo curto."
  },

  oscilacao_funcional_relevante: {
    sintese: "Variabilidade elevada entre domínios funcionais, com padrão instável sem predomínio fixo.",
    interpretacao: "Os achados indicam alta variabilidade entre os eixos avaliados — alguns domínios apresentam comprometimento elevado enquanto outros mostram valores preservados, e esse padrão tende a variar entre avaliações. O Δ elevado indica que a carga não está distribuída de forma uniforme nem concentrada em um único eixo, mas oscila de forma relevante. Os achados sugerem sistema funcional com baixa estabilidade de estado — o paciente não apresenta padrão fixo, o que pode refletir alta sensibilidade a variações contextuais, padrão de regulação ativa ou instabilidade funcional.",
    implicacoes: "A oscilação elevada dificulta a identificação de um eixo de entrada estável para a intervenção. O paciente pode apresentar dias de bom funcionamento alternados com dias de comprometimento significativo, o que torna o prognóstico de curto prazo menos previsível. A avaliação longitudinal é especialmente importante nesse padrão.",
    limites: "A variabilidade entre domínios pode refletir padrão funcional real ou variação na qualidade do autorrelato. Avaliações em condições similares de contexto e horário aumentam a confiabilidade.",
    conduta: "Priorizar avaliação longitudinal antes de definir estratégia de intervenção. Identificar com o paciente os contextos que precedem os dias de maior comprometimento. Trabalhar estabilidade de rotina como base antes de intervenções específicas. Reavaliar em intervalo curto para mapear o padrão de variação."
  },

  sobrecarga_distribuida: {
    sintese: "Comprometimento funcional elevado com distribuição equivalente entre todos os domínios avaliados.",
    interpretacao: "Os achados indicam carga elevada e uniforme em todos os blocos funcionais, sem predomínio isolado e sem eixo preservado. O padrão é de comprometimento sistêmico instalado — todos os domínios operam simultaneamente em nível elevado de sobrecarga. A ausência de gradiente entre os eixos indica que a carga não é reativa a um fator específico, mas expressa estado funcional global comprometido.",
    implicacoes: "A ausência de eixo preservado reduz as opções de entrada para a intervenção. Qualquer demanda adicional sobre o sistema tende a amplificar a sobrecarga global. O risco de progressão para padrão de colapso está aumentado se a carga não for reduzida.",
    limites: "Carga elevada e uniforme pode refletir tanto estado funcional comprometido quanto estilo de autorrelato que uniformiza percepções. A trajetória longitudinal é necessária para distinguir os casos.",
    conduta: "Priorizar redução de demanda antes de qualquer intervenção estruturada. Identificar com o paciente qual eixo tem maior custo subjetivo percebido como ponto de entrada. Não propor aumento de atividade no período imediato. Reavaliar em 7 dias."
  },

  dificuldade_execucao_global: {
    sintese: "Comprometimento funcional com predomínio nos eixos de execução, afetando iniciação e sustentação simultaneamente.",
    interpretacao: "Os achados indicam comprometimento elevado nos blocos de iniciação e sustentação — o paciente apresenta dificuldade tanto para começar quanto para manter as atividades. O padrão é de comprometimento global da capacidade de execução, não seletivo a uma fase do ciclo de ação. Os eixos cognitivo e emocional podem apresentar comprometimento associado, mas o sinal principal está na execução. Os achados sugerem que o sistema funcional não está acessando nem convertendo seus recursos em ação de forma efetiva.",
    implicacoes: "Tarefas de qualquer duração são comprometidas — nem as curtas nem as longas. A ausência de execução tende a amplificar a percepção de incapacidade e reduzir ainda mais a probabilidade de iniciação futura. Qualquer ganho de execução, por menor que seja, tem alto valor de reforço nesse padrão.",
    limites: "O comprometimento de execução global pode ter origem somática, emocional, cognitiva ou de sentido. O questionário identifica o padrão — a origem requer exploração clínica.",
    conduta: "Propor tarefas de duração e complexidade mínimas como ponto de partida. Não avaliar desempenho por padrão habitual do paciente. Identificar com o paciente um exemplo recente de execução bem-sucedida, por menor que seja. Usar esse exemplo como referência de capacidade real disponível."
  },

  comprometimento_somatico_predominante: {
    sintese: "Comprometimento funcional com predomínio no eixo somático, afetando energia, recuperação e tolerância ao esforço.",
    interpretacao: "Os achados indicam carga concentrada no bloco somático — o paciente relata início do dia sem energia, tensão corporal acumulada, sono não reparador, esforço físico acima do esperado para tarefas simples e percepção de que o corpo dá sinais de sobrecarga ao longo do dia. Os demais eixos apresentam comprometimento menor, indicando que a limitação funcional principal tem origem somática. Os achados sugerem que a capacidade cognitiva e de organização pode estar relativamente preservada, mas com acesso limitado pela carga corporal.",
    implicacoes: "Intervenções que aumentam a demanda somática sem considerar o estado de recuperação tendem a amplificar o comprometimento. A carga somática não tratada tende a se disseminar progressivamente para os demais eixos. O paciente pode apresentar capacidade de planejamento maior do que a capacidade de execução física sugere.",
    limites: "O comprometimento somático relatado pode ter origem funcional ou orgânica. O questionário identifica o padrão funcional — a avaliação médica é necessária para descartar causas somáticas subjacentes.",
    conduta: "Avaliar qualidade de sono, padrão de recuperação e demanda física recente como fatores contribuintes. Não aumentar demanda somática no período atual. Trabalhar ritmo e recuperação antes de estrutura e produtividade. Considerar avaliação médica se o padrão somático for persistente ou intenso."
  },

  // ===== LOTE 4 — LONGITUDINAL =====
  // Estrutura diferente: sintese / comparacao / interpretacao / implicacoes / conduta

  estabilizacao_funcional: {
    sintese: "Ausência de variação funcional significativa entre as avaliações — padrão de carga e distribuição mantidos.",
    comparacao: "Variação de G entre sessões inferior a 0.2. Variação de Δ inferior a 0.2. Padrão de distribuição entre eixos mantido sem alteração relevante.",
    interpretacao: "Os dados longitudinais indicam que o estado funcional do paciente se manteve estável entre as avaliações registradas. A estabilização pode refletir equilíbrio dinâmico sustentado pelo processo terapêutico atual, teto de resposta à abordagem vigente ou ausência de fatores de mudança no ambiente do paciente. A interpretação clínica do padrão depende do nível absoluto de carga — estabilização com G baixo indica preservação funcional, enquanto estabilização com G elevado indica manutenção de comprometimento.",
    implicacoes: "Se a estabilização ocorre em nível de carga elevada, o risco de cronificação aumenta com o tempo. Se ocorre em nível de carga reduzida, pode indicar consolidação de ganho funcional. Em ambos os casos, a ausência de movimento por período prolongado é um sinal para revisão da estratégia.",
    conduta: "Avaliar o nível absoluto de G para interpretar o valor clínico da estabilização. Revisar a estratégia terapêutica se a estabilização ocorre em nível comprometido por mais de duas avaliações consecutivas. Explorar com o paciente fatores ambientais que possam estar sustentando ou limitando a mudança."
  },

  melhora_funcional: {
    sintese: "Redução da carga global entre avaliações — movimento de melhora funcional documentado.",
    comparacao: "G atual inferior ao G da avaliação anterior. Redução documentada em pelo menos um bloco funcional com manutenção ou melhora nos demais.",
    interpretacao: "Os dados longitudinais indicam redução da carga funcional global em relação à avaliação anterior. O movimento de melhora pode ser uniforme entre os eixos ou concentrado em domínios específicos. A análise do Δ entre sessões permite identificar se a melhora é sistêmica ou se reflete recuperação seletiva de um eixo. A velocidade e consistência da melhora são informações relevantes para o prognóstico funcional de médio prazo.",
    implicacoes: "A melhora documentada reforça a efetividade da abordagem atual e aumenta a probabilidade de adesão continuada. O risco nesse padrão é de aumento prematuro de demanda antes da consolidação do ganho funcional. Melhoras rápidas em contexto de carga ainda elevada podem refletir flutuação e não recuperação estrutural.",
    conduta: "Manter a estratégia atual sem aumento de demanda imediato. Documentar os fatores que o paciente associa à melhora para reforço intencional. Reavaliar em intervalo regular para verificar consistência do padrão. Considerar aumento gradual de demanda apenas após duas avaliações consecutivas com melhora."
  },

  piora_funcional: {
    sintese: "Aumento da carga global entre avaliações — movimento de piora funcional documentado.",
    comparacao: "G atual superior ao G da avaliação anterior. Aumento documentado em pelo menos um bloco funcional com impacto no padrão geral.",
    interpretacao: "Os dados longitudinais indicam aumento da carga funcional global em relação à avaliação anterior. O movimento de piora pode ser uniforme entre os eixos ou concentrado em domínios específicos. A análise do Δ permite identificar se a piora é sistêmica — todos os eixos aumentaram — ou se reflete comprometimento emergente em um eixo específico. A velocidade da piora e o nível absoluto atual de G são relevantes para a urgência da resposta clínica.",
    implicacoes: "Piora documentada requer revisão da estratégia terapêutica atual. Fatores ambientais, de saúde ou relacionais que possam ter contribuído para a piora devem ser investigados. O risco de progressão para padrão de colapso aumenta se a piora não for revertida nas próximas avaliações.",
    conduta: "Identificar com o paciente os fatores do período que podem estar associados à piora. Reduzir demanda no período imediato. Revisar a estratégia terapêutica vigente. Aumentar a frequência de avaliação enquanto o padrão de piora se mantiver."
  },

  padrao_misto_sem_predominio: {
    sintese: "Padrão funcional sem predomínio definido entre os domínios avaliados, com comprometimento variável entre eixos.",
    interpretacao: "Os achados indicam que nenhum eixo apresenta comprometimento suficientemente maior do que os demais para configurar predomínio claro. O padrão é de envolvimento múltiplo sem hierarquia definida entre os domínios. Isso pode refletir estado de transição entre padrões, oscilação funcional com avaliação em ponto intermediário ou distribuição real de carga sem concentração em eixo específico.",
    implicacoes: "A ausência de predomínio definido dificulta a identificação de um eixo de entrada prioritário para a intervenção. A leitura longitudinal é especialmente relevante nesse padrão para identificar se está emergindo um predomínio em algum eixo ou se a distribuição mista é o padrão estável do paciente.",
    conduta: "Explorar com o paciente qual domínio tem maior custo subjetivo percebido, independentemente dos valores absolutos. Usar a percepção do paciente como critério de entrada quando o padrão não apresenta predomínio definido pelos dados. Priorizar avaliação longitudinal para identificar emergência de padrão mais definido."
  }

};

