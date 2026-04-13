import API from "./auth";

export interface ComprehensionResponse {
  score: number;
  advice: string;
}

export const evaluateComprehensionRequest = (
  passage: string,
  summary: string
) =>
  API.post<ComprehensionResponse>("/api/comprehension/", {
    passage,
    summary,
  });
