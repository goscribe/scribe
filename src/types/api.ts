/**
 * Shared API types between frontend and backend
 */

/**
 * Enums
 */
export type ArtifactType =
  | 'STUDY_GUIDE'
  | 'FLASHCARD_SET'
  | 'WORKSHEET'
  | 'MEETING_SUMMARY'
  | 'PODCAST_EPISODE';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'TEXT'
  | 'NUMERIC'
  | 'TRUE_FALSE'
  | 'MATCHING'
  | 'FILL_IN_THE_BLANK';

/**
 * User types
 */
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Workspace types
 */
export interface Workspace {
  id: string;
  title: string;
  description?: string | null;
  ownerId: string;
  folderId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Artifact types
 */
export interface Artifact {
  id: string;
  workspaceId: string;
  type: ArtifactType;
  title: string;
  isArchived: boolean;
  createdById?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Worksheet types
 */
export interface WorksheetQuestionMeta {
  options?: string[];
  completed?: boolean;
  userAnswer?: string;
  completedAt?: Date | null;
}

export interface WorksheetQuestion {
  id: string;
  artifactId: string;
  prompt: string;
  answer?: string | null;
  type: QuestionType;
  difficulty: Difficulty;
  order: number;
  meta?: WorksheetQuestionMeta;
  createdAt: Date;
}

export interface Worksheet extends Artifact {
  type: 'WORKSHEET';
  questions: WorksheetQuestion[];
}

/**
 * Flashcard types
 */
export interface Flashcard {
  id: string;
  artifactId: string;
  front: string;
  back: string;
  tags: string[];
  order: number;
  createdAt: Date;
}

export interface FlashcardSet extends Artifact {
  type: 'FLASHCARD_SET';
  flashcards: Flashcard[];
}

/**
 * Study Guide types
 */
export interface PodcastVersionData {
  audioUrl?: string;
  durationSec?: number;
  voice?: string;
  transcript?: string;
}

export interface ArtifactVersionData {
  // For podcast episodes
  podcast?: PodcastVersionData;
  // Extensible for other artifact types
  [key: string]: unknown;
}

export interface ArtifactVersion {
  id: string;
  artifactId: string;
  content: string;
  data?: ArtifactVersionData | null;
  version: number;
  createdById?: string | null;
  createdAt: Date;
}

export interface StudyGuide extends Artifact {
  type: 'STUDY_GUIDE';
  versions: ArtifactVersion[];
}

/**
 * File types
 */
export interface FileAssetMeta {
  // File processing metadata
  processedAt?: Date;
  extractedText?: string;
  pageCount?: number;
  duration?: number;
  thumbnailUrl?: string;
  // Upload metadata
  uploadedFrom?: string;
  originalName?: string;
  // Custom metadata
  tags?: string[];
  description?: string;
  // Extensible
  [key: string]: unknown;
}

export interface FileAsset {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  mimeType: string;
  size: number;
  bucket?: string | null;
  objectKey?: string | null;
  url?: string | null;
  checksum?: string | null;
  meta?: FileAssetMeta | null;
  createdAt: Date;
}

/**
 * Member types
 */
export interface Member {
  id: string;
  userId: string;
  workspaceId: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  user: User;
  createdAt: Date;
}

/**
 * Request/Response types
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorDetails {
  field?: string;
  value?: unknown;
  constraint?: string;
  path?: string[];
  // Validation errors
  validationErrors?: Array<{
    field: string;
    message: string;
  }>;
  // Stack trace (dev only)
  stack?: string;
  // Additional context
  [key: string]: unknown;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ApiErrorDetails;
}

/**
 * Form input types
 */
export interface CreateWorksheetInput {
  workspaceId: string;
  title: string;
  description?: string;
  difficulty?: Difficulty;
  estimatedTime?: string;
  problems?: Array<{
    question: string;
    answer: string;
    type: QuestionType;
    options?: string[];
  }>;
}

export interface UpdateWorksheetInput {
  id: string;
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  estimatedTime?: string;
  problems?: Array<{
    id?: string;
    question: string;
    answer: string;
    type: QuestionType;
    options?: string[];
  }>;
}

export interface CreateFlashcardSetInput {
  workspaceId: string;
  title: string;
  flashcards?: Array<{
    front: string;
    back: string;
    tags?: string[];
  }>;
}

export interface UpdateFlashcardSetInput {
  id: string;
  title?: string;
  flashcards?: Array<{
    id?: string;
    front: string;
    back: string;
    tags?: string[];
  }>;
}

/**
 * Type guards
 */
export function isWorksheet(artifact: Artifact): artifact is Worksheet {
  return artifact.type === 'WORKSHEET';
}

export function isFlashcardSet(artifact: Artifact): artifact is FlashcardSet {
  return artifact.type === 'FLASHCARD_SET';
}

export function isStudyGuide(artifact: Artifact): artifact is StudyGuide {
  return artifact.type === 'STUDY_GUIDE';
}

