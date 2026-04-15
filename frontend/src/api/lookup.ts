// api/lookup.ts — rewrite to use the shared axios instance

import API from './auth'   // ← reuse the axios instance that already has baseURL + auth header

export interface VocabOptionsRequest {
  translation: boolean
  definition: boolean
  example: boolean
  level: boolean
}

export interface WordLookupRequest {
  session_id: string
  uid: number
  selected_text: string
  word: string
  lemma: string
  pos: string
  target_language: string
  options: VocabOptionsRequest
}

export interface WordLookupResponse {
  id: string
  word: string
  lemma: string
  pos: string
  target_language: string
  translation: string
  definition: string
  example: string
  level: string
}

export async function fetchWordLookup(
  request: WordLookupRequest,
): Promise<WordLookupResponse> {
  const { data } = await API.post<WordLookupResponse>('/api/lookup', request)
  return data
}
