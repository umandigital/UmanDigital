# Site Uman Digital

Site institucional da Uman Digital. Astro (build estático) + Tailwind CSS 4.

## Regra de design — obrigatória

**Todo trabalho de design passa pelas skills instaladas. Sem exceção.**

Antes de escrever qualquer linha de UI — página, componente, seção, layout,
paleta, tipografia, animação — acione as skills, nesta ordem:

1. **`ui-ux-pro-max`** — consulte primeiro. Traz dados locais pesquisáveis:
   paletas por tipo de produto, pares tipográficos, diretrizes de UX, ícones,
   presets de animação e padrões específicos por stack (inclusive Astro).
   Use para fundamentar as escolhas em dados, não em intuição.
2. **`frontend-design`** — a direção estética. Define o ponto de vista visual,
   evita resultado que pareça template e obriga uma escolha autoral defensável.

Conforme o caso, some a estas:

| Situação | Skill |
| --- | --- |
| Tokens, escalas, arquitetura de design system | `design-system` |
| Componentes, Tailwind, acessibilidade, tema escuro | `ui-styling` |
| Identidade, tom de voz, consistência de marca | `brand` |
| Logo, ícones, identidade visual, peças gráficas | `design` |
| Banners, peças para redes sociais e anúncios | `banner-design` |
| Apresentações em HTML | `slides` |

Isto vale para pedidos diretos ("faça a home") e indiretos ("ajusta o
espaçamento", "essa seção está estranha"). Se o pedido toca no visual, as
skills entram antes do código.

Duas ressalvas conhecidas:

- `ui-styling` inclui `shadcn_add.py`, que roda `npx shadcn add` e pressupõe
  **React**. Este site é Astro: aproveite as referências de Tailwind e
  acessibilidade da skill, mas não rode o instalador de componentes.
- `design-system` propõe tokens em `assets/design-tokens.json` +
  `docs/brand-guidelines.md`. Este projeto já tem sua arquitetura de tokens em
  `src/styles/global.css`. **Não crie um segundo sistema de tokens** — adapte
  o que a skill recomendar para o arquivo que já existe.

## Comandos

```bash
npm run dev      # http://localhost:4321
npm run build    # type-check + build estático em dist/
npm run preview  # serve o build de produção
```

`npm run build` precisa passar antes de qualquer push.

## Onde fica o quê

```
src/
├── components/      # componentes .astro reutilizáveis
├── config/site.ts   # domínio, contato, navegação
├── layouts/         # BaseLayout: <head>, SEO, header, footer
├── pages/           # cada arquivo é uma rota
└── styles/global.css # tokens de marca e estilos base
```

## Convenções

**Estilo.** `global.css` tem duas camadas: `@theme` com os tokens brutos
(paleta, fontes, espaçamentos) e `@layer base` com a semântica (`--surface`,
`--text`, `--accent`, `--border`). **Componentes consomem só a camada
semântica.** É o que permite trocar a identidade inteira mexendo em um arquivo.

**Acessibilidade.** Contraste mínimo AA, foco visível, HTML semântico e
`prefers-reduced-motion` respeitado. Não são opcionais.

**Idioma.** Interface, conteúdo, comentários e mensagens de commit em
português do Brasil.

**Git.** Uma branch por mudança, a partir de `main`. Commits no imperativo.

## Estado atual

O site está em construção. A identidade visual ainda não foi definida — os
valores em `global.css` e o domínio `umandigital.com.br` são **provisórios**.
As pendências estão listadas no README.
