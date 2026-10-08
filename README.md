# Quiz de Estudos — FIAP

Aplicação web de quiz desenvolvida para revisar os conteúdos da fase 6 da FIAP. O projeto foi construído sem frameworks de interface, usando apenas HTML5, TypeScript, Tailwind CSS v4, Vite e a DOM API nativa do navegador.

A aplicação apresenta as perguntas sempre na ordem original do material, mas embaralha as alternativas de cada questão. Respostas erradas mantêm o usuário na pergunta atual, enquanto respostas corretas avançam automaticamente para a próxima questão.

## Demonstração do fluxo

1. A aplicação exibe a tela inicial e a quantidade total de questões.
2. O usuário seleciona **Iniciar**.
3. A primeira questão é carregada com as alternativas embaralhadas.
4. Uma resposta incorreta recebe uma animação vermelha e fica desabilitada.
5. O usuário continua na mesma questão e pode tentar novamente.
6. Uma resposta correta recebe uma animação verde.
7. Após o feedback visual, a próxima questão é carregada automaticamente.
8. Depois da última resposta correta, a tela de conclusão é exibida.
9. O botão **Recomeçar** limpa o estado e inicia novamente pela primeira questão.

## Tecnologias utilizadas

| Tecnologia | Versão instalada | Utilização |
| --- | --- | --- |
| HTML5 | Nativa do navegador | Estrutura semântica e ponto de entrada da aplicação |
| TypeScript | 7.0.2 | Dataset, estado, regras do quiz e manipulação do DOM |
| Tailwind CSS | 4.3.3 | Processamento de estilos e classes utilitárias |
| `@tailwindcss/vite` | 4.3.3 | Integração oficial do Tailwind CSS v4 com o Vite |
| Vite | 8.3.3 | Servidor de desenvolvimento e build de produção |
| npm | Gerenciador do ambiente | Instalação das dependências e execução dos scripts |

O projeto não utiliza React, Vue, Angular, Next.js, jQuery, Bootstrap ou bibliotecas de componentes.

## Funcionalidades

- Tela inicial com contagem dinâmica de questões.
- 20 questões distribuídas em 12 temas da fase 6.
- Perguntas mantidas sempre na ordem definida no dataset.
- Alternativas embaralhadas com o algoritmo Fisher–Yates.
- Preservação da letra original de cada alternativa depois do embaralhamento.
- Validação pela identidade original da alternativa, e não por sua posição visual.
- Ordem das alternativas mantida durante todas as tentativas da mesma questão.
- Feedback animado em vermelho para respostas incorretas.
- Feedback animado em verde para respostas corretas.
- Bloqueio contra cliques múltiplos durante o feedback visual.
- Alternativas incorretas voltam ao estado normal após o feedback visual.
- Avanço automático após uma resposta correta.
- Barra de progresso e porcentagem calculadas dinamicamente.
- Identificação do bloco temático atual.
- Tela de conclusão com resultado total.
- Reinício do quiz sem recarregar a página.
- Nova ordem possível das alternativas a cada reinício.
- Layout responsivo para celulares, tablets e desktops.
- Navegação por teclado e foco visível.
- Suporte a `prefers-reduced-motion`.

## Conteúdo do simulado

O dataset ativo contém 20 questões. A quantidade apresentada na interface é calculada usando `questions.length`, sem valores fixos no HTML.

| Tema | Questões |
| --- | ---: |
| Ciclo de vida de software | 1 |
| Azure DevOps | 3 |
| Integração contínua | 2 |
| Deployment | 3 |
| Testes de inteligência artificial | 1 |
| Pitch e Startups | 3 |
| Testes de software | 2 |
| Entrega contínua | 1 |
| Modelos de processo de software | 1 |
| Modelo Cascata | 1 |
| Manutenção de software | 1 |
| Quality Assurance (QA) | 1 |
| **Total** | **20** |

## Estrutura do projeto

```text
fiap-phase-six/
├── .gitignore           # Arquivos locais e gerados ignorados pelo Git
├── component.html       # Estrutura HTML principal e carregamento da aplicação
├── component.ts         # Dataset, estado, renderização e regras do quiz
├── styles.css           # Tailwind CSS v4, tema visual e animações
├── vite.config.ts       # Integração do Tailwind e entrada do build
├── tsconfig.json        # Configuração estrita do TypeScript
├── package.json         # Metadados, scripts e dependências
├── package-lock.json    # Versões exatas instaladas pelo npm
└── dist/                # Resultado local do build (ignorado pelo Git)
```

## Arquitetura da aplicação

### `component.html`

Contém somente a estrutura essencial da página:

- metadados do documento;
- configuração de viewport para responsividade;
- carregamento da fonte Inter;
- elemento principal `#app`;
- carregamento do módulo `component.ts`.

As perguntas não são duplicadas no HTML. Todo o conteúdo do quiz permanece no TypeScript.

### `component.ts`

Concentra toda a lógica principal da aplicação:

- tipos e interfaces;
- dataset das questões;
- estado atual do quiz;
- embaralhamento das alternativas;
- criação dos elementos da interface;
- validação das respostas;
- controle das animações;
- avanço entre questões;
- barra de progresso;
- tela inicial e tela de conclusão;
- reinicialização do estado.

A interface `QuizState` organiza os dados mutáveis:

```ts
interface QuizState {
  started: boolean;
  finished: boolean;
  currentQuestionIndex: number;
  isAnswering: boolean;
  currentAlternatives: Alternative[];
}
```

### `styles.css`

Utiliza a sintaxe atual do Tailwind CSS v4:

```css
@import "tailwindcss";
```

O arquivo também define os componentes visuais específicos do projeto, como:

- fundo escuro com destaque radial vermelho;
- cards das telas e alternativas;
- estados de foco e hover;
- barra de progresso;
- preenchimento animado das respostas;
- ajustes para telas pequenas;
- redução de movimento conforme a preferência do sistema.

### `vite.config.ts`

O Tailwind CSS é integrado diretamente ao Vite por meio do plugin oficial:

```ts
import tailwindcss from "@tailwindcss/vite";
```

O arquivo `component.html` é definido como a entrada do build. Isso mantém a estrutura solicitada sem a necessidade de um `index.html` adicional.

## Embaralhamento das alternativas

Somente as alternativas são embaralhadas. O array de perguntas nunca é reorganizado.

O projeto usa Fisher–Yates e sempre cria uma nova cópia do array recebido:

```ts
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
```

Cada alternativa possui um identificador original entre `A` e `E`. Esse identificador permanece associado ao texto mesmo quando sua posição visual muda.

```ts
interface Alternative {
  readonly id: AlternativeId;
  readonly text: string;
}
```

A resposta correta é comparada com `correctAnswerId`. A aplicação nunca usa o índice visual do botão para validar a resposta.

As alternativas são embaralhadas uma única vez quando a questão é preparada. Se o usuário errar, a interface não prepara a questão novamente e a ordem continua igual.

## Feedback das respostas

Cada alternativa é um elemento `<button>` com um preenchimento interno posicionado de forma absoluta. Ao responder, esse preenchimento cresce horizontalmente usando `transform: scaleX()` e `transform-origin: left`.

- **Resposta incorreta:** preenchimento vermelho por 1,5 segundo e retorno completo ao estado normal, permanecendo na mesma questão.
- **Resposta correta:** preenchimento verde por 2 segundos, bloqueio temporário de todas as opções e avanço somente após o término da animação.

O estado `isAnswering` impede que cliques rápidos façam a aplicação avançar mais de uma questão.

## Acessibilidade

A aplicação inclui:

- botões nativos para todas as ações;
- navegação completa por teclado;
- indicadores de foco visíveis;
- descrições `aria-label` nas alternativas;
- agrupamento semântico das respostas;
- atributos ARIA na barra de progresso;
- títulos focados ao trocar de tela ou questão;
- estado `disabled` durante os períodos de animação;
- contraste alto entre fundo, cards e textos;
- região principal com `aria-live="polite"`;
- suporte à preferência de redução de movimento.

Quando `prefers-reduced-motion: reduce` está habilitado, as transições decorativas são reduzidas. As animações de resposta preservam suas durações funcionais para manter sincronizados o feedback e a troca de questão.

## Responsividade

O conteúdo é centralizado em um container com largura máxima próxima de 896 px. Espaçamentos, títulos e textos utilizam valores fluidos com `clamp()`.

Em telas pequenas:

- o padding lateral é reduzido;
- os cards ocupam praticamente toda a largura disponível;
- os botões mantêm uma área de toque confortável;
- os textos podem quebrar sem gerar rolagem horizontal;
- o texto das alternativas permanece legível e sem indicadores de letra.

Em telas maiores, a largura é controlada para manter linhas legíveis e evitar que o conteúdo fique excessivamente espalhado.

## Pré-requisitos

Para executar o projeto, é necessário ter instalado:

- Node.js compatível com Vite 8;
- npm.

O projeto foi validado no Node.js 24.21.0.

## Instalação

Clone ou copie o projeto e acesse sua pasta:

```bash
cd fiap-phase-six
```

Instale as dependências:

```bash
npm install
```

## Ambiente de desenvolvimento

Execute:

```bash
npm run dev
```

O Vite iniciará o servidor e abrirá automaticamente:

```text
http://localhost:5173/component.html
```

Alterações nos arquivos são atualizadas automaticamente durante o desenvolvimento.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento e abre `component.html` |
| `npm run typecheck` | Executa a validação estrita do TypeScript sem gerar arquivos |
| `npm run build` | Executa o typecheck e gera o build otimizado em `dist/` |
| `npm run preview` | Serve localmente o resultado do build para conferência |

## Build de produção

Execute:

```bash
npm run build
```

O script primeiro valida o TypeScript com `tsc --noEmit`. O Vite só inicia a compilação de produção se não houver erros de tipagem.

Os arquivos otimizados serão criados na pasta `dist/`.

Para visualizar o build:

```bash
npm run preview
```

## Como adicionar uma questão

As questões são declaradas no array `questions`, dentro de `component.ts`. Uma nova entrada deve seguir esta estrutura:

```ts
{
  block: "QUESTÃO 21",
  topic: "NOVO TEMA",
  number: 21,
  question: "Texto da pergunta",
  alternatives: makeAlternatives([
    ["A", "Primeira alternativa"],
    ["B", "Segunda alternativa"],
    ["C", "Terceira alternativa"],
    ["D", "Quarta alternativa"],
    ["E", "Quinta alternativa"],
  ]),
  correctAnswerId: "C",
}
```

Cuidados ao atualizar o dataset:

1. Mantenha as perguntas na ordem em que devem ser exibidas.
2. Preserve a associação entre letra e texto.
3. Informe a resposta em `correctAnswerId` usando o ID original.
4. Não embaralhe o array `questions`.
5. Não coloque a resposta correta no HTML ou em atributos visíveis do botão.
6. Execute o typecheck e o build depois da alteração.

A contagem, o progresso e a pontuação final serão atualizados automaticamente.

## Personalização visual

As principais cores estão definidas diretamente em `styles.css`:

- fundo principal: `#000000`;
- cards: `#111111` e `#18181b`;
- destaque principal: `#dc2626`, `#ef4444` e `#f43f5e`;
- resposta correta: `#16a34a` e `#22c55e`;
- textos principais: `#f4f4f5` e `#ffffff`;
- textos auxiliares: `#a1a1aa` e `#71717a`.

Também é possível ajustar no mesmo arquivo:

- duração das animações;
- largura máxima do container;
- espaçamentos;
- tamanhos de fonte;
- raio dos cards;
- comportamento nos breakpoints.

## Validações realizadas

O projeto foi conferido com os seguintes resultados:

- TypeScript em modo estrito: aprovado;
- Tailwind CSS v4 integrado ao Vite: aprovado;
- build de produção: aprovado;
- servidor de desenvolvimento: resposta HTTP 200;
- gabarito das 20 questões: conferido;
- todas as questões possuem cinco alternativas;
- dependências npm: nenhuma vulnerabilidade encontrada na última auditoria.

## Licença

Este projeto está configurado com a licença MIT.
