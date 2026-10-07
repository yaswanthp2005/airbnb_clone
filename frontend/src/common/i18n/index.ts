import en from "@/common/i18n/en.json";

type TranslationLeaf = string | TranslationTree;
type TranslationTree = { [key: string]: TranslationLeaf };

const translations = en as TranslationTree;

const getNestedValue = (tree: TranslationTree, keyPath: string): unknown => {
  return keyPath.split(".").reduce<unknown>((current, segment) => {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    return (current as TranslationTree)[segment];
  }, tree);
};

export type TranslateVars = Record<string, string | number>;

export const t = (key: string, vars?: TranslateVars): string => {
  const value = getNestedValue(translations, key);

  if (typeof value !== "string") {
    return key;
  }

  if (!vars) {
    return value;
  }

  return value.replace(/\{\{(\w+)\}\}/g, (_, token: string) =>
    vars[token] !== undefined ? String(vars[token]) : "",
  );
};

