// api/lookup.ts — rewrite to use the shared axios instance

import API from './auth'   // ← reuse the axios instance that already has baseURL + auth header

export type LookupType =
  | 'english_definition'
  | 'spanish_translation'
  | 'example_sentence'
  | 'cefr_level'

export interface WordLookupRequest {
  word:            string
  context?:        string
  lookup_type:     LookupType
  target_language: string
}

export interface WordLookupResponse {
  word:        string
  lookup_type: LookupType
  result:      string
}

export async function fetchWordLookup(
  request: WordLookupRequest,
): Promise<WordLookupResponse> {
  // No token param needed — the axios interceptor in auth.ts
  // already attaches Authorization: Bearer <token> to every request
  const { data } = await API.post<WordLookupResponse>('/api/lookup', request)
  return data
}