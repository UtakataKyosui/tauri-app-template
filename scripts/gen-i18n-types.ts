// GEN-05: ロケール JSON（正本: src/locales/ja.json）から翻訳キーの型を生成する。
// 実行: `pnpm generate:i18n-types`
//
// 未翻訳キーの検出（ja に対する en の欠落キー検査）も Phase 3（#19）でここに追加する。
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const localesDir = resolve(scriptDir, "../src/locales");
const baseLocale = JSON.parse(readFileSync(resolve(localesDir, "ja.json"), "utf-8"));

function flattenKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" && value !== null
      ? flattenKeys(value as Record<string, unknown>, path)
      : [path];
  });
}

const keys = flattenKeys(baseLocale);

const output = `// このファイルは自動生成されます。手編集しないでください（GEN-03）。
// 生成: \`pnpm generate:i18n-types\`（正本: src/locales/ja.json）
export type TranslationKey =
${keys.map((k) => `  | "${k}"`).join("\n")};
`;

writeFileSync(resolve(scriptDir, "../src/locales/keys.gen.ts"), output);
console.log(`generated ${keys.length} translation keys -> src/locales/keys.gen.ts`);
