import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const VIDEOS_DIR = path.join(process.cwd(), "public", "showroom", "videos");
const THUMBS_DIR = path.join(process.cwd(), "public", "showroom", "thumbs");

const VIDEO_EXTS = new Set([".mp4", ".mov", ".m4v", ".webm"]);

function listVideoFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => VIDEO_EXTS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

function baseName(file: string) {
  return path.basename(file, path.extname(file));
}

function runFFmpeg(inputFile: string, outFile: string) {
  const cmd = [
    "ffmpeg",
    "-y",
    "-ss",
    "00:00:00.800",
    "-i",
    `"${inputFile}"`,
    "-frames:v",
    "1",
    "-update",
    "1",
    "-q:v",
    "2",
    "-vf",
    `"scale=1280:-2"`,
    "-f",
    "image2",
    `"${outFile}"`,
  ].join(" ");

  execSync(cmd, { stdio: "inherit" });
}

function main() {
  console.log(`Videos dir: ${VIDEOS_DIR}`);
  console.log(`Thumbs dir: ${THUMBS_DIR}`);

  if (!fs.existsSync(VIDEOS_DIR)) {
    console.error("Videos folder does not exist.");
    process.exit(1);
  }

  fs.mkdirSync(THUMBS_DIR, { recursive: true });

  const videos = listVideoFiles(VIDEOS_DIR);
  console.log("Videos found:", videos);

  if (!videos.length) {
    console.log("No supported video files found.");
    return;
  }

  let madeAny = false;

  for (const file of videos) {
    const input = path.join(VIDEOS_DIR, file);
    const name = baseName(file);
    const out = path.join(THUMBS_DIR, `${name}.jpg`);

    if (fs.existsSync(out)) {
      console.log(`Skipping existing: ${name}.jpg`);
      continue;
    }

    console.log(`Generating: ${file} -> ${name}.jpg`);

    try {
      runFFmpeg(input, out);
      madeAny = true;
    } catch (error) {
      console.error(`Failed: ${file}`);
    }
  }

  console.log(madeAny ? "Done: generated new thumbnails." : "Done: no new thumbnails needed.");
}

main();