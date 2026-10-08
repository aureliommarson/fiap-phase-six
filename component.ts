import "./styles.css";

type AlternativeId = "A" | "B" | "C" | "D" | "E";

interface Alternative {
  readonly id: AlternativeId;
  readonly text: string;
}

interface Question {
  readonly block: string;
  readonly topic: string;
  readonly number: number;
  readonly question: string;
  readonly alternatives: readonly Alternative[];
  readonly correctAnswerId: AlternativeId;
}

interface QuizState {
  started: boolean;
  finished: boolean;
  currentQuestionIndex: number;
  isAnswering: boolean;
  currentAlternatives: Alternative[];
}

const CORRECT_ANIMATION_DURATION_MS = 760;
const WRONG_ANIMATION_DURATION_MS = 760;

const makeAlternatives = (
  entries: ReadonlyArray<readonly [AlternativeId, string]>,
): Alternative[] => entries.map(([id, text]) => ({ id, text }));

const archivedQuestions: readonly Question[] = [
  {
    block: "BLOCO 1",
    topic: "DEPLOYMENT",
    number: 1,
    question:
      "Assinale a alternativa que completa corretamente a frase a seguir:\nO __________ de aplicação refere-se ao processo de disponibilizar uma aplicação para uso em um ambiente específico, que pode ser de desenvolvimento, teste, homologação ou produção.",
    alternatives: makeAlternatives([
      ["A", "deployment"],
      ["B", "projeto"],
      ["C", "escopo"],
      ["D", "delivery"],
      ["E", "gerenciamento"],
    ]),
    correctAnswerId: "A",
  },
  {
    block: "BLOCO 1",
    topic: "DEPLOYMENT",
    number: 2,
    question:
      "Leia a definição a seguir:\nÉ uma estratégia de implantação de aplicação que mantém duas versões idênticas do ambiente de produção: uma versão ativa e outra inativa.\nCom base nessa definição, qual é a estratégia de implantação descrita?",
    alternatives: makeAlternatives([
      ["A", "A/B Testing Deployment"],
      ["B", "Canary Deployment"],
      ["C", "Shadow Deployment"],
      ["D", "Recreate Deployment"],
      ["E", "Blue-Green Deployment"],
    ]),
    correctAnswerId: "E",
  },
  {
    block: "BLOCO 1",
    topic: "DEPLOYMENT",
    number: 3,
    question:
      "Assinale a alternativa que apresenta estratégias de implantação de uma aplicação.",
    alternatives: makeAlternatives([
      ["A", "Rolling Deployment, Blue-Green Deployment, Azure Deployment."],
      ["B", "Rolling Deployments, CI/CD Deployment, Recreate Deployment."],
      ["C", "Rolling Deployment, Canary Deployment, Recreate Deployment."],
      ["D", "A/B Testing Deployment, Recreate Deployment, Continuous Deployment."],
      ["E", "Recreate Deployment, Scrum Deployment, Shadow Deployment."],
    ]),
    correctAnswerId: "C",
  },
  {
    block: "BLOCO 2",
    topic: "AZURE DEVOPS",
    number: 1,
    question:
      "A escolha adequada de um modelo de processo no Azure DevOps é crucial para alinhar as ferramentas de gerenciamento de projetos às necessidades específicas da equipe e do projeto. O modelo CMMI é mais adequado para:",
    alternatives: makeAlternatives([
      ["A", "Qualquer equipe pode adotar esse modelo, pois ele é bastante flexível e se adapta às necessidades da equipe e ao tamanho do projeto."],
      ["B", "Equipes que buscam uma abordagem direta e sem complicações, ou equipes que não necessitam de processos complexos de gerenciamento."],
      ["C", "Equipes que utilizam métodos de planejamento Agile mais flexíveis, e que precisam de flexibilidade para adaptar seus processos de trabalho conforme o projeto evolui."],
      ["D", "Equipes que seguem metodologias de projeto mais estruturadas e que necessitam de um registro auditável de decisões e mudanças."],
      ["E", "Equipes que já implementam a metodologia ágil Scrum."],
    ]),
    correctAnswerId: "D",
  },
  {
    block: "BLOCO 2",
    topic: "AZURE DEVOPS",
    number: 2,
    question: "Sobre backlog, assinale a alternativa correta:",
    alternatives: makeAlternatives([
      ["A", "O backlog é um modelo de projeto de software ágil, que pode ser utilizado como alternativa ao Scrum."],
      ["B", "O backlog representa uma atividade específica de um projeto que precisa ser realizada."],
      ["C", "O backlog, ou lista de pendências, é uma ferramenta essencial no Azure Boards que permite um planejamento eficaz e rápido de projetos através da adição de User Stories (histórias de usuário) ou requisitos."],
      ["D", "Backlog é uma solução robusta de controle de versão que oferece aos desenvolvedores uma plataforma segura e eficiente para gerenciar alterações no código-fonte."],
      ["E", "O backlog permite que equipes de desenvolvimento de software ajustem suas ferramentas de gerenciamento às necessidades específicas do projeto e à metodologia de trabalho da equipe."],
    ]),
    correctAnswerId: "C",
  },
  {
    block: "BLOCO 2",
    topic: "AZURE DEVOPS",
    number: 3,
    question:
      "Qual é o serviço do ecossistema Azure DevOps que oferece aos desenvolvedores uma plataforma segura e eficiente para gerenciar alterações no código-fonte?",
    alternatives: makeAlternatives([
      ["A", "Azure Test Plans"],
      ["B", "Azure Repos"],
      ["C", "Azure Pipelines"],
      ["D", "Azure Artifacts"],
      ["E", "Azure Boards"],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "BLOCO 2",
    topic: "AZURE DEVOPS",
    number: 4,
    question:
      "Qual serviço do ecossistema Azure é utilizado para automatizar o processo de build e teste, e também a implantação de aplicações em qualquer ambiente, seja ele na nuvem, híbrido ou on-premises?",
    alternatives: makeAlternatives([
      ["A", "Azure Pipelines"],
      ["B", "Azure Boards"],
      ["C", "Azure Repos"],
      ["D", "Azure Artifacts"],
      ["E", "Azure Test Plans"],
    ]),
    correctAnswerId: "A",
  },
  {
    block: "BLOCO 3",
    topic: "DOCKER, CI E CD",
    number: 1,
    question:
      "Assinale a alternativa que completa corretamente a frase a seguir:\n________ é uma plataforma líder em conteinerização que permite encapsular a aplicação e suas dependências em um container isolado, o que simplifica as configurações e aumenta a segurança ao reduzir discrepâncias entre os ambientes.",
    alternatives: makeAlternatives([
      ["A", "Docker"],
      ["B", "Pipeline"],
      ["C", "Workflow"],
      ["D", "Branch feature"],
      ["E", "Azure"],
    ]),
    correctAnswerId: "A",
  },
  {
    block: "BLOCO 3",
    topic: "DOCKER, CI E CD",
    number: 2,
    question:
      "Leia a descrição a seguir:\nDireciona uma empresa na criação de um processo simplificado e automatizado de lançamento de software. No centro desse processo há um ciclo de feedback que gira em torno da entrega de software para o usuário final o mais rápido possível, aprendendo com sua experiência prática e, em seguida, incorporando esse feedback na próxima versão.\nEssa descrição refere-se a:",
    alternatives: makeAlternatives([
      ["A", "Colaboração Contínua"],
      ["B", "Segurança Contínua"],
      ["C", "Integração Contínua"],
      ["D", "Aplicação Contínua"],
      ["E", "Entrega Contínua"],
    ]),
    correctAnswerId: "E",
  },
  {
    block: "BLOCO 3",
    topic: "DOCKER, CI E CD",
    number: 3,
    question:
      "Sobre integração contínua (Continuous Integration - CI), assinale a alternativa correta:",
    alternatives: makeAlternatives([
      ["A", "A confirmação de código com mais frequência detecta erros mais cedo e aumenta a quantidade de código que um desenvolvedor precisa depurar para encontrar a origem de um erro."],
      ["B", "Na integração contínua há um ciclo de feedback iterativo que visa a entrega de software para o usuário final o mais rápido possível."],
      ["C", "Atualizações frequentes de código-fonte dificultam a mesclagem de alterações de diferentes membros de uma equipe de desenvolvimento de software."],
      ["D", "A integração contínua direciona uma empresa na criação de um processo simplificado e automatizado de lançamento de software."],
      ["E", "A integração contínua é uma prática de software que requer a confirmação frequente de código em um repositório compartilhado."],
    ]),
    correctAnswerId: "E",
  },
  {
    block: "BLOCO 4",
    topic: "CICLO DE VIDA E MODELOS DE SOFTWARE",
    number: 1,
    question:
      "Sobre ciclo de vida de projeto de software, assinale a afirmativa correta.",
    alternatives: makeAlternatives([
      ["A", "O modelo Cascata incorpora o conceito de desenvolvimento e entrega de componentes em frentes de trabalho paralelas, quase que como uma extrapolação da proposta do modelo Evolutivo."],
      ["B", "O conceito da Cascata de projeto é de conduzir todo o desenvolvimento como uma sequência de fases que acontecem em sequência, sendo que, uma vez superada uma fase, não se volta para trás."],
      ["C", "A ideia do modelo Cascata é proporcionar o desenvolvimento e a entrega da solução de forma modular, disponibilizando pacotes funcionais para os usuários e reduzindo, assim, o tempo de espera para se iniciar o aproveitamento do sistema."],
      ["D", "O modelo Cascata é baseado em protótipos que facilitam a compreensão de como será o formato e os recursos do produto final."],
      ["E", "O modelo Cascata é, atualmente, o modelo mais utilizado, pois permite o desenvolvimento e a entrega de componentes em frentes de trabalho paralelas."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "BLOCO 4",
    topic: "CICLO DE VIDA E MODELOS DE SOFTWARE",
    number: 2,
    question: "As manutenções pelas quais o sistema pode passar são:",
    alternatives: makeAlternatives([
      ["A", "Ágeis, Adaptativas, Evolutivas e Perfectivas."],
      ["B", "Corretivas, Adaptativas, Evolutivas e Perfectivas."],
      ["C", "Corretivas, Adaptativas, Evolutivas e Maturação."],
      ["D", "Corretivas, Adaptativas, Evolutivas e Incrementais."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "BLOCO 4",
    topic: "CICLO DE VIDA E MODELOS DE SOFTWARE",
    number: 3,
    question:
      "Leia a definição a seguir:\nÉ o modelo de processo ágil de software mais aplicado mundialmente. Esse modelo traz fortes conceitos de flexibilização de desenvolvimento, foco em rápidas entregas, comunicação intensiva, desburocratização do gerenciamento, flexibilização de escopo e adaptação do projeto.\nEssa definição está se referindo a qual modelo?",
    alternatives: makeAlternatives([
      ["A", "Extreme Programming"],
      ["B", "Evolutivo"],
      ["C", "Scrum"],
      ["D", "Kanban"],
      ["E", "Azure"],
    ]),
    correctAnswerId: "C",
  },
  {
    block: "BLOCO 5",
    topic: "TESTES DE SOFTWARE",
    number: 1,
    question: "O que são testes de regressão?",
    alternatives: makeAlternatives([
      ["A", "Testes que focam nos requisitos de negócios da aplicação."],
      ["B", "Testes que avaliam como o sistema se comporta sob diferentes cargas de trabalho."],
      ["C", "Testes que avaliam como diferentes módulos ou serviços interagem quando combinados."],
      ["D", "Testes que verificam se alterações no código introduziram novos defeitos em partes já testadas do software."],
      ["E", "Testes realizados no nível do código-fonte e focados em métodos e funções individuais."],
    ]),
    correctAnswerId: "D",
  },
  {
    block: "BLOCO 5",
    topic: "TESTES DE SOFTWARE",
    number: 2,
    question:
      "Leia a frase a seguir:\nAlguns testes de software oferecem uma abordagem diferenciada, sem seguir um roteiro predefinido. Esse tipo de teste costuma utilizar uma abordagem criativa e intuitiva.\nEstamos nos referindo a qual tipo de teste?",
    alternatives: makeAlternatives([
      ["A", "Testes de segurança"],
      ["B", "Testes exploratórios"],
      ["C", "Testes funcionais"],
      ["D", "Testes de unidade"],
      ["E", "Testes de regressão"],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "BLOCO 5",
    topic: "TESTES DE SOFTWARE",
    number: 3,
    question: "O que são testes de unidade?",
    alternatives: makeAlternatives([
      ["A", "Testes realizados no nível do código-fonte e focados em métodos e funções individuais."],
      ["B", "Testes que verificam se alterações no código introduziram novos defeitos em partes já testadas do software."],
      ["C", "Testes que avaliam como diferentes módulos ou serviços interagem quando combinados."],
      ["D", "Testes que avaliam como o sistema se comporta sob diferentes cargas de trabalho."],
      ["E", "Testes que focam nos requisitos de negócios da aplicação."],
    ]),
    correctAnswerId: "A",
  },
  {
    block: "BLOCO 5",
    topic: "TESTES DE SOFTWARE",
    number: 4,
    question:
      "Assinale a alternativa que completa corretamente a frase a seguir:\nO __________ se concentra nas funcionalidades do software sem considerar sua estrutura interna. O testador não possui conhecimento sobre o código-fonte e foca apenas nas entradas e saídas para verificar se o software atende aos requisitos definidos.",
    alternatives: makeAlternatives([
      ["A", "Teste de pirâmide"],
      ["B", "Teste de regressão"],
      ["C", "Teste de integração"],
      ["D", "Teste de caixa branca"],
      ["E", "Teste de caixa preta"],
    ]),
    correctAnswerId: "E",
  },
  {
    block: "BLOCO 6",
    topic: "QUALITY ASSURANCE (QA)",
    number: 1,
    question:
      "Qual é o papel do profissional de Quality Assurance no desenvolvimento de software?",
    alternatives: makeAlternatives([
      ["A", "Planejar e organizar as reuniões diárias realizadas pela equipe em um projeto que adota o modelo Scrum."],
      ["B", "Promover a qualidade de comunicação entre os membros da equipe de desenvolvimento de software."],
      ["C", "Garantir que o escopo do projeto está de acordo com as necessidades do usuário."],
      ["D", "Garantir que um produto atenda aos padrões de qualidade e às expectativas dos usuários."],
      ["E", "Garantir os processos que garantem a entrega contínua de um projeto de software."],
    ]),
    correctAnswerId: "D",
  },
  {
    block: "BLOCO 6",
    topic: "QUALITY ASSURANCE (QA)",
    number: 2,
    question: "Assinale a afirmativa verdadeira:",
    alternatives: makeAlternatives([
      ["A", "A automação de testes é um aspecto do Scrum que permite a realização de testes sem a necessidade de um Quality Assurance (QA)."],
      ["B", "No modelo Scrum, o Quality Assurance atua apenas na etapa de testes para garantir que a qualidade seja uma prioridade na entrega final."],
      ["C", "No modelo Cascata, o Quality Assurance (QA) é integrado a cada etapa do ciclo de desenvolvimento, colaborando continuamente com a equipe para garantir que a qualidade seja uma prioridade desde o planejamento até a entrega final."],
      ["D", "No modelo Scrum, o Quality Assurance (QA) é integrado a cada etapa do ciclo de desenvolvimento, colaborando continuamente com a equipe para garantir que a qualidade seja uma prioridade desde o planejamento até a entrega final."],
      ["E", "Durante a revisão de uma sprint (Review), o Quality Assurance (QA) colabora com o Product Owner e a equipe de desenvolvimento para entender os requisitos e definir os critérios de aceitação para os itens do backlog."],
    ]),
    correctAnswerId: "D",
  },
  {
    block: "BLOCO 6",
    topic: "QUALITY ASSURANCE (QA)",
    number: 3,
    question: "São exemplos de ferramentas de automação de testes:",
    alternatives: makeAlternatives([
      ["A", "JMeter e Cypress"],
      ["B", "Selenium e Jenkins"],
      ["C", "Selenium e Cypress"],
      ["D", "Cypress e GitHub"],
      ["E", "JMeter e Selenium"],
    ]),
    correctAnswerId: "C",
  },
  {
    block: "BLOCO 7",
    topic: "PITCH E STARTUPS",
    number: 1,
    question: "Para que serve um pitch deck?",
    alternatives: makeAlternatives([
      ["A", "Arquivo que será enviado posteriormente para os interlocutores."],
      ["B", "Apoio visual para ressaltar os tópicos mais relevantes da apresentação."],
      ["C", "Para apresentar o protótipo."],
      ["D", "Detalhar todos os itens que estão sendo apresentados no pitch."],
      ["E", "Lembrar ao apresentador de tudo o que deve ser falado."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "BLOCO 7",
    topic: "PITCH E STARTUPS",
    number: 2,
    question:
      "A apresentação feita a fundos de investimento, como VCs ou Private Equities, normalmente é chamada de:",
    alternatives: makeAlternatives([
      ["A", "Twit pitch"],
      ["B", "Pitch deck"],
      ["C", "Elevator pitch"],
      ["D", "Money pitch"],
      ["E", "Investment pitch"],
    ]),
    correctAnswerId: "E",
  },
  {
    block: "BLOCO 7",
    topic: "PITCH E STARTUPS",
    number: 3,
    question:
      "O sucesso de uma startup em geral começa com uma boa ideia. Ao apresentar sua ideia em um pitch, qual é a parte mais importante que deve ser ressaltada?",
    alternatives: makeAlternatives([
      ["A", "O problema"],
      ["B", "O custo"],
      ["C", "O mercado"],
      ["D", "A solução"],
      ["E", "A tecnologia"],
    ]),
    correctAnswerId: "A",
  },
  {
    block: "BLOCO 7",
    topic: "PITCH E STARTUPS",
    number: 4,
    question:
      "O ROI do seu negócio deve ser apresentado aos investidores com base em qual segmentação do mercado?",
    alternatives: makeAlternatives([
      ["A", "Público-alvo"],
      ["B", "TAM"],
      ["C", "SAM"],
      ["D", "Segmento de clientes"],
      ["E", "SOM"],
    ]),
    correctAnswerId: "E",
  },
  {
    block: "BLOCO 7",
    topic: "PITCH E STARTUPS",
    number: 5,
    question:
      "Um trunfo de um bom pitch pode ser a solicitação de smart money. O que significa esse termo?",
    alternatives: makeAlternatives([
      ["A", "Capital em forma de criptomoedas, o que mostra que os fundadores são inovadores."],
      ["B", "Apenas um nome do mercado de investimentos para o dinheiro aportado em um negócio."],
      ["C", "Capital não financeiro com o objetivo de complementar as competências e habilidades do time da startup."],
      ["D", "Dinheiro utilizado de maneira inteligente."],
      ["E", "Capital a ser distribuído entre os sócios-fundadores da startup."],
    ]),
    correctAnswerId: "C",
  },
];

// Mantém o banco anterior disponível como referência sem incluí-lo no simulado atual.
void archivedQuestions;

const questions: readonly Question[] = [
  {
    block: "QUESTÃO 1",
    topic: "CICLO DE VIDA DE SOFTWARE",
    number: 1,
    question:
      "Identifique a(s) alternativa(s) correta(s).\n\nSobre ciclo de vida de software, são CORRETAS as afirmativas:\n\nI. Na fase de Introdução, surgem os primeiros interesses pelo software e ainda podem existir problemas com a aplicação e a equipe de desenvolvedores está bastante focada nesse momento imediato à liberação para uso.\n\nII. Na fase de Crescimento, os clientes atuais satisfeitos ajudam a impulsionar o aumento da clientela do sistema. A equipe de desenvolvedores passa a ser liberada para outras atividades.\n\nIII. Na fase de Maturidade, a comunidade confia no produto e ele alcança sua quantidade máxima de usuários e licenciamento. No ápice da maturidade, a comercialização do software não cresce mais.",
    alternatives: makeAlternatives([
      ["A", "III."],
      ["B", "I, II e III."],
      ["C", "I e II."],
      ["D", "I e III."],
      ["E", "II e III."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "QUESTÃO 2",
    topic: "AZURE DEVOPS",
    number: 2,
    question:
      "Identifique a alternativa correta.\n\nQual serviço do ecossistema Azure DevOps oferece aos desenvolvedores uma plataforma segura e eficiente para gerenciar alterações no código-fonte?",
    alternatives: makeAlternatives([
      ["A", "Azure Pipelines."],
      ["B", "Azure Artifacts."],
      ["C", "Azure Repos."],
      ["D", "Azure Boards."],
      ["E", "Azure Test Plans."],
    ]),
    correctAnswerId: "C",
  },
  {
    block: "QUESTÃO 3",
    topic: "INTEGRAÇÃO CONTÍNUA",
    number: 3,
    question:
      "Identifique a(s) alternativa(s) correta(s).\n\nSobre Integração Contínua (Continuous Integration — CI), são corretas as afirmativas:\n\nI. A integração contínua é uma abordagem na qual as equipes lançam produtos de qualidade com frequência e previsão do repositório do código-fonte para produção de maneira automatizada.\n\nII. A integração contínua é uma prática de software que requer a confirmação frequente de código em um repositório compartilhado.\n\nIII. Na integração contínua, os desenvolvedores precisam coordenar e comunicar à mão quando estão contribuindo com código.",
    alternatives: makeAlternatives([
      ["A", "I e II."],
      ["B", "II."],
      ["C", "III."],
      ["D", "I e II."],
      ["E", "I."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "QUESTÃO 4",
    topic: "DEPLOYMENT",
    number: 4,
    question:
      "Identifique a alternativa correta.\n\nSão estratégias de implantação de aplicações:",
    alternatives: makeAlternatives([
      ["A", "Rolling Deployment, Blue-Green Deployment, Azure Deployment."],
      ["B", "Rolling Deployment, CI/CD Deployment, Recreate Deployment."],
      ["C", "Recreate Deployment, Scrum Deployment, Shadow Deployment."],
      ["D", "Rolling Deployment, Canary Deployment, Recreate Deployment."],
      ["E", "A/B Testing Deployment, Recreate Deployment, Continuous Deployment."],
    ]),
    correctAnswerId: "D",
  },
  {
    block: "QUESTÃO 5",
    topic: "TESTES DE INTELIGÊNCIA ARTIFICIAL",
    number: 5,
    question:
      "Identifique a alternativa correta.\n\nOs produtos e sistemas que utilizam inteligência artificial (IA) e aprendizado de máquina (ML) são, por natureza, mais complexos do que os tradicionais, devido à sua capacidade de aprender e se adaptar com base em dados. Isso cria um ambiente onde o comportamento do sistema pode mudar com o tempo, conforme o modelo de IA é treinado e atualizado. Nesse cenário, os profissionais de Quality Assurance (QA) precisam de novas estratégias para testar esses sistemas dinâmicos e garantir que eles funcionem conforme o esperado em diferentes cenários e condições. Considerando os testes de sistemas de inteligência artificial, indique a alternativa correta.",
    alternatives: makeAlternatives([
      ["A", "Um falso negativo ocorre se o sistema não identifica uma falha crítica."],
      ["B", "Um falso positivo acontece quando o sistema falha em identificar corretamente uma condição que é verdadeira."],
      ["C", "Um falso negativo ocorre quando o sistema identifica incorretamente uma condição como verdadeira quando, na realidade, ela é falsa."],
      ["D", "Um falso positivo ocorre quando o sistema identifica incorretamente uma condição como verdadeira quando, na realidade, ela é falsa."],
      ["E", "Um falso positivo ocorre quando o sistema identifica incorretamente uma condição como falsa quando, na realidade, ela é verdadeira."],
    ]),
    correctAnswerId: "D",
  },
  {
    block: "QUESTÃO 6",
    topic: "PITCH E STARTUPS",
    number: 6,
    question: "Qual é o principal objetivo de um elevator pitch?",
    alternatives: makeAlternatives([
      ["A", "Convencer o interlocutor a se tornar um cliente imediato."],
      ["B", "Despertar o interesse concreto do interlocutor em um curto período de tempo."],
      ["C", "Explicar detalhadamente todos os aspectos financeiros do negócio."],
      ["D", "Apresentar um plano de marketing completo."],
      ["E", "Demonstrar a viabilidade técnica do produto."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "QUESTÃO 7",
    topic: "TESTES DE SOFTWARE",
    number: 7,
    question: "Identifique a alternativa correta.\n\nO que são testes de unidade?",
    alternatives: makeAlternatives([
      ["A", "Testes que focam nos requisitos de negócios da aplicação."],
      ["B", "Testes realizados no nível do código-fonte e focados em métodos e funções individuais."],
      ["C", "Testes que avaliam como o sistema se comporta sob diferentes cargas de trabalho."],
      ["D", "Testes que verificam se alterações no código introduziram novos defeitos em partes já testadas do software."],
      ["E", "Testes que avaliam como diferentes módulos ou serviços interagem quando combinados."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "QUESTÃO 8",
    topic: "TESTES DE SOFTWARE",
    number: 8,
    question:
      "Identifique a alternativa correta.\n\nAlguns testes de software oferecem uma abordagem diferenciada, sem seguir um roteiro predefinido. Esse tipo de teste costuma utilizar uma abordagem criativa e intuitiva. Estamos nos referindo a qual tipo de teste?",
    alternatives: makeAlternatives([
      ["A", "Teste de Unidade."],
      ["B", "Teste de Regressão."],
      ["C", "Teste Funcional."],
      ["D", "Teste Exploratório."],
      ["E", "Teste de Segurança."],
    ]),
    correctAnswerId: "D",
  },
  {
    block: "QUESTÃO 9",
    topic: "DEPLOYMENT",
    number: 9,
    question:
      "Identifique a(s) alternativa(s) correta(s).\n\nSobre estratégias de implantação de solução, é correto afirmar:\n\nI. A estratégia Blue-Green Deployment mantém duas versões idênticas do ambiente de produção: uma versão ativa (blue) e outra versão inativa (green).\n\nII. Na estratégia Recreate Deployment, a implantação é inicialmente realizada para um pequeno grupo especial de usuários. Se a nova versão for bem-sucedida, a implantação é expandida para um grupo maior ou para o restante dos usuários.\n\nIII. A estratégia Shadow Deployment implanta a nova versão da aplicação em paralelo com a versão atual. O tráfego é espelhado (copiado) para a nova versão para testes, mas as respostas não são retornadas aos usuários.",
    alternatives: makeAlternatives([
      ["A", "I."],
      ["B", "I e III."],
      ["C", "I, II e III."],
      ["D", "II e III."],
      ["E", "I e II."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "QUESTÃO 10",
    topic: "ENTREGA CONTÍNUA",
    number: 10,
    question:
      "Identifique a alternativa correta.\n\n\"Direciona uma empresa na criação de um processo simplificado e automatizado de lançamento de software. No centro desse processo há um ciclo de feedback que gira em torno da entrega de software para o usuário final o mais rápido possível, aprendendo com sua experiência prática e, em seguida, incorporando esse feedback na próxima versão.\" Estamos nos referindo ao conceito de:",
    alternatives: makeAlternatives([
      ["A", "Colaboração Contínua."],
      ["B", "Integração Contínua."],
      ["C", "Aplicação Contínua."],
      ["D", "Entrega Contínua."],
      ["E", "Segurança Contínua."],
    ]),
    correctAnswerId: "D",
  },
  {
    block: "QUESTÃO 11",
    topic: "DEPLOYMENT",
    number: 11,
    question:
      "Identifique a alternativa correta.\n\nSão ferramentas utilizadas para o deploy de aplicações:",
    alternatives: makeAlternatives([
      ["A", "Azure Boards, Google App Engine, AWS Elastic."],
      ["B", "Azure App Services, Google App Engine, GitHub Actions."],
      ["C", "Azure App Services, Azure Test Plans, AWS Elastic."],
      ["D", "Azure Test Plans, AWS Elastic, Google App Engine."],
      ["E", "Azure App Services, Google App Engine, AWS Elastic."],
    ]),
    correctAnswerId: "E",
  },
  {
    block: "QUESTÃO 12",
    topic: "AZURE DEVOPS",
    number: 12,
    question: "Identifique a alternativa correta.\n\nSobre backlog, é correto afirmar:",
    alternatives: makeAlternatives([
      ["A", "O backlog permite que equipes de desenvolvimento de software ajustem suas ferramentas de gerenciamento às necessidades específicas do projeto e à metodologia de trabalho da equipe."],
      ["B", "Backlog é uma ferramenta que permite um planejamento eficaz e rápido de projetos através da adição de user stories (histórias de usuário) ou requisitos."],
      ["C", "Backlog representa uma atividade que precisa ser realizada para atender a um requisito específico do projeto."],
      ["D", "Backlog é um modelo de projeto de software ágil, que pode ser utilizado como alternativa ao Scrum."],
      ["E", "Backlog é uma solução de controle de versão que oferece aos desenvolvedores uma plataforma segura e eficiente para gerenciar alterações no código-fonte."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "QUESTÃO 13",
    topic: "PITCH E STARTUPS",
    number: 13,
    question: "De acordo com Klaff (2014), qual é a chave para um pitch de sucesso?",
    alternatives: makeAlternatives([
      ["A", "Apresentar todas as métricas financeiras detalhadamente."],
      ["B", "Utilizar apenas dados e estatísticas para convencer o interlocutor."],
      ["C", "Capturar a atenção do interlocutor de forma eficaz."],
      ["D", "Focar exclusivamente no neocórtex do cérebro humano."],
      ["E", "Evitar qualquer tipo de movimento durante a apresentação."],
    ]),
    correctAnswerId: "C",
  },
  {
    block: "QUESTÃO 14",
    topic: "AZURE DEVOPS",
    number: 14,
    question:
      "Identifique a alternativa correta.\n\nO modelo CMMI (Capability Maturity Model Integration) é indicado para quais tipos de equipes?",
    alternatives: makeAlternatives([
      ["A", "Equipes que buscam uma abordagem direta e sem complicações, ou equipes que não necessitam de processos complexos de gerenciamento."],
      ["B", "Equipes que seguem metodologias de projeto mais estruturadas e que necessitam de um registro auditável de decisões e mudanças."],
      ["C", "Qualquer equipe pode adotar esse modelo, pois ele é bastante flexível e se adapta às necessidades da equipe e ao tamanho do projeto."],
      ["D", "Equipes que utilizam métodos de planejamento Agile mais flexíveis e que precisam de flexibilidade para adaptar seus processos de trabalho conforme o projeto evolui."],
      ["E", "Equipes que já implementam a metodologia ágil Scrum."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "QUESTÃO 15",
    topic: "INTEGRAÇÃO CONTÍNUA",
    number: 15,
    question:
      "Identifique a alternativa correta.\n\nSão exemplos de ferramentas utilizadas para implementar práticas de integração contínua:",
    alternatives: makeAlternatives([
      ["A", "Selenium e LoadRunner."],
      ["B", "Jenkins e JMeter."],
      ["C", "Selenium e Cypress."],
      ["D", "JMeter e LoadRunner."],
      ["E", "Jenkins e CircleCI."],
    ]),
    correctAnswerId: "E",
  },
  {
    block: "QUESTÃO 16",
    topic: "PITCH E STARTUPS",
    number: 16,
    question:
      "Qual das seguintes opções NÃO é uma característica desejável ao descrever o problema que sua startup resolve?",
    alternatives: makeAlternatives([
      ["A", "Ser uma dor significativa para o público-alvo."],
      ["B", "Ser descrito de forma clara e objetiva."],
      ["C", "Ser focado em uma solução específica."],
      ["D", "Ser subjetivo e relevante para o público-alvo."],
      ["E", "Ser agnóstico à solução."],
    ]),
    correctAnswerId: "C",
  },
  {
    block: "QUESTÃO 17",
    topic: "MODELOS DE PROCESSO DE SOFTWARE",
    number: 17,
    question:
      "Identifique a(s) alternativa(s) correta(s).\n\nSobre modelos de processo de software, estão corretas as afirmações:\n\nI. A ideia do modelo Cascata é proporcionar o desenvolvimento e a entrega da solução de forma modular, disponibilizando pacotes funcionais para os usuários e reduzindo, assim, o tempo de espera para se iniciar o aproveitamento do sistema.\n\nII. O conceito da Cascata de projeto consiste em conduzir todo o desenvolvimento como uma sequência de fases que acontecem em sequência, sendo que, uma vez superada uma fase, não se volta para trás.\n\nIII. O ciclo de vida Cascata de projeto foi o primeiro modelo de condução de projetos criado para o universo do desenvolvimento de software.",
    alternatives: makeAlternatives([
      ["A", "Apenas I e II."],
      ["B", "Apenas II e III."],
      ["C", "Apenas I e III."],
      ["D", "Apenas I."],
      ["E", "Apenas III."],
    ]),
    correctAnswerId: "B",
  },
  {
    block: "QUESTÃO 18",
    topic: "MODELO CASCATA",
    number: 18,
    question:
      "Identifique a alternativa correta.\n\nNo modelo de software conhecido como Cascata, o desenvolvimento é conduzido em uma sequência de fases. Assinale a alternativa que apresenta a ordem correta de fases do modelo Cascata:",
    alternatives: makeAlternatives([
      ["A", "Análise, Desenho, Implementação, Testes e Implantação."],
      ["B", "Análise, Desenho, Implementação, Implantação e Testes."],
      ["C", "Análise, Desenho, Implantação, Testes e Implementação."],
      ["D", "Desenho, Análise, Implementação, Implantação e Testes."],
      ["E", "Desenho, Análise, Implementação, Testes e Implantação."],
    ]),
    correctAnswerId: "A",
  },
  {
    block: "QUESTÃO 19",
    topic: "MANUTENÇÃO DE SOFTWARE",
    number: 19,
    question:
      "Identifique a alternativa correta.\n\nAs manutenções pelas quais um sistema pode passar são:",
    alternatives: makeAlternatives([
      ["A", "Corretivas, Adaptativas, Evolutivas e Perfectivas."],
      ["B", "Ágeis, Adaptativas, Evolutivas e Perfectivas."],
      ["C", "Corretivas, Adaptativas, Incrementais e Perfectivas."],
      ["D", "Corretivas, Adaptativas, Evolutivas e Maturação."],
      ["E", "Corretivas, Adaptativas, Evolutivas e Incrementais."],
    ]),
    correctAnswerId: "A",
  },
  {
    block: "QUESTÃO 20",
    topic: "QUALITY ASSURANCE (QA)",
    number: 20,
    question:
      "Identifique a(s) alternativa(s) correta(s).\n\nSobre o papel do Quality Assurance (QA) na metodologia ágil Scrum, estão CORRETAS as afirmativas:\n\nI. No planejamento da sprint (Planning), o QA se mantém atualizado sobre o progresso dos testes e comunica rapidamente qualquer problema encontrado, ajudando a resolver impedimentos que possam impactar a qualidade do produto. Essa comunicação contínua assegura que o trabalho da equipe esteja em sintonia com os padrões de qualidade estabelecidos.\n\nII. Durante a revisão da sprint (Review), o QA valida o incremento do produto para garantir que ele atenda aos requisitos e critérios de aceitação estabelecidos. Isso inclui verificar se as funcionalidades desenvolvidas foram testadas adequadamente e se estão prontas para entrega.\n\nIII. Nas reuniões diárias (Daily), o QA colabora com o Product Owner e a equipe de desenvolvimento para entender os requisitos e definir os critérios de aceitação para os itens do backlog. Essa colaboração inicial é crucial para garantir que os objetivos de qualidade sejam claros e alinhados desde o começo do projeto.",
    alternatives: makeAlternatives([
      ["A", "II."],
      ["B", "I e II."],
      ["C", "III."],
      ["D", "I e III."],
      ["E", "I."],
    ]),
    correctAnswerId: "A",
  },
];

const appElement = document.querySelector<HTMLElement>("#app");

if (!appElement) {
  throw new Error("Elemento principal da aplicação não encontrado.");
}

const app: HTMLElement = appElement;

const state: QuizState = {
  started: false,
  finished: false,
  currentQuestionIndex: 0,
  isAnswering: false,
  currentAlternatives: [],
};

function shuffleArray<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let currentIndex = shuffled.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
}

function prepareQuestionAlternatives(): void {
  const question = questions[state.currentQuestionIndex];

  if (!question) {
    finishQuiz();
    return;
  }

  state.currentAlternatives = shuffleArray(question.alternatives);
}

function resetQuizState(): void {
  state.started = true;
  state.finished = false;
  state.currentQuestionIndex = 0;
  state.isAnswering = false;
  state.currentAlternatives = [];
}

function startQuiz(): void {
  resetQuizState();
  prepareQuestionAlternatives();
  renderQuestion();
}

function restartQuiz(): void {
  startQuiz();
}

function renderStartScreen(): void {
  app.className = "min-h-dvh";
  app.replaceChildren();

  const shell = createElement("section", "screen-shell centered-screen");
  shell.setAttribute("aria-labelledby", "start-title");
  const card = createElement("div", "hero-card");
  const eyebrow = createElement("p", "eyebrow", "FIAP • FASE 6");
  const title = createElement("h1", "hero-title", "QUIZ DE ESTUDOS");
  title.id = "start-title";
  const copy = createElement(
    "p",
    "hero-copy",
    "Teste seus conhecimentos sobre os conteúdos da FIAP.",
  );
  const count = createElement(
    "p",
    "question-count",
    `${questions.length} questões`,
  );
  const startButton = createElement("button", "primary-button", "Iniciar");
  startButton.type = "button";
  startButton.addEventListener("click", startQuiz);

  card.append(eyebrow, title, copy, count, document.createElement("br"), startButton);
  shell.append(card);
  app.append(shell);
}

function renderQuestion(): void {
  const question = questions[state.currentQuestionIndex];

  if (!question) {
    finishQuiz();
    return;
  }

  app.replaceChildren();

  const shell = createElement("section", "screen-shell quiz-screen");
  shell.setAttribute("aria-labelledby", "question-heading");
  const panel = createElement("div", "quiz-panel");
  const blockLabel = createElement("header", "block-label");
  blockLabel.append(
    createElement("span", "block-number", question.block),
    createElement("span", "block-name", question.topic),
  );

  const progress = createProgress();
  const questionCard = createElement("article", "question-card");
  const heading = createElement("h1", "question-text", question.question);
  heading.id = "question-heading";
  heading.tabIndex = -1;

  const answers = createElement("div", "answers-list");
  answers.setAttribute("role", "group");
  answers.setAttribute(
    "aria-label",
    `Alternativas da questão ${state.currentQuestionIndex + 1}`,
  );

  for (const alternative of state.currentAlternatives) {
    answers.append(createAnswerButton(alternative));
  }

  questionCard.append(heading, answers);
  panel.append(blockLabel, progress, questionCard);
  shell.append(panel);
  app.append(shell);

  requestAnimationFrame(() => heading.focus({ preventScroll: true }));
}

function createProgress(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const current = state.currentQuestionIndex + 1;
  const percentage = Math.round((current / questions.length) * 100);
  const meta = createElement("div", "progress-meta");
  meta.append(
    createElement("span", "", `Questão ${current} de ${questions.length}`),
    createElement("span", "progress-percent", `${percentage}%`),
  );

  const track = createElement("div", "progress-track");
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-label", "Progresso do quiz");
  track.setAttribute("aria-valuemin", "1");
  track.setAttribute("aria-valuemax", String(questions.length));
  track.setAttribute("aria-valuenow", String(current));
  const fill = createElement("div", "progress-fill");
  fill.style.width = `${percentage}%`;
  track.append(fill);
  fragment.append(meta, track);

  return fragment;
}

function createAnswerButton(alternative: Alternative): HTMLButtonElement {
  const button = createElement("button", "answer-button");
  button.type = "button";
  button.setAttribute("aria-label", alternative.text);

  button.append(
    createElement("span", "answer-fill"),
    createElement("span", "answer-text", alternative.text),
  );
  button.addEventListener("click", () => handleAnswer(alternative.id, button));

  return button;
}

function handleAnswer(
  selectedId: AlternativeId,
  selectedButton: HTMLButtonElement,
): void {
  if (state.isAnswering || state.finished) {
    return;
  }

  const question = questions[state.currentQuestionIndex];

  if (!question) {
    return;
  }

  state.isAnswering = true;
  setAllAnswerButtonsDisabled(true);

  if (selectedId === question.correctAnswerId) {
    handleCorrectAnswer(selectedButton);
  } else {
    handleWrongAnswer(selectedButton);
  }
}

function handleCorrectAnswer(selectedButton: HTMLButtonElement): void {
  selectedButton.classList.add("is-correct", "is-animating");
  waitForAnswerAnimation(
    selectedButton,
    CORRECT_ANIMATION_DURATION_MS,
    goToNextQuestion,
  );
}

function handleWrongAnswer(selectedButton: HTMLButtonElement): void {
  selectedButton.classList.add("is-wrong", "is-animating");
  waitForAnswerAnimation(selectedButton, WRONG_ANIMATION_DURATION_MS, () => {
    selectedButton.classList.remove("is-wrong", "is-animating");
    selectedButton.blur();
    state.isAnswering = false;
    setAllAnswerButtonsDisabled(false);
  });
}

function setAllAnswerButtonsDisabled(disabled: boolean): void {
  const buttons = app.querySelectorAll<HTMLButtonElement>(".answer-button");

  for (const button of buttons) {
    button.disabled = disabled;
  }
}

function waitForAnswerAnimation(
  selectedButton: HTMLButtonElement,
  durationMs: number,
  onComplete: () => void,
): void {
  const fill = selectedButton.querySelector<HTMLElement>(".answer-fill");
  let completed = false;

  const completeOnce = (): void => {
    if (completed) {
      return;
    }

    completed = true;
    onComplete();
  };

  fill?.addEventListener("animationend", completeOnce, { once: true });

  // Fallback para ambientes que não disparam animationend.
  window.setTimeout(completeOnce, durationMs + 100);
}

function goToNextQuestion(): void {
  const nextIndex = state.currentQuestionIndex + 1;

  if (nextIndex >= questions.length) {
    finishQuiz();
    return;
  }

  state.currentQuestionIndex = nextIndex;
  state.isAnswering = false;
  prepareQuestionAlternatives();
  renderQuestion();
}

function finishQuiz(): void {
  state.finished = true;
  state.isAnswering = false;
  state.currentAlternatives = [];
  renderFinishScreen();
}

function renderFinishScreen(): void {
  app.replaceChildren();

  const shell = createElement("section", "screen-shell centered-screen");
  shell.setAttribute("aria-labelledby", "finish-title");
  const card = createElement("div", "hero-card");
  const eyebrow = createElement("p", "eyebrow", "JORNADA FINALIZADA");
  const title = createElement("h1", "hero-title", "QUIZ CONCLUÍDO");
  title.id = "finish-title";
  title.tabIndex = -1;
  const copy = createElement(
    "p",
    "hero-copy",
    "Você respondeu todas as questões corretamente.",
  );
  const score = createElement(
    "p",
    "finish-score",
    `${questions.length} / ${questions.length}`,
  );
  const restartButton = createElement("button", "primary-button", "Recomeçar");
  restartButton.type = "button";
  restartButton.addEventListener("click", restartQuiz);

  card.append(eyebrow, title, copy, score, restartButton);
  shell.append(card);
  app.append(shell);
  requestAnimationFrame(() => title.focus({ preventScroll: true }));
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className = "",
  text = "",
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.className = className;

  if (text) {
    element.textContent = text;
  }

  return element;
}

renderStartScreen();
