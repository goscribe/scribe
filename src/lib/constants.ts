/**
 * Application constants
 */

/**
 * Question types with display labels
 */
export const QUESTION_TYPES = {
  TEXT: { value: 'TEXT', label: 'Text Answer' },
  NUMERIC: { value: 'NUMERIC', label: 'Numeric' },
  MULTIPLE_CHOICE: { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
  TRUE_FALSE: { value: 'TRUE_FALSE', label: 'True/False' },
  MATCHING: { value: 'MATCHING', label: 'Matching' },
  FILL_IN_THE_BLANK: { value: 'FILL_IN_THE_BLANK', label: 'Fill in the Blank' },
} as const;

/**
 * Difficulty levels with display labels and colors
 */
export const DIFFICULTY_LEVELS = {
  EASY: {
    value: 'EASY',
    label: 'Easy',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  MEDIUM: {
    value: 'MEDIUM',
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  HARD: {
    value: 'HARD',
    label: 'Hard',
    color: 'bg-red-100 text-red-800 border-red-200',
  },
} as const;

/**
 * Artifact types
 */
export const ARTIFACT_TYPES = {
  STUDY_GUIDE: 'STUDY_GUIDE',
  FLASHCARD_SET: 'FLASHCARD_SET',
  WORKSHEET: 'WORKSHEET',
  MEETING_SUMMARY: 'MEETING_SUMMARY',
  PODCAST_EPISODE: 'PODCAST_EPISODE',
} as const;

/**
 * File size limits
 */
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_FILES: 10,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Time constants
 */
export const TIME = {
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_DELAY: 2000,
  TOAST_DURATION: 3000,
} as const;

/**
 * Validation rules
 */
export const VALIDATION = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 120,
  DESCRIPTION_MAX_LENGTH: 500,
  QUESTION_MAX_LENGTH: 1000,
  ANSWER_MAX_LENGTH: 2000,
  TAG_MAX_LENGTH: 50,
  MAX_TAGS: 10,
} as const;

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  STORAGE: '/storage',
  WORKSPACE: (id: string) => `/workspace/${id}`,
  WORKSHEET: (workspaceId: string, worksheetId: string) =>
    `/workspace/${workspaceId}/worksheet/${worksheetId}`,
  FLASHCARDS: (workspaceId: string) => `/workspace/${workspaceId}/flashcards`,
  STUDY_GUIDE: (workspaceId: string) => `/workspace/${workspaceId}/study-guide`,
  PODCASTS: (workspaceId: string) => `/workspace/${workspaceId}/podcasts`,
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  THEME: 'scribe-theme',
  LAST_WORKSPACE: 'scribe-last-workspace',
  SIDEBAR_COLLAPSED: 'scribe-sidebar-collapsed',
} as const;

/**
 * API endpoints (if not using tRPC)
 */
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''),
  TRPC: '/trpc',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size exceeds ${FILE_SIZE_LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
  TOO_MANY_FILES: `Maximum ${FILE_SIZE_LIMITS.MAX_FILES} files allowed.`,
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
  COPIED: 'Copied to clipboard!',
} as const;

