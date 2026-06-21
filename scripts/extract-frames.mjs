import { execSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";

const INPUT = "public/video/showreel.mp4";
const OUTPUT_DIR = "public/frames";
const N_FRAMES = 60;
const WIDTH = 1280; // réduit la taille des fichiers sans perte visible

mkdirSync(OUTPUT_DIR, { recursive: true });

// Récupère la durée via ffprobe
const probe = JSON.parse(
  execSync(`ffprobe -v quiet -print_format json -show_streams "${INPUT}"`).toString()
);
const videoStream = probe.streams.find((s) => s.codec_type === "video");
const duration = parseFloat(videoStream.duration);

console.log(`Durée : ${duration.toFixed(2)}s — extraction de ${N_FRAMES} frames...`);

// Extrait N frames espacées uniformément, en WebP
execSync(
  `ffmpeg -i "${INPUT}" -vf "fps=${N_FRAMES}/${duration},scale=${WIDTH}:-2" -frames:v ${N_FRAMES} -vcodec libwebp -lossless 0 -q:v 80 "${OUTPUT_DIR}/frame-%03d.webp" -y`,
  { stdio: "inherit" }
);

// Manifeste pour que le composant sache combien de frames charger
writeFileSync(`${OUTPUT_DIR}/manifest.json`, JSON.stringify({ count: N_FRAMES }));

console.log(`\nTerminé — ${N_FRAMES} frames dans ${OUTPUT_DIR}/`);
