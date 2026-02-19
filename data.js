// js/data.js
const CURRICULUM = [
  {
    id: 1,
    title: "Mês 1 — Fundamentos (Lógica)",
    weeks: [
      { id: 1, title: "Semana 1 — Base", tasks: [
        "Variáveis e tipos",
        "Operadores (aritméticos/lógicos)",
        "Entrada/saída (prompt/console)",
        "Exercícios: 10 problemas fáceis",
        "Revisão: anotações + resumo"
      ]},
      { id: 2, title: "Semana 2 — Controle", tasks: [
        "if/else (condições)",
        "switch (casos)",
        "Exercícios: 15 condições",
        "Mini-desafio: cálculo de IMC + status",
        "Revisão: erros comuns"
      ]},
      { id: 3, title: "Semana 3 — Repetição", tasks: [
        "for e while",
        "break/continue",
        "Exercícios: 15 loops",
        "Mini-desafio: tabuada + soma",
        "Revisão: padrões de loop"
      ]},
      { id: 4, title: "Semana 4 — Funções", tasks: [
        "Funções (parâmetros/retorno)",
        "Escopo (local/global)",
        "Exercícios: 15 funções",
        "Mini-projeto: calculadora no console",
        "Checklist: sei fazer sem IA?"
      ]},
    ]
  },

  {
    id: 2,
    title: "Mês 2 — JavaScript (Base Forte)",
    weeks: [
      { id: 1, title: "Semana 1 — Arrays", tasks: [
        "Arrays: push/pop/shift/unshift",
        "forEach, map, filter",
        "Exercícios: 12 com arrays",
        "Mini-desafio: lista de compras",
        "Revisão: map vs filter"
      ]},
      { id: 2, title: "Semana 2 — Objetos", tasks: [
        "Objetos: keys/values",
        "Destructuring",
        "Exercícios: 12 com objetos",
        "Mini-desafio: cadastro de usuário",
        "Revisão: objeto vs array"
      ]},
      { id: 3, title: "Semana 3 — Funções avançadas", tasks: [
        "Arrow functions",
        "Callbacks",
        "Closures (noção)",
        "Exercícios: 10 callbacks",
        "Revisão: escopo na prática"
      ]},
      { id: 4, title: "Semana 4 — Async", tasks: [
        "Promise (then/catch)",
        "async/await",
        "fetch básico",
        "Mini-projeto: consumir API pública",
        "Checklist: entendi async?"
      ]},
    ]
  },

  {
    id: 3,
    title: "Mês 3 — HTML + CSS (Profissional)",
    weeks: [
      { id: 1, title: "Semana 1 — HTML", tasks: [
        "HTML semântico (header/main/footer)",
        "Forms (input/label)",
        "Acessibilidade básica",
        "Exercícios: montar 2 páginas",
        "Revisão: semântica"
      ]},
      { id: 2, title: "Semana 2 — CSS base", tasks: [
        "Box model",
        "Flexbox",
        "Responsividade (media queries)",
        "Exercícios: 3 layouts",
        "Revisão: alinhamento"
      ]},
      { id: 3, title: "Semana 3 — CSS avançando", tasks: [
        "Grid",
        "Tipografia (hierarquia)",
        "Componentes reutilizáveis",
        "Exercícios: layout dashboard",
        "Revisão: grid vs flex"
      ]},
      { id: 4, title: "Semana 4 — Projeto UI", tasks: [
        "Landing page moderna",
        "Responsivo mobile",
        "Refino visual (spacing/cards)",
        "Subir no GitHub Pages",
        "Checklist: apresentável?"
      ]},
    ]
  },

  {
    id: 4,
    title: "Mês 4 — Git + Organização",
    weeks: [
      { id: 1, title: "Semana 1 — Git básico", tasks: [
        "init/add/commit",
        "status/log",
        "branches (criar/merge)",
        "Exercícios: commits organizados",
        "Revisão: boas mensagens"
      ]},
      { id: 2, title: "Semana 2 — GitHub", tasks: [
        "Repositório + README",
        "Issues (organização)",
        "Deploy (Pages)",
        "Publicar 1 projeto",
        "Revisão: portfólio"
      ]},
      { id: 3, title: "Semana 3 — Clean code", tasks: [
        "Nomes bons",
        "Funções pequenas",
        "Separar arquivos",
        "Refatorar projeto antigo",
        "Revisão: o que melhorou?"
      ]},
      { id: 4, title: "Semana 4 — Projeto organizado", tasks: [
        "Estrutura de pastas padrão",
        "Componentização no JS",
        "Melhorar DevTrack",
        "Commits por feature",
        "Checklist: padrão pro"
      ]},
    ]
  },

  {
    id: 5,
    title: "Mês 5 — React (Base)",
    weeks: [
      { id: 1, title: "Semana 1 — Começo", tasks: [
        "JSX e componentes",
        "Props",
        "State básico",
        "Exercícios: 5 componentes",
        "Revisão: fluxo de dados"
      ]},
      { id: 2, title: "Semana 2 — Listas", tasks: [
        "Renderizar listas",
        "Keys",
        "Eventos",
        "Projeto: Todo List",
        "Revisão: estado"
      ]},
      { id: 3, title: "Semana 3 — useEffect", tasks: [
        "useEffect",
        "Fetch em React",
        "Loading/erro",
        "Exercício: consumir API",
        "Revisão: dependências"
      ]},
      { id: 4, title: "Semana 4 — Projeto React 1", tasks: [
        "Dashboard simples",
        "Organização de componentes",
        "Estilização",
        "Deploy",
        "Checklist: no portfólio"
      ]},
    ]
  },

  {
    id: 6,
    title: "Mês 6 — React (Avançando)",
    weeks: [
      { id: 1, title: "Semana 1 — Context", tasks: [
        "Context API",
        "Estado global simples",
        "Exercício: tema global",
        "Revisão: quando usar",
        "Refino: organização"
      ]},
      { id: 2, title: "Semana 2 — Forms", tasks: [
        "Forms controlados",
        "Validação básica",
        "Cadastro/login fake",
        "Revisão: inputs",
        "Refino: UX"
      ]},
      { id: 3, title: "Semana 3 — Performance", tasks: [
        "memo/useMemo (noção)",
        "Evitar rerender",
        "Otimizar lista",
        "Revisão: performance",
        "Boas práticas"
      ]},
      { id: 4, title: "Semana 4 — Projeto React 2", tasks: [
        "CRUD no front (mock)",
        "Layout profissional",
        "Componentes reutilizáveis",
        "Deploy",
        "Checklist: projeto top"
      ]},
    ]
  },

  {
    id: 7,
    title: "Mês 7 — Estruturas de Dados",
    weeks: [
      { id: 1, title: "Semana 1 — Big O", tasks: [
        "Big O (noção)",
        "Tempo vs espaço",
        "Analisar 10 trechos",
        "Revisão: O(n), O(n²)",
        "Aplicar no JS"
      ]},
      { id: 2, title: "Semana 2 — Pilha/Fila", tasks: [
        "Stack",
        "Queue",
        "Implementar simples",
        "Mini-desafio: desfazer",
        "Revisão"
      ]},
      { id: 3, title: "Semana 3 — Recursão", tasks: [
        "Recursão base",
        "Caso base",
        "10 exercícios",
        "Fatorial/fibo",
        "Revisão"
      ]},
      { id: 4, title: "Semana 4 — Problemas", tasks: [
        "Resolver 20 desafios",
        "Organizar soluções",
        "Refazer os difíceis",
        "README com explicações",
        "Checklist: evolução"
      ]},
    ]
  },

  {
    id: 8,
    title: "Mês 8 — Backend (Node + Express)",
    weeks: [
      { id: 1, title: "Semana 1 — Node", tasks: [
        "Node básico",
        "npm",
        "módulos",
        "Scripts simples",
        "Revisão"
      ]},
      { id: 2, title: "Semana 2 — Express", tasks: [
        "Rotas GET/POST",
        "Middlewares",
        "Status codes",
        "API simples",
        "Revisão"
      ]},
      { id: 3, title: "Semana 3 — REST", tasks: [
        "CRUD REST",
        "Validação simples",
        "API CRUD",
        "Revisão: padrões",
        "Documentar rotas"
      ]},
      { id: 4, title: "Semana 4 — Integração", tasks: [
        "Front consumindo API",
        "CORS",
        "Tratamento de erro",
        "Mini fullstack",
        "Checklist: rodou local"
      ]},
    ]
  },

  {
    id: 9,
    title: "Mês 9 — Banco de Dados (SQL)",
    weeks: [
      { id: 1, title: "Semana 1 — SQL base", tasks: [
        "SELECT/WHERE",
        "ORDER BY/LIMIT",
        "20 queries",
        "Revisão",
        "Boas práticas"
      ]},
      { id: 2, title: "Semana 2 — Relacionamentos", tasks: [
        "PK/FK",
        "JOIN",
        "15 joins",
        "Revisão",
        "Modelagem simples"
      ]},
      { id: 3, title: "Semana 3 — Node + DB", tasks: [
        "Conectar Node ao DB",
        "CRUD com banco",
        "API com DB",
        "Revisão",
        "Erros"
      ]},
      { id: 4, title: "Semana 4 — Projeto DB", tasks: [
        "API completa",
        "Documentação",
        "Testes manuais",
        "Refino",
        "Checklist: persistência"
      ]},
    ]
  },

  {
    id: 10,
    title: "Mês 10 — Engenharia (Boas práticas)",
    weeks: [
      { id: 1, title: "Semana 1 — SOLID (noção)", tasks: [
        "SRP (responsabilidade única)",
        "Exemplos",
        "Refatorar",
        "Revisão",
        "Aplicar no projeto"
      ]},
      { id: 2, title: "Semana 2 — Arquitetura", tasks: [
        "Camadas",
        "Controllers/Services",
        "Pastas backend",
        "Revisão",
        "Aplicar"
      ]},
      { id: 3, title: "Semana 3 — Auth (noção)", tasks: [
        "JWT (noção)",
        "Hash senha (noção)",
        "Fluxo login",
        "Revisão",
        "Boas práticas"
      ]},
      { id: 4, title: "Semana 4 — Refino final", tasks: [
        "Melhorar fullstack",
        "README forte",
        "Demo/prints",
        "Bugs",
        "Checklist: pronto pra mostrar"
      ]},
    ]
  },

  {
    id: 11,
    title: "Mês 11 — Projeto Grande (Portfólio)",
    weeks: [
      { id: 1, title: "Semana 1 — Planejar", tasks: [
        "Definir ideia",
        "MVP (escopo mínimo)",
        "Telas/rotas",
        "Tarefas no GitHub",
        "Checklist: plano"
      ]},
      { id: 2, title: "Semana 2 — Front", tasks: [
        "UI completa",
        "Componentes",
        "Navegação",
        "Consumir API",
        "Checklist: front"
      ]},
      { id: 3, title: "Semana 3 — Back", tasks: [
        "API completa",
        "Banco modelado",
        "Validações",
        "Erros/logs",
        "Checklist: back"
      ]},
      { id: 4, title: "Semana 4 — Finalizar", tasks: [
        "Deploy",
        "Documentar",
        "Corrigir bugs",
        "Polir UX",
        "Checklist: projeto principal"
      ]},
    ]
  },

  {
    id: 12,
    title: "Mês 12 — Mercado (Júnior/Estágio)",
    weeks: [
      { id: 1, title: "Semana 1 — Perfil", tasks: [
        "Organizar GitHub",
        "README dos projetos",
        "Currículo",
        "LinkedIn",
        "Checklist: apresentação"
      ]},
      { id: 2, title: "Semana 2 — Entrevista", tasks: [
        "Perguntas comuns",
        "Explicar projetos",
        "Treinar fala 5 min",
        "Revisar fundamentos",
        "Checklist: pronto"
      ]},
      { id: 3, title: "Semana 3 — Teste técnico", tasks: [
        "10 desafios",
        "Arrays/strings",
        "Lógica",
        "Refatorar",
        "Checklist: evolução"
      ]},
      { id: 4, title: "Semana 4 — Aplicar", tasks: [
        "Candidatar vagas",
        "Melhorar portfólio",
        "Acompanhar retorno",
        "Ajustar pontos fracos",
        "Checklist: consistência"
      ]},
    ]
  },
];

window.CURRICULUM = CURRICULUM;
