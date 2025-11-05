/**
 * Audio file validation utilities
 */

export interface AudioValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: {
    size: number;
    type: string;
    duration?: number;
  };
}

export interface AudioValidationOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
  maxDurationSeconds?: number;
  minDurationSeconds?: number;
}

const DEFAULT_OPTIONS: Required<AudioValidationOptions> = {
  maxSizeBytes: 50 * 1024 * 1024, // 50MB
  allowedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'],
  maxDurationSeconds: 7200, // 2 hours
  minDurationSeconds: 1, // 1 second
};

/**
 * Validate audio file
 */
export async function validateAudioFile(
  file: File,
  options: AudioValidationOptions = {}
): Promise<AudioValidationResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if file exists
  if (!file) {
    return {
      valid: false,
      errors: ['No file provided'],
      warnings: [],
    };
  }

  // Validate file size
  if (file.size > opts.maxSizeBytes) {
    errors.push(
      `File size (${formatBytes(file.size)}) exceeds maximum allowed size (${formatBytes(opts.maxSizeBytes)})`
    );
  }

  // Warn if file is large
  if (file.size > opts.maxSizeBytes * 0.8) {
    warnings.push(
      `File size is ${Math.round((file.size / opts.maxSizeBytes) * 100)}% of maximum. Consider compressing the audio.`
    );
  }

  // Validate file type
  if (!opts.allowedTypes.includes(file.type)) {
    errors.push(
      `File type "${file.type}" is not supported. Allowed types: ${opts.allowedTypes.join(', ')}`
    );
  }

  // Try to get audio duration
  let duration: number | undefined;
  try {
    duration = await getAudioDuration(file);

    if (duration !== undefined) {
      // Validate duration
      if (duration > opts.maxDurationSeconds) {
        errors.push(
          `Audio duration (${formatDuration(duration)}) exceeds maximum allowed duration (${formatDuration(opts.maxDurationSeconds)})`
        );
      }

      if (duration < opts.minDurationSeconds) {
        errors.push(
          `Audio duration (${formatDuration(duration)}) is below minimum duration (${formatDuration(opts.minDurationSeconds)})`
        );
      }

      // Warn if duration is very long
      if (duration > opts.maxDurationSeconds * 0.8) {
        warnings.push(
          `Audio is quite long (${formatDuration(duration)}). Consider breaking it into segments.`
        );
      }
    }
  } catch (error) {
    warnings.push('Could not determine audio duration');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metadata: {
      size: file.size,
      type: file.type,
      duration,
    },
  };
}

/**
 * Get audio duration from file
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);

    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    });

    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load audio metadata'));
    });

    audio.src = url;
  });
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format duration to human readable string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }
  parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * Estimate audio file size from duration and bitrate
 */
export function estimateAudioSize(durationSeconds: number, bitrate = 128): number {
  // bitrate in kbps, return size in bytes
  return (durationSeconds * bitrate * 1000) / 8;
}

/**
 * Check if browser supports audio format
 */
export function isAudioFormatSupported(mimeType: string): boolean {
  const audio = document.createElement('audio');
  return audio.canPlayType(mimeType) !== '';
}

/**
 * Validate multiple audio segments
 */
export async function validateAudioSegments(
  files: File[],
  options: AudioValidationOptions = {}
): Promise<{
  valid: boolean;
  results: AudioValidationResult[];
  totalSize: number;
  totalDuration: number;
  errors: string[];
}> {
  const results = await Promise.all(
    files.map((file) => validateAudioFile(file, options))
  );

  const totalSize = results.reduce((sum, r) => sum + (r.metadata?.size || 0), 0);
  const totalDuration = results.reduce((sum, r) => sum + (r.metadata?.duration || 0), 0);
  
  const allErrors = results.flatMap((r) => r.errors);
  const valid = allErrors.length === 0;

  // Additional validation for segments
  const segmentErrors: string[] = [];

  if (files.length === 0) {
    segmentErrors.push('No audio segments provided');
  }

  if (files.length > 50) {
    segmentErrors.push(`Too many segments (${files.length}). Maximum is 50.`);
  }

  return {
    valid: valid && segmentErrors.length === 0,
    results,
    totalSize,
    totalDuration,
    errors: [...allErrors, ...segmentErrors],
  };
}

