const STOP_WORDS = new Set([
  "avec",
  "dans",
  "des",
  "les",
  "pour",
  "une",
  "sur",
  "aux",
  "ce",
  "cet",
  "cette",
  "de",
  "par",
  "du",
  "est",
  "sont",
  "etre",
  "et",
  "la",
  "le",
  "ma",
  "mes",
  "mon",
  "nous",
  "notre",
  "ou",
  "qui",
  "quoi",
  "quel",
  "quelle",
  "quelles",
  "un",
  "comment",
  "demande",
  "document",
  "documents",
  "information",
  "informations",
  "verifier",
  "fiche",
]);

export const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/['’]/gu, " ")
    .trim();

const singularize = (token: string) => {
  if (token.length > 4 && token.endsWith("s")) {
    return token.slice(0, -1);
  }

  return token;
};

export const tokenizeSearchText = (value: string) =>
  normalizeText(value)
    .split(/[^a-z0-9]+/u)
    .map(singularize)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));

export const includesSearchToken = (text: string, token: string) => {
  const normalizedText = normalizeText(text);

  return normalizedText.includes(token);
};
