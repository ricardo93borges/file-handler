import fs, { PathLike } from "fs";
import path from "path";

export function listFiles(dir: PathLike): string[] {
  const files = fs.readdirSync(dir);
  return files;
}

export function countFiles(dir: PathLike): number {
  const files = listFiles(dir);
  return files.length;
}

export function deleteFiles(dir: PathLike): void {
  const files = listFiles(dir);
  files.forEach((filename) => {
    if (filename !== ".gitkeep") {
      fs.unlinkSync(path.join(dir.toString(), filename));
    }
  });
}
