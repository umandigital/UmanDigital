# Pipeline do vídeo da home

## Por que frames, e não `<video>`

O handoff (seção 4) já decidiu isto e o motivo é técnico: `<video>` com
`currentTime` amarrado ao scroll tem atraso de decodificação e engasga. Trocar
uma imagem por índice é instantâneo. A home exibe uma **sequência de frames**.

Consequência prática: o vídeo master é **insumo de produção**, não asset do
site. Ele nunca entra no repositório e nunca chega ao navegador do visitante.
O `.gitignore` bloqueia `*.mp4`, `*.mov`, `*.avi`, `*.mkv` e `*.prores`.

## Como entregar o master (arquivos grandes)

O ambiente onde o Claude Code roda tem a saída de rede restrita: Google Drive,
WeTransfer e Dropbox estão bloqueados por política. Os hosts do GitHub estão
liberados. Então a rota é o próprio repositório, **como release asset** — que
não entra no histórico do Git e pode ser apagado depois:

1. Abra `https://github.com/umandigital/UmanDigital/releases/new`
2. Em **Tag**, escreva `insumos-video` e clique em *Create new tag on publish*
3. Em **Title**, algo como `Insumos — vídeo master`
4. **Arraste o arquivo de vídeo** para a área de anexos (limite: 2 GB por
   arquivo, muito acima dos 60 MB)
5. Marque **Set as a pre-release** e publique

Pronto. O Claude Code baixa o arquivo de lá, extrai os frames e commita só os
frames. Depois que os frames estiverem no repositório, a release pode ser
apagada — o master não é mais necessário.

> Não commite o vídeo diretamente numa branch: o blob de 60 MB ficaria no
> histórico do Git para sempre, e todo mundo que clonar o repositório baixaria
> esse peso.

## Gerando os frames

```bash
# Sequência principal da home
node scripts/extrair-frames.mjs caminho/do/master.mp4 \
  --frames 240 --larguras 1600,1100,760

# Abertura do loading (handoff §5: primeiros segundos da NOVA animação)
node scripts/extrair-frames.mjs caminho/do/master.mp4 \
  --inicio 0 --fim 3 --frames 60 --nome loading --larguras 1100,760
```

Saída em `public/filme/<nome>/<largura>/`, mais um manifest
`public/filme/<nome>.json` com contagem de frames, peso e o padrão de caminho.

### Opções

| Opção | Padrão | Para que serve |
| --- | --- | --- |
| `--frames` | 240 | Mais frames = scrub mais suave e mais peso |
| `--larguras` | 1600,1100,760 | Cada visitante baixa só a que couber na tela |
| `--qualidade` | 76 | Qualidade WebP, 0 a 100 |
| `--inicio` / `--fim` | vídeo inteiro | Recorta um trecho, em segundos |
| `--nome` | filme | Nome da sequência |

O script avisa se você pedir mais frames do que o trecho comporta — acima
disso os frames se repetem, só somando peso sem ganhar suavidade.

## Peso esperado

Medição real em WebP, 1600px de largura:

| Conteúdo | Por frame | 240 frames |
| --- | --- | --- |
| Gradiente suave (luz âmbar) | ~6 KB | ~1,5 MB |
| Cena detalhada (pior caso) | ~48 KB | ~11 MB |

O filme da Uman (mão, interface, cidade, orbe, bebê em luz âmbar) deve ficar
entre os dois. Sequência inteira estimada em **4 a 9 MB**, distribuída em três
larguras — cada visitante baixa uma só.

## Regras de carregamento

- Os frames são **pré-carregados** antes do scrub começar. O progresso real
  desse carregamento é o que alimenta o loading (handoff §5), não uma simulação.
- Servir com `astro:assets` onde possível, para o Astro gerar `srcset`.
- `prefers-reduced-motion`: não fazer scrub. Exibir um frame-chave fixo por
  dobra e entregar o texto no estado final.
- Conexão lenta: cair para a largura menor, ou para o poster estático.

## Landings

Landings **não** usam scrub (handoff §4). Herói com vídeo curto em loop mais
poster estático. Aí sim um `<video>` normal, curto e leve, com `poster`
preenchido para não depender do vídeo na indexação.
