# Site Uman Digital

Site institucional da Uman Digital, construído com [Astro](https://astro.build)
e [Tailwind CSS](https://tailwindcss.com).

## Requisitos

- Node.js 22 ou superior
- npm 10 ou superior

## Rodando localmente

```bash
npm install
npm run dev     # http://localhost:4321
```

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Roda o type-check e gera o site estático em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run astro` | Acesso direto ao CLI do Astro |

## Estrutura

```
.
├── astro.config.mjs        # Config do Astro: domínio, sitemap, Tailwind
├── public/                 # Servido como está: favicon, robots.txt, imagens
└── src/
    ├── components/         # Componentes reutilizáveis (.astro)
    ├── config/site.ts      # Nome, domínio, contato, menu de navegação
    ├── layouts/            # BaseLayout: <head>, SEO, header e footer
    ├── pages/              # Cada arquivo vira uma rota
    └── styles/global.css   # Tokens de marca e estilos base
```

## Onde mexer no visual

Toda a identidade visual sai de `src/styles/global.css`:

- O bloco `@theme` define os **tokens brutos** — paleta, fontes, espaçamentos.
- O bloco `@layer base` define a **semântica** — `--surface`, `--text`,
  `--accent` e afins, com as variações de tema claro e escuro.

Os componentes consomem apenas as variáveis semânticas. Na prática: para trocar
a identidade do site inteiro, mude os valores desse arquivo — nenhum componente
precisa ser tocado.

## Pendências antes de publicar

- [ ] Definir a identidade visual e aplicar nos tokens
- [ ] Trocar o domínio provisório em `astro.config.mjs`, `src/config/site.ts` e `public/robots.txt`
- [ ] Preencher e-mail, telefone e redes sociais em `src/config/site.ts`
- [ ] Escrever a descrição real do site (usada em SEO e Open Graph)
- [ ] Adicionar `public/og-default.png` (1200×630) para compartilhamento
- [ ] Remover o `noindex` de `src/pages/index.astro` quando o conteúdo estiver pronto
- [ ] Escolher a hospedagem e configurar o deploy contínuo

## Contribuindo

- Crie uma branch a partir de `main` para cada mudança
- Mensagens de commit no imperativo, descrevendo o que a mudança faz
- `npm run build` precisa passar antes do push
- Abra um Pull Request para revisão antes do merge
