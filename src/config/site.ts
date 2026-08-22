/**
 * Dados globais do site.
 * Centralizados aqui para não ficarem espalhados pelos componentes —
 * mudar o nav, o e-mail de contato ou as redes é mexer só neste arquivo.
 */
export const site = {
  name: 'Uman Digital',
  /** Usado como fallback de <title> e no schema.org */
  legalName: 'Uman Digital',
  /** TODO: escrever a partir do posicionamento definitivo. Máx. ~155 caracteres. */
  description:
    'Uman Digital — estúdio digital. Descrição provisória, a ser definida junto com o posicionamento da marca.',
  locale: 'pt-BR',
  /** TODO: confirmar o domínio definitivo (também em astro.config.mjs). */
  url: 'https://umandigital.com.br',
  /** TODO: preencher com os canais reais da Uman. */
  email: '',
  phone: '',
  social: {
    instagram: '',
    linkedin: '',
    github: 'https://github.com/umandigital',
  },
} as const;

export const nav = [
  { label: 'Início', href: '/' },
] as const satisfies ReadonlyArray<{ label: string; href: string }>;
