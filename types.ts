
export type PromptTemplateFormat = 'string' | 'json';

export interface PromptTemplate {
  id: string;
  name: string;
  structure: (string | { key: string })[];
  defaults: Record<string, string>;
  format?: PromptTemplateFormat;
  imageUrl?: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  isFavorite: boolean;
}