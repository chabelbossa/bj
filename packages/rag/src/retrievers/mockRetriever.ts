import { createProcedureSourceChunks } from "@dossierbj/core";

import { createKeywordRetriever } from "./keywordRetriever";

export const createMockSourceChunks = createProcedureSourceChunks;

export const mockRetriever = createKeywordRetriever(createMockSourceChunks());
