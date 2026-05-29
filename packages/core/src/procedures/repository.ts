import { demoProcedures } from "../seed";
import type { Procedure, VerificationStatus } from "../schemas";
import { includesSearchToken, tokenizeSearchText } from "../utils/searchText";

export type ProcedureSearchFilters = {
  query?: string;
  category?: string;
  targetUser?: string;
  verificationStatus?: VerificationStatus;
};

export type ProcedureSearchResult = {
  procedure: Procedure;
  score: number;
  matchedFields: string[];
  reason: string;
};

export const getProcedures = () => demoProcedures;

export const findProcedureBySlug = (slug: string) =>
  demoProcedures.find((procedure) => procedure.slug === slug);

const scoreField = (label: string, value: string | string[], tokens: string[], weight: number) => {
  const text = Array.isArray(value) ? value.join(" ") : value;
  const matchedTokens = tokens.filter((token) => includesSearchToken(text, token));

  if (matchedTokens.length === 0) {
    return {
      score: 0,
      matchedField: null,
    };
  }

  return {
    score: matchedTokens.length * weight,
    matchedField: `${label}: ${matchedTokens.join(", ")}`,
  };
};

export const searchProcedureList = (
  procedures: Procedure[],
  filters: ProcedureSearchFilters = {},
): ProcedureSearchResult[] => {
  const tokens = tokenizeSearchText(filters.query ?? "");
  const normalizedCategory = filters.category?.trim().toLowerCase();
  const normalizedTargetUser = filters.targetUser?.trim().toLowerCase();

  return procedures
    .filter((procedure) => {
      const matchesCategory =
        !normalizedCategory || procedure.category.toLowerCase() === normalizedCategory;

      const matchesTarget =
        !normalizedTargetUser ||
        procedure.targetUsers.some((target) => target.toLowerCase() === normalizedTargetUser);

      const matchesStatus =
        !filters.verificationStatus || procedure.verificationStatus === filters.verificationStatus;

      return matchesCategory && matchesTarget && matchesStatus;
    })
    .map((procedure) => {
      if (tokens.length === 0) {
        return {
          procedure,
          score: 1,
          matchedFields: [],
          reason: "Toutes les démarches correspondant aux filtres.",
        };
      }

      const scoredFields = [
        scoreField("titre", procedure.title, tokens, 5),
        scoreField("alias", procedure.aliases, tokens, 4),
        scoreField("catégorie", procedure.category, tokens, 3),
        scoreField("public", procedure.targetUsers, tokens, 2),
        scoreField("résumé", procedure.summary, tokens, 1),
        scoreField("besoin", procedure.userNeed, tokens, 1),
        scoreField("points à vérifier", procedure.pointsToVerify, tokens, 1),
      ];

      const matchedFields = scoredFields
        .map((field) => field.matchedField)
        .filter((field): field is string => Boolean(field));

      return {
        procedure,
        score: scoredFields.reduce((sum, field) => sum + field.score, 0),
        matchedFields,
        reason:
          matchedFields.length > 0
            ? `Correspondance sur ${matchedFields.slice(0, 2).join(" ; ")}.`
            : "Aucune correspondance directe.",
      };
    })
    .filter((result) => tokens.length === 0 || result.score > 0)
    .sort((a, b) => b.score - a.score || a.procedure.title.localeCompare(b.procedure.title));
};

export const searchProcedures = (filters: ProcedureSearchFilters = {}): ProcedureSearchResult[] =>
  searchProcedureList(demoProcedures, filters);

export const getProcedureCategories = () =>
  Array.from(new Set(demoProcedures.map((procedure) => procedure.category))).sort();

export const getProcedureTargetUsers = () =>
  Array.from(new Set(demoProcedures.flatMap((procedure) => procedure.targetUsers))).sort();

export const getProcedureCategoriesFromList = (procedures: Procedure[]) =>
  Array.from(new Set(procedures.map((procedure) => procedure.category))).sort();

export const getProcedureTargetUsersFromList = (procedures: Procedure[]) =>
  Array.from(new Set(procedures.flatMap((procedure) => procedure.targetUsers))).sort();
