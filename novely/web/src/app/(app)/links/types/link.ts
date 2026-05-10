export type LinkType =
  | "ARTICLE"
  | "VIDEO"
  | "DOCUMENT"
  | "TOOL"
  | "TWITTER"
  | "GITHUB"
  | "OTHER";

export interface Link {
  id: string;

  title?: string;
  description?: string;

  url: string;

  domain?: string;
  favicon?: string;
  image?: string;

  type: LinkType;

  aiSummary?: string;
  aiTags: string[];

  notes?: string;

  readingTime?: number;

  isFavorite: boolean;
  isArchived: boolean;

  views: number;

  lastViewedAt?: string;

  goalId?: string;
  taskId?: string;

  createdAt: string;
  updatedAt: string;
}