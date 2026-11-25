// Funniest Autocorrect Fail — one line, one ruined date.
// The program prints a single autocorrect slip to /output/entry.txt.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FAIL_LINE =
  "I texted my date 'can't wait to see you tonight' — autocorrect sent 'can't wait to sue you tonight' and now she's bringing a lawyer instead of wine.";

function charCount(text: string): number {
  return Array.from(text).length;
}

function assertSingleLine(text: string): void {
  const chars = charCount(text);
  if (chars < 1 || chars > 199) {
    throw new Error(`entry must be 1-199 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  const text = FAIL_LINE;
  assertSingleLine(text);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, text + "\n", "utf8");
  chmodSync(target, 0o644);
  // Read back what was written: the file the judge sees must be the
  // exact line above, one line, inside the 1-199 character gate.
  const written = readFileSync(target, "utf8").replace(/\n$/, "");
  assertSingleLine(written);
  if (written !== text) {
    throw new Error("written entry differs from the intended line");
  }
}

main();
