# Configuração do Claude Code neste projeto

## Skills

Skills instaladas em `.claude/skills/` ficam disponíveis para quem trabalhar
neste repositório com o Claude Code — versionadas junto com o projeto, e não
presas à máquina de uma pessoa só.

| Skill | Origem | Licença |
| --- | --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Apache 2.0 |

### Atualizando uma skill

```bash
git clone --depth 1 https://github.com/anthropics/skills /tmp/anthropic-skills
cp /tmp/anthropic-skills/skills/frontend-design/* .claude/skills/frontend-design/
```

### Instalando uma skill nova

Crie `.claude/skills/<nome>/SKILL.md` com o frontmatter `name` e `description`.
A `description` é o que faz o Claude decidir quando acionar a skill, então
descreva bem os casos de uso. Reinicie a sessão para que ela seja carregada.
