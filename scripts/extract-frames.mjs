import { execSync } from "child_process";
import { mkdirSync, writeFileSync, readdirSync } from "fs";

const INPUT = "public/video/showreel.mp4";
const OUTPUT_DIR = "public/frames";
const WIDTH = 1920;
const FPS = 24;
const QUALITY = 80;

mkdirSync(OUTPUT_DIR, { recursive: true });

console.log(`Extraction des frames (${FPS}fps, qualité ${QUALITY})...`);

execSync(
  `ffmpeg -i "${INPUT}" -vf "fps=${FPS},scale=${WIDTH}:-2" -vsync vfr -vcodec libwebp -lossless 0 -q:v ${QUALITY} "${OUTPUT_DIR}/frame-%04d.webp" -y`,
  { stdio: "inherit" }
);

const count = readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".webp")).length;

writeFileSync(`${OUTPUT_DIR}/manifest.json`, JSON.stringify({ count, pad: 4 }));

console.log(`\nTerminé — ${count} frames dans ${OUTPUT_DIR}/`);
