#!/usr/bin/env node
/**
 * Converte o vídeo master da home em sequência de frames WebP.
 *
 * O handoff (seção 4) proíbe <video> com currentTime amarrado ao scroll:
 * seek programático engasga. A home troca imagens por índice, que é
 * instantâneo. Este script produz essas imagens.
 *
 *   node scripts/extrair-frames.mjs <video> [opções]
 *
 *   --frames <n>      quantos frames gerar        (padrão 240)
 *   --larguras <a,b>  larguras responsivas        (padrão 1600,1100,760)
 *   --qualidade <n>   qualidade WebP 0-100        (padrão 76)
 *   --inicio <seg>    recortar a partir de        (padrão 0)
 *   --fim <seg>       recortar até                (padrão: fim do vídeo)
 *   --saida <dir>     destino                     (padrão public/filme)
 *   --nome <slug>     nome da sequência           (padrão filme)
 *
 * Para o loading (seção 5), extrair só a abertura:
 *   node scripts/extrair-frames.mjs master.mp4 --inicio 0 --fim 3 \
 *        --frames 60 --nome loading --larguras 1100,760
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const req = createRequire(import.meta.url);
const FFMPEG = req('ffmpeg-static');
const FFPROBE = req('ffprobe-static').path;

// ---------- argumentos ----------
const argv = process.argv.slice(2);
const video = argv.find((a) => !a.startsWith('--'));
if (!video) {
  console.error('Uso: node scripts/extrair-frames.mjs <video> [--frames 240] [--larguras 1600,1100,760]');
  process.exit(1);
}
if (!existsSync(video)) {
  console.error(`Vídeo não encontrado: ${video}`);
  process.exit(1);
}
const opt = (nome, padrao) => {
  const i = argv.indexOf(`--${nome}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : padrao;
};

const totalFrames = parseInt(opt('frames', '240'), 10);
const larguras = opt('larguras', '1600,1100,760').split(',').map((n) => parseInt(n.trim(), 10));
const qualidade = parseInt(opt('qualidade', '76'), 10);
const inicio = parseFloat(opt('inicio', '0'));
const fimArg = opt('fim', null);
const nome = opt('nome', 'filme');
const saida = resolve(opt('saida', 'public/filme'));

// ---------- sondar o vídeo ----------
const probe = JSON.parse(
  execFileSync(FFPROBE, [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate,nb_frames:format=duration',
    '-of', 'json', video,
  ]).toString(),
);
const st = probe.streams[0];
const duracaoTotal = parseFloat(probe.format.duration);
const fim = fimArg ? parseFloat(fimArg) : duracaoTotal;
const trecho = fim - inicio;

if (trecho <= 0) {
  console.error(`Trecho inválido: início ${inicio}s, fim ${fim}s`);
  process.exit(1);
}

const [rfN, rfD] = st.r_frame_rate.split('/').map(Number);
const fpsOriginal = rfD ? rfN / rfD : rfN;
const framesDisponiveis = Math.floor(trecho * fpsOriginal);

console.log(`\nVídeo:    ${video}`);
console.log(`Original: ${st.width}x${st.height} · ${fpsOriginal.toFixed(2)} fps · ${duracaoTotal.toFixed(2)}s`);
console.log(`Trecho:   ${inicio}s → ${fim}s (${trecho.toFixed(2)}s, ~${framesDisponiveis} frames disponíveis)`);
console.log(`Gerando:  ${totalFrames} frames em ${larguras.join(', ')}px · WebP q${qualidade}\n`);

if (totalFrames > framesDisponiveis) {
  console.warn(
    `AVISO: pedidos ${totalFrames} frames, mas o trecho só tem ~${framesDisponiveis}.\n` +
    `       Frames serão duplicados, sem ganho de suavidade. Reduza --frames.\n`,
  );
}

// ---------- extrair ----------
const taxa = totalFrames / trecho; // frames por segundo a amostrar
const manifest = { nome, totalFrames, larguras: {}, geradoDe: { video, inicio, fim, qualidade } };

for (const largura of larguras) {
  const dir = join(saida, nome, String(largura));
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  process.stdout.write(`  ${largura}px ... `);
  execFileSync(FFMPEG, [
    '-hide_banner', '-loglevel', 'error',
    '-ss', String(inicio), '-t', String(trecho), '-i', video,
    '-vf', `fps=${taxa},scale=${largura}:-2:flags=lanczos`,
    '-frames:v', String(totalFrames),
    '-c:v', 'libwebp', '-quality', String(qualidade), '-compression_level', '6',
    '-y', join(dir, `${nome}-%04d.webp`),
  ]);

  const arquivos = readdirSync(dir).filter((f) => f.endsWith('.webp')).sort();
  const bytes = arquivos.reduce((s, f) => s + statSync(join(dir, f)).size, 0);
  const mb = bytes / 1024 / 1024;
  manifest.larguras[largura] = {
    frames: arquivos.length,
    pesoTotalMB: +mb.toFixed(2),
    pesoMedioKB: +(bytes / arquivos.length / 1024).toFixed(1),
    padrao: `/filme/${nome}/${largura}/${nome}-%04d.webp`,
  };
  console.log(`${arquivos.length} frames · ${mb.toFixed(2)} MB · ${(bytes / arquivos.length / 1024).toFixed(1)} KB/frame`);
}

writeFileSync(join(saida, `${nome}.json`), JSON.stringify(manifest, null, 2) + '\n');

const totalMB = Object.values(manifest.larguras).reduce((s, l) => s + l.pesoTotalMB, 0);
console.log(`\nManifest: ${join(saida, `${nome}.json`)}`);
console.log(`Total no disco: ${totalMB.toFixed(2)} MB (todas as larguras)`);
console.log(`O visitante baixa só uma largura — a que couber na tela dele.\n`);
