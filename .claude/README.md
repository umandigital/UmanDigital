# Configuração do Claude Code neste projeto

## Skills

Skills instaladas em `.claude/skills/` ficam disponíveis para quem trabalhar
neste repositório com o Claude Code — versionadas junto com o projeto, e não
presas à máquina de uma pessoa só.

### Instaladas

| Skill | Origem | Licença |
| --- | --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Apache 2.0 |
| `ui-ux-pro-max` | [ui-ux-pro-max-cli](https://www.npmjs.com/package/ui-ux-pro-max-cli) | MIT |
| `design` | idem | MIT |
| `design-system` | idem | MIT |
| `ui-styling` | idem | MIT |
| `brand` | idem | MIT |
| `slides` | idem | MIT |
| `banner-design` | idem | MIT |

As sete últimas vieram de uma instalação só, via
[`ui-ux-pro-max-cli`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

### Atualizando

O pacote `ui-ux-pro-max-cli` traz as sete skills dele de uma vez:

```bash
npm install -g ui-ux-pro-max-cli
uipro update              # atualiza a partir da versão instalada do CLI
```

A `frontend-design` é copiada à mão, pois vem de outro repositório:

```bash
git clone --depth 1 https://github.com/anthropics/skills /tmp/anthropic-skills
cp /tmp/anthropic-skills/skills/frontend-design/* .claude/skills/frontend-design/
```

### Dependências dos scripts

Algumas skills trazem scripts auxiliares em Python 3 e Node. Eles são
opcionais — só rodam se uma skill for acionada e precisar deles. Dois pontos
que valem saber antes de executá-los:

- `design-system/scripts/fetch-background.py` baixa imagens do Pexels.
- `ui-styling/scripts/shadcn_add.py` executa `npx shadcn add`, o que
  **assume um projeto React**. Este site é Astro; use com cautela.

### Instalando uma skill nova

Crie `.claude/skills/<nome>/SKILL.md` com o frontmatter `name` e `description`.
A `description` é o que faz o Claude decidir quando acionar a skill, então
descreva bem os casos de uso.
